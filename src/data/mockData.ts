import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";
import product9 from "@/assets/product-9.jpg";
import product10 from "@/assets/product-10.jpg";
import designpack1 from "@/assets/designpack-1.jpg";
import designpack2 from "@/assets/designpack-2.jpg";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  images: string[];
  dimensions: { width_cm: number; depth_cm: number; height_cm: number };
  style: string;
  material: string;
  color: string;
  inStock: boolean;
  createdAt: string;
}

export interface DesignPack {
  id: string;
  name: string;
  description: string;
  price: number;
  coverImage: string;
  style: string;
  productIds: string[];
  createdAt: string;
}

export const categories: Category[] = [
  { id: "cat-1", name: "Гостиная", slug: "gostinaya" },
  { id: "cat-2", name: "Спальня", slug: "spalnya" },
  { id: "cat-3", name: "Кухня", slug: "kuhnya" },
  { id: "cat-4", name: "Столовая", slug: "stolovaya" },
  { id: "cat-5", name: "Детская", slug: "detskaya" },
  { id: "cat-6", name: "Кабинет", slug: "kabinet" },
  { id: "cat-7", name: "Ванная", slug: "vannaya" },
  { id: "cat-8", name: "Холл", slug: "holl" },
  { id: "cat-9", name: "Гардеробная", slug: "garderobnaya" },
];

export const products: Product[] = [
  {
    id: "p1", name: "Кофейный столик Oslo", brand: "Poliform", description: "Элегантный кофейный столик из массива дуба с металлическими ножками в стиле mid-century.", price: 18500, currency: "RUB", categoryId: "cat-1",
    images: [product1, product5, product1], dimensions: { width_cm: 80, depth_cm: 50, height_cm: 45 }, style: "Скандинавский", material: "Дуб, металл", color: "Натуральный", inStock: true, createdAt: "2025-01-15",
  },
  {
    id: "p2", name: "Комод Norden с тёмно-синими фасадами", brand: "Cassina", description: "Деревянный комод с тремя ящиками и контрастными тёмно-синими фасадами.", price: 45900, currency: "RUB", categoryId: "cat-2",
    images: [product2, product2], dimensions: { width_cm: 150, depth_cm: 45, height_cm: 80 }, style: "Скандинавский", material: "Орех, МДФ", color: "Синий", inStock: true, createdAt: "2025-02-01",
  },
  {
    id: "p3", name: "Растение Фикус в керамическом кашпо", brand: "Green Home", description: "Живое растение в стильном белом керамическом горшке. Высота 120 см.", price: 4200, currency: "RUB", categoryId: "cat-1",
    images: [product3, product3], dimensions: { width_cm: 35, depth_cm: 35, height_cm: 120 }, style: "Минималистичный", material: "Керамика", color: "Зелёный", inStock: true, createdAt: "2025-02-10",
  },
  {
    id: "p4", name: "Подвесной светильник Amber", brand: "RIVALLI", description: "Оранжевый подвесной светильник с плафоном из окрашенного металла.", price: 12800, currency: "RUB", categoryId: "cat-3",
    images: [product4, product4], dimensions: { width_cm: 30, depth_cm: 30, height_cm: 25 }, style: "Индустриальный", material: "Металл", color: "Оранжевый", inStock: true, createdAt: "2025-03-01",
  },
  {
    id: "p5", name: "Журнальный столик Hairpin", brand: "Poliform", description: "Компактный столик с столешницей из массива и ножками-шпильками.", price: 9800, currency: "RUB", categoryId: "cat-1",
    images: [product5, product1, product5], dimensions: { width_cm: 60, depth_cm: 40, height_cm: 42 }, style: "Индустриальный", material: "Дуб, сталь", color: "Натуральный", inStock: true, createdAt: "2025-03-10",
  },
  {
    id: "p6", name: "Кресло Scandi Lounge", brand: "Cassina", description: "Мягкое кресло с обивкой из ткани серого цвета и ножками из бука.", price: 34500, currency: "RUB", categoryId: "cat-1",
    images: [product6, product6], dimensions: { width_cm: 72, depth_cm: 78, height_cm: 85 }, style: "Скандинавский", material: "Ткань, бук", color: "Серый", inStock: true, createdAt: "2025-03-15",
  },
  {
    id: "p7", name: "Стеллаж Open Frame", brand: "RIVALLI", description: "Открытый стеллаж с деревянными полками и чёрным металлическим каркасом.", price: 28700, currency: "RUB", categoryId: "cat-6",
    images: [product7, product7], dimensions: { width_cm: 120, depth_cm: 35, height_cm: 180 }, style: "Индустриальный", material: "Дуб, металл", color: "Чёрный", inStock: true, createdAt: "2025-03-20",
  },
  {
    id: "p8", name: "Диван трёхместный Comfort", brand: "Poliform", description: "Просторный трёхместный диван с мягкими подушками и обивкой из льна.", price: 89000, currency: "RUB", categoryId: "cat-1",
    images: [product8, product8], dimensions: { width_cm: 220, depth_cm: 95, height_cm: 85 }, style: "Классический", material: "Лён, дуб", color: "Бежевый", inStock: true, createdAt: "2025-04-01",
  },
  {
    id: "p9", name: "Набор ваз Terracotta", brand: "Green Home", description: "Комплект из трёх декоративных ваз в тёплых земляных тонах.", price: 6500, currency: "RUB", categoryId: "cat-1",
    images: [product9, product9], dimensions: { width_cm: 15, depth_cm: 15, height_cm: 30 }, style: "Минималистичный", material: "Керамика", color: "Терракотовый", inStock: false, createdAt: "2025-04-05",
  },
  {
    id: "p10", name: "Обеденный стол Nordic", brand: "Cassina", description: "Прямоугольный обеденный стол из массива дуба на 6 персон.", price: 67000, currency: "RUB", categoryId: "cat-3",
    images: [product10, product10], dimensions: { width_cm: 180, depth_cm: 90, height_cm: 75 }, style: "Скандинавский", material: "Дуб", color: "Натуральный", inStock: true, createdAt: "2025-04-10",
  },
];

export const designPacks: DesignPack[] = [
  {
    id: "dp1", name: "Скандинавская гостиная", description: "Полный комплект мебели для уютной гостиной в скандинавском стиле: диван, кресло, столик, стеллаж и декор.",
    price: 152000, coverImage: designpack1, style: "Скандинавский", productIds: ["p1", "p6", "p8", "p3", "p5"], createdAt: "2025-03-01",
  },
  {
    id: "dp2", name: "Минималистичная спальня", description: "Элегантный набор для спальни: комод, прикроватный столик, декоративные вазы и светильник.",
    price: 78000, coverImage: designpack2, style: "Минималистичный", productIds: ["p2", "p4", "p9"], createdAt: "2025-04-01",
  },
];

export const brands = ["Poliform", "Cassina", "RIVALLI", "Green Home"];
export const styles = ["Скандинавский", "Минималистичный", "Индустриальный", "Классический"];
export const colors = [
  { name: "Натуральный", hex: "#C4A882" },
  { name: "Синий", hex: "#2C3E6B" },
  { name: "Зелёный", hex: "#4CAF50" },
  { name: "Оранжевый", hex: "#FF8C00" },
  { name: "Серый", hex: "#9E9E9E" },
  { name: "Чёрный", hex: "#333333" },
  { name: "Бежевый", hex: "#E8DCC8" },
  { name: "Терракотовый", hex: "#CC6633" },
];
