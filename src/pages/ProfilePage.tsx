import { useState } from "react";
import { Link } from "react-router-dom";
import { User, FolderOpen, Heart, Bookmark, CreditCard, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { key: "personal", label: "Личные данные", icon: User },
  { key: "projects", label: "Мои проекты", icon: FolderOpen },
  { key: "designs", label: "Сохранённые дизайны", icon: Bookmark },
  { key: "favorites", label: "Избранное", icon: Heart },
  { key: "subscriptions", label: "Подписки", icon: CreditCard },
];

const ProfilePage = () => {
  const { toast } = useToast();
  const [section, setSection] = useState("personal");
  const [form, setForm] = useState({
    firstName: "Иван", lastName: "Петров", email: "ivan@example.com", phone: "+7 999 123-45-67",
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const mockUser = { initials: "ИП", name: "Иван Петров", email: "ivan@example.com" };

  const handleSave = () => {
    toast({ title: "Сохранено", description: "Личные данные обновлены" });
  };

  const handlePasswordChange = () => {
    if (passwords.newPass !== passwords.confirm) {
      toast({ title: "Ошибка", description: "Пароли не совпадают", variant: "destructive" });
      return;
    }
    toast({ title: "Пароль изменён", description: "Новый пароль сохранён" });
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="flex min-h-[calc(100vh-104px)]">
      {/* Sidebar */}
      <div className="w-[345px] shrink-0 border-r border-border bg-card p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-3 relative group">
            {mockUser.initials}
            <button className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="font-montserrat font-medium">{mockUser.name}</p>
          <p className="text-sm text-muted-foreground">{mockUser.email}</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                section === item.key ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <Separator className="my-3" />
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 max-w-2xl">
        {section === "personal" && (
          <div className="space-y-8">
            <h2 className="text-h2">Личные данные</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Имя</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <Label>Фамилия</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">Сохранить</Button>

            <Separator />

            <h3 className="text-h3">Смена пароля</h3>
            <div className="space-y-3 max-w-sm">
              <div>
                <Label>Текущий пароль</Label>
                <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
              </div>
              <div>
                <Label>Новый пароль</Label>
                <Input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
              </div>
              <div>
                <Label>Подтвердите пароль</Label>
                <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
              </div>
              <Button onClick={handlePasswordChange} variant="outline">Изменить пароль</Button>
            </div>
          </div>
        )}
        {section === "projects" && (
          <div>
            <h2 className="text-h2 mb-4">Мои проекты</h2>
            <p className="text-muted-foreground mb-4">Здесь отображаются ваши проекты.</p>
            <Button asChild className="bg-primary text-primary-foreground">
              <Link to="/projects">Перейти к проектам</Link>
            </Button>
          </div>
        )}
        {section === "designs" && (
          <div>
            <h2 className="text-h2 mb-4">Сохранённые дизайны</h2>
            <p className="text-muted-foreground mb-4">Дизайны, которые вы сохранили из общего каталога.</p>
            <Button asChild className="bg-primary text-primary-foreground">
              <Link to="/designs">Перейти к дизайнам</Link>
            </Button>
          </div>
        )}
        {section === "favorites" && (
          <div>
            <h2 className="text-h2 mb-4">Избранное</h2>
            <p className="text-muted-foreground mb-4">Ваши избранные товары и дизайн-паки.</p>
            <Button asChild className="bg-primary text-primary-foreground">
              <Link to="/favorites">Перейти в избранное</Link>
            </Button>
          </div>
        )}
        {section === "subscriptions" && (
          <div>
            <h2 className="text-h2 mb-4">Подписки</h2>
            <p className="text-muted-foreground">У вас пока нет активных подписок.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
