"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/Header"
import { useCart } from "@/lib/cart-context"
import { getSession, type Session } from "@/lib/auth"
import { createOrder } from "@/lib/db"
import { PICKUP_TIMES, type PickupTimeId } from "@/lib/mockData"

export default function CartPage() {
  const router = useRouter()
  const { items, subtotal, updateQuantity, clear } = useCart()
  const [session, setSession] = useState<Session | null>(null)
  const [pickup, setPickup] = useState<PickupTimeId>("30")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const s = getSession()
    if (!s) {
      router.replace("/login")
      return
    }
    setSession(s)
  }, [router])

  async function handleConfirm() {
    if (!session || items.length === 0) return
    setSubmitting(true)

    try {
      // 1. Armamos el objeto con los datos crudos (con posibles undefineds)
      const rawOrderData = {
        userId: session.id,
        userName: session.name,
        items,
        total: subtotal,
        pickupTime: pickup,
        createdAt: new Date().toISOString(),
        status: "recibido",
        note: note.trim() || undefined,
      }

      // 2. MAGIA: Convertimos a string y de vuelta a JSON.
      // Esto elimina automáticamente cualquier propiedad que valga `undefined` 
      // (ya sea la nota, o el selectedSize dentro de algún item).
      const cleanOrderData = JSON.parse(JSON.stringify(rawOrderData))

      // 3. Mandamos el objeto limpio a Firebase
      const order = await createOrder(cleanOrderData)

      clear()
      router.replace(`/order/${order.id}`)
    } catch (err) {
      console.log("[v0] Error creating order:", err)
      setSubmitting(false)
    }
  }
  if (!session) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-sm text-[#6B6B6B]">Cargando...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0]">
        <Header showBack title="Tu carrito" />
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-[#E2DDD6]">
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="1.5">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2 -1.5L21 8H6" />
            </svg>
          </div>
          <p className="text-base font-bold text-[#1C1C1C]">
            Tu carrito esta vacio
          </p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Agrega productos desde el menu para hacer tu pedido.
          </p>
          <Link
            href="/menu"
            className="mt-5 rounded-lg bg-[#E8A020] px-6 py-3 text-sm font-extrabold text-white transition-colors duration-150 hover:bg-[#C4841A]"
          >
            Ir al menu
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0] pb-28">
      <Header showBack title="Tu carrito" />

      <main className="flex-1 px-4 pt-4">
        {/* Items list */}
        <section className="flex flex-col gap-3" aria-label="Articulos del pedido">
          {items.map((it) => {
            const customizations = [it.selectedSize, it.selectedFlavor]
              .filter(Boolean)
              .join(" · ")
            const extras = it.selectedExtras?.join(", ") ?? ""
            return (
              <article
                key={it.cartItemId}
                className="rounded-lg border border-[#E2DDD6] bg-white p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={it.imageUrl || "/placeholder.svg"}
                      alt={it.productName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-[#1C1C1C] leading-snug">
                      {it.productName}
                    </p>
                    {customizations ? (
                      <p className="text-xs text-[#6B6B6B]">
                        {customizations}
                      </p>
                    ) : null}
                    {extras ? (
                      <p className="text-xs text-[#6B6B6B]">{extras}</p>
                    ) : null}
                    {it.note ? (
                      <p className="mt-0.5 text-xs italic text-[#6B6B6B]">
                        Nota: {it.note}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-sm font-extrabold text-[#1C1C1C]">
                    ${it.price * it.quantity}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(it.cartItemId, it.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2DDD6] bg-white text-base font-bold text-[#1C1C1C] transition-colors duration-150 hover:border-[#1C1C1C]"
                      aria-label={`Quitar uno de ${it.productName}`}
                    >
                      -
                    </button>
                    <span
                      className="min-w-[20px] text-center text-sm font-bold"
                      aria-live="polite"
                    >
                      {it.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(it.cartItemId, it.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2DDD6] bg-white text-base font-bold text-[#1C1C1C] transition-colors duration-150 hover:border-[#1C1C1C]"
                      aria-label={`Agregar uno de ${it.productName}`}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-[#6B6B6B]">
                    ${it.price} c/u
                  </p>
                </div>
              </article>
            )
          })}
        </section>

        {/* Pickup time */}
        <section className="mt-6 rounded-lg border border-[#E2DDD6] bg-white p-4">
          <h2 className="text-sm font-extrabold text-[#1C1C1C]">
            Cuando pasas a recoger?
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {PICKUP_TIMES.map((p) => {
              const isActive = p.id === pickup
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPickup(p.id)}
                  className={`rounded-lg border px-2 py-2 text-sm font-bold transition-colors duration-150 ${
                    isActive
                      ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
                      : "border-[#E2DDD6] bg-white text-[#1C1C1C] hover:border-[#1C1C1C]"
                  }`}
                  aria-pressed={isActive}
                >
                  {p.short}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-[#6B6B6B] leading-relaxed">
            Recibiras una notificacion cuando tu pedido este listo. Paga en caja
            al recoger.
          </p>
        </section>

        {/* Note */}
        <section className="mt-4">
          <label
            htmlFor="cart-note"
            className="text-xs font-bold text-[#1C1C1C]"
          >
            Nota para la cafeteria (opcional)
          </label>
          <textarea
            id="cart-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Algo que quieras avisar al equipo de cocina?"
            rows={2}
            maxLength={160}
            className="mt-1.5 w-full resize-none rounded-lg border border-[#E2DDD6] bg-white px-3 py-2 text-sm text-[#1C1C1C] placeholder:text-[#9A9A9A] outline-none transition-colors duration-150 focus:border-[#E8A020]"
          />
        </section>

        {/* Totals */}
        <section className="mt-6 rounded-lg border border-[#E2DDD6] bg-white p-4">
          <div className="flex items-center justify-between text-sm text-[#1C1C1C]">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal} MXN</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#E2DDD6] pt-3">
            <span className="text-base font-extrabold text-[#1C1C1C]">
              Total
            </span>
            <span className="text-lg font-extrabold text-[#1C1C1C]">
              ${subtotal} MXN
            </span>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex w-full gap-2 border-t border-[#E2DDD6] bg-white px-3 py-3">
        <Link
          href="/menu"
          className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#E2DDD6] bg-white text-sm font-extrabold text-[#1C1C1C] transition-colors duration-150 hover:bg-[#F7F5F0]"
        >
          Agregar mas
        </Link>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting}
          className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#E8A020] text-sm font-extrabold text-white transition-colors duration-150 hover:bg-[#C4841A] disabled:opacity-60"
        >
          {submitting ? "Confirmando..." : `Confirmar $${subtotal}`}
        </button>
      </footer>
    </div>
  )
}
