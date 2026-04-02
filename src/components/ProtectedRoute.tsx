import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const PUBLIC_PATHS = ["/", "/catalog", "/designs", "/auth"];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  const isPublic = PUBLIC_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/")
  );

  if (!isAuthenticated && !isPublic) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
