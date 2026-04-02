import { useLocation } from "react-router-dom";

const Placeholder = () => {
  const location = useLocation();
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-h3 text-muted-foreground">{location.pathname}</p>
    </div>
  );
};

export default Placeholder;
