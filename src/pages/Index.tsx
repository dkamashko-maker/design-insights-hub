import { Link } from "react-router-dom";
import { ArrowRight, Heart, ChevronLeft, ChevronRight, Layout, Armchair, Image, Zap, Users, Palette, Plus, Minus } from "lucide-react";
import { useState, useCallback } from "react";

import heroImg from "@/assets/hero-interior.jpg";
import design1 from "@/assets/design-1.jpg";
import design2 from "@/assets/design-2.jpg";
import design3 from "@/assets/design-3.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import project1 from "@/assets/project-1.jpg";
import aiAssistant from "@/assets/ai-assistant.jpg";
import ctaBg from "@/assets/cta-bg.jpg";
import { mockProjects } from "@/data/projectsData";
import { mockPublicDesigns } from "@/data/projectsData";

const CTALink = ({ text, to }: { text: string; to: string }) => (
  <Link to={to} className="group inline-flex flex-col gap-1">
    <div className="flex items-center gap-3">
      <span className="text-cta">{text}</span>
      <ArrowRight className="w-[38px] h-[38px] text-art-accent transition-transform group-hover:translate-x-1" />
    </div>
    <div className="h-px bg-art-accent" />
  </Link>
);

const SectionDivider = () => (
  <div className="border-b border-art-accent-border" />
);

const heroSlides = [
  { image: heroImg, subtitle: "КАТАЛОГ МЕБЕЛИ", title: "Моделируйте пространство в 2D и 3D, визуализируйте интерьер и подбирайте мебель из каталога" },
  { image: design1, subtitle: "ДИЗАЙН ИНТЕРЬЕРА", title: "Создавайте уникальные интерьеры с помощью AI-ассистента и профессиональных инструментов" },
  { image: design2, subtitle: "ПЛАНИРОВЩИК", title: "Интерактивный 2D-планировщик с drag-and-drop для точной расстановки мебели" },
  { image: design3, subtitle: "ГОТОВЫЕ РЕШЕНИЯ", title: "Выбирайте из коллекции дизайн-пакетов и адаптируйте их под своё пространство" },
];

const products = [
  { id: "p1", name: "Кофейный столик Oslo", brand: "Poliform", price: 18500, image: product1, category: "Столы" },
  { id: "p2", name: "Комод Norden", brand: "Cassina", price: 45900, image: product2, category: "Комоды" },
  { id: "p3", name: "Растение Фикус", brand: "Green Home", price: 4200, image: product3, category: "Декор" },
  { id: "p4", name: "Подвесной светильник Amber", brand: "RIVALLI", price: 12800, image: product4, category: "Декор" },
  { id: "p5", name: "Журнальный столик Hairpin", brand: "Poliform", price: 9800, image: product1, category: "Столы" },
  { id: "p6", name: "Кресло Scandi Lounge", brand: "Cassina", price: 34500, image: product2, category: "Стулья" },
  { id: "p7", name: "Стеллаж Open Frame", brand: "RIVALLI", price: 28700, image: product3, category: "Хранение" },
  { id: "p8", name: "Диван Comfort", brand: "Poliform", price: 89000, image: product4, category: "Диваны" },
];

const catalogTabs = ["Все", "Диваны", "Столы", "Комоды", "Хранение", "Стулья", "Декор", "Софы"];

const faqItems = [
  { q: "Какой инструмент для проектирования и дизайна интерьеров?", a: "Rumica — онлайн-платформа для проектирования интерьеров с интерактивным планировщиком, каталогом мебели и AI-ассистентом." },
  { q: "Можно ли заказать всю мебель из моей комплектации?", a: "Да, вы можете добавить все предметы из проекта в корзину и оформить единый заказ." },
  { q: "Как я могу оплатить услуги и заказ мебели?", a: "Мы принимаем банковские карты, электронные кошельки и банковские переводы." },
  { q: "Подходит ли программа для проектирования и дизайна интерьеров?", a: "Да, программа подходит как для профессиональных дизайнеров, так и для тех, кто хочет самостоятельно спроектировать интерьер." },
  { q: "Сколько стоит выбрать мебель и построить проект?", a: "Базовое использование планировщика бесплатное. Расширенные функции доступны по подписке." },
];

const advantages = [
  { icon: Layout, title: "Простой интерфейс", desc: "Интуитивно понятный инструмент для проектирования" },
  { icon: Zap, title: "Быстрая визуализация", desc: "Мгновенный 3D-рендеринг интерьера" },
  { icon: Armchair, title: "Каталог мебели + покупка", desc: "Тысячи товаров с возможностью покупки" },
  { icon: Users, title: "Работа команды и заказчика", desc: "Совместное редактирование проекта" },
  { icon: Palette, title: "Готовые дизайн-пакеты", desc: "Стильные дизайн-решения для каждой комнаты" },
  { icon: Image, title: "Работа с текстурами и 3D-моделями", desc: "Реалистичные материалы и освещение" },
];

const targetAudience = [
  { num: "01", title: "Дизайнеры интерьера", desc: "Вы получите мощный инструмент для создания визуализаций и презентаций клиентам, с возможностью сразу подобрать мебель из каталога." },
  { num: "02", title: "Архитекторы и строительные компании", desc: "Быстрое создание планировок с интеграцией мебельного каталога для комплектации объектов." },
  { num: "03", title: "Домовладельцы, самостоятельно делающие ремонт", desc: "Простой интерфейс позволит спроектировать интерьер без профессиональных навыков." },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("Все");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [designIndex, setDesignIndex] = useState(0);

  const filteredProducts = activeTab === "Все"
    ? products
    : products.filter((p) => p.category === activeTab);

  const designsPerPage = 3;
  const totalDesignPages = Math.ceil(mockPublicDesigns.length / designsPerPage);
  const visibleDesigns = mockPublicDesigns.slice(
    designIndex * designsPerPage,
    designIndex * designsPerPage + designsPerPage
  );

  const prevHero = useCallback(() => setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length), []);
  const nextHero = useCallback(() => setHeroIndex((i) => (i + 1) % heroSlides.length), []);
  const prevDesign = useCallback(() => setDesignIndex((i) => (i - 1 + totalDesignPages) % totalDesignPages), [totalDesignPages]);
  const nextDesign = useCallback(() => setDesignIndex((i) => (i + 1) % totalDesignPages), [totalDesignPages]);

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative w-full h-[680px] overflow-hidden">
        <img src={currentSlide.image} alt="Современный дизайн интерьера" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-[60px] max-w-[600px]">
          <p className="text-small text-white/80 mb-4">{currentSlide.subtitle}</p>
          <h1 className="text-h2 text-white leading-tight mb-6">
            {currentSlide.title}
          </h1>
          <div className="inline-block bg-black/40 backdrop-blur-sm rounded-lg px-6 py-4 w-fit">
            <CTALink text="НАЧАТЬ ПРОЕКТ" to="/planner/new" />
          </div>
        </div>
        {/* Slide progress */}
        <div className="absolute bottom-8 left-[60px] flex items-center gap-4">
          <span className="text-white/60 font-montserrat font-medium text-[18px]">
            <span className="text-art-accent">{String(heroIndex + 1).padStart(2, "0")}</span>/{String(heroSlides.length).padStart(2, "0")}
          </span>
          <div className="w-[200px] h-1 bg-white/20 rounded">
            <div className="h-full bg-art-accent rounded transition-all duration-300" style={{ width: `${((heroIndex + 1) / heroSlides.length) * 100}%` }} />
          </div>
        </div>
        {/* Thumbnails */}
        <div className="absolute bottom-8 right-[60px] flex gap-3">
          {heroSlides.map((slide, i) => (
            <button key={i} onClick={() => setHeroIndex(i)} className={`w-[100px] h-[70px] rounded overflow-hidden border-2 transition-colors ${i === heroIndex ? "border-art-accent" : "border-white/20"}`}>
              <img src={slide.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </section>

      {/* О ПРОГРАММЕ */}
      <section className="py-20 px-[60px]">
        <div className="flex gap-16 items-start">
          <h2 className="text-h2 text-art-main shrink-0">О ПРОГРАММЕ</h2>
          <div className="grid grid-cols-2 gap-8">
            <p className="text-body text-art-muted">
              Это ваш персональный конструктор интерьера, который поможет спланировать пространство, подобрать мебель и увидеть результат до покупки.
            </p>
            <p className="text-body text-art-muted">
              Планируйте квартиру, офис или загородный дом — с удобным инструментом проектирования и каталогом мебели на одной платформе.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ЭТАПЫ РАБОТЫ */}
      <section className="py-20 px-[60px]">
        <div className="flex items-center gap-8 mb-12">
          <h2 className="text-h2 text-art-main">ЭТАПЫ РАБОТЫ</h2>
          <div className="flex items-center gap-2 text-art-accent">
            <span className="text-number">1</span>
            <ChevronRight className="w-6 h-6" />
            <span className="text-number text-art-muted">2</span>
            <ChevronRight className="w-6 h-6 text-art-muted" />
            <span className="text-number text-art-muted">3</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-12">
          {[
            { num: "1", title: "Планировка", desc: "Создайте план помещения с помощью 2D-редактора с точными размерами стен, окон и дверей.", icon: Layout },
            { num: "2", title: "Мебель", desc: "Добавьте мебель из каталога, расставьте её по комнатам и подберите стиль.", icon: Armchair },
            { num: "3", title: "Визуализация", desc: "Переключитесь в 3D-режим и посмотрите как будет выглядеть ваш интерьер в реальности.", icon: Image },
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="w-[60px] h-[60px] rounded-full border border-art-accent-border flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-art-accent" />
              </div>
              <h3 className="text-h3 text-art-main mb-3">{step.title}</h3>
              <p className="text-small text-art-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ДИЗАЙНЫ */}
      <section className="py-20 px-[60px]">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-h2 text-art-main">ДИЗАЙНЫ</h2>
          <div className="flex gap-2">
            <button onClick={prevDesign} className="w-10 h-10 rounded-full border border-art-accent-border flex items-center justify-center hover:bg-art-accent hover:text-white transition-colors text-art-accent">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextDesign} className="w-10 h-10 rounded-full border border-art-accent-border flex items-center justify-center hover:bg-art-accent hover:text-white transition-colors text-art-accent">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {visibleDesigns.map((d) => (
            <Link to={`/designs/${d.id}`} key={d.id} className="group">
              <div className="overflow-hidden rounded-lg mb-4">
                <img src={d.coverImage} alt={d.name} className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={600} />
              </div>
              <p className="text-body text-art-main">{d.name}</p>
            </Link>
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-8 flex items-center gap-4">
          <span className="font-montserrat font-medium text-[18px] text-art-accent">{designIndex + 1}/{String(totalDesignPages).padStart(2, "0")}</span>
          <div className="flex-1 h-1 bg-muted rounded">
            <div className="h-full bg-art-accent rounded transition-all duration-300" style={{ width: `${((designIndex + 1) / totalDesignPages) * 100}%` }} />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* КАТАЛОГ */}
      <section className="py-20 px-[60px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-h2 text-art-main">КАТАЛОГ</h2>
          <CTALink text="Подробнее в каталог" to="/catalog" />
        </div>
        {/* Tabs */}
        <div className="flex gap-6 mb-10 border-b border-art-accent-border">
          {catalogTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-montserrat font-medium text-[16px] transition-colors ${
                activeTab === tab
                  ? "text-art-accent border-b-2 border-art-accent"
                  : "text-art-muted hover:text-art-main"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Product grid */}
        <div className="grid grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <Link to={`/catalog/${p.id}`} key={p.id} className="group p-2">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img src={p.image} alt={p.name} className="w-full h-[430px] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={512} height={640} />
                <button onClick={(e) => e.preventDefault()} className="absolute top-3 right-3 text-art-main/60 hover:text-art-accent transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              <p className="text-body text-art-main mb-1">{p.name}</p>
              <p className="text-small text-art-muted mb-1">{p.brand}</p>
              <p className="font-montserrat font-bold text-[16px] text-art-main">{p.price.toLocaleString("ru-RU")} ₽</p>
            </Link>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center text-art-muted py-12">Нет товаров в этой категории</p>
        )}
      </section>

      <SectionDivider />

      {/* ПРОЕКТЫ */}
      <section className="py-20 px-[60px]">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-h2 text-art-main">ПРОЕКТЫ</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-art-accent-border flex items-center justify-center hover:bg-art-accent hover:text-white transition-colors text-art-accent">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-art-accent-border flex items-center justify-center hover:bg-art-accent hover:text-white transition-colors text-art-accent">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {mockProjects.map((proj) => (
            <Link to={`/projects/${proj.id}`} key={proj.id} className="group">
              <div className="overflow-hidden rounded-lg mb-3">
                <img src={proj.thumbnailUrl} alt={proj.name} className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={600} />
              </div>
              <p className="text-body text-art-main">{proj.name}</p>
              <p className="text-small text-art-muted">{proj.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <span className="font-montserrat font-medium text-[18px] text-art-accent">1/01</span>
          <div className="flex-1 h-1 bg-muted rounded">
            <div className="w-full h-full bg-art-accent rounded" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ПРЕИМУЩЕСТВА ПЛАНИРОВЩИКА */}
      <section className="py-20 px-[60px]">
        <h2 className="text-h2 text-art-main mb-14">ПРЕИМУЩЕСТВА ПЛАНИРОВЩИКА</h2>
        <div className="grid grid-cols-3 gap-x-12 gap-y-10">
          {advantages.map((a, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-[60px] h-[60px] rounded-full border border-art-accent-border flex items-center justify-center shrink-0">
                <a.icon className="w-6 h-6 text-art-accent" />
              </div>
              <div>
                <h3 className="text-h3 text-art-main mb-2">{a.title}</h3>
                <p className="text-small text-art-muted">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* AI ПОМОЩНИК */}
      <section className="py-20 px-[60px]">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-h2 text-art-main">AI ПОМОЩНИК</h2>
        </div>
        <p className="text-body text-art-muted mb-10 max-w-[600px]">
          Получите рекомендации по стилю, цветовой палитре и мебели от нашего искусственного интеллекта
        </p>
        <div className="relative rounded-xl overflow-hidden h-[400px]">
          <img src={aiAssistant} alt="AI Помощник" className="w-full h-full object-cover" loading="lazy" width={800} height={600} />
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur rounded-lg px-6 py-4">
            <p className="text-small text-art-main">1 из 3: Выберите комнату для дизайна</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* КОМУ ПОДОЙДЁТ НАШ ПЛАНИРОВЩИК */}
      <section className="py-20 px-[60px]">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-h2 text-art-main">КОМУ ПОДОЙДЁТ НАШ ПЛАНИРОВЩИК</h2>
          <CTALink text="Подробнее" to="/planner/new" />
        </div>
        <div className="flex flex-col">
          {targetAudience.map((item, i) => (
            <div key={i}>
              <div className="flex items-start gap-10 py-8">
                <span className="text-number text-art-accent shrink-0 w-[60px]">{item.num}</span>
                <h3 className="text-h3 text-art-main w-[280px] shrink-0">{item.title}</h3>
                <p className="text-body text-art-muted flex-1">{item.desc}</p>
              </div>
              {i < targetAudience.length - 1 && <SectionDivider />}
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ */}
      <section className="py-20 px-[60px]">
        <h2 className="text-h2 text-art-main mb-10">ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ</h2>
        <div className="flex flex-col">
          {faqItems.map((item, i) => (
            <div key={i} className="border-b border-art-accent-border">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left"
              >
                <span className="text-body text-art-main pr-8">{item.q}</span>
                {openFaq === i ? (
                  <Minus className="w-5 h-5 text-art-accent shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-art-accent shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <p className="text-body text-art-muted pb-6">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* СОЗДАЙТЕ СВОЙ ПЕРВЫЙ ПРОЕКТ */}
      <section className="py-20 px-[60px]">
        <h2 className="text-h2 text-art-main mb-10">СОЗДАЙТЕ СВОЙ ПЕРВЫЙ ПРОЕКТ УЖЕ СЕГОДНЯ</h2>
        <div className="flex gap-10 items-center">
          <div className="w-[400px] h-[300px] rounded-xl overflow-hidden shrink-0">
            <img src={ctaBg} alt="Создайте проект" className="w-full h-full object-cover" loading="lazy" width={640} height={512} />
          </div>
          <div className="flex-1">
            <p className="text-body text-art-muted mb-8">
              Начните планировать свой идеальный интерьер прямо сейчас. Зарегистрируйтесь бесплатно и получите доступ ко всем инструментам проектирования.
            </p>
            <CTALink text="НАЧАТЬ ПРОЕКТ" to="/planner/new" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
