"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/Header"
import { subscribeToAvailability } from "@/lib/db"
import { PRODUCTS, type Product } from "@/lib/mockData"
import { useCart } from "@/lib/cart-context"
import { getSession } from "@/lib/auth"

// Extras with explicit prices
const EXTRA_PRICES: Record<string, number> = {
  "extra-shot": 10,
  "leche-almendra": 12,
  aguacate: 10,
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [availability, setAvailability] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState<string | undefined>()
  const [flavor, setFlavor] = useState<string | undefined>()
  const [extras, setExtras] = useState<string[]>([])
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login")
      return
    }

    const unsub = subscribeToAvailability((map) => {
      setAvailability(map)
      setLoading(false)
    })

    return unsub
  }, [router])

  const product = useMemo(() => {
    if (!id) return undefined
    const base = PRODUCTS.find((p) => p.id === id)
    if (!base) return undefined
    if (id in availability) {
      return { ...base, available: availability[id] }
    }
    return base
  }, [id, availability])

  // Set defaults when product loads
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0 && !size) {
      setSize(product.sizes[0].id)
    }
    if (product?.flavors && product.flavors.length > 0 && !flavor) {
      setFlavor(product.flavors[0].id)
    }
  }, [product, size, flavor])

  const totalPrice = useMemo(() => {
    if (!product) return 0
    let p = product.price
    for (const eId of extras) {
      p += EXTRA_PRICES[eId] ?? 0
    }
    return p
  }, [product, extras])

  function toggleExtra(extraId: string) {
    setExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((e) => e !== extraId)
        : [...prev, extraId]
    )
  }

  function handleAddToCart() {
    if (!product) return
    if (product.sizes && product.sizes.length > 0 && !size) {
      setError("Selecciona un tamano antes de continuar")
      return
    }
    setError(null)

    const sizeLabel = product.sizes?.find((s) => s.id === size)?.label
    const flavorLabel = product.flavors?.find((f) => f.id === flavor)?.label
    const extraLabels = product.extras
      ? product.extras.filter((e) => extras.includes(e.id)).map((e) => e.label)
      : []

    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      price: totalPrice,
      unitPrice: product.price,
      quantity: 1,
      selectedSize: sizeLabel,
      selectedFlavor: flavorLabel,
      selectedExtras: extraLabels,
      note: note.trim() || undefined,
    })

    // Show feedback, then go back to menu
    setAddedFeedback(true)
    setTimeout(() => {
      router.push("/menu")
    }, 800)
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0]">
        <Header showBack title="Tu pedido" />
        <main className="flex-1 px-4 pt-4">
          <div className="rounded-lg border border-[#E2DDD6] bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="h-20 w-20 rounded-lg animate-skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-3/4 rounded animate-skeleton" />
                <div className="h-4 w-full rounded animate-skeleton" />
                <div className="h-5 w-20 rounded animate-skeleton" />
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="h-4 w-20 rounded animate-skeleton" />
            <div className="flex gap-2">
              <div className="h-10 w-24 rounded-lg animate-skeleton" />
              <div className="h-10 w-24 rounded-lg animate-skeleton" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <main className="flex min-h-[100dvh] flex-col bg-[#F7F5F0]">
        <Header showBack title="Producto" />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="text-base font-bold text-[#1C1C1C]">
            Producto no encontrado
          </p>
          <Link
            href="/menu"
            className="mt-4 rounded-lg bg-[#E8A020] px-5 py-3 text-sm font-extrabold text-white"
          >
            Volver al menu
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F7F5F0] pb-24">
      <Header showBack title="Tu pedido" showCart />

      {/* Toast feedback */}
      {addedFeedback ? (
        <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 animate-toast-up">
          <div className="rounded-lg bg-[#1C1C1C] px-4 py-3 text-sm font-bold text-white shadow-lg">
            Agregado al carrito
          </div>
        </div>
      ) : null}

      <main className="flex-1 px-4 pt-4">
        {/* Product summary card */}
        <section className="rounded-lg border border-[#E8A020]/30 bg-[#FFF8EC] p-4">
          <div className="flex items-start gap-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-extrabold leading-tight text-[#1C1C1C] text-balance">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-[#6B6B6B] text-pretty">
                {product.description}
              </p>
              <p className="mt-2 text-base font-extrabold text-[#E8A020]">
                ${product.price} MXN
              </p>
            </div>
          </div>
        </section>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 ? (
          <section className="mt-5">
            <h3 className="inline-block text-sm font-extrabold text-[#1C1C1C] border-b-[3px] border-[#E8A020] pb-1">
              Tamano
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isActive = s.id === size
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                      isActive
                        ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
                        : "border-[#E2DDD6] bg-white text-[#1C1C1C] hover:border-[#1C1C1C]"
                    }`}
                    aria-pressed={isActive}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </section>
        ) : null}

        {/* Flavors */}
        {product.flavors && product.flavors.length > 0 ? (
          <section className="mt-5">
            <h3 className="inline-block text-sm font-extrabold text-[#1C1C1C] border-b-[3px] border-[#E8A020] pb-1">
              Sabor
            </h3>
            <ul className="mt-3 overflow-hidden rounded-lg border border-[#E2DDD6] bg-white">
              {product.flavors.map((f, idx) => {
                const isActive = f.id === flavor
                return (
                  <li
                    key={f.id}
                    className={`${
                      idx === 0 ? "" : "border-t border-[#E2DDD6]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setFlavor(f.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#1C1C1C] transition-colors duration-150 hover:bg-[#F7F5F0]"
                      aria-pressed={isActive}
                    >
                      <span>{f.label}</span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-150 ${
                          isActive
                            ? "border-[#E8A020]"
                            : "border-[#E2DDD6]"
                        }`}
                        aria-hidden="true"
                      >
                        {isActive ? (
                          <span className="block h-2.5 w-2.5 rounded-full bg-[#E8A020]" />
                        ) : null}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        {/* Extras */}
        {product.extras && product.extras.length > 0 ? (
          <section className="mt-5">
            <h3 className="inline-block text-sm font-extrabold text-[#1C1C1C] border-b-[3px] border-[#E8A020] pb-1">
              Extras
            </h3>
            <ul className="mt-3 overflow-hidden rounded-lg border border-[#E2DDD6] bg-white">
              {product.extras.map((e, idx) => {
                const isChecked = extras.includes(e.id)
                return (
                  <li
                    key={e.id}
                    className={`${
                      idx === 0 ? "" : "border-t border-[#E2DDD6]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleExtra(e.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#1C1C1C] transition-colors duration-150 hover:bg-[#F7F5F0]"
                      aria-pressed={isChecked}
                    >
                      <span>{e.label}</span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors duration-150 ${
                          isChecked
                            ? "border-[#E8A020] bg-[#E8A020]"
                            : "border-[#E2DDD6] bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        {isChecked ? (
                          <svg
                            width={12}
                            height={12}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        ) : null}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        {/* Note */}
        <section className="mt-5">
          <h3 className="inline-block text-sm font-extrabold text-[#1C1C1C] border-b-[3px] border-[#E8A020] pb-1">
            Nota especial
          </h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Algun comentario para tu pedido..."
            rows={2}
            className="mt-3 w-full resize-none rounded-lg border border-[#E2DDD6] bg-white px-3 py-2 text-sm text-[#1C1C1C] placeholder:text-[#9A9A9A] outline-none transition-colors duration-150 focus:border-[#E8A020]"
            maxLength={140}
          />
        </section>

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-md bg-[#FCEBE9] px-3 py-2 text-xs font-semibold text-[#C0392B]"
          >
            {error}
          </p>
        ) : null}
      </main>

      {/* Footer actions */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex w-full gap-2 border-t border-[#E2DDD6] bg-white px-3 py-3">
        <Link
          href="/menu"
          className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#E2DDD6] bg-white text-sm font-extrabold text-[#1C1C1C] transition-colors duration-150 hover:bg-[#F7F5F0]"
        >
          Cancelar
        </Link>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addedFeedback}
          className={`flex h-12 flex-1 items-center justify-center rounded-lg text-sm font-extrabold text-white transition-all duration-150 ${
            addedFeedback
              ? "bg-[#2D7A3A]"
              : "bg-[#E8A020] hover:bg-[#C4841A]"
          }`}
        >
          {addedFeedback ? "Agregado" : `Agregar $${totalPrice}`}
        </button>
      </footer>
    </div>
  )
}
