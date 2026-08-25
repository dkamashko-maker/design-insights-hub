import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, ChevronDown, ChevronUp } from "lucide-react";
import { products, designPacks, categories, brands, styles, colors, type Product, type DesignPack } from "@/data/mockData";
import { useFavoritesStore } from "@/stores/appStore";

const ITEMS_PER_PAGE = 12;

type SortOption = "price_asc" | "price_desc" | "newest";
type TabOption = "products" | "design-packs";

interface FilterSection {
  key: string;
  label: string;
  open: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { isProductFavorite, toggleProductFavorite } = useFavoritesStore();
  const isFav = isProductFavorite(product.id);

  return (
    <div className="group p-2">
      <Link to={`/catalog/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg mb-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-[430px] object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width={512}
            height={640}
          />
        </div>
      </Link>
      <div className="flex justify-between items-start gap-2">
        <Link to={`/catalog/${product.id}`} className="flex-1">
          <p className="text-body text-art-main mb-1 leading-snug">{product.name}</p>
          <p className="text-small text-art-muted mb-1">{product.brand}</p>
          <p className="font-montserrat font-bold text-[16px] text-art-main">
            {product.price.toLocaleString("ru-RU")} ₽
          </p>
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); toggleProductFavorite(product.id); }}
          className="mt-1 shrink-0"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-art-accent text-art-accent" : "text-art-muted hover:text-art-accent"}`} />
        </button>
      </div>
    </div>
  );
};

const DesignPackCard = ({ pack }: { pack: DesignPack }) => {
  const { isDesignPackFavorite, toggleDesignPackFavorite } = useFavoritesStore();
  const isFav = isDesignPackFavorite(pack.id);

  return (
    <div className="group p-2">
      <Link to={`/designs/${pack.id}`}>
        <div className="relative overflow-hidden rounded-lg mb-3">
          <img
            src={pack.coverImage}
            alt={pack.name}
            className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width={800}
            height={600}
          />
        </div>
      </Link>
      <div className="flex justify-between items-start gap-2">
        <Link to={`/designs/${pack.id}`} className="flex-1">
          <p className="text-body text-art-main mb-1">{pack.name}</p>
          <p className="text-small text-art-muted mb-1">{pack.productIds.length} предметов · {pack.style}</p>
          <p className="font-montserrat font-bold text-[16px] text-art-main">
            {pack.price.toLocaleString("ru-RU")} ₽
          </p>
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); toggleDesignPackFavorite(pack.id); }}
          className="mt-1 shrink-0"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-art-accent text-art-accent" : "text-art-muted hover:text-art-accent"}`} />
        </button>
      </div>
    </div>
  );
};

const CatalogPage = () => {
  const [tab, setTab] = useState<TabOption>("products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // Section toggles
  const [sections, setSections] = useState<Record<string, boolean>>({
    price: true,
    room: true,
    brand: true,
    style: true,
    color: true,
  });

  const toggleSection = (key: string) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedStyles([]);
    setSelectedColors([]);
    setPriceFrom("");
    setPriceTo("");
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (selectedCategories.length) result = result.filter((p) => selectedCategories.includes(p.categoryId));
    if (selectedBrands.length) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedStyles.length) result = result.filter((p) => selectedStyles.includes(p.style));
    if (selectedColors.length) result = result.filter((p) => selectedColors.includes(p.color));
    if (priceFrom) result = result.filter((p) => p.price >= Number(priceFrom));
    if (priceTo) result = result.filter((p) => p.price <= Number(priceTo));

    switch (sort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return result;
  }, [search, selectedCategories, selectedBrands, selectedStyles, selectedColors, priceFrom, priceTo, sort]);

  // Count of products matching the current sidebar filter combination (excludes search/sort)
  const matchingCount = useMemo(() => {
    let result = [...products];
    if (selectedCategories.length) result = result.filter((p) => selectedCategories.includes(p.categoryId));
    if (selectedBrands.length) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedStyles.length) result = result.filter((p) => selectedStyles.includes(p.style));
    if (selectedColors.length) result = result.filter((p) => selectedColors.includes(p.color));
    if (priceFrom) result = result.filter((p) => p.price >= Number(priceFrom));
    if (priceTo) result = result.filter((p) => p.price <= Number(priceTo));
    return result.length;
  }, [selectedCategories, selectedBrands, selectedStyles, selectedColors, priceFrom, priceTo]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const sortLabels: Record<SortOption, string> = {
    price_asc: "Цена ↑",
    price_desc: "Цена ↓",
    newest: "По новизне",
  };

  const getCategoryProductCount = (catId: string) => products.filter((p) => p.categoryId === catId).length;

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
                  type="number"
                  placeholder="0"
                  value={priceFrom}
                  onChange={(e) => { setPriceFrom(e.target.value); setPage(1); }}
                  className="w-full border border-art-accent-border rounded px-3 py-2 text-small text-art-main bg-transparent focus:outline-none focus:border-art-accent"
                />
              </div>
              <span className="text-art-muted mt-5">—</span>
              <div className="flex-1">
                <label className="text-small text-art-muted mb-1 block">До</label>
                <input
                  type="number"
                  placeholder="150 000"
                  value={priceTo}
                  onChange={(e) => { setPriceTo(e.target.value); setPage(1); }}
                  className="w-full border border-art-accent-border rounded px-3 py-2 text-small text-art-main bg-transparent focus:outline-none focus:border-art-accent"
                />
              </div>
            </div>
          )}
        </div>

        {/* КОМНАТА */}
        <div className="mb-6">
          <button onClick={() => toggleSection("room")} className="flex items-center justify-between w-full mb-3">
            <span className="font-montserrat font-semibold text-[14px] uppercase tracking-wide text-art-main">Комната</span>
            {sections.room ? <ChevronUp className="w-4 h-4 text-art-muted" /> : <ChevronDown className="w-4 h-4 text-art-muted" />}
          </button>
          {sections.room && (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleFilter(selectedCategories, cat.id, setSelectedCategories)}
                      className="w-4 h-4 rounded border-art-accent-border text-art-accent focus:ring-art-accent accent-art-accent"
                    />
                    <span className="text-small text-art-main group-hover:text-art-accent transition-colors">{cat.name}</span>
                  </div>
                  <span className="text-small text-art-muted">({getCategoryProductCount(cat.id)})</span>
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
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleFilter(selectedBrands, brand, setSelectedBrands)}
                    className="w-4 h-4 rounded border-art-accent-border text-art-accent focus:ring-art-accent accent-art-accent"
                  />
                  <span className="text-small text-art-main group-hover:text-art-accent transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* СТИЛЬ */}
        <div className="mb-6">
          <button onClick={() => toggleSection("style")} className="flex items-center justify-between w-full mb-3">
            <span className="font-montserrat font-semibold text-[14px] uppercase tracking-wide text-art-main">Стиль</span>
            {sections.style ? <ChevronUp className="w-4 h-4 text-art-muted" /> : <ChevronDown className="w-4 h-4 text-art-muted" />}
          </button>
          {sections.style && (
            <div className="flex flex-col gap-2">
              {styles.map((style) => (
                <label key={style} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedStyles.includes(style)}
                    onChange={() => toggleFilter(selectedStyles, style, setSelectedStyles)}
                    className="w-4 h-4 rounded border-art-accent-border text-art-accent focus:ring-art-accent accent-art-accent"
                  />
                  <span className="text-small text-art-main group-hover:text-art-accent transition-colors">{style}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ЦВЕТ */}
        <div className="mb-6">
          <button onClick={() => toggleSection("color")} className="flex items-center justify-between w-full mb-3">
            <span className="font-montserrat font-semibold text-[14px] uppercase tracking-wide text-art-main">Цвет</span>
            {sections.color ? <ChevronUp className="w-4 h-4 text-art-muted" /> : <ChevronDown className="w-4 h-4 text-art-muted" />}
          </button>
          {sections.color && (
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => toggleFilter(selectedColors, c.name, setSelectedColors)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColors.includes(c.name) ? "border-art-accent scale-110" : "border-transparent hover:border-art-accent-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
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
        <h1 className="text-h2 text-art-main mb-8">МЕБЕЛЬ И ИНТЕРЬЕР</h1>

        {/* Search + Sort */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-art-muted" />
            <input
              type="text"
              placeholder="Поиск товаров..."
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

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-art-accent-border">
          <button
            onClick={() => { setTab("products"); setPage(1); }}
            className={`pb-3 font-montserrat font-medium text-[16px] transition-colors ${
              tab === "products" ? "text-art-accent border-b-2 border-art-accent" : "text-art-muted hover:text-art-main"
            }`}
          >
            Товары
          </button>
          <button
            onClick={() => { setTab("design-packs"); setPage(1); }}
            className={`pb-3 font-montserrat font-medium text-[16px] transition-colors ${
              tab === "design-packs" ? "text-art-accent border-b-2 border-art-accent" : "text-art-muted hover:text-art-main"
            }`}
          >
            Дизайн-паки
          </button>
        </div>

        {/* Grid */}
        {tab === "products" ? (
          <>
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
                      page === p
                        ? "bg-art-accent text-white"
                        : "text-art-main hover:bg-art-accent/10"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {designPacks.map((dp) => (
              <DesignPackCard key={dp.id} pack={dp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
