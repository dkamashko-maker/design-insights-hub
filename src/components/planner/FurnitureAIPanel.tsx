import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePlannerStore } from "@/stores/plannerStore";
import { products } from "@/data/mockData";
import { CM_TO_PX } from "@/constants/planner";
import { toast } from "sonner";

const STYLES = [
  { id: "Скандинавский", label: "Сканди" },
  { id: "Индустриальный", label: "Индустр." },
  { id: "Минимализм", label: "Миним." },
  { id: "Классика", label: "Классика" },
  { id: "Современный", label: "Совр." },
  { id: "Лофт", label: "Лофт" },
];

const FurnitureAIPanel = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof products | null>(null);
  const [recommendation, setRecommendation] = useState("");
  const { addObject } = usePlannerStore();

  const handleSearch = () => {
    if (!selectedStyle) {
      toast.error("Выберите стиль");
      return;
    }
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      let filtered = products.filter((p) =>
        p.style.toLowerCase().includes(selectedStyle.toLowerCase())
      );

      if (prompt.trim()) {
        const kw = prompt.toLowerCase();
        const keywordFiltered = products.filter((p) =>
          p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw)
        );
        if (keywordFiltered.length > 0) {
          filtered = [...new Set([...keywordFiltered, ...filtered])];
        }
      }

      filtered = filtered.slice(0, 6);
      if (filtered.length === 0) filtered = products.slice(0, 4);

      const styleTexts: Record<string, string> = {
        "Скандинавский": "Для скандинавского стиля подойдут светлые тона, натуральное дерево и минималистичные формы.",
        "Индустриальный": "Индустриальный стиль: металлические элементы, грубые текстуры и тёмные акценты.",
        "Минимализм": "Минимализм: чистые линии, нейтральная палитра, функциональность без лишнего.",
        "Классика": "Классический стиль: элегантные формы, богатые текстуры и симметрия.",
        "Современный": "Современный стиль: гармония функциональности и эстетики с актуальными трендами.",
        "Лофт": "Лофт: открытое пространство, кирпич, металл и промышленные элементы.",
      };

      setRecommendation(styleTexts[selectedStyle] || "Вот рекомендованная мебель для вашего проекта.");
      setResults(filtered);
      setLoading(false);
    }, 1500);
  };

  const addToProject = (product: typeof products[0]) => {
    addObject({
      id: crypto.randomUUID(),
      type: "furniture",
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      width: product.dimensions.width_cm * CM_TO_PX,
      height: product.dimensions.depth_cm * CM_TO_PX,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      imageUrl: product.images[0],
      widthCm: product.dimensions.width_cm,
      heightCm: product.dimensions.height_cm,
      depthCm: product.dimensions.depth_cm,
    });
    toast.success(`${product.name} добавлен`);
  };

  const addAllToProject = () => {
    if (!results) return;
    results.forEach((p, i) => {
      addObject({
        id: crypto.randomUUID(),
        type: "furniture",
        x: 150 + (i % 3) * 250,
        y: 150 + Math.floor(i / 3) * 250,
        width: p.dimensions.width_cm * CM_TO_PX,
        height: p.dimensions.depth_cm * CM_TO_PX,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        productId: p.id,
        productName: p.name,
        productPrice: p.price,
        imageUrl: p.images[0],
        widthCm: p.dimensions.width_cm,
        heightCm: p.dimensions.height_cm,
        depthCm: p.dimensions.depth_cm,
      });
    });
    toast.success(`${results.length} предметов добавлено`);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Step 1: Style */}
      <div>
        <p className="text-sm font-montserrat font-medium text-[#333] mb-2">Выберите стиль дизайна</p>
        <div className="grid grid-cols-3 gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(s.id)}
              className={`px-3 py-2 rounded text-xs font-montserrat font-medium transition-colors ${
                selectedStyle === s.id
                  ? "bg-[#008080] text-white"
                  : "bg-[rgba(0,128,128,0.05)] text-[#333] border border-[rgba(0,128,128,0.2)] hover:border-[#008080]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Prompt */}
      <div>
        <p className="text-sm font-montserrat font-medium text-[#333] mb-2">Опишите задачу (необязательно)</p>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Нужен диван до 50 000 ₽ для семьи с детьми"
          className="border-[rgba(0,128,128,0.3)] text-sm min-h-[60px]"
        />
      </div>

      <Button onClick={handleSearch} disabled={loading} className="w-full bg-[#008080] hover:bg-[#006666] text-white font-montserrat font-semibold">
        <Sparkles className="w-4 h-4 mr-2" />
        {loading ? "Подбираем..." : "Подобрать мебель"}
      </Button>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#008080] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-3">
          <div className="bg-[rgba(0,128,128,0.05)] rounded-lg p-3">
            <p className="text-sm font-montserrat text-[#333]">{recommendation}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {results.map((p) => (
              <div key={p.id} className="border border-[rgba(0,128,128,0.2)] rounded-lg overflow-hidden">
                <img src={p.images[0]} alt={p.name} className="w-full h-20 object-cover" />
                <div className="p-2">
                  <p className="text-xs font-montserrat font-medium text-[#333] truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-montserrat font-bold text-[#008080]">{p.price.toLocaleString("ru-RU")} ₽</span>
                    <button onClick={() => addToProject(p)} className="text-[#008080] hover:bg-[rgba(0,128,128,0.1)] rounded p-0.5">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={addAllToProject} variant="outline" className="w-full border-[#008080] text-[#008080] font-montserrat text-sm">
            Добавить всё в проект
          </Button>
        </div>
      )}
    </div>
  );
};

export default FurnitureAIPanel;
