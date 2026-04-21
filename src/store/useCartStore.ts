import { create } from 'zustand';
import { Id } from '@convex/_generated/dataModel';
export interface CartItem {
  productId: Id<"products">;
  name: string;
  emoji: string;
  price: number;
  quantity: number;
  availableStock: number;
}
interface CartState {
  items: CartItem[];
  addItem: (product: { _id: Id<"products">; name: string; emoji: string; price: number; stock: number }) => void;
  removeItem: (productId: Id<"products">) => void;
  updateQuantity: (productId: Id<"products">, delta: number) => void;
  clearCart: () => void;
}
export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existing = state.items.find((i) => i.productId === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) return state;
      return {
        items: state.items.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    if (product.stock <= 0) return state;
    return {
      items: [
        ...state.items,
        {
          productId: product._id,
          name: product.name,
          emoji: product.emoji,
          price: product.price,
          quantity: 1,
          availableStock: product.stock,
        },
      ],
    };
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter((i) => i.productId !== productId),
  })),
  updateQuantity: (productId, delta) => set((state) => ({
    items: state.items.map((i) => {
      if (i.productId !== productId) return i;
      const nextQty = Math.max(1, Math.min(i.availableStock, i.quantity + delta));
      return { ...i, quantity: nextQty };
    }),
  })),
  clearCart: () => set({ items: [] }),
}));