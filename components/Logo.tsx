type LogoProps = {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg"
}

export function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const color = variant === "light" ? "#ffffff" : "#1C1C1C"
  const textSize =
    size === "lg" ? "text-4xl" : size === "sm" ? "text-lg" : "text-2xl"
  const iconSize = size === "lg" ? 22 : size === "sm" ? 12 : 16

  return (
    <div
      className="inline-flex items-start gap-1 leading-none"
      style={{ color }}
      aria-label="CafePotros"
    >
      <span
        className={`font-script ${textSize}`}
        style={{
          fontFamily: "var(--font-dancing), cursive",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        CafePotros
      </span>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5"
        aria-hidden="true"
      >
        {/* Steam */}
        <path d="M8 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
        <path d="M12 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
        <path d="M16 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
        {/* Cup */}
        <path d="M4 11h14v5a4 4 0 0 1 -4 4h-6a4 4 0 0 1 -4 -4v-5z" />
        <path d="M18 13h1.5a2.5 2.5 0 0 1 0 5H18" />
      </svg>
    </div>
  )
}
