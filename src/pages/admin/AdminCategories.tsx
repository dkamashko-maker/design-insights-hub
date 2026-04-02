import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories as mockCategories, type Category } from "@/data/mockData";

const AdminCategories = () => {
  const [items, setItems] = useState<Category[]>(mockCategories);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", parentId: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setIsNew(true); setEditingCat(null); setForm({ name: "", slug: "", parentId: "" }); };
  const openEdit = (c: Category) => { setIsNew(true); setEditingCat(c); setForm({ name: c.name, slug: c.slug, parentId: c.parentId || "" }); };

  const handleSave = () => {
    const cat: Category = { id: editingCat?.id || `cat-${Date.now()}`, name: form.name, slug: form.slug, parentId: form.parentId || undefined };
    if (editingCat) setItems(items.map((i) => (i.id === editingCat.id ? cat : i)));
    else setItems([...items, cat]);
    setIsNew(false);
  };

  const handleDelete = () => { if (deleteId) setItems(items.filter((i) => i.id !== deleteId)); setDeleteId(null); };

  const roots = items.filter((c) => !c.parentId);
  const children = (parentId: string) => items.filter((c) => c.parentId === parentId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2">Категории</h1>
        <Button onClick={openNew} className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Добавить</Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        {roots.map((c) => (
          <div key={c.id}>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-2">
                {children(c.id).length > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <span className="font-medium text-sm">{c.name}</span>
                <span className="text-xs text-muted-foreground">/{c.slug}</span>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(c)}><Pencil className="w-3 h-3" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
            {children(c.id).map((ch) => (
              <div key={ch.id} className="flex items-center justify-between py-2 px-3 pl-10 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{ch.name}</span>
                  <span className="text-xs text-muted-foreground">/{ch.slug}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(ch)}><Pencil className="w-3 h-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(ch.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={isNew} onOpenChange={setIsNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCat ? "Редактировать" : "Новая категория"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Название</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div>
              <Label>Родительская категория</Label>
              <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
                <SelectTrigger><SelectValue placeholder="Нет (корневая)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Нет</SelectItem>
                  {items.filter((c) => c.id !== editingCat?.id).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNew(false)}>Отмена</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Удалить категорию?</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
