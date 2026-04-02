import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Copy, Share2, Trash2, Upload, LayoutGrid, PenTool, X, FolderOpen } from "lucide-react";
import { useProjectsStore } from "@/stores/projectsStore";
import { projectTemplates, type Project } from "@/data/projectsData";
import { toast } from "@/hooks/use-toast";

type CreateStep = 1 | 2;
type BasisOption = "upload" | "template" | "scratch";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, deleteProject, duplicateProject, togglePublic } = useProjectsStore();
  const addProject = useProjectsStore((s) => s.addProject);

  const [tab, setTab] = useState<"created" | "saved">("created");
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<string | null>(null);

  // Create modal state
  const [step, setStep] = useState<CreateStep>(1);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [basis, setBasis] = useState<BasisOption | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const resetCreate = () => {
    setShowCreate(false);
    setStep(1);
    setNewName("");
    setNewDesc("");
    setBasis(null);
    setSelectedTemplate(null);
  };

  const handleCreate = () => {
    const tpl = projectTemplates.find((t) => t.id === selectedTemplate);
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      userId: "user-1",
      name: newName || "Новый проект",
      description: newDesc,
      thumbnailUrl: tpl?.thumbnail || "",
      roomWidthCm: tpl?.widthCm || 600,
      roomHeightCm: tpl?.heightCm || 400,
      isPublic: false,
      shareToken: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productIds: [],
    };
    addProject(newProject);
    resetCreate();
    navigate(`/planner/${newProject.id}`);
  };

  const handleCopyLink = (project: Project) => {
    const link = `${window.location.origin}/projects/${project.id}?token=${project.shareToken}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Ссылка скопирована" });
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="px-[60px] py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-h2 text-art-main">МОИ ПРОЕКТЫ</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-6 py-3 bg-art-accent text-white font-montserrat font-medium text-[14px] uppercase rounded-lg hover:bg-art-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Новый проект
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-art-accent-border">
        {[
          { key: "created" as const, label: "Созданные" },
          { key: "saved" as const, label: "Сохранённые" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 font-montserrat font-medium text-[16px] transition-colors ${
              tab === t.key ? "text-art-accent border-b-2 border-art-accent" : "text-art-muted hover:text-art-main"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FolderOpen className="w-16 h-16 text-art-muted mb-4" />
          <p className="text-h3 text-art-main mb-2">Проектов пока нет</p>
          <p className="text-body text-art-muted mb-6">Создайте свой первый проект</p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-3 bg-art-accent text-white font-montserrat font-medium text-[14px] uppercase rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Создать проект
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-art-accent-border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
              <Link to={`/projects/${project.id}`}>
                <div className="h-[220px] bg-muted overflow-hidden">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-art-warm-bg">
                      <LayoutGrid className="w-12 h-12 text-art-muted" />
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-montserrat font-medium text-[16px] text-art-main">{project.name}</p>
                    <p className="text-small text-art-muted">{formatDate(project.updatedAt)}</p>
                  </div>
                  <span className="text-[12px] font-montserrat font-medium bg-art-accent/10 text-art-accent px-2 py-1 rounded">
                    {project.productIds.length} предметов
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    to={`/planner/${project.id}`}
                    className="flex-1 py-2 bg-art-accent text-white text-[13px] font-montserrat font-medium uppercase rounded text-center hover:bg-art-accent/90 transition-colors"
                  >
                    Открыть
                  </Link>
                  <button onClick={() => navigate(`/projects/${project.id}`)} className="p-2 hover:bg-art-warm-bg rounded transition-colors" title="Редактировать">
                    <Pencil className="w-4 h-4 text-art-muted" />
                  </button>
                  <button onClick={() => duplicateProject(project.id)} className="p-2 hover:bg-art-warm-bg rounded transition-colors" title="Дублировать">
                    <Copy className="w-4 h-4 text-art-muted" />
                  </button>
                  <button onClick={() => setShareModal(project.id)} className="p-2 hover:bg-art-warm-bg rounded transition-colors" title="Поделиться">
                    <Share2 className="w-4 h-4 text-art-muted" />
                  </button>
                  <button onClick={() => setDeleteConfirm(project.id)} className="p-2 hover:bg-red-50 rounded transition-colors" title="Удалить">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 text-art-main">Создать новый проект</h2>
              <button onClick={resetCreate}><X className="w-5 h-5 text-art-muted" /></button>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-small text-art-main font-medium block mb-1">Название проекта</label>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Моя гостиная" className="w-full border border-art-accent-border rounded-lg px-4 py-3 text-body focus:outline-none focus:border-art-accent" />
                </div>
                <div>
                  <label className="text-small text-art-main font-medium block mb-1">Описание</label>
                  <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Опишите проект..." rows={3} className="w-full border border-art-accent-border rounded-lg px-4 py-3 text-body focus:outline-none focus:border-art-accent resize-none" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={resetCreate} className="px-6 py-3 border border-art-accent text-art-accent font-montserrat font-medium text-[14px] uppercase rounded-lg">Отмена</button>
                  <button onClick={() => setStep(2)} className="px-6 py-3 bg-art-accent text-white font-montserrat font-medium text-[14px] uppercase rounded-lg">Далее</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-body text-art-muted mb-4">Выберите основу для проекта:</p>
                <div className="grid grid-cols-3 gap-4">
                  {/* Upload */}
                  <button
                    onClick={() => { setBasis("upload"); setSelectedTemplate(null); }}
                    className={`border-2 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors ${basis === "upload" ? "border-art-accent bg-art-accent/5" : "border-art-accent-border hover:border-art-accent"}`}
                  >
                    <Upload className="w-8 h-8 text-art-accent" />
                    <span className="text-small font-medium text-art-main text-center">Загрузить план</span>
                  </button>
                  {/* Template */}
                  <button
                    onClick={() => setBasis("template")}
                    className={`border-2 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors ${basis === "template" ? "border-art-accent bg-art-accent/5" : "border-art-accent-border hover:border-art-accent"}`}
                  >
                    <LayoutGrid className="w-8 h-8 text-art-accent" />
                    <span className="text-small font-medium text-art-main text-center">Выбрать шаблон</span>
                  </button>
                  {/* Scratch */}
                  <button
                    onClick={() => { setBasis("scratch"); setSelectedTemplate(null); }}
                    className={`border-2 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors ${basis === "scratch" ? "border-art-accent bg-art-accent/5" : "border-art-accent-border hover:border-art-accent"}`}
                  >
                    <PenTool className="w-8 h-8 text-art-accent" />
                    <span className="text-small font-medium text-art-main text-center">Нарисовать с нуля</span>
                  </button>
                </div>

                {basis === "template" && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {projectTemplates.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`border-2 rounded-lg overflow-hidden transition-colors ${selectedTemplate === tpl.id ? "border-art-accent" : "border-transparent hover:border-art-accent-border"}`}
                      >
                        <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-[100px] object-cover" loading="lazy" />
                        <p className="text-[12px] font-medium text-art-main p-2 text-center">{tpl.name}</p>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border border-art-accent text-art-accent font-montserrat font-medium text-[14px] uppercase rounded-lg">Назад</button>
                  <div className="flex gap-3">
                    <button onClick={resetCreate} className="px-6 py-3 border border-art-accent-border text-art-muted font-montserrat font-medium text-[14px] uppercase rounded-lg">Отмена</button>
                    <button
                      onClick={handleCreate}
                      disabled={!basis}
                      className="px-6 py-3 bg-art-accent text-white font-montserrat font-medium text-[14px] uppercase rounded-lg disabled:opacity-50"
                    >
                      Создать и открыть
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-[400px]">
            <h3 className="text-h3 text-art-main mb-4">Удалить проект?</h3>
            <p className="text-body text-art-muted mb-6">Это действие нельзя отменить.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2 border border-art-accent-border rounded-lg text-small text-art-muted">Отмена</button>
              <button onClick={() => { deleteProject(deleteConfirm); setDeleteConfirm(null); toast({ title: "Проект удалён" }); }} className="px-5 py-2 bg-red-500 text-white rounded-lg text-small">Удалить</button>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {shareModal && (() => {
        const project = projects.find((p) => p.id === shareModal);
        if (!project) return null;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 w-[450px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-h3 text-art-main">Поделиться</h3>
                <button onClick={() => setShareModal(null)}><X className="w-5 h-5 text-art-muted" /></button>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-body text-art-main">Сделать публичным</span>
                <button
                  onClick={() => togglePublic(project.id)}
                  className={`w-12 h-6 rounded-full transition-colors ${project.isPublic ? "bg-art-accent" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${project.isPublic ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              {project.isPublic && (
                <button
                  onClick={() => handleCopyLink(project)}
                  className="w-full py-3 border border-art-accent text-art-accent font-montserrat font-medium text-[14px] uppercase rounded-lg hover:bg-art-accent/5"
                >
                  Скопировать ссылку
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ProjectsPage;
