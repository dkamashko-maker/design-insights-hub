import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/appStore";
import { products, designPacks } from "@/data/mockData";

const CartPage = () => {
  const { items, removeItem, updateQuantity } = useCartStore();

  const enrichedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const designPack = item.designPackId ? designPacks.find((d) => d.id === item.designPackId) : undefined;
    return { ...item, product, designPack };
  }).filter((i) => i.product);

  const subtotal = enrichedItems.reduce((sum, i) => sum + (i.product!.price * i.quantity), 0);

  if (enrichedItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-h2">Ваша корзина пуста</h1>
        <p className="text-muted-foreground">Добавьте товары из каталога, чтобы начать покупки</p>
        <Button asChild className="bg-primary text-primary-foreground">
          <Link to="/catalog">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-h2">Корзина</h1>
        <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          {enrichedItems.length}
        </span>
      </div>

      <div className="flex gap-10">
        {/* Items list */}
        <div className="flex-1 space-y-0">
          {enrichedItems.map((item, idx) => (
            <div key={item.productId}>
              <div className="flex gap-5 py-5">
                <img
                  src={item.product!.images[0]}
                  alt={item.product!.name}
                  className="w-[100px] h-[100px] object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-base truncate">{item.product!.name}</p>
                  <p className="text-sm text-muted-foreground">{item.product!.brand}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.product!.price.toLocaleString("ru-RU")} ₽ / шт.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0 w-32">
                  <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                  <p className="font-montserrat font-semibold">
                    {(item.product!.price * item.quantity).toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>
              {idx < enrichedItems.length - 1 && <Separator className="bg-[hsl(var(--border))]" />}
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-[340px] shrink-0">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
            <h3 className="text-h3 mb-6">Сводка заказа</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Подытог</span>
                <span>{subtotal.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Доставка</span>
                <span className="text-muted-foreground">уточняется</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-montserrat font-bold text-lg">Итого</span>
                <span className="font-montserrat font-bold text-primary text-2xl">
                  {subtotal.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
            <Button asChild className="w-full mt-6 bg-primary text-primary-foreground">
              <Link to="/checkout">Перейти к оформлению</Link>
            </Button>
            <Link to="/catalog" className="block text-center text-sm text-primary mt-3 hover:underline">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
