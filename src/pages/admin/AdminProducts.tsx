import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products as mockProducts, categories, styles, type Product } from "@/data/mockData";

const AdminProducts = () => {
  const [items, setItems] = useState(mockProducts);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", brand: "", description: "", price: "", categoryId: "", style: "", material: "", color: "", width: "", depth: "", height: "", inStock: true, imagesText: "" });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", brand: "", description: "", price: "", categoryId: "", style: "", material: "", color: "", width: "", depth: "", height: "", inStock: true, imagesText: "" });
    setDrawerOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand, description: p.description, price: String(p.price),
      categoryId: p.categoryId, style: p.style, material: p.material, color: p.color,
      width: String(p.dimensions.width_cm), depth: String(p.dimensions.depth_cm), height: String(p.dimensions.height_cm),
      inStock: p.inStock, imagesText: p.images.join("\n"),
    });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const newProduct: Product = {
      id: editing?.id || `p-${Date.now()}`,
      name: form.name, brand: form.brand, description: form.description,
      price: Number(form.price), currency: "RUB", categoryId: form.categoryId,
      images: form.imagesText.split("\n").filter(Boolean),
      dimensions: { width_cm: Number(form.width), depth_cm: Number(form.depth), height_cm: Number(form.height) },
      style: form.style, material: form.material, color: form.color, inStock: form.inStock,
      createdAt: editing?.createdAt || new Date().toISOString(),
    };
    if (editing) {
      setItems(items.map((i) => (i.id === editing.id ? newProduct : i)));
    } else {
      setItems([...items, newProduct]);
    }
    setDrawerOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) setItems(items.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2">Товары</h1>
        <Button onClick={openNew} className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Добавить товар</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Наличие</TableHead>
              <TableHead className="w-20">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell><img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" /></TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{getCategoryName(p.categoryId)}</TableCell>
                <TableCell className="text-sm">{p.brand}</TableCell>
                <TableCell>{p.price.toLocaleString("ru-RU")} ₽</TableCell>
                <TableCell><Badge className={p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{p.inStock ? "В наличии" : "Нет"}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle>{editing ? "Редактировать товар" : "Добавить товар"}</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-6">
            <div><Label>Название</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Бренд</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
            <div><Label>Описание</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Цена (₽)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div>
              <Label>Категория</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Стиль</Label>
              <Select value={form.style} onValueChange={(v) => setForm({ ...form, style: v })}>
                <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                <SelectContent>{styles.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Материал</Label><Input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} /></div>
            <div><Label>Цвет</Label><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Ш (см)</Label><Input type="number" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} /></div>
              <div><Label>Г (см)</Label><Input type="number" value={form.depth} onChange={(e) => setForm({ ...form, depth: e.target.value })} /></div>
              <div><Label>В (см)</Label><Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.inStock} onCheckedChange={(v) => setForm({ ...form, inStock: v })} />
              <Label>В наличии</Label>
            </div>
            <div><Label>URL изображений (каждый с новой строки)</Label><Textarea rows={4} value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} /></div>
            <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">{editing ? "Сохранить" : "Добавить"}</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Удалить товар?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Это действие нельзя отменить.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
