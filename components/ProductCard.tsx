"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/mockData"

type ProductCardProps = {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const isAvailable = product.available
  
  const card = (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-lg border border-[#E2DDD6] bg-white transition-all duration-150 ${
        isAvailable ? "hover:shadow-md" : "pointer-events-none"
      }`}
    >
      <div className={`relative w-full overflow-hidden bg-[#F2EEE7] ${compact ? "aspect-[4/3]" : "aspect-square"}`}>
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          unoptimized
          className={`object-cover transition-transform duration-150 ${
            isAvailable ? "group-hover:scale-105" : "grayscale"
          }`}
          sizes={compact ? "(max-width: 430px) 33vw, 140px" : "(max-width: 430px) 50vw, 200px"}
        />
        {!isAvailable ? (
          <>
            <div
              className="absolute inset-0 bg-white/60"
              aria-hidden="true"
            />
            <span className={`absolute left-1 top-1 rounded bg-[#C0392B] px-1.5 py-0.5 font-bold uppercase tracking-wide text-white ${compact ? "text-[9px]" : "text-[11px]"}`}>
              Agotado
            </span>
          </>
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "gap-0.5 p-2" : "gap-1 p-3"}`}>
        <h3
          className={`line-clamp-2 font-bold leading-tight text-[#1C1C1C] ${compact ? "text-xs" : "text-sm"}`}
          title={product.name}
        >
          {product.name}
        </h3>
        <p className={`mt-auto font-extrabold text-[#E8A020] ${compact ? "text-sm" : "text-base"}`}>
          ${product.price}
        </p>
      </div>
    </article>
  )

  if (!isAvailable) {
    return <div aria-disabled="true">{card}</div>
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block transition-colors duration-150 active:scale-[0.98]"
      aria-label={`Ver ${product.name}`}
    >
      {card}
    </Link>
  )
}
