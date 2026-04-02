import { useRef, useCallback, useState } from "react";
import { Stage, Layer, Line, Transformer } from "react-konva";
import Konva from "konva";
import GridLayer from "./GridLayer";
import { RoomShape, WallShape, DoorShape, WindowShape, FurnitureShape } from "./PlannerShapes";
import { usePlannerStore, type PlannerObject } from "@/stores/plannerStore";
import { GRID_SIZE_PX, SNAP_THRESHOLD_PX, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP, CM_TO_PX, DEFAULT_WALL_THICKNESS } from "@/constants/planner";

interface Props {
  width: number;
  height: number;
}

const snapToGrid = (val: number, enabled: boolean) => {
  if (!enabled) return val;
  return Math.round(val / GRID_SIZE_PX) * GRID_SIZE_PX;
};

const PlannerCanvas = ({ width, height }: Props) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const {
    objects, selectedObjectId, stageScale, stageX, stageY, activeTool, snapEnabled, gridEnabled, isDrawing,
    selectObject, updateObject, addObject, setStageTransform, saveSnapshot, setIsDrawing,
  } = usePlannerStore();

  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawPreview, setDrawPreview] = useState<number[] | null>(null);

  // Zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stageScale;
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = { x: (pointer.x - stageX) / oldScale, y: (pointer.y - stageY) / oldScale };
    const dir = e.evt.deltaY > 0 ? -1 : 1;
    let newScale = dir > 0 ? oldScale * ZOOM_STEP : oldScale / ZOOM_STEP;
    newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));
    const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
    setStageTransform(newScale, newPos.x, newPos.y);
  }, [stageScale, stageX, stageY, setStageTransform]);

  // Stage click
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      selectObject(null);
    }
  };

  // Drawing mouse down
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool === "select") return;
    if (activeTool !== "wall" && activeTool !== "room") return;
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    const sx = snapToGrid(pos.x, snapEnabled);
    const sy = snapToGrid(pos.y, snapEnabled);
    setDrawStart({ x: sx, y: sy });
    setIsDrawing(true);
    if (activeTool === "wall") {
      setDrawPreview([sx, sy, sx, sy]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !drawStart) return;
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    const sx = snapToGrid(pos.x, snapEnabled);
    const sy = snapToGrid(pos.y, snapEnabled);
    if (activeTool === "wall") {
      setDrawPreview([drawStart.x, drawStart.y, sx, sy]);
    } else if (activeTool === "room") {
      setDrawPreview([drawStart.x, drawStart.y, sx, sy]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !drawStart || !drawPreview) {
      setIsDrawing(false);
      return;
    }
    if (activeTool === "wall") {
      const [x1, y1, x2, y2] = drawPreview;
      const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      if (len > 10) {
        addObject({
          id: crypto.randomUUID(), type: "wall",
          x: 0, y: 0, width: 0, height: 0, rotation: 0, scaleX: 1, scaleY: 1,
          points: [x1, y1, x2, y2], strokeWidth: DEFAULT_WALL_THICKNESS,
        });
      }
    } else if (activeTool === "room") {
      const [x1, y1, x2, y2] = drawPreview;
      const w = Math.abs(x2 - x1);
      const h = Math.abs(y2 - y1);
      if (w > 20 && h > 20) {
        addObject({
          id: crypto.randomUUID(), type: "room",
          x: Math.min(x1, x2), y: Math.min(y1, y2),
          width: w, height: h, rotation: 0, scaleX: 1, scaleY: 1,
          fillColor: "rgba(218,189,171,0.15)",
          label: `${Math.round(w / CM_TO_PX / 100 * h / CM_TO_PX / 100 * 100) / 100} м²`,
        });
      }
    }
    setDrawStart(null);
    setDrawPreview(null);
    setIsDrawing(false);
  };

  // Object callbacks
  const handleDragEnd = (id: string, x: number, y: number) => {
    const sx = snapToGrid(x, snapEnabled);
    const sy = snapToGrid(y, snapEnabled);
    updateObject(id, { x: sx, y: sy });
    saveSnapshot();
  };

  const handleTransformEnd = (id: string, updates: Partial<PlannerObject>) => {
    updateObject(id, updates);
    saveSnapshot();
  };

  // Transformer sync
  const selectedNode = selectedObjectId
    ? stageRef.current?.findOne(`#${selectedObjectId}`)
    : null;

  if (transformerRef.current) {
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode as any]);
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer()?.batchDraw();
  }

  const shapeProps = (obj: PlannerObject) => ({
    obj,
    isSelected: selectedObjectId === obj.id,
    onSelect: () => selectObject(obj.id),
    onDragEnd: (x: number, y: number) => handleDragEnd(obj.id, x, y),
    onTransformEnd: (u: Partial<PlannerObject>) => handleTransformEnd(obj.id, u),
  });

  const rooms = objects.filter((o) => o.type === "room");
  const walls = objects.filter((o) => o.type === "wall");
  const doors = objects.filter((o) => o.type === "door");
  const windows = objects.filter((o) => o.type === "window");
  const furniture = objects.filter((o) => o.type === "furniture");

  const cursor = activeTool === "wall" || activeTool === "room" ? "crosshair" : activeTool === "door" || activeTool === "window" ? "crosshair" : "default";

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stageX}
      y={stageY}
      onWheel={handleWheel}
      onClick={handleStageClick}
      onTap={(e: any) => handleStageClick(e)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor, background: "#F5F5F5" }}
      draggable={activeTool === "select"}
      onDragEnd={(e) => {
        if (e.target === e.target.getStage()) {
          setStageTransform(stageScale, e.target.x(), e.target.y());
        }
      }}
    >
      {/* Grid */}
      {gridEnabled && (
        <Layer listening={false}>
          <GridLayer width={width} height={height} scale={stageScale} />
        </Layer>
      )}

      {/* Objects */}
      <Layer>
        {rooms.map((o) => <RoomShape key={o.id} {...shapeProps(o)} />)}
        {walls.map((o) => <WallShape key={o.id} {...shapeProps(o)} />)}
        {doors.map((o) => <DoorShape key={o.id} {...shapeProps(o)} />)}
        {windows.map((o) => <WindowShape key={o.id} {...shapeProps(o)} />)}
        {furniture.map((o) => <FurnitureShape key={o.id} {...shapeProps(o)} />)}

        {/* Draw preview */}
        {drawPreview && activeTool === "wall" && (
          <Line points={drawPreview} stroke="#008080" strokeWidth={DEFAULT_WALL_THICKNESS} lineCap="square" opacity={0.5} listening={false} />
        )}
        {drawPreview && activeTool === "room" && (
          <>
            <Line
              points={[drawPreview[0], drawPreview[1], drawPreview[2], drawPreview[1], drawPreview[2], drawPreview[3], drawPreview[0], drawPreview[3]]}
              closed stroke="#008080" strokeWidth={2} dash={[6, 4]} opacity={0.6} listening={false}
            />
          </>
        )}

        {/* Transformer */}
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          borderStroke="#008080"
          anchorStroke="#008080"
          anchorFill="white"
          anchorSize={8}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default PlannerCanvas;
