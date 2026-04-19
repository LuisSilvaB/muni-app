"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "./button"
import { Input } from "./input"
import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"

type FormValues = {
  email: string
  password: string
  name: string
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState("")
  
  const { setUser } = useAuthStore()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    }
  })

  const onSubmit = async (data: FormValues) => {
    setError("")

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
      const body = mode === "login" 
        ? { email: data.email, password: data.password }
        : { email: data.email, password: data.password, name: data.name }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error en la autenticación")
      }

      setUser(result.user)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === "register" && (
        <Input
          label="Nombre completo"
          type="text"
          {...register("name", { required: "El nombre es obligatorio" })}
          error={errors.name?.message}
          placeholder="Juan Pérez"
        />
      )}
      
      <Input
        label="Correo electrónico"
        type="email"
        {...register("email", { 
          required: "El correo es obligatorio",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Correo inválido"
          }
        })}
        error={errors.email?.message}
        placeholder="correo@ejemplo.com"
      />
      
      <Input
        label="Contraseña"
        type="password"
        {...register("password", { 
          required: "La contraseña es obligatoria",
          minLength: {
            value: 6,
            message: "Mínimo 6 caracteres"
          }
        })}
        error={errors.password?.message}
        placeholder="••••••••"
      />

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isSubmitting}
      >
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </Button>
    </form>
  )
}