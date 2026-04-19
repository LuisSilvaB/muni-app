"use client"

import { AuthForm } from "@/components/ui/auth-form"
import { Navbar } from "@/components/ui/navbar"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { user, isHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && user) {
      router.push("/dashboard")
    }
  }, [user, isHydrated, router])

  if (!isHydrated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <main className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
              <p className="text-slate-600 mt-2">Regístrate para comenzar a gestionar tu producción</p>
            </div>

            <AuthForm mode="register" />

            <div className="mt-6 text-center text-sm text-slate-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}