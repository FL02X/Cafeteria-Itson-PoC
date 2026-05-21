"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "./Logo"
import { useCart } from "@/lib/cart-context"
import { useEffect, useRef, useState } from "react"

type HeaderProps = {
  title?: string
  showBack?: boolean
  showCart?: boolean
  showLogo?: boolean
  rightSlot?: React.ReactNode
}

export function Header({
  title,
  showBack = false,
  showCart = false,
  showLogo = false,
  rightSlot,
}: HeaderProps) {
  const router = useRouter()
  const { itemCount } = useCart()
  const prevCount = useRef(itemCount)
  const [animate, setAnimate] = useState(false)

  // Trigger animation when count increases
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 300)
      return () => clearTimeout(timer)
    }
    prevCount.current = itemCount
  }, [itemCount])

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-3 bg-[#1C1C1C] text-white"
      role="banner"
    >
      <div className="flex items-center gap-2 w-1/4">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm font-semibold py-1 pr-2 -ml-1 transition-colors duration-150 hover:text-[#E8A020]"
            aria-label="Volver atras"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Atras</span>
          </button>
        ) : showLogo}
      </div>

      <div className="flex-1 text-center">
        {title ? (
          <h1 className="text-base font-bold tracking-tight truncate">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-2 w-1/4">
        {rightSlot}
        {showCart ? (
          <Link
            href="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-white/10"
            aria-label={`Ver carrito (${itemCount} articulos)`}
          >
            <svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2 -1.5L21 8H6" />
            </svg>
            {itemCount > 0 ? (
              <span
                className={`absolute -top-0.5 -right-0.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#E8A020] px-1 text-[11px] font-bold text-[#1C1C1C] ${
                  animate ? "animate-badge-pulse" : ""
                }`}
                aria-hidden="true"
              >
                {itemCount}
              </span>
            ) : null}
          </Link>
        ) : null}
      </div>
    </header>
  )
}
