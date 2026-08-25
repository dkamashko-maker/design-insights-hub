import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, ShoppingCart, FolderPlus, FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { materialProducts, materialCategories, materialBrands, type MaterialProduct } from "@/data/materialsData";
import { useFavoritesStore, useCartStore } from "@/stores/appStore";
import { toast } from "@/hooks/use-toast";

const MaterialCard = ({ item }: { item: MaterialProduct }) => {
  const { isProductFavorite, toggleProductFavorite } = useFavoritesStore();
  const addItem = useCartStore((s) => s.addItem);
  const isFav = isProductFavorite(item.id);

  const specs = [
    { label: "Артикул", value: item.sku },
    { label: "Штрихкод", value: item.barcode || "—" },
    { label: "Вес", value: `${item.weightKg} кг` },
    { label: "Производитель", value: item.manufacturer },
    { label: "Поставщик", value: item.supplier },
    { label: "Срок годности", value: item.shelfLife },
    { label: "Сертификат", value: item.certificate },
  ];

  return (
    <article className="bg-art-warm-bg rounded-xl p-6">
      <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-6">
        <Link to={`/catalog/${item.id}`} className="block">
          <div className="bg-white border border-art-accent-border rounded-xl h-[200px] flex items-center justify-center overflow-hidden">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-contain p-3"
              loading="lazy"
              width={1024}
              height={1024}
            />
          </div>
        </Link>

        <div className="min-w-0">
          <p className="text-[12px] text-art-muted mb-1.5">
            {[item.group1, item.group2, item.group3].filter(Boolean).join(" / ")}
          </p>
          <Link to={`/catalog/${item.id}`}>
            <h3 className="font-montserrat text-[18px] font-medium text-art-main mb-2 leading-snug hover:text-art-accent transition-colors">
              {item.name}
            </h3>
          </Link>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-art-accent/10 text-art-accent text-[12px] px-2.5 py-1 rounded">
              {item.inStock ? "В наличии" : "Под заказ"}
            </span>
            <span className="bg-white border border-art-accent-border text-art-muted text-[12px] px-2.5 py-1 rounded">
              {item.brand}
            </span>
            <span className="bg-white border border-art-accent-border text-art-muted text-[12px] px-2.5 py-1 rounded">
              Артикул {item.sku}
            </span>
          </div>

          <p className="text-small text-art-muted leading-relaxed mb-4 line-clamp-3">{item.description}</p>

          <p className="font-montserrat font-bold text-[22px] text-art-main mb-4">
            {item.price.toLocaleString("ru-RU")} ₽
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => { addItem(item.id); toast({ title: "Товар добавлен в корзину", description: item.name }); }}
              className="h-9 px-5 bg-art-main text-white text-[14px] font-medium rounded flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="w-4 h-4" /> В корзину
            </button>
            <button
              onClick={() => toggleProductFavorite(item.id)}
              className="h-9 px-4 bg-white border border-art-accent-border text-[14px] text-art-main rounded flex items-center gap-2 hover:border-art-accent transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-art-accent text-art-accent" : ""}`} />
              {isFav ? "В избранном" : "В избранное"}
            </button>
            <button
              onClick={() => toast({ title: "Добавлено в проект", description: item.name })}
              className="h-9 px-4 bg-white border border-art-accent-border text-[14px] text-art-main rounded flex items-center gap-2 hover:border-art-accent transition-colors"
            >
              <FolderPlus className="w-4 h-4" /> В проект
            </button>
            <button
              onClick={() => toast({ title: "Добавлено в дизайн", description: item.name })}
              className="h-9 px-4 bg-white border border-art-accent-border text-[14px] text-art-main rounded flex items-center gap-2 hover:border-art-accent transition-colors"
            >
              <FolderPlus className="w-4 h-4" /> В дизайн
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-art-accent-border mt-5 pt-4">
        <h4 className="font-montserrat text-[14px] font-medium text-art-main mb-2.5">Характеристики</h4>
        <table className="w-full text-[13px]">
          <tbody>
            {specs.map((s, i) => (
              <tr key={s.label} className={i < specs.length - 1 ? "border-b border-art-accent-border" : ""}>
                <td className="text-art-muted py-1.5 w-[45%] align-top">{s.label}</td>
                <td className="py-1.5 text-art-main break-words">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {item.application && (
        <div className="border-t border-art-accent-border mt-4 pt-4">
          <h4 className="font-montserrat text-[14px] font-medium text-art-main mb-2">Область применения</h4>
          <p className="text-[14px] text-art-muted leading-relaxed">{item.application}</p>
        </div>
      )}

      {item.properties.length > 0 && (
        <div className="border-t border-art-accent-border mt-4 pt-4">
          <h4 className="font-montserrat text-[14px] font-medium text-art-main mb-2">Свойства</h4>
          <ul className="text-[14px] text-art-muted leading-relaxed list-disc pl-5">
            {item.properties.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => toast({ title: "Техническая карта", description: "PDF будет доступен после подключения каталога поставщика" })}
          className="h-8 px-3.5 bg-white border border-art-accent-border text-[13px] text-art-main rounded flex items-center gap-2 hover:border-art-accent transition-colors"
        >
          <FileDown className="w-4 h-4" /> Техническая карта (PDF)
        </button>
      </div>
    </article>
  );
};

const MaterialsCatalogPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [sections, setSections] = useState({ price: true, cat: true, brand: true });

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    return materialProducts.filter((m) => {
      if (search && !`${m.name} ${m.sku} ${m.group2}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCats.length && !selectedCats.includes(m.group2)) return false;
      if (selectedBrands.length && !selectedBrands.includes(m.brand)) return false;
      if (priceFrom && m.price < Number(priceFrom)) return false;
      if (priceTo && m.price > Number(priceTo)) return false;
      return true;
    });
  }, [search, selectedCats, selectedBrands, priceFrom, priceTo]);

  const reset = () => {
    setSearch(""); setSelectedCats([]); setSelectedBrands([]); setPriceFrom(""); setPriceTo("");
  };

  const Section = ({ k, label, children }: { k: keyof typeof sections; label: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <button
        onClick={() => setSections((s) => ({ ...s, [k]: !s[k] }))}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-montserrat font-semibold text-[14px] uppercase tracking-wide text-art-main">{label}</span>
        {sections[k] ? <ChevronUp className="w-4 h-4 text-art-muted" /> : <ChevronDown className="w-4 h-4 text-art-muted" />}
      </button>
      {sections[k] && children}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-104px)] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[345px] shrink-0 border-r border-art-accent-border flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <Section k="price" label="Цена">
            <div className="flex items-center gap-3">
              <input
                type="number" placeholder="0" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)}
                className="flex-1 border border-art-accent-border rounded px-3 py-2 text-small bg-transparent focus:outline-none focus:border-art-accent"
              />
              <span className="text-art-muted">—</span>
              <input
                type="number" placeholder="20 000" value={priceTo} onChange={(e) => setPriceTo(e.target.value)}
                className="flex-1 border border-art-accent-border rounded px-3 py-2 text-small bg-transparent focus:outline-none focus:border-art-accent"
              />
            </div>
          </Section>

          <Section k="cat" label="Категория">
            <div className="flex flex-col gap-2">
              {materialCategories.map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox" checked={selectedCats.includes(c)}
                    onChange={() => toggle(selectedCats, c, setSelectedCats)}
                    className="w-4 h-4 rounded border-art-accent-border accent-art-accent shrink-0"
                  />
                  <span className="text-small text-art-main group-hover:text-art-accent transition-colors">{c}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section k="brand" label="Бренд">
            <div className="flex flex-col gap-2">
              {materialBrands.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox" checked={selectedBrands.includes(b)}
                    onChange={() => toggle(selectedBrands, b, setSelectedBrands)}
                    className="w-4 h-4 rounded border-art-accent-border accent-art-accent"
                  />
                  <span className="text-small text-art-main group-hover:text-art-accent transition-colors">{b}</span>
                </label>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-3 p-6 pt-4 border-t border-art-accent-border">
          <button className="w-full py-3 bg-art-accent text-white font-montserrat font-medium text-[14px] uppercase rounded hover:bg-art-accent/90 transition-colors">
            Применить
          </button>
          <button
            onClick={reset}
            className="w-full py-3 border border-art-accent text-art-accent font-montserrat font-medium text-[14px] uppercase rounded hover:bg-art-accent/5 transition-colors"
          >
            Сбросить
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-h2 text-art-main mb-2">СТРОЙМАТЕРИАЛЫ</h1>
        <p className="text-small text-art-muted mb-6">
          Сухие смеси, гидроизоляция, герметики и лакокрасочные материалы Ceresit
        </p>

        <div className="relative mb-6 max-w-[520px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-art-muted" />
          <input
            type="text" placeholder="Поиск по названию или артикулу..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-art-accent-border rounded text-body bg-transparent focus:outline-none focus:border-art-accent"
          />
        </div>

        <p className="text-small text-art-muted mb-4">Найдено позиций: {filtered.length}</p>

        <div className="flex flex-col gap-6 max-w-[900px]">
          {filtered.map((item) => <MaterialCard key={item.id} item={item} />)}
          {filtered.length === 0 && (
            <p className="text-body text-art-muted">По вашему запросу ничего не найдено</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsCatalogPage;
