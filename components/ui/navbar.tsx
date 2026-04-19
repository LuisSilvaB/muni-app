"use client"

import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui"

export function Navbar() {
  const { user, signOut } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    signOut()
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">Muni App</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:block">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 rounded-lg shadow-lg">
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}