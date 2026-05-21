import type { Metadata, Viewport } from "next"
import { Nunito, Dancing_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
  display: "swap",
})

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "CafePotros — Pide antes, recoge a tiempo",
  description:
    "Pre-ordena tu comida y cafe en la cafeteria del Instituto Tecnologico de Sonora. Pide antes, recoge a tiempo.",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CafePotros",
  },
}

export const viewport: Viewport = {
  themeColor: "#1C1C1C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-MX"
      suppressHydrationWarning
      className={`${nunito.variable} ${dancing.variable} bg-[#F7F5F0]`}
    >
      <body className="bg-[#F7F5F0] text-[#1C1C1C] font-sans">
        <CartProvider>
          <div className="mobile-shell">{children}</div>
        </CartProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
