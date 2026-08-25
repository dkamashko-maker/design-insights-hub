import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, ChevronDown, ChevronUp } from "lucide-react";
import { materialProducts, materialCategories, materialBrands, type MaterialProduct } from "@/data/materialsData";
import { useFavoritesStore } from "@/stores/appStore";

const MaterialCard = ({ item }: { item: MaterialProduct }) => {
  const { isProductFavorite, toggleProductFavorite } = useFavoritesStore();
  const isFav = isProductFavorite(item.id);

  return (
    <div className="group p-2">
      <Link to={`/materials/${item.id}`}>
        <div className="relative overflow-hidden rounded-lg mb-3 bg-art-warm-bg border border-art-accent-border">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-[430px] object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width={512}
            height={640}
          />
        </div>
      </Link>
      <div className="flex justify-between items-start gap-2">
        <Link to={`/materials/${item.id}`} className="flex-1">
          <p className="text-body text-art-main mb-1 leading-snug line-clamp-2">{item.name}</p>
          <p className="text-small text-art-muted mb-1">{item.brand}</p>
          <p className="font-montserrat font-bold text-[16px] text-art-main">
            {item.price.toLocaleString("ru-RU")} ₽
          </p>
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); toggleProductFavorite(item.id); }}
          className="mt-1 shrink-0"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-art-accent text-art-accent" : "text-art-muted hover:text-art-accent"}`} />
        </button>
      </div>
    </div>
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
