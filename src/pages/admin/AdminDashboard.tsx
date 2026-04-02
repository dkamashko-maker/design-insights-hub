import { products, categories, designPacks } from "@/data/mockData";
import { useCartStore } from "@/stores/appStore";
import { Package, Users, ClipboardList, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
};
const statusLabels: Record<string, string> = {
  pending: "В ожидании", confirmed: "Подтверждён", shipped: "Отправлен", delivered: "Доставлен",
};

const AdminDashboard = () => {
  const orders = useCartStore((s) => s.orders);
  const revenue = orders.filter((o) => o.status !== "pending").reduce((s, o) => s + o.total, 0);

  const metrics = [
    { label: "Товаров", value: products.length, icon: Package },
    { label: "Пользователей", value: 42, icon: Users },
    { label: "Заказов", value: orders.length, icon: ClipboardList },
    { label: "Выручка", value: `${revenue.toLocaleString("ru-RU")} ₽`, icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="text-h2 mb-6">Дашборд</h1>
      <div className="grid grid-cols-4 gap-5 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <m.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-montserrat font-bold text-2xl">{m.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-h3 mb-4">Последние заказы</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">Заказов пока нет</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(-5).reverse().map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.orderNumber}</TableCell>
                  <TableCell>{o.deliveryAddress.email}</TableCell>
                  <TableCell>{o.total.toLocaleString("ru-RU")} ₽</TableCell>
                  <TableCell>
                    <Badge className={statusColors[o.status] || ""}>{statusLabels[o.status] || o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
