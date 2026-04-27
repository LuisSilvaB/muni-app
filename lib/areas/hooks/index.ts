import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/store/auth-store"
import type { Area } from "../types"

export function useAreas(rootId?: string) {
  const { selectedRootId } = useAuthStore()
  const effectiveRootId = rootId || selectedRootId

  return useQuery<Area[]>({
    queryKey: ["areas", effectiveRootId],
    queryFn: async () => {
      if (!effectiveRootId) return []
      const res = await fetch(`/api/areas?rootId=${effectiveRootId}`)
      if (!res.ok) throw new Error("Error fetching areas")
      return res.json()
    },
    enabled: !!effectiveRootId,
  })
}

export function useArea(id: string) {
  return useQuery<Area>({
    queryKey: ["areas", id],
    queryFn: async () => {
      const res = await fetch(`/api/areas/${id}`)
      if (!res.ok) throw new Error("Error fetching area")
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateArea() {
  const queryClient = useQueryClient()
  const { selectedRootId } = useAuthStore()

  return useMutation({
    mutationFn: async (data: Partial<Area>) => {
      if (!selectedRootId) throw new Error("No root selected")
      const res = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rootId: selectedRootId }),
      })
      if (!res.ok) throw new Error("Error creating area")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] })
    },
  })
}

export function useUpdateArea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Area>) => {
      const res = await fetch(`/api/areas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error updating area")
      return res.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["areas"] })
      queryClient.invalidateQueries({ queryKey: ["areas", id] })
    },
  })
}

export function useDeleteArea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/areas/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error deleting area")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] })
    },
  })
}