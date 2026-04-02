import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePlannerStore } from "@/stores/plannerStore";
import { toast } from "sonner";

interface Props {
  stageRef: React.RefObject<any>;
}

const PlannerTopBar = ({ stageRef }: Props) => {
  const { projectName, setProjectName, isDirty, markClean } = usePlannerStore();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);

  const handleSave = () => {
    // Mock save
    markClean();
    toast.success("Проект сохранён");
  };

  const handleExportPNG = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${projectName}.png`;
    link.href = uri;
    link.click();
    toast.success("PNG скачан");
  };

  const handleExportPDF = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    const { jsPDF } = await import("jspdf");
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF("landscape", "px", [stage.width(), stage.height()]);
    pdf.text(projectName, 20, 30);
    pdf.addImage(uri, "PNG", 0, 40, stage.width(), stage.height());
    pdf.save(`${projectName}.pdf`);
    toast.success("PDF скачан");
  };

  const handleNameSubmit = () => {
    setEditing(false);
    if (nameInput.trim()) setProjectName(nameInput.trim());
  };

  const handle3D = () => toast.info("3D режим будет доступен в следующей версии");

  return (
    <div className="h-16 bg-white border-b border-[rgba(0,128,128,0.3)] flex items-center px-4 shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <Link to="/projects" className="text-[#008080] font-montserrat font-medium text-sm flex items-center gap-1 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" /> К проектам
        </Link>
        {editing ? (
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            className="font-montserrat font-medium text-lg border-b border-[#008080] outline-none bg-transparent w-48"
          />
        ) : (
          <button onClick={() => { setEditing(true); setNameInput(projectName); }} className="font-montserrat font-medium text-lg text-[#333] hover:text-[#008080]">
            {projectName}
          </button>
        )}
      </div>

      {/* Center: 2D/3D */}
      <div className="flex-1 flex justify-center">
        <div className="flex">
          <button className="px-4 py-1.5 text-sm font-montserrat font-medium bg-[#008080] text-white">
            2D
          </button>
          <button onClick={handle3D} className="px-4 py-1.5 text-sm font-montserrat font-medium bg-white text-[#333] border border-[rgba(0,128,128,0.3)]">
            3D
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 min-w-[280px] justify-end">
        <span className={`text-xs font-montserrat flex items-center gap-1 ${isDirty ? "text-muted-foreground" : "text-green-600"}`}>
          {isDirty ? "Изменения не сохранены" : <><Check className="w-3 h-3" /> Сохранено</>}
        </span>
        <Button size="sm" onClick={handleSave} className="bg-[#008080] text-white font-montserrat font-semibold text-sm">
          <Save className="w-4 h-4 mr-1" /> Сохранить
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="border-[#008080] text-[#008080]">
              <Download className="w-4 h-4 mr-1" /> Экспорт
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportPNG}>Сохранить как PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>Сохранить как PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PlannerTopBar;
