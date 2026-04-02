import { useParams, Link } from "react-router-dom";
import { ChevronRight, Copy, User } from "lucide-react";
import { mockPublicDesigns } from "@/data/projectsData";
import { products as allProducts } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const DesignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const design = mockPublicDesigns.find((d) => d.id === id);

  if (!design) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-h3 text-art-muted">Дизайн не найден</p>
      </div>
    );
  }

  const designProducts = design.productIds.map((pid) => allProducts.find((p) => p.id === pid)).filter(Boolean);
  const totalPrice = designProducts.reduce((sum, p) => sum + (p?.price || 0), 0);

  return (
    <div className="px-[60px] py-10">
      <nav className="flex items-center gap-2 text-small text-art-muted mb-8">
        <Link to="/designs" className="hover:text-art-accent transition-colors">Дизайны</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-art-main">{design.name}</span>
      </nav>

      <div className="flex gap-12">
        <div className="w-1/2">
          <img src={design.coverImage} alt={design.name} className="w-full h-[450px] object-cover rounded-xl" loading="lazy" />
        </div>

        <div className="w-1/2">
          <h1 className="text-h2 text-art-main mb-3">{design.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-art-accent/20 flex items-center justify-center">
              <User className="w-4 h-4 text-art-accent" />
            </div>
            <span className="text-body text-art-muted">{design.authorName}</span>
          </div>
          <p className="text-body text-art-muted mb-6">{design.description}</p>
          <div className="text-small text-art-muted mb-6">
            <span className="inline-block px-3 py-1 bg-art-accent/10 text-art-accent rounded-full mr-2">{design.style}</span>
            <span>{design.productIds.length} предметов</span>
          </div>

          <h3 className="text-h3 text-art-main mb-4">Товары в дизайне</h3>
          <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto">
            {designProducts.map((p) => p && (
              <Link to={`/catalog/${p.id}`} key={p.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-art-warm-bg transition-colors">
                <img src={p.images[0]} alt={p.name} className="w-[60px] h-[60px] rounded-lg object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-small text-art-main font-medium truncate">{p.name}</p>
                  <p className="text-[12px] text-art-muted">{p.brand}</p>
                </div>
                <p className="text-small text-art-main font-bold shrink-0">{p.price.toLocaleString("ru-RU")} ₽</p>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between py-4 border-t border-art-accent-border mb-6">
            <span className="text-body text-art-main font-medium">Итого:</span>
            <span className="font-montserrat font-bold text-[24px] text-art-accent">{totalPrice.toLocaleString("ru-RU")} ₽</span>
          </div>

          <button
            onClick={() => toast({ title: "Проект создан", description: `Дизайн "${design.name}" скопирован в ваши проекты` })}
            className="w-full flex items-center justify-center gap-3 py-4 bg-art-accent text-white font-montserrat font-semibold text-[16px] uppercase rounded-lg hover:bg-art-accent/90"
          >
            <Copy className="w-5 h-5" />
            Создать похожий проект
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignDetailPage;
