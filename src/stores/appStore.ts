import { create } from "zustand";

interface FavoritesState {
  favoriteProductIds: Set<string>;
  favoriteDesignPackIds: Set<string>;
  toggleProductFavorite: (id: string) => void;
  toggleDesignPackFavorite: (id: string) => void;
  isProductFavorite: (id: string) => boolean;
  isDesignPackFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteProductIds: new Set<string>(),
  favoriteDesignPackIds: new Set<string>(),
  toggleProductFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favoriteProductIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { favoriteProductIds: next };
    }),
  toggleDesignPackFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favoriteDesignPackIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { favoriteDesignPackIds: next };
    }),
  isProductFavorite: (id) => get().favoriteProductIds.has(id),
  isDesignPackFavorite: (id) => get().favoriteDesignPackIds.has(id),
}));

export interface CartItem {
  productId: string;
  designPackId?: string;
  quantity: number;
}

interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  deliveryAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  status: string;
  createdAt: string;
}

interface CartState {
  items: CartItem[];
  orders: Order[];
  addItem: (productId: string, designPackId?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  getCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orders: [],
  addItem: (productId, designPackId) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        return { items: state.items.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { productId, designPackId, quantity: 1 }] };
    }),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.productId !== productId)
        : state.items.map((i) => i.productId === productId ? { ...i, quantity } : i),
    })),
  clearCart: () => set({ items: [] }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
