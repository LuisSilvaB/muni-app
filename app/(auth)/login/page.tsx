"use client"

import { AuthForm } from "@/components/ui/auth-form"
import { Navbar } from "@/components/ui/navbar"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar />
      
      <main className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Bienvenido</h1>
              <p className="text-slate-600 mt-2">Ingresa tus credenciales para continuar</p>
            </div>

            <AuthForm mode="login" />

            <div className="mt-6 text-center text-sm text-slate-600">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}