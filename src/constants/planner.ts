export const CM_TO_PX = 3;
export const DEFAULT_WALL_THICKNESS = 15;
export const DEFAULT_ROOM_WIDTH_CM = 600;
export const DEFAULT_ROOM_HEIGHT_CM = 400;
export const GRID_SIZE_PX = 30;
export const SNAP_THRESHOLD_PX = 10;
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4.0;
export const ZOOM_STEP = 1.05;

export const ROOM_TEMPLATES = [
  { name: "Студия 30м²", desc: "Прямоугольная комната", widthCm: 600, heightCm: 500 },
  { name: "Однокомнатная 50м²", desc: "L-форма", widthCm: 800, heightCm: 625 },
  { name: "Двухкомнатная 75м²", desc: "T-форма", widthCm: 1000, heightCm: 750 },
];

export const PLANNER_TEMPLATES: Record<string, {
  name: string;
  area: number;
  roomWidthCm: number;
  roomHeightCm: number;
  walls: { points: number[] }[];
}> = {
  studio_30: {
    name: "Студия",
    area: 30,
    roomWidthCm: 600,
    roomHeightCm: 500,
    walls: [
      { points: [0, 0, 600 * CM_TO_PX, 0] },
      { points: [600 * CM_TO_PX, 0, 600 * CM_TO_PX, 500 * CM_TO_PX] },
      { points: [600 * CM_TO_PX, 500 * CM_TO_PX, 0, 500 * CM_TO_PX] },
      { points: [0, 500 * CM_TO_PX, 0, 0] },
    ],
  },
  one_room_45: {
    name: "1-комнатная",
    area: 45,
    roomWidthCm: 750,
    roomHeightCm: 600,
    walls: [
      { points: [0, 0, 750 * CM_TO_PX, 0] },
      { points: [750 * CM_TO_PX, 0, 750 * CM_TO_PX, 600 * CM_TO_PX] },
      { points: [750 * CM_TO_PX, 600 * CM_TO_PX, 0, 600 * CM_TO_PX] },
      { points: [0, 600 * CM_TO_PX, 0, 0] },
      { points: [400 * CM_TO_PX, 0, 400 * CM_TO_PX, 350 * CM_TO_PX] },
    ],
  },
  two_room_65: {
    name: "2-комнатная",
    area: 65,
    roomWidthCm: 1000,
    roomHeightCm: 650,
    walls: [
      { points: [0, 0, 1000 * CM_TO_PX, 0] },
      { points: [1000 * CM_TO_PX, 0, 1000 * CM_TO_PX, 650 * CM_TO_PX] },
      { points: [1000 * CM_TO_PX, 650 * CM_TO_PX, 0, 650 * CM_TO_PX] },
      { points: [0, 650 * CM_TO_PX, 0, 0] },
      { points: [400 * CM_TO_PX, 0, 400 * CM_TO_PX, 650 * CM_TO_PX] },
      { points: [400 * CM_TO_PX, 350 * CM_TO_PX, 1000 * CM_TO_PX, 350 * CM_TO_PX] },
    ],
  },
  three_room_85: {
    name: "3-комнатная",
    area: 85,
    roomWidthCm: 1200,
    roomHeightCm: 700,
    walls: [
      { points: [0, 0, 1200 * CM_TO_PX, 0] },
      { points: [1200 * CM_TO_PX, 0, 1200 * CM_TO_PX, 700 * CM_TO_PX] },
      { points: [1200 * CM_TO_PX, 700 * CM_TO_PX, 0, 700 * CM_TO_PX] },
      { points: [0, 700 * CM_TO_PX, 0, 0] },
      { points: [450 * CM_TO_PX, 0, 450 * CM_TO_PX, 700 * CM_TO_PX] },
      { points: [800 * CM_TO_PX, 0, 800 * CM_TO_PX, 400 * CM_TO_PX] },
    ],
  },
  office_40: {
    name: "Офис",
    area: 40,
    roomWidthCm: 800,
    roomHeightCm: 500,
    walls: [
      { points: [0, 0, 800 * CM_TO_PX, 0] },
      { points: [800 * CM_TO_PX, 0, 800 * CM_TO_PX, 500 * CM_TO_PX] },
      { points: [800 * CM_TO_PX, 500 * CM_TO_PX, 0, 500 * CM_TO_PX] },
      { points: [0, 500 * CM_TO_PX, 0, 0] },
    ],
  },
  open_plan: {
    name: "Открытая планировка",
    area: 70,
    roomWidthCm: 1000,
    roomHeightCm: 700,
    walls: [
      { points: [0, 0, 1000 * CM_TO_PX, 0] },
      { points: [1000 * CM_TO_PX, 0, 1000 * CM_TO_PX, 700 * CM_TO_PX] },
      { points: [1000 * CM_TO_PX, 700 * CM_TO_PX, 0, 700 * CM_TO_PX] },
      { points: [0, 700 * CM_TO_PX, 0, 0] },
    ],
  },
};

export const DOOR_TYPES = [
  { id: "single", name: "Одностворчатая", widthCm: 90, heightCm: 10 },
  { id: "double", name: "Двустворчатая", widthCm: 140, heightCm: 10 },
  { id: "sliding", name: "Раздвижная", widthCm: 120, heightCm: 10 },
];

export const WINDOW_TYPES = [
  { id: "standard", name: "Стандартное", widthCm: 120, heightCm: 10 },
  { id: "corner", name: "Угловое", widthCm: 80, heightCm: 10 },
];

export const FINISH_COLORS = [
  { name: "Белый", hex: "#FFFFFF" },
  { name: "Слоновая кость", hex: "#FFFFF0" },
  { name: "Бежевый", hex: "#E8DCC8" },
  { name: "Серый", hex: "#D3D3D3" },
  { name: "Пыльная роза", hex: "#DCAE96" },
  { name: "Мятный", hex: "#B2DFDB" },
  { name: "Лавандовый", hex: "#E6E6FA" },
  { name: "Тёплый серый", hex: "#A9A9A9" },
];
