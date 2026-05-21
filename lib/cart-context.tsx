"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { CartItem } from "./mockData"

const CART_KEY = "cafeteria_cart"

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, "cartItemId">) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  removeItem: (cartItemId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch (e) {
      console.log("[v0] Failed to hydrate cart:", e)
    }
    setHydrated(true)
  }, [])

  // Persist on change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch (e) {
      console.log("[v0] Failed to persist cart:", e)
    }
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, "cartItemId">) => {
    setItems((prev) => [
      ...prev,
      { ...item, cartItemId: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
    ])
  }, [])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.cartItemId !== cartItemId)
      }
      return prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity } : i
      )
    })
  }, [])

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
    return { items, itemCount, subtotal, addItem, updateQuantity, removeItem, clear }
  }, [items, addItem, updateQuantity, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
