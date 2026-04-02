import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SharePage = () => {
  const { shareToken } = useParams();

  // TODO: SELECT * FROM projects WHERE share_token = :shareToken AND is_public = true
  // For now show a mock read-only view

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F5F5F5]">
      {/* Top bar */}
      <div className="h-14 bg-white border-b border-[rgba(0,128,128,0.3)] flex items-center justify-between px-6 shrink-0">
        <span className="font-montserrat font-medium text-lg text-[#333]">
          Общий доступ к проекту
        </span>
        <span className="text-xs text-muted-foreground font-montserrat">
          Только просмотр
        </span>
      </div>

      {/* Canvas placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[rgba(0,128,128,0.1)] flex items-center justify-center mx-auto">
            <span className="text-3xl">🏠</span>
          </div>
          <h2 className="font-montserrat font-semibold text-xl text-[#333]">Проект планировки</h2>
          <p className="font-montserrat text-sm text-muted-foreground max-w-md">
            Здесь будет отображаться read-only canvas с объектами проекта.
            <br />Токен: {shareToken}
          </p>
          {/* TODO: Mount Konva Stage in read-only mode with objects from DB */}
        </div>
      </div>

      {/* CTA bar */}
      <div className="h-14 bg-white border-t border-[rgba(0,128,128,0.3)] flex items-center justify-center gap-4 shrink-0">
        <span className="font-montserrat text-sm text-[#333]">Создайте свой дизайн</span>
        <Link to="/auth/register">
          <Button size="sm" className="bg-[#008080] hover:bg-[#006666] text-white font-montserrat font-semibold">
            Регистрация <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SharePage;
