"use client"

type Tab = "menu" | "pedidos" | "cuenta"

type BottomNavProps = {
  active: Tab
  onChange: (tab: Tab) => void
}

const ITEMS: { id: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: "menu",
    label: "Menú",
    icon: () => (
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
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "pedidos",
    label: "Mis pedidos",
    icon: () => (
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
        <path d="M6 2h9l5 5v13a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2V4a2 2 0 0 1 2 -2z" />
        <path d="M14 2v5h5" />
        <path d="M8 12h8" />
        <path d="M8 16h6" />
      </svg>
    ),
  },
  {
    id: "cuenta",
    label: "Cuenta",
    icon: () => (
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
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex h-[60px] w-full items-stretch bg-[#1C1C1C]"
      aria-label="Navegación principal"
    >
      {ITEMS.map((item) => {
        const isActive = item.id === active
        const color = isActive ? "#E8A020" : "#9A9A9A"
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-150"
            style={{ color }}
            aria-current={isActive ? "page" : undefined}
          >
            {item.icon(isActive)}
            <span className="text-[11px] font-semibold">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
