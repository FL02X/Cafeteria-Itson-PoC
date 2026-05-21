"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Logo } from "@/components/Logo"
import { clearSession, getSession } from "@/lib/auth"
import {
  subscribeToOrders,
  subscribeToAvailability,
  updateOrderStatus,
  setProductAvailability,
} from "@/lib/db"
import type { Order, Product, OrderStatus } from "@/lib/mockData"
import { CATEGORIES, PRODUCTS } from "@/lib/mockData"

type AdminTab = "orders" | "menu"

function getDeadline(order: Order): Date {
  const created = new Date(order.createdAt)
  const minutes = Number.parseInt(order.pickupTime, 10) || 30
  return new Date(created.getTime() + minutes * 60_000)
}

function getMinutesRemaining(order: Order): number {
  const deadline = getDeadline(order)
  const now = Date.now()
  return Math.floor((deadline.getTime() - now) / 60_000)
}

type UrgencyLevel = "calm" | "warning" | "urgent" | "overdue"

function getUrgencyLevel(minutesRemaining: number): UrgencyLevel {
  if (minutesRemaining <= 0) return "overdue"
  if (minutesRemaining <= 5) return "urgent"
  if (minutesRemaining <= 10) return "warning"
  return "calm"
}

export default function AdminPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [tab, setTab] = useState<AdminTab>("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [availability, setAvailability] = useState<Record<string, boolean>>({})
  const [showCompleted, setShowCompleted] = useState(false)
  const [, setTick] = useState(0)
  const prevOrderIds = useRef<Set<string>>(new Set())
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const s = getSession()
    if (!s || s.role !== "admin") {
      router.replace("/login")
      return
    }
    setAuthorized(true)

    const unsubOrders = subscribeToOrders((incoming) => {
      // Detect new orders for animation
      const incomingIds = new Set(incoming.map((o) => o.id))
      const newIds = new Set<string>()
      for (const id of incomingIds) {
        if (!prevOrderIds.current.has(id)) {
          newIds.add(id)
        }
      }
      if (newIds.size > 0) {
        setNewOrderIds((prev) => new Set([...prev, ...newIds]))
        // Clear animation flag after animation completes
        setTimeout(() => {
          setNewOrderIds((prev) => {
            const next = new Set(prev)
            for (const id of newIds) next.delete(id)
            return next
          })
        }, 500)
      }
      prevOrderIds.current = incomingIds
      setOrders(incoming)
    })

    const unsubAvail = subscribeToAvailability(setAvailability)

    return () => {
      unsubOrders()
      unsubAvail()
    }
  }, [router])

  // Update urgency every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  // Update tab title with pending count
  useEffect(() => {
    const active = orders.filter((o) => o.status !== "listo")
    if (active.length > 0) {
      document.title = `(${active.length}) Panel CafePotros`
    } else {
      document.title = "Panel CafePotros"
    }
  }, [orders])

  const advance = useCallback(async (orderId: string) => {
    const target = orders.find((o) => o.id === orderId)
    if (!target) return
    const next: OrderStatus =
      target.status === "recibido"
        ? "en-preparacion"
        : target.status === "en-preparacion"
          ? "listo"
          : "listo"
    await updateOrderStatus(orderId, next)
  }, [orders])

  const toggleAvailability = useCallback(async (productId: string, current: boolean) => {
    await setProductAvailability(productId, !current)
  }, [])

  if (!authorized) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-sm text-[#6B6B6B]">Verificando acceso...</p>
      </div>
    )
  }

  // Sort active orders by deadline (closest first)
  const active = orders
    .filter((o) => o.status !== "listo")
    .sort((a, b) => getDeadline(a).getTime() - getDeadline(b).getTime())
  const completed = orders.filter((o) => o.status === "listo")

  const products = PRODUCTS.map((p) =>
    p.id in availability ? { ...p, available: availability[p.id] } : p
  )

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0]">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#1C1C1C] px-4 text-white">
        <Logo variant="light" size="sm" />
        <h1 className="text-sm font-extrabold">Panel de cocina</h1>
        <button
          type="button"
          onClick={() => {
            clearSession()
            router.replace("/login")
          }}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xs font-bold text-[#E8A020] transition-colors duration-150 hover:text-white"
        >
          Salir
        </button>
      </header>

      {/* Mobile Tabs - hidden on tablet+ */}
      <nav
        className="sticky top-14 z-20 flex border-b border-[#E2DDD6] bg-white md:hidden"
        aria-label="Secciones del panel"
      >
        {[
          { id: "orders" as const, label: "Pedidos", count: active.length },
          { id: "menu" as const, label: "Disponibilidad" },
        ].map((t) => {
          const isActive = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex flex-1 items-center justify-center gap-1.5 px-3 py-4 text-sm font-bold transition-colors duration-150 min-h-[52px] ${
                isActive
                  ? "text-[#1C1C1C]"
                  : "text-[#6B6B6B] hover:text-[#1C1C1C]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{t.label}</span>
              {t.id === "orders" && t.count && t.count > 0 ? (
                <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-[#E8A020] px-1.5 py-0.5 text-[11px] font-extrabold text-white">
                  {t.count}
                </span>
              ) : null}
              {isActive ? (
                <span
                  className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 bg-[#E8A020]"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          )
        })}
      </nav>

      {/* Content - two column on tablet+ */}
      <div className="flex-1 md:flex md:gap-0">
        {/* Orders Panel - always visible on tablet+ */}
        <main className={`flex-1 px-4 py-4 ${tab === "orders" ? "block" : "hidden md:block"}`}>
          <h2 className="hidden md:block mb-4 text-sm font-extrabold uppercase tracking-wide text-[#6B6B6B]">
            Pedidos activos ({active.length})
          </h2>
          
          {active.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#E2DDD6] bg-white px-6 py-12 text-center">
              <div className="text-3xl text-[#E8A020]" aria-hidden="true">
                <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
                  <path d="M12 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
                  <path d="M16 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
                  <path d="M4 11h14v5a4 4 0 0 1 -4 4h-6a4 4 0 0 1 -4 -4v-5z" />
                  <path d="M18 13h1.5a2.5 2.5 0 0 1 0 5H18" />
                </svg>
              </div>
              <p className="mt-2 text-sm font-bold text-[#1C1C1C]">
                No hay pedidos activos en este momento.
              </p>
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Los nuevos pedidos apareceran aqui automaticamente.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {active.map((o) => (
                <AdminOrderCard
                  key={o.id}
                  order={o}
                  onAdvance={advance}
                  isNew={newOrderIds.has(o.id)}
                  minutesRemaining={getMinutesRemaining(o)}
                />
              ))}
            </div>
          )}

          {/* Completed orders - collapsible */}
          {completed.length > 0 ? (
            <section className="mt-6">
              <button
                type="button"
                onClick={() => setShowCompleted((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-[#E2DDD6] bg-white px-4 py-4 text-left transition-colors duration-150 hover:bg-[#F7F5F0] min-h-[56px]"
                aria-expanded={showCompleted}
              >
                <span className="text-sm font-extrabold text-[#1C1C1C]">
                  Pedidos completados hoy ({completed.length})
                </span>
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${showCompleted ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6l6 -6" />
                </svg>
              </button>
              {showCompleted ? (
                <div className="mt-3 flex flex-col gap-3">
                  {completed.map((o) => (
                    <AdminOrderCard
                      key={o.id}
                      order={o}
                      onAdvance={advance}
                      minutesRemaining={0}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}
        </main>

        {/* Menu/Availability Panel - right side on tablet+ */}
        <aside className={`md:w-[340px] md:border-l md:border-[#E2DDD6] md:bg-white px-4 py-4 ${tab === "menu" ? "block" : "hidden md:block"}`}>
          <h2 className="hidden md:block mb-4 text-sm font-extrabold uppercase tracking-wide text-[#6B6B6B]">
            Disponibilidad
          </h2>
          <MenuPanel products={products} onToggle={toggleAvailability} />
        </aside>
      </div>
    </div>
  )
}

function AdminOrderCard({
  order,
  onAdvance,
  isNew = false,
  minutesRemaining,
}: {
  order: Order
  onAdvance: (orderId: string) => void
  isNew?: boolean
  minutesRemaining: number
}) {
  const isCompleted = order.status === "listo"
  const urgency = getUrgencyLevel(minutesRemaining)

  function timeAgo(iso: string): string {
    try {
      const date = new Date(iso)
      const diffMs = Date.now() - date.getTime()
      const mins = Math.floor(diffMs / 60000)
      if (mins < 1) return "hace menos de 1 min"
      if (mins === 1) return "hace 1 min"
      if (mins < 60) return `hace ${mins} min`
      const hours = Math.floor(mins / 60)
      if (hours === 1) return "hace 1 hora"
      return `hace ${hours} horas`
    } catch {
      return ""
    }
  }

  const urgencyBadge = !isCompleted ? (
    <span
      className={`rounded-md px-2 py-1 text-[11px] font-bold ${
        urgency === "overdue"
          ? "bg-[#C0392B]/10 text-[#C0392B] animate-pulse-subtle"
          : urgency === "urgent"
            ? "bg-[#C0392B]/10 text-[#C0392B]"
            : urgency === "warning"
              ? "bg-[#E8A020]/10 text-[#C4841A]"
              : "bg-[#F7F5F0] text-[#6B6B6B]"
      }`}
      title="Tiempo estimado - el equipo decide cuando esta listo"
    >
      {urgency === "overdue"
        ? "Pasado"
        : minutesRemaining <= 0
          ? "Ahora"
          : `${minutesRemaining} min`}
    </span>
  ) : null

  return (
    <article
      className={`rounded-lg border border-[#E2DDD6] bg-white p-4 shadow-sm transition-all duration-300 ${
        isNew ? "animate-slide-in-top" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold leading-none text-[#E8A020]">
            #{order.orderNumber}
          </p>
          <p className="mt-1 text-sm font-bold text-[#1C1C1C]">
            {order.userName}
          </p>
          <p className="text-xs text-[#6B6B6B]">{timeAgo(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {urgencyBadge}
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 border-t border-[#E2DDD6] pt-3">
        {order.items.map((it) => (
          <li
            key={it.cartItemId}
            className="flex items-start justify-between gap-2 text-sm"
          >
            <div className="min-w-0">
              <p className="font-semibold text-[#1C1C1C]">
                <span className="text-[#E8A020]">{it.quantity}x</span>{" "}
                {it.productName}
              </p>
              {(it.selectedSize ||
                it.selectedFlavor ||
                (it.selectedExtras && it.selectedExtras.length > 0)) ? (
                <p className="text-xs text-[#6B6B6B]">
                  {[it.selectedSize, it.selectedFlavor]
                    .filter(Boolean)
                    .join(" - ")}
                  {it.selectedExtras && it.selectedExtras.length > 0
                    ? ` - ${it.selectedExtras.join(", ")}`
                    : ""}
                </p>
              ) : null}
              {it.note ? (
                <p className="mt-0.5 text-xs italic text-[#6B6B6B]">
                  Nota: {it.note}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 text-sm font-bold text-[#1C1C1C]">
              ${it.price * it.quantity}
            </span>
          </li>
        ))}
      </ul>

      {order.note ? (
        <p className="mt-3 rounded-md bg-[#FFF8EC] px-3 py-2 text-xs text-[#1C1C1C]">
          <span className="font-bold">Nota general:</span> {order.note}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between border-t border-[#E2DDD6] pt-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
          Total
        </span>
        <span className="text-lg font-extrabold text-[#1C1C1C]">
          ${order.total} MXN
        </span>
      </div>

      {!isCompleted ? (
        <button
          type="button"
          onClick={() => onAdvance(order.id)}
          className={`mt-3 w-full rounded-lg px-4 py-4 text-sm font-bold text-white transition-all duration-150 min-h-[56px] active:scale-[0.98] ${
            order.status === "recibido"
              ? "bg-[#E8A020] hover:bg-[#C4841A]"
              : "bg-[#2D7A3A] hover:bg-[#246030]"
          }`}
        >
          {order.status === "recibido"
            ? "Marcar en preparacion"
            : "Listo para recoger"}
        </button>
      ) : (
        <p className="mt-3 rounded-lg bg-[#E7F3EA] px-3 py-3 text-center text-xs font-bold text-[#2D7A3A]">
          Pedido entregado
        </p>
      )}
    </article>
  )
}

function MenuPanel({
  products,
  onToggle,
}: {
  products: Product[]
  onToggle: (productId: string, current: boolean) => void
}) {
  return (
    <section aria-label="Disponibilidad de productos">
      {CATEGORIES.map((cat) => {
        const list = products.filter((p) => p.category === cat.id)
        if (list.length === 0) return null
        return (
          <div key={cat.id} className="mb-5">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-[#6B6B6B]">
              {cat.label}
            </p>
            <ul className="overflow-hidden rounded-lg border border-[#E2DDD6] bg-white">
              {list.map((p, idx) => (
                <li
                  key={p.id}
                  className={`flex items-center gap-3 px-3 py-3 ${
                    idx === 0 ? "" : "border-t border-[#E2DDD6]"
                  }`}
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={p.imageUrl || "/placeholder.svg"}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#1C1C1C]">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">${p.price} MXN</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={p.available}
                    aria-label={`${p.name} ${p.available ? "disponible" : "no disponible"}`}
                    onClick={() => onToggle(p.id, p.available)}
                    className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors duration-150 min-h-[44px] min-w-[56px] ${
                      p.available ? "bg-[#2D7A3A]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-150 ${
                        p.available ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
