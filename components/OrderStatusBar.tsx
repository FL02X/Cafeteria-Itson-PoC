"use client"

import type { OrderStatus } from "@/lib/mockData"

type OrderStatusBarProps = {
  status: OrderStatus
}

const STEPS: { id: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { 
    id: "recibido", 
    label: "Recibido",
    icon: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    )
  },
  { 
    id: "en-preparacion", 
    label: "En preparacion",
    icon: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    )
  },
  { 
    id: "listo", 
    label: "Listo para recoger",
    icon: (
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5l10 -10" />
      </svg>
    )
  },
]

function statusIndex(status: OrderStatus) {
  return STEPS.findIndex((s) => s.id === status)
}

export function OrderStatusBar({ status }: OrderStatusBarProps) {
  const currentIdx = statusIndex(status)

  return (
    <ol className="relative flex flex-col gap-0" aria-label="Estado del pedido">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIdx
        const isCurrent = i === currentIdx
        const isLast = i === STEPS.length - 1

        // Circle styles with transitions
        let circleClass = "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 status-step"
        let labelClass = "text-sm transition-colors duration-300"

        if (isCompleted) {
          circleClass += " bg-[#2D7A3A] text-white"
          labelClass += " text-[#2D7A3A] font-bold"
        } else if (isCurrent) {
          if (status === "listo") {
            circleClass += " bg-[#2D7A3A] text-white ring-4 ring-[#2D7A3A]/15"
            labelClass += " text-[#2D7A3A] font-extrabold"
          } else {
            circleClass += " bg-[#E8A020] text-white ring-4 ring-[#E8A020]/15"
            labelClass += " text-[#1C1C1C] font-extrabold"
          }
        } else {
          circleClass += " border-2 border-[#E2DDD6] bg-white text-[#9A9A9A]"
          labelClass += " text-[#9A9A9A] font-semibold"
        }

        const lineColor = isCompleted ? "bg-[#2D7A3A]" : "bg-[#E2DDD6]"

        return (
          <li
            key={step.id}
            className="relative flex items-start gap-3 pb-4 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <span className={circleClass} aria-hidden="true">
                {isCompleted || (isCurrent && status === "listo") ? (
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5l10 -10" />
                  </svg>
                ) : isCurrent ? (
                  step.icon
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </span>
              {!isLast ? (
                <span
                  className={`mt-1 h-8 w-0.5 transition-colors duration-300 ${lineColor}`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className="flex-1 pt-1">
              <p className={labelClass}>{step.label}</p>
              {isCurrent && status !== "listo" ? (
                <p className="text-xs text-[#6B6B6B]">
                  Tu pedido esta siendo procesado...
                </p>
              ) : null}
              {isCurrent && status === "listo" ? (
                <p className="text-xs text-[#2D7A3A] font-semibold">
                  Pasa a recoger en caja!
                </p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
