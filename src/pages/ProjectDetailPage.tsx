import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, Share2, FileDown, ImageDown, ExternalLink } from "lucide-react";
import { useProjectsStore } from "@/stores/projectsStore";
import { allProducts } from "@/data/allProducts";
import { toast } from "@/hooks/use-toast";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, updateProject, togglePublic } = useProjectsStore();
  const project = projects.find((p) => p.id === id);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-h3 text-art-muted">Проект не найден</p>
      </div>
    );
  }

  const projectProducts = project.productIds.map((pid) => allProducts.find((p) => p.id === pid)).filter(Boolean);
  const totalPrice = projectProducts.reduce((sum, p) => sum + (p?.price || 0), 0);

  const startEditName = () => {
    setTempName(project.name);
    setEditingName(true);
  };

  const saveName = () => {
    if (tempName.trim()) updateProject(project.id, { name: tempName.trim() });
    setEditingName(false);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/projects/${project.id}?token=${project.shareToken}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Ссылка скопирована" });
  };

  return (
    <div className="px-[60px] py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-small text-art-muted mb-8">
        <Link to="/projects" className="hover:text-art-accent transition-colors">Проекты</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-art-main">{project.name}</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        {editingName ? (
          <input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            autoFocus
            className="text-h2 text-art-main bg-transparent border-b-2 border-art-accent focus:outline-none w-full"
          />
        ) : (
          <h1 className="text-h2 text-art-main cursor-pointer hover:text-art-accent transition-colors" onClick={startEditName}>
            {project.name}
          </h1>
        )}
        <p className="text-body text-art-muted mt-2">{project.description}</p>
      </div>

      {/* Open Planner */}
      <Link
        to={`/planner/${project.id}`}
        className="inline-flex items-center gap-3 px-8 py-4 bg-art-accent text-white font-montserrat font-semibold text-[16px] uppercase rounded-lg hover:bg-art-accent/90 transition-colors mb-10"
      >
        <ExternalLink className="w-5 h-5" />
        Открыть в планировщике
      </Link>

      <div className="flex gap-12">
        {/* Left: thumbnail */}
        <div className="w-1/2">
          {project.thumbnailUrl ? (
            <img src={project.thumbnailUrl} alt={project.name} className="w-full h-[400px] object-cover rounded-xl" loading="lazy" />
          ) : (
            <div className="w-full h-[400px] bg-art-warm-bg rounded-xl flex items-center justify-center">
              <p className="text-art-muted text-body">Превью не создано</p>
            </div>
          )}
        </div>

        {/* Right: products + actions */}
        <div className="w-1/2">
          <h3 className="text-h3 text-art-main mb-4">Товары в проекте</h3>

          {projectProducts.length === 0 ? (
            <p className="text-body text-art-muted mb-6">В проекте нет товаров</p>
          ) : (
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
              {projectProducts.map((p) => p && (
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
          )}

          {/* Total */}
          <div className="flex items-center justify-between py-4 border-t border-art-accent-border mb-6">
            <span className="text-body text-art-main font-medium">Итого:</span>
            <span className="font-montserrat font-bold text-[24px] text-art-accent">{totalPrice.toLocaleString("ru-RU")} ₽</span>
          </div>

          {/* Export */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => toast({ title: "Экспорт PDF", description: "Функция будет доступна после подключения backend" })}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-art-accent text-art-accent font-montserrat font-medium text-[14px] uppercase rounded-lg hover:bg-art-accent/5"
            >
              <FileDown className="w-4 h-4" />
              Экспорт PDF
            </button>
            <button
              onClick={() => toast({ title: "Экспорт PNG", description: "Функция будет доступна после подключения backend" })}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-art-accent text-art-accent font-montserrat font-medium text-[14px] uppercase rounded-lg hover:bg-art-accent/5"
            >
              <ImageDown className="w-4 h-4" />
              Экспорт PNG
            </button>
          </div>

          {/* Share */}
          <div className="border-t border-art-accent-border pt-6">
            <h4 className="text-small font-medium text-art-main mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Поделиться
            </h4>
            <div className="flex items-center justify-between mb-3">
              <span className="text-small text-art-muted">Сделать публичным</span>
              <button
                onClick={() => togglePublic(project.id)}
                className={`w-12 h-6 rounded-full transition-colors flex items-center ${project.isPublic ? "bg-art-accent" : "bg-muted"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${project.isPublic ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            {project.isPublic && (
              <button onClick={handleCopyLink} className="w-full py-2 text-art-accent text-small font-medium border border-art-accent-border rounded-lg hover:bg-art-accent/5">
                Скопировать ссылку
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
