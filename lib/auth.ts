"use client"

const USER_KEY = "cafeteria_user"

export type Session = {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
}

export function saveSession(user: Session) {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}

export function isValidEmail(email: string): boolean {
  const e = email.trim().toLowerCase()
  return (
    e.endsWith("@potros.itson.edu.mx") ||
    e.endsWith("@itson.edu.mx")
  )
}

export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === "cafeteria@itson.edu.mx"
}
