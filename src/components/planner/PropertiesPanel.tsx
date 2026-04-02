import { X, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { usePlannerStore } from "@/stores/plannerStore";
import { useCartStore } from "@/stores/appStore";
import { CM_TO_PX } from "@/constants/planner";

const PropertiesPanel = () => {
  const { objects, selectedObjectId, rightPropsOpen, setRightPropsOpen, updateObject, deleteObject, saveSnapshot } = usePlannerStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (!rightPropsOpen || !selectedObjectId) return null;
  const obj = objects.find((o) => o.id === selectedObjectId);
  if (!obj) return null;

  const update = (u: Parameters<typeof updateObject>[1]) => {
    updateObject(selectedObjectId, u);
  };

  const handleDelete = () => {
    deleteObject(selectedObjectId);
  };

  return (
    <div className="w-[280px] bg-white border-l border-[rgba(0,128,128,0.3)] flex flex-col shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,128,128,0.2)]">
        <h3 className="font-montserrat font-semibold text-base">Свойства</h3>
        <button onClick={() => setRightPropsOpen(false)} className="text-[#333] hover:text-[#008080]">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {obj.type === "furniture" && (
          <>
            {obj.productName && <p className="font-montserrat font-medium">{obj.productName}</p>}
            {obj.productPrice && <p className="font-montserrat font-bold text-[#008080]">{obj.productPrice.toLocaleString("ru-RU")} ₽</p>}
            <Separator />
          </>
        )}

        {obj.type === "room" && (
          <>
            <p className="font-montserrat font-medium">Помещение</p>
            <p className="text-sm text-muted-foreground">
              Площадь: {((obj.width / CM_TO_PX / 100) * (obj.height / CM_TO_PX / 100)).toFixed(1)} м²
            </p>
            <Separator />
          </>
        )}

        {obj.type === "wall" && (
          <>
            <p className="font-montserrat font-medium">Стена</p>
            {obj.points && (
              <p className="text-sm text-muted-foreground">
                Длина: {(Math.sqrt((obj.points[2] - obj.points[0]) ** 2 + (obj.points[3] - obj.points[1]) ** 2) / CM_TO_PX).toFixed(0)} см
              </p>
            )}
            <Separator />
          </>
        )}

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Геометрия</p>

        {(obj.type === "furniture" || obj.type === "room") && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Ширина (см)</Label>
              <Input
                type="number"
                value={Math.round(obj.width / CM_TO_PX)}
                onChange={(e) => update({ width: Number(e.target.value) * CM_TO_PX })}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">{obj.type === "room" ? "Высота (см)" : "Глубина (см)"}</Label>
              <Input
                type="number"
                value={Math.round(obj.height / CM_TO_PX)}
                onChange={(e) => update({ height: Number(e.target.value) * CM_TO_PX })}
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}

        {obj.type === "wall" && (
          <div>
            <Label className="text-xs">Толщина (см)</Label>
            <Input
              type="number"
              value={Math.round((obj.strokeWidth || 15) / CM_TO_PX)}
              onChange={(e) => update({ strokeWidth: Number(e.target.value) * CM_TO_PX })}
              className="h-8 text-xs"
            />
          </div>
        )}

        <div>
          <Label className="text-xs">Поворот ({obj.rotation}°)</Label>
          <Slider
            value={[obj.rotation]}
            onValueChange={([v]) => update({ rotation: v })}
            min={0}
            max={360}
            step={1}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">X</Label>
            <Input type="number" value={Math.round(obj.x)} onChange={(e) => update({ x: Number(e.target.value) })} className="h-8 text-xs" />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input type="number" value={Math.round(obj.y)} onChange={(e) => update({ y: Number(e.target.value) })} className="h-8 text-xs" />
          </div>
        </div>

        {obj.type === "room" && (
          <div>
            <Label className="text-xs">Цвет пола</Label>
            <input
              type="color"
              value={obj.fillColor || "#dabbab26"}
              onChange={(e) => update({ fillColor: e.target.value + "26" })}
              className="w-full h-8 rounded cursor-pointer border border-border"
            />
          </div>
        )}

        <Separator />

        {obj.type === "furniture" && obj.productId && (
          <Button
            variant="outline"
            className="w-full border-[#008080] text-[#008080] text-sm"
            onClick={() => addToCart(obj.productId!)}
          >
            <ShoppingCart className="w-4 h-4 mr-1" /> В корзину
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full border-red-200 text-red-500 text-sm hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Удалить объект
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
