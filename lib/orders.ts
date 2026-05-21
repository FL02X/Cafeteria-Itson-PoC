"use client"

import type { Order, OrderStatus } from "./mockData"
import { MOCK_ORDERS } from "./mockData"

const USER_ORDERS_KEY = "cafeteria_orders"
const ADMIN_ORDERS_KEY = "cafeteria_admin_orders"

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.log("[v0] Failed to write key", key, e)
  }
}

export function getUserOrders(): Order[] {
  return read<Order[]>(USER_ORDERS_KEY, [])
}

export function getAdminOrders(): Order[] {
  // Seed with mock orders the first time
  if (typeof window === "undefined") return []
  const existing = localStorage.getItem(ADMIN_ORDERS_KEY)
  if (!existing) {
    write(ADMIN_ORDERS_KEY, MOCK_ORDERS)
    return MOCK_ORDERS
  }
  try {
    return JSON.parse(existing) as Order[]
  } catch {
    return []
  }
}

export function saveUserOrder(order: Order) {
  const list = getUserOrders()
  list.unshift(order)
  write(USER_ORDERS_KEY, list)
}

export function pushAdminOrder(order: Order) {
  const list = getAdminOrders()
  list.unshift(order)
  write(ADMIN_ORDERS_KEY, list)
}

export function updateAdminOrderStatus(orderId: string, status: OrderStatus) {
  const list = getAdminOrders()
  const next = list.map((o) => (o.id === orderId ? { ...o, status } : o))
  write(ADMIN_ORDERS_KEY, next)

  // Mirror status into user orders too
  const userList = getUserOrders()
  const userNext = userList.map((o) =>
    o.id === orderId ? { ...o, status } : o
  )
  write(USER_ORDERS_KEY, userNext)
}

export function findOrderById(orderId: string): Order | null {
  const userList = getUserOrders()
  const fromUser = userList.find((o) => o.id === orderId)
  if (fromUser) {
    // Sync with admin status if it's been updated
    const admin = getAdminOrders().find((o) => o.id === orderId)
    if (admin && admin.status !== fromUser.status) {
      return { ...fromUser, status: admin.status }
    }
    return fromUser
  }
  const fromAdmin = getAdminOrders().find((o) => o.id === orderId)
  return fromAdmin ?? null
}

export function generateOrderNumber(): string {
  // 3-digit number, sequential-ish based on existing orders
  const existing = getAdminOrders().length
  const n = 44 + existing
  return String(n).padStart(3, "0")
}

export function generateOrderId(): string {
  return `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
