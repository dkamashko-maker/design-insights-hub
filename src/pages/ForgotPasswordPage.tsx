import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Введите корректный email");
      return;
    }
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-[60px] h-[60px] rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-montserrat text-2xl font-semibold text-foreground">Письмо отправлено</h1>
          <p className="text-muted-foreground text-sm">
            Проверьте почту <span className="font-medium text-foreground">{email}</span> и следуйте инструкциям
          </p>
          <Button asChild variant="outline" className="rounded-none h-12 w-full font-montserrat">
            <Link to="/auth/login">Вернуться к входу</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="font-montserrat text-2xl font-semibold text-foreground">Восстановление пароля</h1>
          <p className="text-muted-foreground text-sm mt-1">Введите email для получения ссылки</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-none h-12"
          />
          {error && <p className="text-destructive text-xs">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-none bg-primary text-primary-foreground font-montserrat font-semibold text-base"
          >
            {loading ? "Отправка..." : "Отправить ссылку"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:underline">Вернуться к входу</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
