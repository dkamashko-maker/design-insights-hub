import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/appStore";

const OrderSuccessPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const order = useCartStore((s) => s.orders.find((o) => o.id === orderId));

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-muted-foreground">Заказ не найден</p>
        <Button asChild className="mt-4 bg-primary text-primary-foreground">
          <Link to="/">На главную</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-primary-foreground" />
      </div>
      <h1 className="text-h2 mb-2">Заказ оформлен!</h1>
      <p className="font-montserrat font-medium text-primary text-lg mb-8">
        Номер заказа: {order.orderNumber}
      </p>

      <div className="border border-border rounded-xl p-5 text-left mb-8 space-y-2">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3 text-sm">
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
            <span className="flex-1">{item.name} × {item.quantity}</span>
            <span className="font-medium">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-montserrat font-bold pt-1">
          <span>Итого</span>
          <span className="text-primary">{order.total.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button asChild variant="outline">
          <Link to="/">На главную</Link>
        </Button>
        <Button asChild className="bg-primary text-primary-foreground">
          <Link to="/projects">Мои проекты</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
