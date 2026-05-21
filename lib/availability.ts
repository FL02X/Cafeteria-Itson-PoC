"use client"

import { PRODUCTS, type Product } from "./mockData"

const KEY = "cafeteria_products_availability"

export function getAvailabilityMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, boolean>
  } catch {
    return {}
  }
}

export function setAvailability(productId: string, available: boolean) {
  if (typeof window === "undefined") return
  const map = getAvailabilityMap()
  map[productId] = available
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function getProductsWithAvailability(): Product[] {
  const overrides = getAvailabilityMap()
  return PRODUCTS.map((p) =>
    p.id in overrides ? { ...p, available: overrides[p.id] } : p
  )
}

export function getProductByIdWithAvailability(id: string): Product | undefined {
  return getProductsWithAvailability().find((p) => p.id === id)
}
