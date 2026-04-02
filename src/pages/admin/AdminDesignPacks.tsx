import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { designPacks as mockPacks, products, type DesignPack } from "@/data/mockData";

const AdminDesignPacks = () => {
  const [items, setItems] = useState(mockPacks);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<DesignPack | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", coverImage: "", style: "", selectedProducts: [] as string[] });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", coverImage: "", style: "", selectedProducts: [] });
    setDrawerOpen(true);
  };

  const openEdit = (dp: DesignPack) => {
    setEditing(dp);
    setForm({ name: dp.name, description: dp.description, price: String(dp.price), coverImage: dp.coverImage, style: dp.style, selectedProducts: dp.productIds });
    setDrawerOpen(true);
  };

  const toggleProduct = (id: string) => {
    setForm((f) => ({ ...f, selectedProducts: f.selectedProducts.includes(id) ? f.selectedProducts.filter((p) => p !== id) : [...f.selectedProducts, id] }));
  };

  const handleSave = () => {
    const dp: DesignPack = {
      id: editing?.id || `dp-${Date.now()}`, name: form.name, description: form.description,
      price: Number(form.price), coverImage: form.coverImage, style: form.style,
      productIds: form.selectedProducts, createdAt: editing?.createdAt || new Date().toISOString(),
    };
    if (editing) setItems(items.map((i) => (i.id === editing.id ? dp : i)));
    else setItems([...items, dp]);
    setDrawerOpen(false);
  };

  const handleDelete = () => { if (deleteId) setItems(items.filter((i) => i.id !== deleteId)); setDeleteId(null); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2">Дизайн-паки</h1>
        <Button onClick={openNew} className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Добавить</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Обложка</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Товаров</TableHead>
              <TableHead className="w-20">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((dp) => (
              <TableRow key={dp.id}>
                <TableCell><img src={dp.coverImage} alt="" className="w-10 h-10 rounded object-cover" /></TableCell>
                <TableCell className="font-medium">{dp.name}</TableCell>
                <TableCell>{dp.price.toLocaleString("ru-RU")} ₽</TableCell>
                <TableCell>{dp.productIds.length}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(dp)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(dp.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[420px] overflow-y-auto">
          <SheetHeader><SheetTitle>{editing ? "Редактировать" : "Новый дизайн-пак"}</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-6">
            <div><Label>Название</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Описание</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Цена (₽)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><Label>URL обложки</Label><Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} /></div>
            <div><Label>Стиль</Label><Input value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} /></div>
            <div>
              <Label className="mb-2 block">Товары</Label>
              <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-2 space-y-1">
                {products.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer text-sm">
                    <Checkbox checked={form.selectedProducts.includes(p.id)} onCheckedChange={() => toggleProduct(p.id)} />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">{editing ? "Сохранить" : "Добавить"}</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Удалить дизайн-пак?</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDesignPacks;
