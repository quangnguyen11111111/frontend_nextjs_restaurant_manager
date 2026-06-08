import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  dishId: number;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (dishId: number, quantity: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  removeFromCart: (dishId: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (dishId: number, quantity: number) => {
        set((state) => {
          const existingItemIndex = state.cart.findIndex((item) => item.dishId === dishId);
          if (existingItemIndex !== -1) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += quantity;
            if (newCart[existingItemIndex].quantity <= 0) {
              newCart.splice(existingItemIndex, 1);
            }
            return { cart: newCart };
          }
          if (quantity > 0) {
            return { cart: [...state.cart, { dishId, quantity }] };
          }
          return state;
        });
      },
      updateQuantity: (dishId: number, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.dishId !== dishId) };
          }
          const newCart = state.cart.map((item) =>
            item.dishId === dishId ? { ...item, quantity } : item
          );
          return { cart: newCart };
        });
      },
      removeFromCart: (dishId: number) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.dishId !== dishId),
        }));
      },
      clearCart: () => set({ cart: [] }),
      getTotalQuantity: () => {
        const cart = get().cart;
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // stores in localStorage by default
    }
  )
);
