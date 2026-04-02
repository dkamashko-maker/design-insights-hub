import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-art-main py-[100px] px-[240px]">
      <div className="flex items-start justify-between">
        {/* Logo */}
        <div className="shrink-0">
          <Link to="/" className="flex items-baseline gap-0">
            <span className="font-playfair font-light text-white text-[28px] tracking-tight">
              Art
            </span>
            <span className="font-montserrat font-medium text-white text-[28px] tracking-tight">
              Decor
            </span>
          </Link>
        </div>

        {/* Nav columns */}
        <div className="flex gap-20">
          <div className="flex flex-col gap-3">
            <Link to="/" className="text-white text-small hover:opacity-80 transition-opacity">О компании</Link>
            <Link to="/planner/new" className="text-white text-small hover:opacity-80 transition-opacity">Планировщик</Link>
            <Link to="/catalog" className="text-white text-small hover:opacity-80 transition-opacity">Каталог</Link>
            <Link to="/projects" className="text-white text-small hover:opacity-80 transition-opacity">Проекты</Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="#" className="text-white text-small hover:opacity-80 transition-opacity">Политика конфиденциальности</Link>
            <Link to="#" className="text-white text-small hover:opacity-80 transition-opacity">Условия использования</Link>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 shrink-0">
          <Mail className="w-5 h-5 text-white" />
          <a href="mailto:art.decor@gmail.com" className="text-white text-small hover:opacity-80 transition-opacity">
            art.decor@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
