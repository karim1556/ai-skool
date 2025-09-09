"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: string | number
  title: string
  price: number
  originalPrice?: number | null
  image?: string | null
  provider?: string | null
  type?: "course" | "level" | "product"
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "cart:v1"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage only on client
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      }
    } catch {}
  }, [items])

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === String(item.id))
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity }
        return copy
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)))
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => String(p.id) !== String(id))
      return prev.map((p) => (String(p.id) === String(id) ? { ...p, quantity } : p))
    })
  }

  const clear = () => setItems([])

  const subtotal = useMemo(() => items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0), [items])
  const count = useMemo(() => items.reduce((c, it) => c + Number(it.quantity || 0), 0), [items])

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
