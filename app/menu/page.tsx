"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/Header"
import { BottomNav } from "@/components/BottomNav"
import { ProductCard } from "@/components/ProductCard"
import { CATEGORIES, type Product, type Order } from "@/lib/mockData"
import { subscribeToAvailability, subscribeToOrders } from "@/lib/db"
import { PRODUCTS } from "@/lib/mockData"
import { clearSession, getSession, type Session } from "@/lib/auth"

type Tab = "menu" | "pedidos" | "cuenta"

export default function MenuPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("menu")
  const [prevTab, setPrevTab] = useState<Tab>("menu")
  const [session, setSession] = useState<Session | null>(null)
  const [availability, setAvailability] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState<string>(CATEGORIES[0].id)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Auth gate
  useEffect(() => {
    const s = getSession()
    if (!s) {
      router.replace("/login")
      return
    }
    if (s.role === "admin") {
      router.replace("/admin")
      return
    }
    setSession(s)

    const unsub = subscribeToAvailability((map) => {
      setAvailability(map)
      setLoading(false)
    })

    return unsub
  }, [router])

  const products = useMemo(() => {
    return PRODUCTS.map((p) =>
      p.id in availability ? { ...p, available: availability[p.id] } : p
    )
  }, [availability])

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {}
    for (const cat of CATEGORIES) map[cat.id] = []
    for (const p of products) {
      if (map[p.category]) map[p.category].push(p)
    }
    return map
  }, [products])

  function scrollToCategory(catId: string) {
    setActiveCat(catId)
    const el = sectionRefs.current[catId]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  function handleTabChange(newTab: Tab) {
    setPrevTab(tab)
    setTab(newTab)
  }

  // Direction for animation
  const tabOrder: Tab[] = ["menu", "pedidos", "cuenta"]
  const direction = tabOrder.indexOf(tab) > tabOrder.indexOf(prevTab) ? "left" : "right"

  if (!session) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-sm text-[#6B6B6B]">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0] pb-[60px]">
      {tab === "menu" ? (
        <div key="menu" className={`flex flex-col flex-1 ${direction === "left" ? "animate-slide-left" : "animate-slide-right"}`}>
          <Header showLogo title="CafePotros" showCart />
          <CategoryStrip
            active={activeCat}
            onSelect={scrollToCategory}
          />
          <main className="flex-1 px-4 pb-6">
            {loading ? (
              <MenuSkeleton />
            ) : (
              CATEGORIES.map((cat) => {
                const list = grouped[cat.id] ?? []
                if (list.length === 0) return null
                return (
                  <section
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    ref={(el) => {
                      sectionRefs.current[cat.id] = el
                    }}
                    className="scroll-mt-28 pt-5"
                    aria-labelledby={`heading-${cat.id}`}
                  >
                    <h2
                      id={`heading-${cat.id}`}
                      className="mb-3 inline-block text-lg font-extrabold text-[#1C1C1C] border-b-[3px] border-[#E8A020] pb-1"
                    >
                      {cat.label}
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 md:gap-4">
                      {list.map((p) => (
                        <ProductCard key={p.id} product={p} compact />
                      ))}
                    </div>
                  </section>
                )
              })
            )}
          </main>
        </div>
      ) : null}

      {tab === "pedidos" ? (
        <div key="pedidos" className={`flex flex-col flex-1 ${direction === "left" ? "animate-slide-left" : "animate-slide-right"}`}>
          <Header showLogo title="Mis pedidos" />
          <PedidosTab userId={session.id} />
        </div>
      ) : null}

      {tab === "cuenta" ? (
        <div key="cuenta" className={`flex flex-col flex-1 ${direction === "left" ? "animate-slide-left" : "animate-slide-right"}`}>
          <Header showLogo title="Mi cuenta" />
          <CuentaTab
            session={session}
            onLogout={() => {
              clearSession()
              router.replace("/login")
            }}
          />
        </div>
      ) : null}

      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  )
}

function MenuSkeleton() {
  return (
    <div className="pt-5">
      <div className="h-4 w-24 rounded animate-skeleton mb-3" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="rounded-lg border border-[#E2DDD6] bg-white overflow-hidden">
            <div className="aspect-square w-full animate-skeleton" />
            <div className="p-2 space-y-1">
              <div className="h-3 w-3/4 rounded animate-skeleton" />
              <div className="h-4 w-12 rounded animate-skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryStrip({
  active,
  onSelect,
}: {
  active: string
  onSelect: (id: string) => void
}) {
  const prevActive = useRef(active)
  
  useEffect(() => {
    prevActive.current = active
  }, [active])

  return (
    <div className="sticky top-14 z-20 bg-[#F7F5F0] shadow-sm">
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto px-3 py-2.5">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === active
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-[#1C1C1C] text-white shadow-md"
                  : "bg-white text-[#6B6B6B] border border-[#E2DDD6] hover:border-[#1C1C1C] hover:text-[#1C1C1C]"
              }`}
              aria-pressed={isActive}
            >
              <span className="text-sm" aria-hidden="true">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PedidosTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showPastOrders, setShowPastOrders] = useState(false)

  useEffect(() => {
    const unsub = subscribeToOrders((allOrders) => {
      // Filter to only this user's orders
      const userOrders = allOrders.filter((o) => o.userId === userId)
      setOrders(userOrders)
      setLoading(false)
    })
    return unsub
  }, [userId])

  const active = orders.filter((o) => o.status !== "listo")
  const completed = orders.filter((o) => o.status === "listo")

  if (loading) {
    return (
      <main className="flex-1 px-4 py-4">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-[#E2DDD6] bg-white p-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded animate-skeleton" />
                  <div className="h-8 w-20 rounded animate-skeleton" />
                </div>
                <div className="h-6 w-24 rounded animate-skeleton" />
              </div>
              <div className="mt-3 h-4 w-full rounded animate-skeleton" />
            </div>
          ))}
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-[#E2DDD6]">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="1.5">
            <path d="M6 2h9l5 5v13a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2V4a2 2 0 0 1 2 -2z" />
            <path d="M14 2v5h5" />
            <path d="M8 12h8" />
            <path d="M8 16h6" />
          </svg>
        </div>
        <p className="text-base font-bold text-[#1C1C1C]">
          Aun no tienes pedidos
        </p>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Haz tu primer pedido desde el menu!
        </p>
        <Link
          href="/menu"
          className="mt-5 rounded-lg bg-[#E8A020] px-6 py-3 text-sm font-extrabold text-white transition-colors duration-150 hover:bg-[#C4841A]"
        >
          Ver el menu
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 px-4 py-4">
      {/* Active orders - always visible and prominent */}
      {active.length > 0 ? (
        <section className="mb-5">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#6B6B6B]">
            Pedidos activos
          </h2>
          <div className="flex flex-col gap-3">
            {active.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mb-5 rounded-lg border border-dashed border-[#E2DDD6] bg-white px-4 py-6 text-center">
          <p className="text-sm text-[#6B6B6B]">No tienes pedidos activos</p>
        </div>
      )}

      {/* Past orders - hidden in dropdown */}
      {completed.length > 0 ? (
        <section>
          <button
            type="button"
            onClick={() => setShowPastOrders((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-[#E2DDD6] bg-white px-4 py-3 text-left transition-colors duration-150 hover:bg-[#F7F5F0]"
            aria-expanded={showPastOrders}
          >
            <span className="text-sm font-extrabold text-[#1C1C1C]">
              Pedidos anteriores ({completed.length})
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
              className={`transition-transform duration-200 ${showPastOrders ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path d="M6 9l6 6l6 -6" />
            </svg>
          </button>
          {showPastOrders ? (
            <div className="mt-3 flex flex-col gap-3">
              {completed.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  )
}

function OrderRow({ order }: { order: Order }) {
  const isActive = order.status !== "listo"
  
  const statusLabel =
    order.status === "recibido"
      ? "Recibido"
      : order.status === "en-preparacion"
        ? "En preparacion"
        : "Listo"

  // Colors based on status
  const statusStyles = 
    order.status === "listo"
      ? "bg-[#E7F3EA] text-[#2D7A3A]"
      : order.status === "en-preparacion"
        ? "bg-[#FFF1D6] text-[#C4841A]"
        : "bg-[#F0F0F0] text-[#6B6B6B]"

  const statusIcon =
    order.status === "listo" ? (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5l10 -10" />
      </svg>
    ) : order.status === "en-preparacion" ? (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ) : (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    )

  return (
    <Link
      href={`/order/${order.id}`}
      className={`block rounded-lg border bg-white p-4 transition-all duration-150 active:scale-[0.99] ${
        isActive ? "border-[#E8A020]/50 shadow-sm" : "border-[#E2DDD6]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
            Pedido
          </p>
          <p className="text-2xl font-extrabold text-[#E8A020]">
            #{order.orderNumber}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold ${statusStyles}`}
        >
          {statusIcon}
          {statusLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-[#1C1C1C]">
        {order.items.length}{" "}
        {order.items.length === 1 ? "articulo" : "articulos"} ·{" "}
        <span className="font-bold">${order.total} MXN</span>
      </p>
      <p className="mt-0.5 text-xs text-[#6B6B6B] line-clamp-1">
        {order.items.map((i) => i.productName).join(", ")}
      </p>
    </Link>
  )
}

function CuentaTab({
  session,
  onLogout,
}: {
  session: Session
  onLogout: () => void
}) {
  return (
    <main className="flex-1 px-4 py-5">
      <section className="rounded-lg border border-[#E2DDD6] bg-white p-5 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#1C1C1C] text-2xl font-extrabold text-[#E8A020]">
          {session.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <p className="text-base font-extrabold text-[#1C1C1C]">
          {session.name}
        </p>
        <p className="text-xs text-[#6B6B6B] break-all">{session.email}</p>
        <span className="mt-2 inline-block rounded-md bg-[#FFF8EC] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#C4841A]">
          {session.role === "teacher" ? "Docente" : "Estudiante"}
        </span>
      </section>

      <section className="mt-4 rounded-lg border border-[#E2DDD6] bg-white p-4">
        <p className="text-xs font-semibold text-[#6B6B6B]">Aplicacion</p>
        <ul className="mt-2 divide-y divide-[#E2DDD6] text-sm">
          <li className="flex items-center justify-between py-2.5">
            <span className="text-[#1C1C1C]">Version</span>
            <span className="font-mono text-xs text-[#6B6B6B]">1.0.0 · POC</span>
          </li>
          <li className="flex items-center justify-between py-2.5">
            <span className="text-[#1C1C1C]">Campus</span>
            <span className="text-xs font-semibold text-[#1C1C1C]">
              Navojoa, Sonora
            </span>
          </li>
        </ul>
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="mt-5 h-12 w-full rounded-lg border border-[#C0392B] bg-white text-sm font-extrabold uppercase tracking-wide text-[#C0392B] transition-colors duration-150 hover:bg-[#FCEBE9]"
      >
        Cerrar sesion
      </button>

      <p className="mt-6 pb-2 text-center text-[11px] text-[#9A9A9A]">
        CafePotros · Pide antes, recoge a tiempo
      </p>
    </main>
  )
}
