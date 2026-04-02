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
  {
    name: "Студия 30м²",
    desc: "Прямоугольная комната",
    widthCm: 600,
    heightCm: 500,
  },
  {
    name: "Однокомнатная 50м²",
    desc: "L-форма",
    widthCm: 800,
    heightCm: 625,
  },
  {
    name: "Двухкомнатная 75м²",
    desc: "T-форма",
    widthCm: 1000,
    heightCm: 750,
  },
];

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
