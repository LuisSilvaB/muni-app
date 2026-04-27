"use client"

import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
  mode?: "login" | "register"
}

export function AuthForm({ mode = "login" }: AuthFormProps) {
  return null
}