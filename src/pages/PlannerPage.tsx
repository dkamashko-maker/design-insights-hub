import { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePlannerStore } from "@/stores/plannerStore";
import PlannerTopBar from "@/components/planner/PlannerTopBar";
import PlannerToolbar from "@/components/planner/PlannerToolbar";
import PlannerCanvas from "@/components/planner/PlannerCanvas";
import CatalogPanel from "@/components/planner/CatalogPanel";
import PropertiesPanel from "@/components/planner/PropertiesPanel";
import LeftPanel from "@/components/planner/LeftPanel";
import StatusBar from "@/components/planner/StatusBar";
import { toast } from "sonner";

const PlannerPage = () => {
  const { id } = useParams();
  const stageRef = useRef<any>(null);

  const {
    setProjectMeta, undo, redo, selectObject, setActiveTool, deleteObject,
    selectedObjectId, isDirty, markClean,
    rightCatalogOpen, rightPropsOpen,
  } = usePlannerStore();

  useEffect(() => {
    setProjectMeta(id || "new", id === "new" ? "Новый проект" : `Проект ${id?.slice(0, 8)}`);
  }, [id, setProjectMeta]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    if ((e.key === "Delete" || e.key === "Backspace") && selectedObjectId) {
      e.preventDefault();
      deleteObject(selectedObjectId);
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
      if (e.key === "y") { e.preventDefault(); redo(); }
      if (e.key === "s") { e.preventDefault(); markClean(); toast.success("Сохранено"); }
    }
    if (e.key === "Escape") { selectObject(null); setActiveTool("select"); }
    if (e.key === "v") setActiveTool("select");
    if (e.key === "w") setActiveTool("wall");
    if (e.key === "f") setActiveTool("furniture");
  }, [selectedObjectId, deleteObject, undo, redo, selectObject, setActiveTool, markClean]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (usePlannerStore.getState().isDirty) {
        usePlannerStore.getState().markClean();
        toast.success("Автосохранение выполнено");
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const leftW = 72;
  const rightW = rightCatalogOpen ? 345 : rightPropsOpen ? 280 : 0;
  const canvasW = typeof window !== "undefined" ? window.innerWidth - leftW - rightW : 800;
  const canvasH = typeof window !== "undefined" ? window.innerHeight - 64 - 36 : 600;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F5F5F5]">
      <PlannerTopBar stageRef={stageRef} />
      <div className="flex flex-1 overflow-hidden relative">
        <PlannerToolbar />
        <LeftPanel />
        <div className="flex-1 overflow-hidden relative">
          <PlannerCanvas width={Math.max(canvasW, 400)} height={Math.max(canvasH, 300)} />
        </div>
        <CatalogPanel />
        <PropertiesPanel />
      </div>
      <StatusBar />
    </div>
  );
};

export default PlannerPage;
