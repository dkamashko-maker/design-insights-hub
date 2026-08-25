import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Heart, ShoppingCart, FolderPlus, ChevronRight } from "lucide-react";
import { categories } from "@/data/mockData";
import { allProducts as products } from "@/data/allProducts";
import { useFavoritesStore, useCartStore } from "@/stores/appStore";
import { toast } from "@/hooks/use-toast";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isProductFavorite, toggleProductFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-h3 text-art-muted">Товар не найден</p>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const isFav = isProductFavorite(product.id);
  const similarProducts = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  const specs = [
    { label: "Стиль", value: product.style },
    { label: "Материал", value: product.material },
    { label: "Цвет", value: product.color },
    { label: "Габариты (Ш×Г×В)", value: `${product.dimensions.width_cm} × ${product.dimensions.depth_cm} × ${product.dimensions.height_cm} см` },
  ];

  const handleAddToCart = () => {
    addItem(product.id);
    toast({ title: "Добавлено в корзину", description: product.name });
  };

  return (
    <div className="px-[60px] py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-small text-art-muted mb-8">
        <Link to="/" className="hover:text-art-accent transition-colors">Главная</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/catalog" className="hover:text-art-accent transition-colors">Каталог</Link>
        <ChevronRight className="w-4 h-4" />
        {category && (
          <>
            <span className="hover:text-art-accent transition-colors">{category.name}</span>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-art-main">{product.name}</span>
      </nav>

      {/* Main block */}
      <div className="flex gap-12 mb-16">
        {/* Gallery */}
        <div className="w-1/2">
          <div className="rounded-xl overflow-hidden mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-[520px] object-cover"
              width={800}
              height={520}
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-[100px] h-[80px] rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? "border-art-accent" : "border-transparent hover:border-art-accent-border"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="w-1/2">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-h2 text-art-main leading-tight">{product.name}</h1>
            <button onClick={() => toggleProductFavorite(product.id)} className="mt-2 shrink-0">
              <Heart className={`w-7 h-7 transition-colors ${isFav ? "fill-art-accent text-art-accent" : "text-art-muted hover:text-art-accent"}`} />
            </button>
          </div>

          <p className="text-small text-art-muted mb-4">{product.brand}</p>

          <p className="font-montserrat font-bold text-[28px] text-art-accent mb-6">
            {product.price.toLocaleString("ru-RU")} ₽
          </p>

          <p className="text-body text-art-muted mb-8">{product.description}</p>

          {/* Specs */}
          <div className="mb-8">
            {specs.map((spec, i) => (
              <div key={i} className="flex justify-between py-3 border-b border-art-accent-border">
                <span className="text-small text-art-muted">{spec.label}</span>
                <span className="text-small text-art-main font-medium">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`} />
            <span className="text-small text-art-muted">
              {product.inStock ? "В наличии" : "Нет в наличии"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full py-4 bg-art-accent text-white font-montserrat font-semibold text-[16px] uppercase rounded-lg flex items-center justify-center gap-3 hover:bg-art-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              Добавить в корзину
            </button>
            <button className="w-full py-4 border-2 border-art-accent text-art-accent font-montserrat font-semibold text-[16px] uppercase rounded-lg flex items-center justify-center gap-3 hover:bg-art-accent/5 transition-colors">
              <FolderPlus className="w-5 h-5" />
              Добавить в проект
            </button>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <div>
          <div className="border-t border-art-accent-border pt-12">
            <h2 className="text-h2 text-art-main mb-8">ПОХОЖИЕ ТОВАРЫ</h2>
            <div className="grid grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <Link to={`/catalog/${p.id}`} key={p.id} className="group p-2">
                  <div className="overflow-hidden rounded-lg mb-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-[430px] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={512}
                      height={640}
                    />
                  </div>
                  <p className="text-body text-art-main mb-1">{p.name}</p>
                  <p className="text-small text-art-muted mb-1">{p.brand}</p>
                  <p className="font-montserrat font-bold text-[16px] text-art-main">
                    {p.price.toLocaleString("ru-RU")} ₽
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
