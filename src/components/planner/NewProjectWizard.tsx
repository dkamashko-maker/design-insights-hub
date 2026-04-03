import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, LayoutTemplate, Pencil, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlannerStore } from "@/stores/plannerStore";
import { PLANNER_TEMPLATES } from "@/constants/planner";
import { toast } from "sonner";

interface Props {
  onComplete: () => void;
}

const NewProjectWizard = ({ onComplete }: Props) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const { setProjectName, loadObjects, setActiveTool } = usePlannerStore();

  const handleNext = () => {
    if (!name.trim()) {
      toast.error("Введите название проекта");
      return;
    }
    setProjectName(name.trim());
    setStep(2);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: Upload to Supabase Storage, set as background
    toast.success(`Файл "${file.name}" загружен`);
    onComplete();
  };

  const handleTemplate = (key: string) => {
    const tpl = PLANNER_TEMPLATES[key as keyof typeof PLANNER_TEMPLATES];
    if (!tpl) return;
    const objects = tpl.walls.map((w, i) => ({
      id: crypto.randomUUID(),
      type: "wall" as const,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      points: w.points,
      strokeWidth: 15,
    }));
    loadObjects(objects);
    onComplete();
  };

  const handleScratch = () => {
    setActiveTool("room");
    toast.info("Нарисуйте контур комнаты на canvas");
    onComplete();
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-[640px] max-w-[95vw] p-8 relative">
          <button onClick={onComplete} className="absolute right-4 top-4 text-muted-foreground hover:text-[#333] transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground font-montserrat mb-2">Шаг 1 из 2</p>
            <h2 className="font-montserrat font-semibold text-2xl text-[#333]">Создайте новый проект</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-montserrat font-medium text-[#333] mb-1 block">Название проекта *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Моя гостиная"
                className="border-[rgba(0,128,128,0.3)] focus:border-[#008080]"
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
              />
            </div>
            <div>
              <label className="text-sm font-montserrat font-medium text-[#333] mb-1 block">Описание</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите свой проект..."
                className="border-[rgba(0,128,128,0.3)] focus:border-[#008080] min-h-[80px]"
              />
            </div>
          </div>
          <Button onClick={handleNext} className="w-full mt-6 bg-[#008080] hover:bg-[#006666] text-white font-montserrat font-semibold">
            Далее <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (showTemplates) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl w-[720px] max-w-[95vw] p-8">
          <button onClick={() => setShowTemplates(false)} className="text-sm text-[#008080] font-montserrat mb-4 hover:underline">← Назад</button>
          <h2 className="font-montserrat font-semibold text-xl text-[#333] mb-6">Выберите шаблон</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(PLANNER_TEMPLATES).map(([key, tpl]) => (
              <button
                key={key}
                onClick={() => handleTemplate(key)}
                className="border border-[rgba(0,128,128,0.3)] rounded-lg p-4 hover:border-[#008080] transition-colors text-center group"
              >
                <div className="w-full h-24 bg-[rgba(0,128,128,0.05)] rounded mb-3 flex items-center justify-center">
                  <LayoutTemplate className="w-10 h-10 text-[rgba(0,128,128,0.4)] group-hover:text-[#008080] transition-colors" />
                </div>
                <p className="font-montserrat font-medium text-sm text-[#333]">{tpl.name}</p>
                <p className="font-montserrat text-xs text-muted-foreground mt-1">{tpl.area} м²</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-[720px] max-w-[95vw] p-8">
        <div className="text-center mb-6">
          <p className="text-xs text-muted-foreground font-montserrat mb-2">Шаг 2 из 2</p>
          <h2 className="font-montserrat font-semibold text-2xl text-[#333]">Как начнёте?</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* Upload */}
          <label className="border border-[rgba(0,128,128,0.3)] rounded-lg p-6 hover:border-[#008080] transition-colors text-center cursor-pointer group flex flex-col items-center justify-center min-h-[240px]">
            <div className="w-[60px] h-[60px] rounded-full bg-[rgba(0,128,128,0.1)] flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-[#008080]" />
            </div>
            <p className="font-montserrat font-medium text-[#333] mb-1">Загрузить план</p>
            <p className="font-montserrat text-xs text-muted-foreground">.jpg .png .pdf</p>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleUpload} className="hidden" />
          </label>

          {/* Template */}
          <button
            onClick={() => setShowTemplates(true)}
            className="border border-[rgba(0,128,128,0.3)] rounded-lg p-6 hover:border-[#008080] transition-colors text-center group flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-[rgba(0,128,128,0.1)] flex items-center justify-center mb-4">
              <LayoutTemplate className="w-7 h-7 text-[#008080]" />
            </div>
            <p className="font-montserrat font-medium text-[#333] mb-1">Выбрать шаблон</p>
            <p className="font-montserrat text-xs text-muted-foreground">Готовые макеты</p>
          </button>

          {/* Scratch */}
          <button
            onClick={handleScratch}
            className="border border-[rgba(0,128,128,0.3)] rounded-lg p-6 hover:border-[#008080] transition-colors text-center group flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-[rgba(0,128,128,0.1)] flex items-center justify-center mb-4">
              <Pencil className="w-7 h-7 text-[#008080]" />
            </div>
            <p className="font-montserrat font-medium text-[#333] mb-1">Нарисовать с нуля</p>
            <p className="font-montserrat text-xs text-muted-foreground">Свободный режим</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectWizard;
