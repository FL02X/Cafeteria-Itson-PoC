"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { OrderStatusBar } from "@/components/OrderStatusBar"
import { subscribeToOrder } from "@/lib/db"
import { getSession } from "@/lib/auth"
import type { Order } from "@/lib/mockData"

function formatPickupTime(createdAt: string, pickupTime: string): string {
  try {
    const created = new Date(createdAt)
    const minutes = Number.parseInt(pickupTime, 10) || 30
    const ready = new Date(created.getTime() + minutes * 60_000)
    return ready.toLocaleTimeString("es-MX", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } catch {
    return ""
  }
}

export default function OrderStatusPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login")
      return
    }
    if (!id) return

    const unsub = subscribeToOrder(id, (found) => {
      if (!found) {
        setNotFound(true)
      } else {
        setOrder(found)
      }
      setLoading(false)
    })

    return unsub
  }, [id, router])

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-center bg-[#1C1C1C] text-white">
          <Logo variant="light" size="sm" />
        </header>
        <main className="flex-1 px-4 py-5">
          <div className="rounded-lg bg-[#E8A020] p-5">
            <div className="mx-auto h-14 w-14 rounded-full animate-skeleton bg-white/20" />
            <div className="mt-3 mx-auto h-8 w-48 rounded animate-skeleton bg-white/20" />
          </div>
          <div className="mt-4 rounded-lg border border-[#E2DDD6] bg-white p-5">
            <div className="h-4 w-32 rounded animate-skeleton mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full animate-skeleton" />
                  <div className="h-4 w-32 rounded animate-skeleton" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (notFound) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#F7F5F0] px-6 text-center">
        <p className="text-base font-bold text-[#1C1C1C]">
          Pedido no encontrado
        </p>
        <Link
          href="/menu"
          className="mt-4 rounded-lg bg-[#E8A020] px-5 py-3 text-sm font-extrabold text-white"
        >
          Volver al menu
        </Link>
      </main>
    )
  }

  if (!order) return null

  const pickupAt = formatPickupTime(order.createdAt, order.pickupTime)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0]">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-center bg-[#1C1C1C] text-white">
        <Logo variant="light" size="sm" />
      </header>

      <main className="flex-1 px-4 py-5">
        {/* Confirmation banner */}
        <section className={`rounded-lg p-5 text-center text-white ${
          order.status === "listo" ? "bg-[#2D7A3A]" : "bg-[#E8A020]"
        }`}>
          <div className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full ${
            order.status === "listo" ? "bg-white/20" : "bg-white/20"
          }`}>
            {order.status === "listo" ? (
              <svg
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5l10 -10" />
              </svg>
            ) : (
              <svg
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3l5 -6" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-extrabold leading-tight">
            {order.status === "listo" 
              ? "Listo para recoger!" 
              : order.status === "en-preparacion"
                ? "En preparacion..."
                : "Pedido recibido!"}
          </h1>
          <p className="text-sm opacity-90">Pedido #{order.orderNumber}</p>
        </section>

        {/* Status card */}
        <section className="mt-4 rounded-lg border border-[#E2DDD6] bg-white p-5">
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-[#6B6B6B]">
            Estado de tu pedido
          </h2>
          <OrderStatusBar status={order.status} />
          {pickupAt && order.status !== "listo" ? (
            <p className="mt-4 rounded-md bg-[#F7F5F0] px-3 py-2 text-xs text-[#1C1C1C]">
              Recoge aproximadamente a las{" "}
              <span className="font-extrabold">{pickupAt}</span>
            </p>
          ) : null}
        </section>

        {/* Order summary */}
        <section className="mt-4 rounded-lg border border-[#E2DDD6] bg-white p-4">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#6B6B6B]">
            Resumen del pedido
          </h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((it) => {
              const custom = [it.selectedSize, it.selectedFlavor]
                .filter(Boolean)
                .join(" · ")
              return (
                <li key={it.cartItemId} className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1C1C1C]">
                      <span className="text-[#E8A020]">{it.quantity}x</span>{" "}
                      {it.productName}
                    </p>
                    {custom ? (
                      <p className="text-xs text-[#6B6B6B]">{custom}</p>
                    ) : null}
                    {it.selectedExtras && it.selectedExtras.length > 0 ? (
                      <p className="text-xs text-[#6B6B6B]">
                        {it.selectedExtras.join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 font-bold text-[#1C1C1C]">
                    ${it.price * it.quantity}
                  </p>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-[#E2DDD6] pt-3">
            <span className="text-sm font-extrabold text-[#1C1C1C]">Total</span>
            <span className="text-base font-extrabold text-[#1C1C1C]">
              ${order.total} MXN
            </span>
          </div>
        </section>

        {/* Pickup info */}
        <section className="mt-4 rounded-lg border border-[#E8A020]/30 bg-[#FFF8EC] p-4">
          <p className="flex items-start gap-2 text-sm text-[#1C1C1C]">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
              <path d="M12 21a9 9 0 1 0 0 -18a9 9 0 0 0 0 18z" />
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            </svg>
            <span>Pasa a recoger en CafePotros, Campus Navojoa</span>
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm text-[#1C1C1C]">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
            </svg>
            <span>El pago es en caja al momento de recoger</span>
          </p>
          <div className="mt-4 rounded-lg border border-[#E8A020]/40 bg-white p-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B6B6B]">
              Di tu numero en caja
            </p>
            <p className="text-3xl font-extrabold text-[#E8A020]">
              #{order.orderNumber}
            </p>
          </div>
        </section>

        <Link
          href="/menu"
          className="mt-5 mb-2 flex h-12 w-full items-center justify-center rounded-lg border border-[#1C1C1C] bg-white text-sm font-extrabold text-[#1C1C1C] transition-colors duration-150 hover:bg-[#1C1C1C] hover:text-white"
        >
          Pedir algo mas
        </Link>
      </main>
    </div>
  )
}
