import { Link, useLocation } from "react-router-dom";
import { User, Heart, ShoppingCart } from "lucide-react";

const navItems = [
  { label: "Планировщик", path: "/planner/new" },
  { label: "Каталог", path: "/catalog" },
  { label: "Проекты", path: "/projects" },
  { label: "Дизайны", path: "/designs" },
  { label: "Ассистент", path: "/assistant" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="w-full h-[104px] bg-art-accent flex items-stretch">
      {/* Logo panel */}
      <div className="w-[345px] bg-art-main flex items-center px-6 shrink-0">
        <Link to="/" className="flex items-baseline gap-0">
          <span className="font-playfair font-light text-white text-[28px] tracking-tight">
            Art
          </span>
          <span className="font-montserrat font-medium text-white text-[28px] tracking-tight">
            Decor
          </span>
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
            <span className="absolute -top-2 -right-2 bg-white text-art-accent text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
