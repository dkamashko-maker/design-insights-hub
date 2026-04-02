import { useState } from "react";
import { X, Search, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlannerStore } from "@/stores/plannerStore";
import { products, categories } from "@/data/mockData";
import { CM_TO_PX } from "@/constants/planner";
import { useCartStore } from "@/stores/appStore";

const CatalogPanel = () => {
  const { rightCatalogOpen, setRightCatalogOpen, activeFurnitureTab, setActiveFurnitureTab, addObject, stageScale } = usePlannerStore();
  const addToCart = useCartStore((s) => s.addItem);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState<typeof products | null>(null);

  if (!rightCatalogOpen) return null;

  const tabs = [
    { key: "category" as const, label: "По категории" },
    { key: "room" as const, label: "По комнате" },
    { key: "ai" as const, label: "AI подбор" },
  ];

  const filtered = products.filter((p) => {
    if (catFilter && p.categoryId !== catFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = (p: typeof products[0]) => {
    addObject({
      id: crypto.randomUUID(),
      type: "furniture",
      x: 300,
      y: 300,
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
  };

  const handleAI = () => {
    const lower = aiQuery.toLowerCase();
    const matches = products.filter((p) => p.style.toLowerCase().includes(lower) || p.name.toLowerCase().includes(lower));
    setAiResults(matches.length > 0 ? matches : products.slice(0, 4));
  };

  return (
    <div className="w-[345px] bg-white border-l border-[rgba(0,128,128,0.3)] flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,128,128,0.2)]">
        <h3 className="font-montserrat font-semibold text-base">Мебель</h3>
        <button onClick={() => setRightCatalogOpen(false)} className="text-[#333] hover:text-[#008080]">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(0,128,128,0.2)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveFurnitureTab(t.key)}
            className={`flex-1 py-2.5 text-xs font-montserrat transition-colors ${
              activeFurnitureTab === t.key ? "text-[#008080] border-b-2 border-[#008080]" : "text-[#333]/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeFurnitureTab === "category" && (
          <>
            <div className="flex gap-1.5 flex-wrap mb-3">
              <button
                onClick={() => setCatFilter(null)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${!catFilter ? "bg-[#008080] text-white" : "bg-muted text-[#333]"}`}
              >
                Все
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCatFilter(c.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${catFilter === c.id ? "bg-[#008080] text-white" : "bg-muted text-[#333]"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск товаров..." className="pl-8 h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((p) => (
                <div key={p.id} className="border border-border rounded-lg overflow-hidden bg-white">
                  <img src={p.images[0]} alt={p.name} className="w-full h-[100px] object-cover" />
                  <div className="p-2">
                    <p className="text-[12px] font-medium truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                    <p className="text-[13px] font-bold text-[#008080]">{p.price.toLocaleString("ru-RU")} ₽</p>
                    <Button size="sm" className="w-full h-7 text-[11px] mt-1.5 bg-[#008080] text-white" onClick={() => handleAdd(p)}>
                      <Plus className="w-3 h-3 mr-0.5" /> Добавить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeFurnitureTab === "room" && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Сначала добавьте планировку, чтобы увидеть рекомендации по комнатам
          </div>
        )}

        {activeFurnitureTab === "ai" && (
          <>
            <div className="mb-4">
              <Textarea value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Опишите стиль или задачу..." rows={3} className="text-sm" />
              <Button onClick={handleAI} className="w-full mt-2 bg-[#008080] text-white text-sm" disabled={!aiQuery.trim()}>
                <Sparkles className="w-4 h-4 mr-1" /> Подобрать
              </Button>
            </div>
            {aiResults && (
              <div className="grid grid-cols-2 gap-2">
                {aiResults.map((p) => (
                  <div key={p.id} className="border border-border rounded-lg overflow-hidden bg-white">
                    <img src={p.images[0]} alt={p.name} className="w-full h-[100px] object-cover" />
                    <div className="p-2">
                      <p className="text-[12px] font-medium truncate">{p.name}</p>
                      <p className="text-[13px] font-bold text-[#008080]">{p.price.toLocaleString("ru-RU")} ₽</p>
                      <Button size="sm" className="w-full h-7 text-[11px] mt-1.5 bg-[#008080] text-white" onClick={() => handleAdd(p)}>
                        <Plus className="w-3 h-3 mr-0.5" /> Добавить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPanel;
