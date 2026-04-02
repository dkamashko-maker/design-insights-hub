import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Save, Download, MousePointer2, SquareDashed,
  DoorOpen, Armchair, Undo2, Redo2, X, Search, Plus, Trash2, LayoutGrid
} from "lucide-react";
import { usePlannerStore, type PlannerTool } from "@/stores/plannerStore";
import { products, categories } from "@/data/mockData";

const tools: { key: PlannerTool; icon: typeof MousePointer2; label: string }[] = [
  { key: "floorplan", icon: LayoutGrid, label: "Планировка" },
  { key: "walls", icon: SquareDashed, label: "Стены" },
  { key: "doors", icon: DoorOpen, label: "Двери" },
  { key: "furniture", icon: Armchair, label: "Мебель" },
  { key: "select", icon: MousePointer2, label: "Выбор" },
];

const PlannerPage = () => {
  const { id } = useParams<{ id: string }>();
  const store = usePlannerStore();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(store.projectName);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (catalogCategory && p.categoryId !== catalogCategory) return false;
    if (catalogSearch && !p.name.toLowerCase().includes(catalogSearch.toLowerCase())) return false;
    return true;
  });

  const selectedObj = store.placedObjects.find((o) => o.id === store.selectedObjectId);

  const handleAddProduct = (product: typeof products[0]) => {
    store.addObject({
      id: `obj-${Date.now()}`,
      productId: product.id,
      name: product.name,
      posX: 200 + Math.random() * 200,
      posY: 200 + Math.random() * 200,
      rotation: 0,
      scale: 1,
      price: product.price,
      widthCm: product.dimensions.width_cm,
      depthCm: product.dimensions.depth_cm,
      heightCm: product.dimensions.height_cm,
    });
  };

  const saveName = () => {
    store.setProjectName(tempName);
    setEditingName(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <div className="h-16 bg-white shadow-sm flex items-center justify-between px-4 shrink-0 z-20">
        <Link to="/projects" className="flex items-center gap-2 text-art-accent font-montserrat font-medium text-[14px] hover:underline">
          <ArrowLeft className="w-4 h-4" />
          К проектам
        </Link>

        <div className="flex items-center gap-2">
          {editingName ? (
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              autoFocus
              className="font-montserrat font-medium text-[20px] text-art-main border-b-2 border-art-accent bg-transparent focus:outline-none text-center"
            />
          ) : (
            <button onClick={() => { setTempName(store.projectName); setEditingName(true); }} className="font-montserrat font-medium text-[20px] text-art-main hover:text-art-accent transition-colors">
              {store.projectName}
            </button>
          )}
          {store.isDirty && <span className="w-2 h-2 bg-art-accent rounded-full" />}
        </div>

        <div className="flex items-center gap-3">
          {/* 2D/3D toggle */}
          <div className="flex rounded-lg overflow-hidden border border-art-accent-border">
            <button
              onClick={() => store.setViewMode("2d")}
              className={`px-4 py-2 text-[13px] font-montserrat font-medium ${store.viewMode === "2d" ? "bg-art-accent text-white" : "text-art-main hover:bg-art-warm-bg"}`}
            >
              2D
            </button>
            <button
              onClick={() => store.setViewMode("3d")}
              className={`px-4 py-2 text-[13px] font-montserrat font-medium ${store.viewMode === "3d" ? "bg-art-accent text-white" : "text-art-main hover:bg-art-warm-bg"}`}
            >
              3D
            </button>
          </div>
          <button
            onClick={() => store.setDirty(false)}
            className="flex items-center gap-2 px-4 py-2 bg-art-accent text-white text-[13px] font-montserrat font-medium uppercase rounded-lg hover:bg-art-accent/90"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
          <button className="p-2 border border-art-accent-border rounded-lg hover:bg-art-warm-bg">
            <Download className="w-4 h-4 text-art-main" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT TOOLBAR */}
        <div className="w-16 bg-white border-r border-art-accent-border flex flex-col items-center py-4 gap-1 shrink-0">
          {tools.map((tool) => (
            <button
              key={tool.key}
              onClick={() => store.setTool(tool.key)}
              className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors ${
                store.selectedTool === tool.key ? "bg-art-accent/10 text-art-accent" : "text-art-muted hover:bg-art-warm-bg"
              }`}
              title={tool.label}
            >
              <tool.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium leading-none">{tool.label}</span>
            </button>
          ))}

          <div className="border-t border-art-accent-border w-8 my-2" />

          <button className="w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 text-art-muted hover:bg-art-warm-bg" title="Отменить">
            <Undo2 className="w-5 h-5" />
            <span className="text-[9px] font-medium">Отмена</span>
          </button>
          <button className="w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 text-art-muted hover:bg-art-warm-bg" title="Повторить">
            <Redo2 className="w-5 h-5" />
            <span className="text-[9px] font-medium">Повтор</span>
          </button>
        </div>

        {/* CANVAS */}
        <div className="flex-1 relative overflow-hidden">
          <div
            id="planner-canvas"
            className="w-full h-full"
            style={{
              backgroundColor: "#F5F5F5",
              backgroundImage: "linear-gradient(rgba(0,128,128,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,128,128,0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Placed objects visualization */}
            {store.placedObjects.map((obj) => (
              <div
                key={obj.id}
                onClick={() => store.selectObject(obj.id)}
                className={`absolute cursor-pointer rounded border-2 flex items-center justify-center text-[10px] font-medium transition-all ${
                  store.selectedObjectId === obj.id ? "border-art-accent bg-art-accent/20 shadow-lg" : "border-art-accent-border bg-white/80 hover:border-art-accent"
                }`}
                style={{
                  left: obj.posX,
                  top: obj.posY,
                  width: Math.max(obj.widthCm * 0.5, 40),
                  height: Math.max(obj.depthCm * 0.5, 40),
                  transform: `rotate(${obj.rotation}deg)`,
                }}
              >
                <span className="truncate px-1 text-art-main">{obj.name.split(" ")[0]}</span>
              </div>
            ))}

            {store.placedObjects.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-art-muted">
                  <LayoutGrid className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-body">Выберите инструмент «Мебель» и добавьте предметы</p>
                  <p className="text-small mt-1">// TODO: Three.js canvas будет подключён отдельно</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CATALOG PANEL */}
        {store.catalogOpen && (
          <div className="w-[345px] bg-white border-l border-art-accent-border flex flex-col shrink-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-art-accent-border">
              <h3 className="text-h3 text-art-main">Каталог</h3>
              <button onClick={() => store.closeCatalog()}>
                <X className="w-5 h-5 text-art-muted" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-art-muted" />
                <input
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full pl-9 pr-3 py-2 border border-art-accent-border rounded text-small focus:outline-none focus:border-art-accent"
                />
              </div>

              <div className="flex gap-1 flex-wrap mb-3">
                <button
                  onClick={() => setCatalogCategory(null)}
                  className={`px-2 py-1 rounded text-[11px] font-medium ${!catalogCategory ? "bg-art-accent text-white" : "bg-art-warm-bg text-art-muted"}`}
                >
                  Все
                </button>
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCatalogCategory(cat.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium ${catalogCategory === cat.id ? "bg-art-accent text-white" : "bg-art-warm-bg text-art-muted"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="border border-art-accent-border rounded-lg overflow-hidden">
                    <img src={p.images[0]} alt={p.name} className="w-full h-[120px] object-cover" loading="lazy" />
                    <div className="p-2">
                      <p className="text-[11px] text-art-main font-medium truncate">{p.name}</p>
                      <p className="text-[11px] text-art-accent font-bold">{p.price.toLocaleString("ru-RU")} ₽</p>
                      <button
                        onClick={() => handleAddProduct(p)}
                        className="w-full mt-1 py-1 bg-art-accent text-white text-[11px] font-medium rounded flex items-center justify-center gap-1 hover:bg-art-accent/90"
                      >
                        <Plus className="w-3 h-3" />
                        Добавить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT PROPERTIES PANEL */}
        {store.propertiesOpen && selectedObj && !store.catalogOpen && (
          <div className="w-[280px] bg-white border-l border-art-accent-border flex flex-col shrink-0">
            <div className="flex items-center justify-between p-4 border-b border-art-accent-border">
              <h3 className="text-h3 text-art-main">Свойства</h3>
              <button onClick={() => store.selectObject(null)}>
                <X className="w-5 h-5 text-art-muted" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-[12px] text-art-muted block mb-1">Название</label>
                <p className="text-small text-art-main font-medium">{selectedObj.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-art-muted block">Ш, см</label>
                  <p className="text-small text-art-main">{selectedObj.widthCm}</p>
                </div>
                <div>
                  <label className="text-[11px] text-art-muted block">Г, см</label>
                  <p className="text-small text-art-main">{selectedObj.depthCm}</p>
                </div>
                <div>
                  <label className="text-[11px] text-art-muted block">В, см</label>
                  <p className="text-small text-art-main">{selectedObj.heightCm}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-art-muted block">Позиция X</label>
                  <p className="text-small text-art-main">{Math.round(selectedObj.posX)}</p>
                </div>
                <div>
                  <label className="text-[11px] text-art-muted block">Позиция Y</label>
                  <p className="text-small text-art-main">{Math.round(selectedObj.posY)}</p>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-art-muted block">Поворот</label>
                <p className="text-small text-art-main">{selectedObj.rotation}°</p>
              </div>
              <div>
                <label className="text-[11px] text-art-muted block">Цена</label>
                <p className="text-small text-art-accent font-bold">{selectedObj.price.toLocaleString("ru-RU")} ₽</p>
              </div>
              <button
                onClick={() => store.removeObject(selectedObj.id)}
                className="w-full py-2 border border-art-accent text-red-500 text-small font-medium rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить объект
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STATUS BAR */}
      <div className="h-9 bg-white border-t border-art-accent-border flex items-center justify-between px-4 shrink-0 z-20">
        <span className="text-[12px] text-art-muted font-montserrat">
          Ш: {store.roomWidthCm} см × В: {store.roomHeightCm} см
        </span>
        <span className="text-[12px] text-art-muted font-montserrat">
          Предметов: {store.placedObjects.length}
        </span>
        <span className="text-[12px] text-art-accent font-montserrat font-medium">
          Итого: {store.getTotalPrice().toLocaleString("ru-RU")} ₽
        </span>
      </div>
    </div>
  );
};

export default PlannerPage;
