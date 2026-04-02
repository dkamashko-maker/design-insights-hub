import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/stores/authStore";

const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Слабый", color: "bg-destructive" };
  if (score === 2) return { level: 2, label: "Средний", color: "bg-orange-400" };
  if (score === 3) return { level: 3, label: "Хороший", color: "bg-yellow-400" };
  return { level: 4, label: "Сильный", color: "bg-green-500" };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(form.password);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Введите имя";
    if (!form.lastName.trim()) e.lastName = "Введите фамилию";
    if (!form.email.trim()) e.email = "Введите email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Неверный формат email";
    if (!form.password) e.password = "Введите пароль";
    else if (form.password.length < 6) e.password = "Минимум 6 символов";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Пароли не совпадают";
    if (!agreed) e.agreed = "Необходимо согласие";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await register(form);
    if (res.success) navigate("/auth/confirm", { state: { email: form.email } });
  };

  const Field = ({ name, label, type = "text", placeholder }: { name: string; label: string; type?: string; placeholder: string }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={(form as any)[name]}
        onChange={(e) => set(name, e.target.value)}
        className="rounded-none h-12"
      />
      {errors[name] && <p className="text-destructive text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80')" }}
      />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[420px] space-y-6">
          <Link to="/" className="font-montserrat text-[28px] font-medium lowercase tracking-[0.02em] text-foreground block">
            rumica
          </Link>

          <div>
            <h1 className="font-montserrat text-2xl font-semibold text-foreground">Создать аккаунт</h1>
            <p className="text-muted-foreground text-sm mt-1">Присоединяйтесь к RUMICA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field name="firstName" label="Имя" placeholder="Имя" />
              <Field name="lastName" label="Фамилия" placeholder="Фамилия" />
            </div>
            <Field name="email" label="Email" type="email" placeholder="Ваш email" />

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Пароль</label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Ваш пароль"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="rounded-none h-12 pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.level ? strength.color : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Подтвердить пароль</label>
              <Input
                type="password"
                placeholder="Повторите пароль"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                className="rounded-none h-12"
              />
              {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                Соглашаюсь с <a href="#" className="text-primary hover:underline">условиями использования</a>
              </label>
            </div>
            {errors.agreed && <p className="text-destructive text-xs">{errors.agreed}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-none bg-primary text-primary-foreground font-montserrat font-semibold text-base"
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
