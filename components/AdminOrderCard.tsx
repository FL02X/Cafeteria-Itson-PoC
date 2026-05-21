"use client"

import type { Order } from "@/lib/mockData"

type AdminOrderCardProps = {
  order: Order
  onAdvance: (orderId: string) => void
}

function timeAgo(iso: string): string {
  try {
    const date = new Date(iso)
    const diffMs = Date.now() - date.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return "hace menos de 1 minuto"
    if (mins === 1) return "hace 1 minuto"
    if (mins < 60) return `hace ${mins} minutos`
    const hours = Math.floor(mins / 60)
    if (hours === 1) return "hace 1 hora"
    return `hace ${hours} horas`
  } catch {
    return ""
  }
}

function pickupLabel(p: string) {
  if (p === "15") return "Recoge en 15 min"
  if (p === "30") return "Recoge en 30 min"
  if (p === "60") return "Recoge en 1 hora"
  return `Recoge en ${p} min`
}

export function AdminOrderCard({ order, onAdvance }: AdminOrderCardProps) {
  const isCompleted = order.status === "listo"

  return (
    <article className="rounded-lg border border-[#E2DDD6] bg-white p-4 shadow-sm">
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
        <span className="rounded-md border border-[#E2DDD6] bg-[#F7F5F0] px-2 py-1 text-[11px] font-bold text-[#1C1C1C]">
          {pickupLabel(order.pickupTime)}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5 border-t border-[#E2DDD6] pt-3">
        {order.items.map((it) => (
          <li
            key={it.cartItemId}
            className="flex items-start justify-between gap-2 text-sm"
          >
            <div className="min-w-0">
              <p className="font-semibold text-[#1C1C1C]">
                <span className="text-[#E8A020]">{it.quantity}×</span>{" "}
                {it.productName}
              </p>
              {(it.selectedSize ||
                it.selectedFlavor ||
                (it.selectedExtras && it.selectedExtras.length > 0)) ? (
                <p className="text-xs text-[#6B6B6B]">
                  {[it.selectedSize, it.selectedFlavor]
                    .filter(Boolean)
                    .join(" · ")}
                  {it.selectedExtras && it.selectedExtras.length > 0
                    ? ` · ${it.selectedExtras.join(", ")}`
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
          className={`mt-3 w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition-colors duration-150 ${
            order.status === "recibido"
              ? "bg-[#E8A020] hover:bg-[#C4841A]"
              : "bg-[#2D7A3A] hover:bg-[#246030]"
          }`}
        >
          {order.status === "recibido"
            ? "→ Marcar En preparación"
            : "✓ Listo para recoger"}
        </button>
      ) : (
        <p className="mt-3 rounded-lg bg-[#E7F3EA] px-3 py-2 text-center text-xs font-bold text-[#2D7A3A]">
          Pedido entregado
        </p>
      )}
    </article>
  )
}
