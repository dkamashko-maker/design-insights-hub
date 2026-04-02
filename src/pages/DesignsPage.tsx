import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Copy, User } from "lucide-react";
import { mockPublicDesigns } from "@/data/projectsData";
import { styles } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const DesignsPage = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const filtered = selectedStyle
    ? mockPublicDesigns.filter((d) => d.style === selectedStyle)
    : mockPublicDesigns;

  const handleSave = (designName: string) => {
    toast({ title: "Сохранено", description: `Дизайн "${designName}" добавлен в ваши проекты` });
  };

  return (
    <div className="px-[60px] py-10">
      <h1 className="text-h2 text-art-main mb-8">ДИЗАЙНЫ</h1>

      {/* Style filter */}
      <div className="flex gap-4 mb-8 border-b border-art-accent-border">
        <button
          onClick={() => setSelectedStyle(null)}
          className={`pb-3 font-montserrat font-medium text-[16px] transition-colors ${
            !selectedStyle ? "text-art-accent border-b-2 border-art-accent" : "text-art-muted hover:text-art-main"
          }`}
        >
          Все
        </button>
        {styles.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStyle(s)}
            className={`pb-3 font-montserrat font-medium text-[16px] transition-colors ${
              selectedStyle === s ? "text-art-accent border-b-2 border-art-accent" : "text-art-muted hover:text-art-main"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filtered.map((design) => (
          <div key={design.id} className="border border-art-accent-border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
            <Link to={`/designs/${design.id}`}>
              <div className="h-[280px] overflow-hidden">
                <img src={design.coverImage} alt={design.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            </Link>
            <div className="p-4">
              <p className="font-montserrat font-medium text-[16px] text-art-main mb-1">{design.name}</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-art-accent/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-art-accent" />
                </div>
                <span className="text-small text-art-muted">{design.authorName}</span>
              </div>
              <p className="text-small text-art-muted mb-3">{design.productIds.length} предметов · {design.style}</p>
              <div className="flex gap-2">
                <Link
                  to={`/designs/${design.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-art-accent text-white text-[13px] font-montserrat font-medium uppercase rounded hover:bg-art-accent/90"
                >
                  <Eye className="w-4 h-4" />
                  Посмотреть
                </Link>
                <button
                  onClick={() => handleSave(design.name)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-art-accent text-art-accent text-[13px] font-montserrat font-medium uppercase rounded hover:bg-art-accent/5"
                >
                  <Copy className="w-4 h-4" />
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignsPage;
