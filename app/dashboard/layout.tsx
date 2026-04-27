"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { useSidebarStore } from "@/lib/store/sidebar-store"
import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"
import { clsx } from "clsx"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, isHydrated } = useAuthStore()
  const { isCollapsed } = useSidebarStore()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login")
    }
  }, [user, isHydrated, router])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className={clsx(
        "transition-all duration-300",
        isCollapsed ? "pl-16" : "pl-64"
      )}>
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}