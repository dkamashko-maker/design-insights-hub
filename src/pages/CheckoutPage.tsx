import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore, type Order } from "@/stores/appStore";
import { allProducts as products } from "@/data/allProducts";
import { useToast } from "@/hooks/use-toast";

const steps = ["Доставка", "Оплата", "Подтверждение"];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, clearCart, addOrder } = useCartStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", postalCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const enrichedItems = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! }))
    .filter((i) => i.product);

  const subtotal = enrichedItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Укажите ФИО";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Укажите корректный email";
    if (!form.phone.trim()) e.phone = "Укажите телефон";
    if (!form.address.trim()) e.address = "Укажите адрес";
    if (!form.city.trim()) e.city = "Укажите город";
    if (!form.postalCode.trim()) e.postalCode = "Укажите индекс";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && validateStep1()) setStep(1);
  };

  const handlePay = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    const orderNumber = `ART-${dateStr}-${rand}`;
    const id = crypto.randomUUID();

    const order: Order = {
      id,
      orderNumber,
      items: enrichedItems.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        brand: i.product.brand,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
      })),
      subtotal,
      total: subtotal,
      deliveryAddress: { ...form },
      status: "pending",
      createdAt: now.toISOString(),
    };

    addOrder(order);
    clearCart();
    navigate(`/order-success?order=${id}`);
  };

  const field = (key: keyof typeof form, label: string, type = "text", full = false) => (
    <div className={full ? "col-span-2" : ""}>
      <Label className="text-sm font-medium">{label}</Label>
      {key === "address" ? (
        <Textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className={errors[key] ? "border-destructive" : ""}
        />
      ) : (
        <Input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className={errors[key] ? "border-destructive" : ""}
        />
      )}
      {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`font-montserrat text-sm ${i === step ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              {s}
            </span>
            {i < steps.length - 1 && <div className="w-12 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Delivery */}
      {step === 0 && (
        <div>
          <h2 className="text-h3 mb-6">Данные доставки</h2>
          <div className="grid grid-cols-2 gap-4">
            {field("fullName", "ФИО", "text", true)}
            {field("email", "Email", "email")}
            {field("phone", "Телефон", "tel")}
            {field("address", "Адрес доставки", "text", true)}
            {field("city", "Город")}
            {field("postalCode", "Почтовый индекс")}
          </div>
          <Button onClick={handleNext} className="mt-6 bg-primary text-primary-foreground">
            Далее →
          </Button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 1 && (
        <div>
          <h2 className="text-h3 mb-6">Оплата</h2>

          <div className="border border-border rounded-xl p-4 mb-6 space-y-2">
            <p className="font-montserrat font-medium text-sm mb-2">Состав заказа</p>
            {enrichedItems.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span>{i.product.name} × {i.quantity}</span>
                <span>{(i.product.price * i.quantity).toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Итого</span>
              <span className="text-primary">{subtotal.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>

          <div className="border border-border rounded-xl p-6 mb-6">
            <p className="font-montserrat font-medium mb-3">Способ оплаты</p>
            <div className="bg-muted rounded-lg p-8 text-center text-muted-foreground text-sm">
              Платёжный виджет
              <br />
              <span className="text-xs">// TODO: Integrate Bitrix24 payment gateway</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>← Назад</Button>
            <Button onClick={handlePay} className="flex-1 bg-primary text-primary-foreground">
              Оплатить {subtotal.toLocaleString("ru-RU")} ₽
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
