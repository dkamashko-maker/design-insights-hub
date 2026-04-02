import { Link, useLocation } from "react-router-dom";
import { User, Heart, ShoppingCart, LogOut } from "lucide-react";
import { useCartStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { label: "Планировщик", path: "/planner/new" },
  { label: "Каталог", path: "/catalog" },
  { label: "Проекты", path: "/projects" },
  { label: "Дизайны", path: "/designs" },
  { label: "Ассистент", path: "/assistant" },
];

const Header = () => {
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getCount());

  return (
    <header className="w-full h-[104px] bg-art-accent flex items-stretch">
      {/* Logo panel */}
      <div className="w-[345px] bg-art-main flex items-center px-6 shrink-0">
        <Link to="/" className="font-montserrat text-[36px] font-medium lowercase tracking-[0.02em] text-white">
          rumica
        </Link>
      </div>

      {/* Nav + icons */}
      <div className="flex-1 flex items-center justify-between px-10">
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path.replace("/new", ""));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`font-montserrat font-medium text-[16px] uppercase tracking-wide text-white transition-opacity ${
                  isActive ? "opacity-100 border-b-2 border-white pb-0.5" : "opacity-80 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/profile" className="text-white hover:opacity-80 transition-opacity">
            <User className="w-6 h-6" />
          </Link>
          <Link to="/favorites" className="text-white hover:opacity-80 transition-opacity">
            <Heart className="w-6 h-6" />
          </Link>
          <Link to="/cart" className="text-white hover:opacity-80 transition-opacity relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-art-accent text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
