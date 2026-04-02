import { Minus, Plus, Maximize2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { usePlannerStore } from "@/stores/plannerStore";
import { CM_TO_PX, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from "@/constants/planner";

const StatusBar = () => {
  const { objects, stageScale, gridEnabled, snapEnabled, setGridEnabled, setSnapEnabled, setStageTransform } = usePlannerStore();

  const furnitureCount = objects.filter((o) => o.type === "furniture").length;
  const totalPrice = objects.filter((o) => o.type === "furniture").reduce((s, o) => s + (o.productPrice || 0), 0);

  const rooms = objects.filter((o) => o.type === "room");
  const roomLabel = rooms.length > 0
    ? `${Math.round(rooms[0].width / CM_TO_PX)} × ${Math.round(rooms[0].height / CM_TO_PX)} см`
    : "—";

  const zoomIn = () => {
    const ns = Math.min(MAX_ZOOM, stageScale * ZOOM_STEP);
    setStageTransform(ns, 0, 0);
  };
  const zoomOut = () => {
    const ns = Math.max(MIN_ZOOM, stageScale / ZOOM_STEP);
    setStageTransform(ns, 0, 0);
  };
  const fit = () => setStageTransform(1, 0, 0);

  return (
    <div className="h-9 bg-white border-t border-[rgba(0,128,128,0.3)] flex items-center px-4 text-xs font-montserrat text-[#333] gap-6 shrink-0 z-10">
      <span>Помещение: {roomLabel}</span>
      <span>Предметов: {furnitureCount}</span>
      <span className="text-[#008080] font-semibold">Итого: {totalPrice.toLocaleString("ru-RU")} ₽</span>

      <div className="flex-1" />

      <label className="flex items-center gap-1.5 cursor-pointer">
        <span>Сетка</span>
        <Switch checked={gridEnabled} onCheckedChange={setGridEnabled} className="h-4 w-7" />
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <span>Snap</span>
        <Switch checked={snapEnabled} onCheckedChange={setSnapEnabled} className="h-4 w-7" />
      </label>

      <span className="ml-2">{Math.round(stageScale * 100)}%</span>
      <div className="flex gap-0.5">
        <button onClick={zoomOut} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted"><Minus className="w-3 h-3" /></button>
        <button onClick={zoomIn} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted"><Plus className="w-3 h-3" /></button>
        <button onClick={fit} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted"><Maximize2 className="w-3 h-3" /></button>
      </div>
    </div>
  );
};

export default StatusBar;
