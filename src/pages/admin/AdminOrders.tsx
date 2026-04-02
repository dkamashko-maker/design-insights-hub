import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCartStore, type Order } from "@/stores/appStore";

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
};
const statusLabels: Record<string, string> = {
  pending: "В ожидании", confirmed: "Подтверждён", shipped: "Отправлен", delivered: "Доставлен",
};
const statusOptions = ["pending", "confirmed", "shipped", "delivered"];

const AdminOrders = () => {
  const orders = useCartStore((s) => s.orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Local status overrides since store orders are immutable for now
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});

  const getStatus = (o: Order) => statusOverrides[o.id] || o.status;

  return (
    <div>
      <h1 className="text-h2 mb-6">Заказы</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Заказов пока нет. Оформите заказ через корзину для тестирования.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Покупатель</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(o)}>
                  <TableCell className="font-medium">{o.orderNumber}</TableCell>
                  <TableCell>{o.deliveryAddress.fullName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.deliveryAddress.email}</TableCell>
                  <TableCell>{o.total.toLocaleString("ru-RU")} ₽</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select value={getStatus(o)} onValueChange={(v) => setStatusOverrides({ ...statusOverrides, [o.id]: v })}>
                      <SelectTrigger className="w-[150px] h-8">
                        <Badge className={statusColors[getStatus(o)]}>{statusLabels[getStatus(o)]}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ru-RU")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Заказ {selectedOrder?.orderNumber}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-3">
              <div className="text-sm">
                <p><strong>Покупатель:</strong> {selectedOrder.deliveryAddress.fullName}</p>
                <p><strong>Email:</strong> {selectedOrder.deliveryAddress.email}</p>
                <p><strong>Телефон:</strong> {selectedOrder.deliveryAddress.phone}</p>
                <p><strong>Адрес:</strong> {selectedOrder.deliveryAddress.address}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.postalCode}</p>
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-sm">
                    <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                    <span className="flex-1">{item.name} × {item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Итого</span>
                <span className="text-primary">{selectedOrder.total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
