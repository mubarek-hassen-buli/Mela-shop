import { create } from 'zustand';
import type { Product } from '@/types';

export interface CartItem {
  id: string;          // unique id for cart entry (product.id + size + color)
  productId: string;   // the base product id from mockData
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, size, color, quantity) => {
    set((state) => {
      // Create a unique identifier so different colors/sizes of the same product don't stack
      const cartItemId = `${product.id}-${size}-${color}`;
      const existingItem = state.items.find((item) => item.id === cartItemId);

      if (existingItem) {
        // If it exists, stringently increase the quantity
        return {
          items: state.items.map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      // If it doesn't exist, append it
      return {
        items: [
          ...state.items,
          {
            id: cartItemId,
            productId: product.id,
            product,
            size,
            color,
            quantity,
          },
        ],
      };
    });
  },

  updateQuantity: (id, delta) => {
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        // Automatically drop items that reach 0 quantity
        .filter((item) => item.quantity > 0),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getSubTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },

  getTotal: () => {
    const { getSubTotal } = get();
    const subTotal = getSubTotal();
    const deliveryCharge = itemsCount(get().items) > 0 ? 7 : 0; // Flat 7 AED / $ delivery shown in screenshot if not empty
    const discount = 0; // Fixed at 0 for now as per screenshot

    return subTotal + deliveryCharge - discount;
  },
}));

// Helper to check if cart has items safely inside selector bounds
const itemsCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);
