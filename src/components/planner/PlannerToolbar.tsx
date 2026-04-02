import { MousePointer2, LayoutGrid, Square, DoorOpen, Armchair, Paintbrush, Undo2, Redo2 } from "lucide-react";
import { usePlannerStore, type ActiveTool } from "@/stores/plannerStore";

const tools: { tool: ActiveTool; icon: typeof MousePointer2; label: string }[] = [
  { tool: "select", icon: MousePointer2, label: "Выбор" },
  { tool: "room", icon: LayoutGrid, label: "Планировка" },
  { tool: "wall", icon: Square, label: "Стены" },
  { tool: "door", icon: DoorOpen, label: "Двери/окна" },
  { tool: "furniture", icon: Armchair, label: "Мебель" },
  { tool: "finish", icon: Paintbrush, label: "Отделка" },
];

const PlannerToolbar = () => {
  const { activeTool, setActiveTool, undo, redo, historyIndex, history } = usePlannerStore();
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="w-[72px] bg-white border-r border-[rgba(0,128,128,0.3)] flex flex-col items-center py-3 shrink-0">
      {tools.map((t) => {
        const active = activeTool === t.tool;
        return (
          <button
            key={t.tool}
            onClick={() => setActiveTool(t.tool)}
            className={`w-full flex flex-col items-center gap-0.5 py-2.5 transition-colors text-[11px] font-montserrat ${
              active
                ? "bg-[rgba(0,128,128,0.1)] border-l-[3px] border-l-[#008080] text-[#008080]"
                : "border-l-[3px] border-l-transparent text-[#333] hover:bg-[rgba(0,128,128,0.05)]"
            }`}
          >
            <t.icon className="w-5 h-5" />
            {t.label}
          </button>
        );
      })}

      <div className="w-10 border-t border-[rgba(0,128,128,0.2)] my-2" />

      <button
        onClick={undo}
        disabled={!canUndo}
        className={`w-full flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-montserrat ${canUndo ? "text-[#333] hover:bg-[rgba(0,128,128,0.05)]" : "text-[#333]/40"}`}
      >
        <Undo2 className="w-5 h-5" />
        Отменить
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`w-full flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-montserrat ${canRedo ? "text-[#333] hover:bg-[rgba(0,128,128,0.05)]" : "text-[#333]/40"}`}
      >
        <Redo2 className="w-5 h-5" />
        Повторить
      </button>
    </div>
  );
};

export default PlannerToolbar;
