import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  size: string
  colour: string
  quantity: number
  unitPrice: number
}

interface CartStore {
  items: CartItem[]
  referralCode: string | null
  isOpen: boolean

  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, size: string, colour: string) => void
  updateQuantity: (productId: string, size: string, colour: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setReferralCode: (code: string | null) => void

  // Computed (helper functions to be used in components)
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      referralCode: null,
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          (item) => 
            item.productId === newItem.productId && 
            item.size === newItem.size && 
            item.colour === newItem.colour
        )

        if (existingItemIndex > -1) {
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += (newItem.quantity || 1)
          set({ items: updatedItems, isOpen: true })
        } else {
          set({ 
            items: [...items, { ...newItem, quantity: newItem.quantity || 1 }],
            isOpen: true 
          })
        }
      },

      removeItem: (productId, size, colour) => {
        set({
          items: get().items.filter(
            (item) => 
              !(item.productId === productId && item.size === size && item.colour === colour)
          )
        })
      },

      updateQuantity: (productId, size, colour, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size, colour)
          return
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId && item.size === size && item.colour === colour
              ? { ...item, quantity: qty }
              : item
          )
        })
      },

      clearCart: () => set({ items: [] }),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),

      setReferralCode: (code) => set({ referralCode: code }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },
    }),
    {
      name: 'kalsuq_cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items and referralCode
      partialize: (state) => ({ 
        items: state.items, 
        referralCode: state.referralCode 
      }),
    }
  )
)
