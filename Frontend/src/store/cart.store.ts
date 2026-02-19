import { create } from 'zustand'
import { Cart } from '../types/cart'
import { addToCart, clearCart, getCart, removeFromCart } from '../lib/api';

type CartStore = {
    cart: Cart | null;
    loading: boolean;

    setCart: (cart: Cart | null) => void;

    fetchCart: () => Promise<void>;
    addItem: (variantId: string, qty?: number) => Promise<void>;
    updateQty: (variantId: string, qty: number) => Promise<void>;
    removeItem: (variantId: string, qty?: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>( (set) => ({
    cart: null,
    loading: false,

    setCart: (cart) => set({ cart }),

    fetchCart: async () => {
        set({ loading:true });
        const cart = await getCart();
        set({ cart , loading:false});
    },

    addItem: async (variantId,qty) => {
        const cart = await addToCart(variantId,qty);
        set({ cart });
    },

    updateQty: async (variantId,qty) => {
        const cart = await addToCart(variantId,qty);
        set({ cart });  
    },

    removeItem: async (variantId,qty = 1) => {
        const cart = await removeFromCart(variantId,qty);
        set({ cart });
    },

    clearCart: async () => {
        const cart = await clearCart();
        set({ cart });
    }
}))

