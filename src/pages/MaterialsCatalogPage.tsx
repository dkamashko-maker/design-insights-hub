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

const ITEMS_PER_PAGE = 12;

type SortOption = "price_asc" | "price_desc" | "newest";

const sortLabels: Record<SortOption, string> = {
  price_asc: "Цена ↑",
  price_desc: "Цена ↓",
  newest: "По новизне",
};

const MaterialsCatalogPage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const [sections, setSections] = useState<Record<string, boolean>>({ price: true, cat: true, brand: true });
  const toggleSection = (key: string) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedCats([]); setSelectedBrands([]); setPriceFrom(""); setPriceTo(""); setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = materialProducts.filter((m) => {
      if (search && !`${m.name} ${m.sku} ${m.brand} ${m.group2}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCats.length && !selectedCats.includes(m.group2)) return false;
      if (selectedBrands.length && !selectedBrands.includes(m.brand)) return false;
      if (priceFrom && m.price < Number(priceFrom)) return false;
      if (priceTo && m.price > Number(priceTo)) return false;
      return true;
    });
    switch (sort) {
      case "price_asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price_desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "newest": result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return result;
  }, [search, selectedCats, selectedBrands, priceFrom, priceTo, sort]);

  // Количество товаров по текущей комбинации фильтров сайдбара (без поиска и сортировки)
  const matchingCount = useMemo(() => materialProducts.filter((m) => {
    if (selectedCats.length && !selectedCats.includes(m.group2)) return false;
    if (selectedBrands.length && !selectedBrands.includes(m.brand)) return false;
    if (priceFrom && m.price < Number(priceFrom)) return false;
    if (priceTo && m.price > Number(priceTo)) return false;
    return true;
  }).length, [selectedCats, selectedBrands, priceFrom, priceTo]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getCategoryCount = (cat: string) => materialProducts.filter((m) => m.group2 === cat).length;
  const getBrandCount = (brand: string) => materialProducts.filter((m) => m.brand === brand).length;

  return (
    <div className="flex h-[calc(100vh-104px)] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[345px] shrink-0 border-r border-art-accent-border flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">

          {/* ЦЕНА */}
          <div className="mb-6">
            <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full mb-3">
              <span className="font-montserrat font-semibold text-[14px] uppercase tracking-wide text-art-main">Цена</span>
              {sections.price ? <ChevronUp className="w-4 h-4 text-art-muted" /> : <ChevronDown className="w-4 h-4 text-art-muted" />}
            </button>
            {sections.price && (
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-small text-art-muted mb-1 block">От</label>
                  <input
                    type="number" placeholder="0" value={priceFrom}
                    onChange={(e) => { setPriceFrom(e.target.value); setPage(1); }}
                    className="w-full border border-art-accent-border rounded px-3 py-2 text-small text-art-main bg-transparent focus:outline-none focus:border-art-accent"
                  />
                </div>
                <span className="text-art-muted mt-5">—</span>
                <div className="flex-1">
                  <label className="text-small text-art-muted mb-1 block">До</label>
                  <input
                    type="number" placeholder="20 000" value={priceTo}
                    onChange={(e) => { setPriceTo(e.target.value); setPage(1); }}
                    className="w-full border border-art-accent-border rounded px-3 py-2 text-small text-art-main bg-transparent focus:outline-none focus:border-art-accent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* КАТЕГОРИЯ */}
          <div className="mb-6">
            <button onClick={() => toggleSection("cat")} className="flex items-center justify-between w-full mb-3">
              <span className="font-montserrat font-semibold text-[14px] uppercase tracking-wide text-art-main">Категория</span>
              {sections.cat ? <ChevronUp className="w-4 h-4 text-art-muted" /> : <ChevronDown className="w-4 h-4 text-art-muted" />}
            </button>
            {sections.cat && (
              <div className="flex flex-col gap-2">
                {materialCategories.map((cat) => (
                  <label key={cat} className="flex items-start justify-between gap-2 cursor-pointer group">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox" checked={selectedCats.includes(cat)}
                        onChange={() => toggleFilter(selectedCats, cat, setSelectedCats)}
                        className="w-4 h-4 mt-0.5 rounded border-art-accent-border accent-art-accent shrink-0"
                      />
                      <span className="text-small text-art-main group-hover:text-art-accent transition-colors">{cat}</span>
                    </div>
                    <span className="text-small text-art-muted shrink-0">({getCategoryCount(cat)})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* БРЕНД */}
          <div className="mb-6">
            <button onClick={() => toggleSection("brand")} className="flex items-center justify-between w-full mb-3">
              <span className="font-montserrat font-semibold text-[14px] uppercase tracking-wide text-art-main">Бренд</span>
              {sections.brand ? <ChevronUp className="w-4 h-4 text-art-muted" /> : <ChevronDown className="w-4 h-4 text-art-muted" />}
            </button>
            {sections.brand && (
              <div className="flex flex-col gap-2">
                {materialBrands.map((brand) => (
                  <label key={brand} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox" checked={selectedBrands.includes(brand)}
                        onChange={() => toggleFilter(selectedBrands, brand, setSelectedBrands)}
                        className="w-4 h-4 rounded border-art-accent-border accent-art-accent"
                      />
                      <span className="text-small text-art-main group-hover:text-art-accent transition-colors">{brand}</span>
                    </div>
                    <span className="text-small text-art-muted">({getBrandCount(brand)})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 p-6 pt-4 border-t border-art-accent-border">
          <div className="text-center text-small text-art-muted">
            Найдено товаров: <span className="font-montserrat font-semibold text-art-accent">{matchingCount}</span>
          </div>
          <button
            onClick={() => setPage(1)}
            className="w-full py-3 bg-art-accent text-white font-montserrat font-medium text-[14px] uppercase rounded hover:bg-art-accent/90 transition-colors"
          >
            Применить
          </button>
          <button
            onClick={resetFilters}
            className="w-full py-3 border border-art-accent text-art-accent font-montserrat font-medium text-[14px] uppercase rounded hover:bg-art-accent/5 transition-colors"
          >
            Сбросить
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-h2 text-art-main mb-8">СТРОЙМАТЕРИАЛЫ</h1>

        {/* Search + Sort */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-art-muted" />
            <input
              type="text"
              placeholder="Поиск по названию или артикулу..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 border border-art-accent-border rounded text-body bg-transparent focus:outline-none focus:border-art-accent"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-3 border border-art-accent-border rounded text-small text-art-main hover:border-art-accent transition-colors"
            >
              Сортировать: {sortLabels[sort]}
              <ChevronDown className="w-4 h-4" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-art-accent-border rounded shadow-lg z-20">
                {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-small hover:bg-art-warm-bg transition-colors ${sort === key ? "text-art-accent font-medium" : "text-art-main"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2">
            {paginatedProducts.map((item) => (
              <MaterialCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-art-muted mb-4" />
            <p className="text-h3 text-art-main mb-2">Товары не найдены</p>
            <p className="text-body text-art-muted">Попробуйте изменить параметры фильтрации</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded font-montserrat font-medium text-[14px] transition-colors ${
                  page === p ? "bg-art-accent text-white" : "text-art-main hover:bg-art-accent/10"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsCatalogPage;

