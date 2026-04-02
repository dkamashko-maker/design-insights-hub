import { Download, Image, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePlannerStore } from "@/stores/plannerStore";
import { toast } from "sonner";

interface Props {
  stageRef: React.RefObject<any>;
}

const ExportMenu = ({ stageRef }: Props) => {
  const { projectName, projectId } = usePlannerStore();

  const handleExportPNG = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${projectName}_план.png`;
    link.href = uri;
    link.click();
    toast.success("PNG скачан");
  };

  const handleExportPDF = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    const { jsPDF } = await import("jspdf");
    const w = stage.width();
    const h = stage.height();
    const uri = stage.toDataURL({ pixelRatio: 1 });
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [w, h] });
    pdf.addImage(uri, "PNG", 0, 0, w, h);
    // Add metadata text
    pdf.setFontSize(14);
    pdf.text(`Проект: ${projectName}`, 20, 20);
    pdf.setFontSize(10);
    pdf.text(`Дата: ${new Date().toLocaleDateString("ru-RU")}`, 20, 35);
    pdf.save(`${projectName}_план.pdf`);
    toast.success("PDF скачан");
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${projectId || "demo"}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Ссылка скопирована ✓");
    }).catch(() => {
      toast.error("Не удалось скопировать");
    });
    // TODO: Toggle projects.is_public = true in Supabase
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="border-[#008080] text-[#008080]">
          <Download className="w-4 h-4 mr-1" /> Экспорт
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPNG} className="cursor-pointer">
          <Image className="w-4 h-4 mr-2" /> Сохранить как PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" /> Сохранить как PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
          <Share2 className="w-4 h-4 mr-2" /> Поделиться
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportMenu;
