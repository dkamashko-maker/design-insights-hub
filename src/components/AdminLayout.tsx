import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Package, FolderTree, Palette, Users, ClipboardList, LogOut } from "lucide-react";

const sidebarItems = [
  { path: "/admin", label: "Дашборд", icon: BarChart3, exact: true },
  { path: "/admin/products", label: "Товары", icon: Package },
  { path: "/admin/categories", label: "Категории", icon: FolderTree },
  { path: "/admin/design-packs", label: "Дизайн-паки", icon: Palette },
  { path: "/admin/users", label: "Пользователи", icon: Users },
  { path: "/admin/orders", label: "Заказы", icon: ClipboardList },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-[260px] shrink-0 bg-art-main flex flex-col">
        <div className="px-6 py-5">
          <Link to="/" className="font-montserrat text-2xl font-medium lowercase text-white tracking-wide">
            rumica
          </Link>
          <p className="text-white/50 text-xs mt-1">Панель администратора</p>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {sidebarItems.map((item) => {
            const active = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && (item.path !== "/admin" || location.pathname === "/admin");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-primary text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">А</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Администратор</p>
              <p className="text-white/50 text-[10px]">admin@rumica.ru</p>
            </div>
            <Link to="/" className="text-white/50 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-muted/30 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
