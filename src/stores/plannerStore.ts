import { create } from "zustand";

export interface PlannerObject {
  id: string;
  type: "wall" | "door" | "window" | "furniture" | "room";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  points?: number[];
  strokeWidth?: number;
  productId?: string;
  productName?: string;
  productPrice?: number;
  imageUrl?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  fillColor?: string;
  label?: string;
  isLocked?: boolean;
  subType?: string;
}

export type ActiveTool = "select" | "room" | "wall" | "door" | "window" | "furniture" | "finish";
export type LeftTab = "layout" | "walls" | "openings" | "furniture" | "finish";
export type FurnitureTab = "category" | "room" | "ai";

interface PlannerStore {
  projectId: string | null;
  projectName: string;
  isDirty: boolean;
  objects: PlannerObject[];
  selectedObjectId: string | null;
  stageScale: number;
  stageX: number;
  stageY: number;
  activeTool: ActiveTool;
  isDrawing: boolean;
  history: PlannerObject[][];
  historyIndex: number;
  leftPanelOpen: boolean;
  rightCatalogOpen: boolean;
  rightPropsOpen: boolean;
  activeLeftTab: LeftTab;
  activeFurnitureTab: FurnitureTab;
  gridEnabled: boolean;
  snapEnabled: boolean;

  setActiveTool: (tool: ActiveTool) => void;
  addObject: (obj: PlannerObject) => void;
  updateObject: (id: string, updates: Partial<PlannerObject>) => void;
  deleteObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  setStageTransform: (scale: number, x: number, y: number) => void;
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  setProjectMeta: (id: string | null, name: string) => void;
  markDirty: () => void;
  markClean: () => void;
  setLeftPanelOpen: (open: boolean) => void;
  setRightCatalogOpen: (open: boolean) => void;
  setRightPropsOpen: (open: boolean) => void;
  setActiveLeftTab: (tab: LeftTab) => void;
  setActiveFurnitureTab: (tab: FurnitureTab) => void;
  setGridEnabled: (v: boolean) => void;
  setSnapEnabled: (v: boolean) => void;
  setIsDrawing: (v: boolean) => void;
  setProjectName: (name: string) => void;
  loadObjects: (objects: PlannerObject[]) => void;
}

export const usePlannerStore = create<PlannerStore>((set, get) => ({
  projectId: null,
  projectName: "Новый проект",
  isDirty: false,
  objects: [],
  selectedObjectId: null,
  stageScale: 1,
  stageX: 0,
  stageY: 0,
  activeTool: "select",
  isDrawing: false,
  history: [[]],
  historyIndex: 0,
  leftPanelOpen: false,
  rightCatalogOpen: false,
  rightPropsOpen: false,
  activeLeftTab: "layout",
  activeFurnitureTab: "category",
  gridEnabled: true,
  snapEnabled: true,

  setActiveTool: (tool) => {
    const updates: Record<string, unknown> = { activeTool: tool, isDrawing: false };
    if (tool === "furniture") {
      updates.rightCatalogOpen = true;
      updates.leftPanelOpen = false;
    } else if (tool === "room") {
      updates.leftPanelOpen = true;
      updates.activeLeftTab = "layout";
      updates.rightCatalogOpen = false;
    } else if (tool === "door" || tool === "window") {
      updates.leftPanelOpen = true;
      updates.activeLeftTab = "openings";
      updates.rightCatalogOpen = false;
    } else if (tool === "finish") {
      updates.leftPanelOpen = true;
      updates.activeLeftTab = "finish";
      updates.rightCatalogOpen = false;
    } else {
      updates.leftPanelOpen = false;
      updates.rightCatalogOpen = false;
    }
    set(updates as Partial<PlannerStore>);
  },

  addObject: (obj) => {
    set((s) => ({ objects: [...s.objects, obj], isDirty: true }));
    get().saveSnapshot();
  },

  updateObject: (id, updates) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, ...updates } : o)),
      isDirty: true,
    }));
  },

  deleteObject: (id) => {
    set((s) => ({
      objects: s.objects.filter((o) => o.id !== id),
      selectedObjectId: s.selectedObjectId === id ? null : s.selectedObjectId,
      rightPropsOpen: s.selectedObjectId === id ? false : s.rightPropsOpen,
      isDirty: true,
    }));
    get().saveSnapshot();
  },

  selectObject: (id) => set({ selectedObjectId: id, rightPropsOpen: id !== null }),

  setStageTransform: (scale, x, y) => set({ stageScale: scale, stageX: x, stageY: y }),

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const newIdx = historyIndex - 1;
    set({ objects: [...history[newIdx]], historyIndex: newIdx, isDirty: true });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const newIdx = historyIndex + 1;
    set({ objects: [...history[newIdx]], historyIndex: newIdx, isDirty: true });
  },

  saveSnapshot: () => {
    const { objects, history, historyIndex } = get();
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push([...objects]);
    if (trimmed.length > 50) trimmed.shift();
    set({ history: trimmed, historyIndex: trimmed.length - 1 });
  },

  setProjectMeta: (id, name) => set({ projectId: id, projectName: name }),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
  setLeftPanelOpen: (open) => set({ leftPanelOpen: open }),
  setRightCatalogOpen: (open) => set({ rightCatalogOpen: open }),
  setRightPropsOpen: (open) => set({ rightPropsOpen: open }),
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  setActiveFurnitureTab: (tab) => set({ activeFurnitureTab: tab }),
  setGridEnabled: (v) => set({ gridEnabled: v }),
  setSnapEnabled: (v) => set({ snapEnabled: v }),
  setIsDrawing: (v) => set({ isDrawing: v }),
  setProjectName: (name) => set({ projectName: name, isDirty: true }),
  loadObjects: (objects) => set({ objects, history: [objects], historyIndex: 0, isDirty: false }),
}));
