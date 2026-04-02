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

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  getCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (productId) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        return { items: state.items.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { productId, quantity: 1 }] };
    }),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
