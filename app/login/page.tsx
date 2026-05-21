"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Logo } from "@/components/Logo"
import { saveSession, getSession } from "@/lib/auth"
import { MOCK_USER, MOCK_ADMIN_USER } from "@/lib/mockData"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

useEffect(() => {
    const existing = getSession()
    if (existing) {
      if (existing.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/menu")
      }
    }
  }, [router])

  function handleDemoLogin(type: "student" | "admin") {
    setLoading(true)
    const user = type === "admin" ? MOCK_ADMIN_USER : MOCK_USER
    saveSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "admin" ? "admin" : "student",
    })
    // Short delay for visual feedback
    setTimeout(() => {
      router.replace(type === "admin" ? "/admin" : "/menu")
    }, 400)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#1C1C1C]">
      {/* Top section with branding */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-10 pb-6">
        <div className="mb-4 relative h-20 w-20 rounded-full bg-[#E8A020]/10 flex items-center justify-center">
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E8A020"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
            <path d="M12 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
            <path d="M16 3c0 1.5 -1 1.5 -1 3s1 1.5 1 3" />
            <path d="M4 11h14v5a4 4 0 0 1 -4 4h-6a4 4 0 0 1 -4 -4v-5z" />
            <path d="M18 13h1.5a2.5 2.5 0 0 1 0 5H18" />
          </svg>
        </div>
        <Logo variant="light" size="lg" />
        <p className="mt-3 text-center text-sm text-white/60">
          La cafeteria de ITSON Campus Navojoa
        </p>
        <p className="mt-2 text-center text-base font-medium text-[#E8A020]">
          Pide antes, recoge a tiempo
        </p>
      </div>

      {/* Horizontal separator line */}
      <div className="h-px w-full bg-[#E8A020]/30" />

      {/* Login form section */}
      <div className="bg-white px-6 pt-8 pb-10">
        <h1 className="text-xl font-extrabold text-[#1C1C1C]">
          Entrar a CafePotros
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Selecciona un modo de acceso.
        </p>

        {/* Demo login buttons */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => handleDemoLogin("student")}
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#E8A020] text-sm font-bold text-white transition-all duration-150 hover:bg-[#C4841A] disabled:opacity-60"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
            </svg>
            <span>Entrar como estudiante</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("admin")}
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-[#1C1C1C] bg-white text-sm font-bold text-[#1C1C1C] transition-all duration-150 hover:bg-[#1C1C1C] hover:text-white disabled:opacity-60"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-16a1 1 0 0 1 1 -1z" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
              <path d="M9 8h6" />
            </svg>
            <span>Entrar al panel de cocina</span>
          </button>
        </div>

        {/* PWA install tip */}
        <p className="mt-8 text-center text-[11px] text-[#9A9A9A] leading-relaxed">
          Para la mejor experiencia, agrega esta app a tu pantalla de inicio.
        </p>
        
        <p className="mt-4 text-center text-[11px] text-[#9A9A9A]">
          CafePotros v1.0.0
        </p>
      </div>
    </div>
  )
}
