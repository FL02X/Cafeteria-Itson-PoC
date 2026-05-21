"use client"

import {
  ref,
  push,
  set,
  update,
  get,
  onValue,
  off,
  type DataSnapshot,
} from "firebase/database"
import { getFirebaseDb, firebaseConfigured } from "./firebase"
import type { Order, OrderStatus } from "./mockData"
import { MOCK_ORDERS, PRODUCTS } from "./mockData"

// ─────────────────────────────────────────────────────────────────────────
// In-memory + BroadcastChannel fallback (used when .env.local is empty)
// Keeps the realtime cross-tab demo working locally without Firebase.
// ─────────────────────────────────────────────────────────────────────────

type LocalState = {
  orders: Record<string, Order>
  availability: Record<string, boolean>
  counter: number
}

const LOCAL_KEY = "cafeteria_local_db_v1"

function seedLocal(): LocalState {
  const seedOrders: Record<string, Order> = {}
  for (const o of MOCK_ORDERS) {
    seedOrders[o.id] = o
  }
  return {
    orders: seedOrders,
    availability: PRODUCTS.reduce<Record<string, boolean>>((acc, p) => {
      acc[p.id] = p.available
      return acc
    }, {}),
    counter: 43,
  }
}

function readLocal(): LocalState {
  if (typeof window === "undefined") return seedLocal()
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) {
      const seeded = seedLocal()
      localStorage.setItem(LOCAL_KEY, JSON.stringify(seeded))
      return seeded
    }
    return JSON.parse(raw) as LocalState
  } catch {
    return seedLocal()
  }
}

function writeLocal(state: LocalState) {
  if (typeof window === "undefined") return
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
  // Cross-tab notification
  try {
    const ch = new BroadcastChannel("cafeteria_db")
    ch.postMessage({ type: "update" })
    ch.close()
  } catch {
    /* ignore */
  }
  // Same-tab subscribers
  for (const cb of localSubs) cb(state)
}

const localSubs = new Set<(s: LocalState) => void>()

function subscribeLocal(cb: (s: LocalState) => void): () => void {
  localSubs.add(cb)
  let ch: BroadcastChannel | null = null
  try {
    ch = new BroadcastChannel("cafeteria_db")
    ch.onmessage = () => cb(readLocal())
  } catch {
    /* ignore */
  }
  // Also listen to storage events from other tabs (BroadcastChannel fallback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_KEY) cb(readLocal())
  }
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage)
  }
  return () => {
    localSubs.delete(cb)
    if (ch) ch.close()
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────

export async function createOrder(
  order: Omit<Order, "id" | "orderNumber">
): Promise<Order> {
  if (firebaseConfigured) {
    const db = getFirebaseDb()!
    const counterRef = ref(db, "order_counter")
    const counterSnap = await get(counterRef)
    const currentCount = (counterSnap.val() ?? 40) + 1
    await set(counterRef, currentCount)

    const orderNumber = String(currentCount).padStart(3, "0")
    const newOrderRef = push(ref(db, "orders"))
    const fullOrder: Order = {
      ...order,
      id: newOrderRef.key!,
      orderNumber,
    }
    await set(newOrderRef, fullOrder)
    return fullOrder
  }

  // Local fallback
  const state = readLocal()
  state.counter += 1
  const orderNumber = String(state.counter).padStart(3, "0")
  const id = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const fullOrder: Order = { ...order, id, orderNumber }
  state.orders[id] = fullOrder
  writeLocal(state)
  return fullOrder
}

export function subscribeToOrders(
  callback: (orders: Order[]) => void
): () => void {
  if (firebaseConfigured) {
    const db = getFirebaseDb()!
    const ordersRef = ref(db, "orders")
    const handler = (snapshot: DataSnapshot) => {
      const data = snapshot.val()
      if (!data) {
        callback([])
        return
      }
      callback(Object.values(data) as Order[])
    }
    onValue(ordersRef, handler)
    return () => off(ordersRef, "value", handler)
  }

  // Local fallback — fire immediately then on every change
  const emit = (s: LocalState) => callback(Object.values(s.orders))
  emit(readLocal())
  return subscribeLocal(emit)
}

export function subscribeToOrder(
  orderId: string,
  callback: (order: Order | null) => void
): () => void {
  if (firebaseConfigured) {
    const db = getFirebaseDb()!
    const orderRef = ref(db, `orders/${orderId}`)
    const handler = (snapshot: DataSnapshot) => {
      callback(snapshot.val() as Order | null)
    }
    onValue(orderRef, handler)
    return () => off(orderRef, "value", handler)
  }

  const emit = (s: LocalState) => callback(s.orders[orderId] ?? null)
  emit(readLocal())
  return subscribeLocal(emit)
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  if (firebaseConfigured) {
    const db = getFirebaseDb()!
    await update(ref(db, `orders/${orderId}`), { status })
    return
  }

  const state = readLocal()
  if (state.orders[orderId]) {
    state.orders[orderId] = { ...state.orders[orderId], status }
    writeLocal(state)
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PRODUCT AVAILABILITY
// ─────────────────────────────────────────────────────────────────────────

export function subscribeToAvailability(
  callback: (map: Record<string, boolean>) => void
): () => void {
  if (firebaseConfigured) {
    const db = getFirebaseDb()!
    const availRef = ref(db, "products_availability")
    const handler = (snapshot: DataSnapshot) => {
      callback(snapshot.val() ?? {})
    }
    onValue(availRef, handler)
    return () => off(availRef, "value", handler)
  }

  const emit = (s: LocalState) => callback(s.availability)
  emit(readLocal())
  return subscribeLocal(emit)
}

export async function setProductAvailability(
  productId: string,
  available: boolean
): Promise<void> {
  if (firebaseConfigured) {
    const db = getFirebaseDb()!
    await set(ref(db, `products_availability/${productId}`), available)
    return
  }

  const state = readLocal()
  state.availability[productId] = available
  writeLocal(state)
}
