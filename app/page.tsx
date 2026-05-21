"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Logo } from "@/components/Logo"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace("/login")
    } else if (session.role === "admin") {
      router.replace("/admin")
    } else {
      router.replace("/menu")
    }
  }, [router])

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-[#F7F5F0] px-6 text-center">
      <Logo size="lg" />
      <p className="text-sm text-[#6B6B6B]">Cargando…</p>
    </div>
  )
}
