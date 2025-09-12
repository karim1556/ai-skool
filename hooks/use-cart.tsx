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
  removeItem: (id: string | number, type?: CartItem['type']) => void
  updateQuantity: (id: string | number, quantity: number, type?: CartItem['type']) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "cart:v2"
const LEGACY_KEY = "cart:v1"

function keyFor(it: Pick<CartItem, 'id' | 'type'>) {
  return `${it.type || 'item'}:${String(it.id)}`
}

function isSameItem(a: Pick<CartItem,'id'|'type'>, b: Pick<CartItem,'id'|'type'>) {
  if (String(a.id) !== String(b.id)) return false
  // If either is missing type, consider them the same (legacy entries)
  if (!a.type || !b.type) return true
  return a.type === b.type
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage only on client
  useEffect(() => {
    try {
      const get = (k: string) => typeof window !== 'undefined' ? window.localStorage.getItem(k) : null
      const rawV2 = get(STORAGE_KEY)
      const rawV1 = !rawV2 ? get(LEGACY_KEY) : null
      const raw = rawV2 || rawV1
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          // normalize: clamp quantity to 1 and de-duplicate by composite key
          const map = new Map<string, CartItem>()
          for (const x of parsed) {
            if (!x || typeof x !== 'object') continue
            const item: CartItem = {
              id: x.id,
              title: x.title,
              price: Number(x.price || 0),
              originalPrice: x.originalPrice ?? undefined,
              image: x.image ?? null,
              provider: x.provider ?? null,
              type: x.type ?? 'product',
              quantity: 1,
            }
            map.set(keyFor(item), item)
          }
          const normalized = Array.from(map.values())
          setItems(normalized)
          // if we migrated from v1, write to v2 and clear v1
          if (rawV1 && typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
            window.localStorage.removeItem(LEGACY_KEY)
          }
        }
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
      const idx = prev.findIndex((p) => isSameItem(p, item))
      if (idx >= 0) {
        // single-quantity policy: ensure quantity stays 1
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: 1 }
        return copy
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string | number, type?: CartItem['type']) => {
    setItems((prev) => prev.filter((p) => !isSameItem(p, { id, type })) )
  }

  const updateQuantity = (id: string | number, quantity: number, type?: CartItem['type']) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => !isSameItem(p, { id, type }))
      // single-quantity policy: clamp to 1
      return prev.map((p) => (isSameItem(p, { id, type }) ? { ...p, quantity: 1 } : p))
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
