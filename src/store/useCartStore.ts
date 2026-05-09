"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDefaultPriceVariant, getProductPrice, isProductPurchasable, Product, PriceVariant } from "@/lib/products-live";

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: PriceVariant;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: PriceVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export function getCartItemId(product: Product, variant?: PriceVariant): string {
  const selected = variant ?? getDefaultPriceVariant(product);
  if (!selected) {
    return product.id;
  }

  return `${product.id}::${selected.quantity}::${selected.price}`;
}

export function getCartItemPrice(item: CartItem): number {
  return getProductPrice(item.product, item.variant);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1, variant?: PriceVariant) => {
        if (!isProductPurchasable(product)) {
          return;
        }

        const selectedVariant = variant ?? getDefaultPriceVariant(product);
        const nextItemId = getCartItemId(product, selectedVariant);

        set((state) => {
          const existingItem = state.items.find(
            (item) => getCartItemId(item.product, item.variant) === nextItemId
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                getCartItemId(item.product, item.variant) === nextItemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity, variant: selectedVariant }] };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => getCartItemId(item.product, item.variant) !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            getCartItemId(item.product, item.variant) === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + getCartItemPrice(item) * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "yuveda-cart",
    }
  )
);
