import { products, type Product } from "./mockData";
import { materialProducts, type MaterialProduct } from "./materialsData";

/**
 * Единый список товаров обоих каталогов («Мебель и Интерьер» + «Стройматериалы»).
 * Используется корзиной, избранным, проектами и дизайнами, чтобы товары
 * из любого каталога попадали в одну и ту же корзину/избранное.
 */
export const materialAsProduct = (m: MaterialProduct): Product => ({
  id: m.id,
  name: m.name,
  brand: m.brand,
  description: m.description,
  price: m.price,
  currency: m.currency,
  categoryId: "cat-materials",
  images: m.images,
  dimensions: { width_cm: 0, depth_cm: 0, height_cm: 0 },
  style: "Стройматериалы",
  material: m.group2,
  color: "—",
  inStock: m.inStock,
  createdAt: m.createdAt,
});

export const allProducts: Product[] = [
  ...products,
  ...materialProducts.map(materialAsProduct),
];

export const findProduct = (id?: string) => allProducts.find((p) => p.id === id);
