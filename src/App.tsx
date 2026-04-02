import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import DesignsPage from "./pages/DesignsPage";
import DesignDetailPage from "./pages/DesignDetailPage";
import PlannerPage from "./pages/PlannerPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AssistantPage from "./pages/AssistantPage";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/planner/:id" element={<PlannerPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:id" element={<ProductDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/designs" element={<DesignsPage />} />
            <Route path="/designs/:id" element={<DesignDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/favorites" element={<Placeholder />} />
            <Route path="/profile" element={<Placeholder />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/auth/login" element={<Placeholder />} />
            <Route path="/auth/register" element={<Placeholder />} />
            <Route path="/auth/forgot-password" element={<Placeholder />} />
            <Route path="/auth/confirm" element={<Placeholder />} />
            <Route path="/admin" element={<Placeholder />} />
            <Route path="/admin/products" element={<Placeholder />} />
            <Route path="/admin/categories" element={<Placeholder />} />
            <Route path="/admin/design-packs" element={<Placeholder />} />
            <Route path="/admin/users" element={<Placeholder />} />
            <Route path="/admin/orders" element={<Placeholder />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
