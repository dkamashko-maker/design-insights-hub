import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, FolderPlus, FileDown, ChevronRight } from "lucide-react";
import { materialProducts } from "@/data/materialsData";
import { useFavoritesStore, useCartStore } from "@/stores/appStore";
import { toast } from "@/hooks/use-toast";

const MaterialDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const item = materialProducts.find((m) => m.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isProductFavorite, toggleProductFavorite } = useFavoritesStore();
  const addItem = useCartStore((s) => s.addItem);

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-h3 text-art-muted">Товар не найден</p>
      </div>
    );
  }

  const isFav = isProductFavorite(item.id);

  const specs = [
    { label: "Артикул", value: item.sku },
    { label: "Штрихкод", value: item.barcode || "—" },
    { label: "Вес", value: `${item.weightKg} кг` },
    { label: "Бренд", value: item.brand },
    { label: "Производитель", value: item.manufacturer },
    { label: "Поставщик", value: item.supplier },
    { label: "Срок годности", value: item.shelfLife },
    { label: "Сертификат", value: item.certificate },
  ];

  const similar = materialProducts.filter((m) => m.group2 === item.group2 && m.id !== item.id).slice(0, 4);

  return (
    <div className="px-[60px] py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-small text-art-muted mb-8 flex-wrap">
        <Link to="/" className="hover:text-art-accent transition-colors">Главная</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/materials" className="hover:text-art-accent transition-colors">Стройматериалы</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-art-main">{item.name}</span>
      </nav>

      <div className="flex gap-12 mb-16 max-lg:flex-col">
        {/* Gallery */}
        <div className="w-1/2 max-lg:w-full">
          <div className="bg-art-warm-bg border border-art-accent-border rounded-xl overflow-hidden mb-4">
            <img
              src={item.images[selectedImage]}
              alt={item.name}
              className="w-full h-[520px] object-contain p-8"
              width={800}
              height={520}
            />
          </div>
          <div className="flex gap-3">
            {item.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-[100px] h-[80px] bg-art-warm-bg rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? "border-art-accent" : "border-transparent hover:border-art-accent-border"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-2" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="w-1/2 max-lg:w-full">
          <p className="text-[12px] text-art-muted mb-1.5">
            {[item.group1, item.group2, item.group3].filter(Boolean).join(" / ")}
          </p>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-h2 text-art-main leading-tight">{item.name}</h1>
            <button onClick={() => toggleProductFavorite(item.id)} className="mt-2 shrink-0">
              <Heart className={`w-7 h-7 transition-colors ${isFav ? "fill-art-accent text-art-accent" : "text-art-muted hover:text-art-accent"}`} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
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

          <p className="font-montserrat font-bold text-[28px] text-art-main mb-5">
            {item.price.toLocaleString("ru-RU")} ₽
          </p>

          <p className="text-body text-art-muted leading-relaxed mb-6">{item.description}</p>

          <div className="flex flex-wrap gap-2.5 mb-8">
            <button
              onClick={() => { addItem(item.id); toast({ title: "Товар добавлен в корзину", description: item.name }); }}
              className="h-11 px-6 bg-art-main text-white text-[14px] font-medium rounded flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="w-4 h-4" /> В корзину
            </button>
            <button
              onClick={() => toast({ title: "Добавлено в проект", description: item.name })}
              className="h-11 px-5 bg-white border border-art-accent-border text-[14px] text-art-main rounded flex items-center gap-2 hover:border-art-accent transition-colors"
            >
              <FolderPlus className="w-4 h-4" /> В проект
            </button>
          </div>

          <div className="bg-art-warm-bg rounded-xl p-6">
            <h2 className="font-montserrat text-[16px] font-medium text-art-main mb-3">Характеристики</h2>
            <table className="w-full text-[13px]">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={s.label} className={i < specs.length - 1 ? "border-b border-art-accent-border" : ""}>
                    <td className="text-art-muted py-2 w-[45%] align-top">{s.label}</td>
                    <td className="py-2 text-art-main break-words">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {item.application && (
              <div className="border-t border-art-accent-border mt-5 pt-4">
                <h3 className="font-montserrat text-[14px] font-medium text-art-main mb-2">Область применения</h3>
                <p className="text-[14px] text-art-muted leading-relaxed">{item.application}</p>
              </div>
            )}

            {item.properties.length > 0 && (
              <div className="border-t border-art-accent-border mt-4 pt-4">
                <h3 className="font-montserrat text-[14px] font-medium text-art-main mb-2">Свойства</h3>
                <ul className="text-[14px] text-art-muted leading-relaxed list-disc pl-5">
                  {item.properties.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            )}

            <div className="mt-5">
              <button
                onClick={() => toast({ title: "Техническая карта", description: "PDF будет доступен после подключения каталога поставщика" })}
                className="h-9 px-4 bg-white border border-art-accent-border text-[13px] text-art-main rounded flex items-center gap-2 hover:border-art-accent transition-colors"
              >
                <FileDown className="w-4 h-4" /> Техническая карта (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="text-h3 text-art-main mb-6">Похожие товары</h2>
          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
            {similar.map((s) => (
              <Link key={s.id} to={`/materials/${s.id}`} className="group p-2">
                <div className="bg-art-warm-bg border border-art-accent-border rounded-lg overflow-hidden mb-3">
                  <img src={s.images[0]} alt={s.name} loading="lazy" className="w-full h-[260px] object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-body text-art-main mb-1 leading-snug line-clamp-2">{s.name}</p>
                <p className="font-montserrat font-bold text-[16px] text-art-main">{s.price.toLocaleString("ru-RU")} ₽</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MaterialDetailPage;
