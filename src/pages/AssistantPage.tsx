import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Paperclip, Palette, Sparkles, ShoppingCart, Plus, ArrowRight, Layout, Paintbrush, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/appStore";
import { products, type Product } from "@/data/mockData";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

const quickPrompts = [
  "Подберите мебель для гостиной в скандинавском стиле",
  "Какие цвета сочетаются с серыми стенами?",
  "Расставьте мебель в однокомнатной квартире 40м²",
  "Посоветуйте диван до 80 000 ₽",
];

const styleCards = [
  { name: "Скандинавский", desc: "Светлые тона, натуральные материалы, функциональность" },
  { name: "Индустриальный", desc: "Необработанные поверхности, металл, открытое пространство" },
  { name: "Минималистичный", desc: "Чистые линии, нейтральные цвета, меньше — значит больше" },
];

function getMockResponse(text: string): { content: string; matchedProducts: Product[] } {
  const lower = text.toLowerCase();
  if (lower.includes("скандинавск")) {
    return {
      content: "Скандинавский стиль — отличный выбор! Он сочетает уют и функциональность. Основные принципы:\n\n• Светлые тона: белый, бежевый, серый\n• Натуральные материалы: дерево, лён, хлопок\n• Минимум декора, максимум света\n\nЯ подобрал несколько предметов мебели, которые отлично впишутся в скандинавский интерьер. Посмотрите рекомендации справа →",
      matchedProducts: products.filter((p) => p.style === "Скандинавский"),
    };
  }
  if (lower.includes("диван")) {
    return {
      content: "Вот несколько рекомендаций по выбору дивана:\n\n• Для гостиной выбирайте 3-местный диван длиной 200–240 см\n• Обратите внимание на обивку: лён и хлопок — для скандинавского стиля, кожа — для лофта\n• Каркас из бука или дуба прослужит дольше\n\nЯ нашёл подходящие варианты в нашем каталоге →",
      matchedProducts: products.filter((p) => p.name.toLowerCase().includes("диван") || p.name.toLowerCase().includes("кресло")),
    };
  }
  if (lower.includes("цвет")) {
    return {
      content: "Вот проверенные цветовые сочетания с серыми стенами:\n\n🎨 **Тёплые акценты**: горчичный, терракотовый, тёплый бежевый\n🎨 **Холодные акценты**: пыльный синий, мятный, лавандовый\n🎨 **Контраст**: чёрный + белый + один яркий акцент\n\nДобавьте текстиль и декор в этих тонах для завершённого образа.",
      matchedProducts: products.filter((p) => ["Терракотовый", "Бежевый", "Серый"].includes(p.color)),
    };
  }
  if (lower.includes("расстав") || lower.includes("планиров") || lower.includes("квартир")) {
    return {
      content: "Для однокомнатной квартиры 40м² рекомендую зонирование:\n\n1. **Гостиная зона** (15м²): компактный диван, кофейный столик, стеллаж-перегородка\n2. **Спальная зона** (10м²): кровать 160 см, комод, подвесные полки\n3. **Рабочая зона** (5м²): стол 120 см, эргономичное кресло\n\nОткройте планировщик для визуализации →",
      matchedProducts: products.slice(0, 6),
    };
  }
  return {
    content: "Спасибо за вопрос! Я — AI ассистент по дизайну интерьера. Могу помочь с:\n\n• Подбором мебели и декора\n• Цветовыми решениями\n• Планировкой помещений\n• Рекомендациями по стилю\n\nОпишите вашу задачу подробнее, и я подберу решение!",
    matchedProducts: [],
  };
}

const TypingIndicator = () => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">AI</div>
    <div className="border border-border rounded-[14px] px-4 py-3 flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </div>
  </div>
);

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <img src={product.images[0]} alt={product.name} className="w-full aspect-[4/3] object-cover" />
      <div className="p-3 space-y-1.5">
        <p className="font-montserrat font-medium text-sm truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <p className="font-montserrat font-semibold text-primary">{product.price.toLocaleString("ru-RU")} ₽</p>
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1 h-8 text-xs bg-primary text-primary-foreground" onClick={() => addItem(product.id)}>
            <ShoppingCart className="w-3 h-3 mr-1" /> В корзину
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
            <Link to={`/catalog/${product.id}`}>↗</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const ResultsPanel = ({ messages }: { messages: Message[] }) => {
  const lastAssistantWithProducts = [...messages].reverse().find((m) => m.role === "assistant" && m.products && m.products.length > 0);
  const hasMessages = messages.length > 0;

  if (!hasMessages || !lastAssistantWithProducts) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-10 text-center">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-h2 mb-3 max-w-md">Воспользуйтесь неограниченными возможностями дизайна на базе ИИ</h2>
        <p className="text-muted-foreground mb-10 max-w-sm">Задайте вопрос ассистенту, и он подберёт мебель, стиль и цветовые решения</p>
        <div className="grid grid-cols-3 gap-5 max-w-xl">
          {[
            { icon: <Layout className="w-5 h-5" />, title: "Умный подбор мебели", desc: "Рекомендации на основе стиля и бюджета" },
            { icon: <Paintbrush className="w-5 h-5" />, title: "Цветовые решения", desc: "Гармоничные палитры для вашего интерьера" },
            { icon: <Maximize className="w-5 h-5" />, title: "Оптимизация пространства", desc: "Эффективные планировки для любой площади" },
          ].map((c) => (
            <div key={c.title} className="bg-card border border-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">{c.icon}</div>
              <p className="font-montserrat font-medium text-sm mb-1">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recs = lastAssistantWithProducts.products!;
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h3 className="text-h3">Рекомендации ассистента</h3>
        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{recs.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {recs.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <Separator />
      <div>
        <h3 className="text-h3 mb-4">Рекомендуемые стили</h3>
        <div className="grid grid-cols-3 gap-4">
          {styleCards.map((s) => (
            <div key={s.name} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="font-montserrat font-medium text-sm mb-1">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-h3 mb-4">Планировки</h3>
        <div className="grid grid-cols-2 gap-4">
          {["Студия 30м²", "Однокомнатная 50м²"].map((name) => (
            <div key={name} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
              <span className="font-montserrat font-medium text-sm">{name}</span>
              <Button size="sm" variant="outline" asChild>
                <Link to="/planner/new">Открыть</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const { content, matchedProducts } = getMockResponse(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", content, products: matchedProducts.length > 0 ? matchedProducts : undefined }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const hasMessages = messages.length > 0;

  const chatPanel = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-h2 text-lg">AI Помощник</h2>
            <p className="text-xs text-muted-foreground">Дизайн-ассистент на базе ИИ</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {!hasMessages && (
          <div className="space-y-3 mb-4">
            <p className="text-sm text-muted-foreground">Попробуйте задать вопрос:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs text-left px-3 py-2 rounded-lg border border-border bg-card hover:bg-primary/5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] px-4 py-3 bg-primary/10 rounded-tl-[14px] rounded-bl-[14px] rounded-br-[14px] font-montserrat text-sm">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">AI</div>
              <div className="max-w-[85%] px-4 py-3 border border-border rounded-[14px] text-sm whitespace-pre-line">
                {m.content}
              </div>
            </div>
          )
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="border-t border-border px-5 py-3 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Задайте вопрос о дизайне интерьера..."
            rows={1}
            className="flex-1 resize-none max-h-[100px] bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-montserrat"
            style={{ minHeight: 40 }}
          />
          <Button
            size="icon"
            className="rounded-full w-10 h-10 bg-primary text-primary-foreground shrink-0"
            onClick={() => send(input)}
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-3 mt-2">
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Paperclip className="w-3 h-3" /> Прикрепить план
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Palette className="w-3 h-3" /> Выбрать стиль
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-104px)]">
      {/* Left: Chat — hidden on mobile, replaced by full width */}
      <div className="hidden md:flex w-[400px] shrink-0 border-r border-border bg-card flex-col">
        {chatPanel}
      </div>
      {/* Mobile chat */}
      <div className="flex md:hidden flex-col flex-1">
        {chatPanel}
        {hasMessages && (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="fixed bottom-20 right-4 z-50 rounded-full bg-primary text-primary-foreground shadow-lg">
                Результаты <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0 overflow-y-auto">
              <ResultsPanel messages={messages} />
            </SheetContent>
          </Sheet>
        )}
      </div>
      {/* Right: Results */}
      <div className="hidden md:block flex-1 bg-secondary/10">
        <ResultsPanel messages={messages} />
      </div>
    </div>
  );
};

export default AssistantPage;
