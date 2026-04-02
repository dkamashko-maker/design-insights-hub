import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConfirmPage = () => {
  const location = useLocation();
  const email = (location.state as any)?.email || "ваш email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-[60px] h-[60px] rounded-full border-2 border-primary flex items-center justify-center">
          <Mail className="w-7 h-7 text-primary" />
        </div>

        <h1 className="font-montserrat text-2xl font-semibold text-foreground">Проверьте вашу почту</h1>

        <p className="text-muted-foreground text-sm">
          Мы отправили ссылку для подтверждения на{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>

        <Button asChild variant="outline" className="rounded-none h-12 w-full font-montserrat">
          <Link to="/auth/login">Вернуться к входу</Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmPage;
