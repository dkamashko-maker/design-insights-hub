import { Rect, Line, Arc, Text, Group } from "react-konva";
import { type PlannerObject } from "@/stores/plannerStore";
import { DEFAULT_WALL_THICKNESS } from "@/constants/planner";

interface Props {
  obj: PlannerObject;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (updates: Partial<PlannerObject>) => void;
}

export const RoomShape = ({ obj, isSelected, onSelect, onDragEnd }: Props) => (
  <Rect
    id={obj.id}
    x={obj.x}
    y={obj.y}
    width={obj.width}
    height={obj.height}
    fill={obj.fillColor || "rgba(218,189,171,0.15)"}
    stroke={isSelected ? "#008080" : "rgba(0,128,128,0.3)"}
    strokeWidth={isSelected ? 2 : 1}
    draggable={!obj.isLocked}
    onClick={onSelect}
    onTap={onSelect}
    onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
  />
);

export const WallShape = ({ obj, isSelected, onSelect, onDragEnd }: Props) => {
  const pts = obj.points || [0, 0, obj.width, 0];
  return (
    <Line
      id={obj.id}
      x={obj.x}
      y={obj.y}
      points={pts}
      stroke={isSelected ? "#008080" : "#333"}
      strokeWidth={obj.strokeWidth || DEFAULT_WALL_THICKNESS}
      lineCap="square"
      hitStrokeWidth={20}
      draggable={!obj.isLocked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
    />
  );
};

export const DoorShape = ({ obj, isSelected, onSelect, onDragEnd }: Props) => (
  <Group
    id={obj.id}
    x={obj.x}
    y={obj.y}
    rotation={obj.rotation}
    draggable={!obj.isLocked}
    onClick={onSelect}
    onTap={onSelect}
    onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
  >
    <Rect width={obj.width} height={obj.height || 10} fill="white" stroke={isSelected ? "#008080" : "#666"} strokeWidth={1} />
    <Arc x={0} y={obj.height || 10} innerRadius={0} outerRadius={obj.width * 0.7} angle={-90} rotation={0} stroke="#008080" strokeWidth={1} dash={[4, 4]} fill="transparent" />
  </Group>
);

export const WindowShape = ({ obj, isSelected, onSelect, onDragEnd }: Props) => (
  <Group
    id={obj.id}
    x={obj.x}
    y={obj.y}
    rotation={obj.rotation}
    draggable={!obj.isLocked}
    onClick={onSelect}
    onTap={onSelect}
    onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
  >
    <Rect width={obj.width} height={obj.height || 10} fill="white" stroke={isSelected ? "#008080" : "#4488aa"} strokeWidth={1.5} />
    <Line points={[0, (obj.height || 10) / 3, obj.width, (obj.height || 10) / 3]} stroke="#4488aa" strokeWidth={0.5} />
    <Line points={[0, ((obj.height || 10) * 2) / 3, obj.width, ((obj.height || 10) * 2) / 3]} stroke="#4488aa" strokeWidth={0.5} />
  </Group>
);

export const FurnitureShape = ({ obj, isSelected, onSelect, onDragEnd }: Props) => (
  <Group
    id={obj.id}
    x={obj.x}
    y={obj.y}
    rotation={obj.rotation}
    scaleX={obj.scaleX}
    scaleY={obj.scaleY}
    draggable={!obj.isLocked}
    onClick={onSelect}
    onTap={onSelect}
    onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
  >
    <Rect
      width={obj.width}
      height={obj.height}
      fill="rgba(0,128,128,0.08)"
      stroke={isSelected ? "#008080" : "rgba(0,128,128,0.4)"}
      strokeWidth={isSelected ? 2 : 1}
      cornerRadius={4}
    />
    <Text
      text={obj.productName || obj.label || "Мебель"}
      x={4}
      y={obj.height / 2 - 6}
      width={obj.width - 8}
      fontSize={11}
      fill="#333"
      ellipsis
      wrap="none"
      listening={false}
    />
  </Group>
);
