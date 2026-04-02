import { create } from "zustand";

export type PlannerTool = "select" | "walls" | "floorplan" | "doors" | "furniture";

export interface PlacedObject {
  id: string;
  productId: string;
  name: string;
  posX: number;
  posY: number;
  rotation: number;
  scale: number;
  price: number;
  widthCm: number;
  depthCm: number;
  heightCm: number;
}

interface PlannerState {
  projectId: string | null;
  projectName: string;
  roomWidthCm: number;
  roomHeightCm: number;
  selectedTool: PlannerTool;
  placedObjects: PlacedObject[];
  selectedObjectId: string | null;
  catalogOpen: boolean;
  propertiesOpen: boolean;
  isDirty: boolean;
  viewMode: "2d" | "3d";

  setProjectId: (id: string) => void;
  setProjectName: (name: string) => void;
  setRoomSize: (w: number, h: number) => void;
  setTool: (tool: PlannerTool) => void;
  addObject: (obj: PlacedObject) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  toggleCatalog: () => void;
  closeCatalog: () => void;
  setViewMode: (mode: "2d" | "3d") => void;
  setDirty: (dirty: boolean) => void;
  getTotalPrice: () => number;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  projectId: null,
  projectName: "Новый проект",
  roomWidthCm: 600,
  roomHeightCm: 400,
  selectedTool: "select",
  placedObjects: [],
  selectedObjectId: null,
  catalogOpen: false,
  propertiesOpen: false,
  isDirty: false,
  viewMode: "2d",

  setProjectId: (id) => set({ projectId: id }),
  setProjectName: (name) => set({ projectName: name, isDirty: true }),
  setRoomSize: (w, h) => set({ roomWidthCm: w, roomHeightCm: h }),
  setTool: (tool) => {
    if (tool === "furniture") {
      set({ selectedTool: tool, catalogOpen: true });
    } else {
      set({ selectedTool: tool, catalogOpen: false });
    }
  },
  addObject: (obj) => set((s) => ({ placedObjects: [...s.placedObjects, obj], isDirty: true })),
  removeObject: (id) => set((s) => ({
    placedObjects: s.placedObjects.filter((o) => o.id !== id),
    selectedObjectId: s.selectedObjectId === id ? null : s.selectedObjectId,
    propertiesOpen: s.selectedObjectId === id ? false : s.propertiesOpen,
    isDirty: true,
  })),
  selectObject: (id) => set({ selectedObjectId: id, propertiesOpen: id !== null }),
  toggleCatalog: () => set((s) => ({ catalogOpen: !s.catalogOpen })),
  closeCatalog: () => set({ catalogOpen: false }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  getTotalPrice: () => get().placedObjects.reduce((sum, o) => sum + o.price, 0),
}));
