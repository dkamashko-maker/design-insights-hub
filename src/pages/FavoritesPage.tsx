import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore, useCartStore } from "@/stores/appStore";
import { products, designPacks } from "@/data/mockData";

const FavoritesPage = () => {
  const [tab, setTab] = useState<"products" | "designs">("products");
  const { favoriteProductIds, favoriteDesignPackIds, toggleProductFavorite, toggleDesignPackFavorite } = useFavoritesStore();
  const addItem = useCartStore((s) => s.addItem);

  const favProducts = products.filter((p) => favoriteProductIds.has(p.id));
  const favDesigns = designPacks.filter((d) => favoriteDesignPackIds.has(d.id));

  const tabs = [
    { key: "products" as const, label: "Товары", count: favProducts.length },
    { key: "designs" as const, label: "Дизайны", count: favDesigns.length },
  ];

  const isEmpty = tab === "products" ? favProducts.length === 0 : favDesigns.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-h2 mb-6">Избранное</h1>

      <div className="flex gap-6 border-b border-border mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 font-montserrat font-medium text-sm transition-colors ${
              tab === t.key ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center py-16 gap-4">
          <Heart className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            {tab === "products" ? "Здесь будут ваши избранные товары" : "Здесь будут ваши избранные дизайны"}
          </p>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link to={tab === "products" ? "/catalog" : "/designs"}>
              Перейти в {tab === "products" ? "каталог" : "дизайны"}
            </Link>
          </Button>
        </div>
      ) : tab === "products" ? (
        <div className="grid grid-cols-4 gap-5">
          {favProducts.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden group">
              <div className="relative">
                <Link to={`/catalog/${p.id}`}>
                  <img src={p.images[0]} alt={p.name} className="w-full aspect-[4/3] object-cover" />
                </Link>
                <button
                  onClick={() => toggleProductFavorite(p.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                <p className="font-montserrat font-medium text-sm truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
                <p className="font-montserrat font-semibold text-primary">{p.price.toLocaleString("ru-RU")} ₽</p>
                <Button size="sm" className="w-full mt-2 h-8 text-xs bg-primary text-primary-foreground" onClick={() => addItem(p.id)}>
                  <ShoppingCart className="w-3 h-3 mr-1" /> В корзину
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {favDesigns.map((d) => (
            <div key={d.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="relative">
                <Link to={`/designs/${d.id}`}>
                  <img src={d.coverImage} alt={d.name} className="w-full aspect-video object-cover" />
                </Link>
                <button
                  onClick={() => toggleDesignPackFavorite(d.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                </button>
              </div>
              <div className="p-4">
                <p className="font-montserrat font-medium">{d.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{d.style}</p>
                <p className="font-montserrat font-semibold text-primary mt-2">{d.price.toLocaleString("ru-RU")} ₽</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
