import { useState } from "react";
import { X, Upload, LayoutGrid, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlannerStore } from "@/stores/plannerStore";
import { ROOM_TEMPLATES, DOOR_TYPES, WINDOW_TYPES, FINISH_COLORS, CM_TO_PX } from "@/constants/planner";
import { toast } from "sonner";

const LeftPanel = () => {
  const { leftPanelOpen, setLeftPanelOpen, activeLeftTab, activeTool, setActiveTool, addObject, objects, updateObject, selectedObjectId } = usePlannerStore();
  const [openingTab, setOpeningTab] = useState<"doors" | "windows">("doors");

  if (!leftPanelOpen) return null;

  const handleTemplate = (t: typeof ROOM_TEMPLATES[0]) => {
    addObject({
      id: crypto.randomUUID(), type: "room",
      x: 60, y: 60,
      width: t.widthCm * CM_TO_PX, height: t.heightCm * CM_TO_PX,
      rotation: 0, scaleX: 1, scaleY: 1,
      fillColor: "rgba(218,189,171,0.15)",
      label: t.name,
    });
    setLeftPanelOpen(false);
    toast.success(`Шаблон "${t.name}" добавлен`);
  };

  const handleAddOpening = (type: "door" | "window", preset: { widthCm: number; heightCm: number; name: string }) => {
    addObject({
      id: crypto.randomUUID(), type,
      x: 200, y: 200,
      width: preset.widthCm * CM_TO_PX,
      height: preset.heightCm * CM_TO_PX,
      rotation: 0, scaleX: 1, scaleY: 1,
      label: preset.name,
      subType: preset.name,
    });
    toast.success(`${preset.name} добавлена`);
  };

  const handleFinishColor = (hex: string) => {
    if (selectedObjectId) {
      const obj = objects.find((o) => o.id === selectedObjectId);
      if (obj && (obj.type === "room" || obj.type === "wall")) {
        updateObject(selectedObjectId, { fillColor: hex + (obj.type === "room" ? "26" : "") });
        toast.success("Цвет применён");
        return;
      }
    }
    toast.info("Выберите помещение или стену для применения отделки");
  };

  return (
    <div className="w-[345px] bg-white border-r border-[rgba(0,128,128,0.3)] flex flex-col shrink-0 overflow-hidden absolute left-[72px] top-16 bottom-9 z-20 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,128,128,0.2)]">
        <h3 className="font-montserrat font-semibold text-base">
          {activeLeftTab === "layout" && "Планировка"}
          {activeLeftTab === "openings" && "Двери и окна"}
          {activeLeftTab === "finish" && "Отделка"}
        </h3>
        <button onClick={() => setLeftPanelOpen(false)} className="text-[#333] hover:text-[#008080]">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeLeftTab === "layout" && (
          <div className="space-y-4">
            <button className="w-full border border-dashed border-[rgba(0,128,128,0.4)] rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-[rgba(0,128,128,0.05)] transition-colors">
              <Upload className="w-8 h-8 text-[#008080]" />
              <span className="font-montserrat font-medium text-sm">Загрузить план</span>
              <span className="text-xs text-muted-foreground">.jpg, .png, .pdf</span>
            </button>

            <div>
              <p className="font-montserrat font-medium text-sm mb-3">Выбрать шаблон</p>
              <div className="space-y-2">
                {ROOM_TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleTemplate(t)}
                    className="w-full border border-border rounded-lg p-3 flex items-center gap-3 hover:bg-[rgba(0,128,128,0.05)] transition-colors text-left"
                  >
                    <LayoutGrid className="w-8 h-8 text-[#008080]" />
                    <div>
                      <p className="font-montserrat font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.desc} — {t.widthCm / 100}×{t.heightCm / 100} м</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setActiveTool("room"); setLeftPanelOpen(false); }}
              className="w-full border border-border rounded-lg p-4 flex items-center gap-3 hover:bg-[rgba(0,128,128,0.05)] transition-colors"
            >
              <Pencil className="w-6 h-6 text-[#008080]" />
              <div className="text-left">
                <p className="font-montserrat font-medium text-sm">Нарисовать с нуля</p>
                <p className="text-xs text-muted-foreground">Кликните и растяните прямоугольник</p>
              </div>
            </button>
          </div>
        )}

        {activeLeftTab === "openings" && (
          <div className="space-y-4">
            <div className="flex border-b border-[rgba(0,128,128,0.2)] mb-3">
              {(["doors", "windows"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setOpeningTab(t)}
                  className={`flex-1 py-2 text-sm font-montserrat ${openingTab === t ? "text-[#008080] border-b-2 border-[#008080]" : "text-muted-foreground"}`}
                >
                  {t === "doors" ? "Двери" : "Окна"}
                </button>
              ))}
            </div>
            {openingTab === "doors" && DOOR_TYPES.map((d) => (
              <button key={d.id} onClick={() => handleAddOpening("door", d)} className="w-full border border-border rounded-lg p-3 text-left hover:bg-[rgba(0,128,128,0.05)]">
                <p className="font-montserrat font-medium text-sm">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.widthCm} × {d.heightCm} см</p>
              </button>
            ))}
            {openingTab === "windows" && WINDOW_TYPES.map((w) => (
              <button key={w.id} onClick={() => handleAddOpening("window", w)} className="w-full border border-border rounded-lg p-3 text-left hover:bg-[rgba(0,128,128,0.05)]">
                <p className="font-montserrat font-medium text-sm">{w.name}</p>
                <p className="text-xs text-muted-foreground">{w.widthCm} × {w.heightCm} см</p>
              </button>
            ))}
          </div>
        )}

        {activeLeftTab === "finish" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Выберите цвет, затем кликните на помещение</p>
            <div className="grid grid-cols-4 gap-2">
              {FINISH_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => handleFinishColor(c.hex)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-10 h-10 rounded-lg border border-border" style={{ backgroundColor: c.hex }} />
                  <span className="text-[10px] text-muted-foreground">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
