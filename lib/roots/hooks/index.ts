import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Root } from "../types"

export function useRoots() {
  return useQuery<Root[]>({
    queryKey: ["roots"],
    queryFn: async () => {
      const res = await fetch("/api/roots")
      if (!res.ok) throw new Error("Error fetching municipalities")
      return res.json()
    },
  })
}

export function useRoot(id: string) {
  return useQuery<Root>({
    queryKey: ["roots", id],
    queryFn: async () => {
      const res = await fetch(`/api/roots/${id}`)
      if (!res.ok) throw new Error("Error fetching municipality")
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateRoot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Root>) => {
      const res = await fetch("/api/roots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error creating municipality")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roots"] })
    },
  })
}

export function useUpdateRoot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Root>) => {
      const res = await fetch(`/api/roots/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error updating municipality")
      return res.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["roots"] })
      queryClient.invalidateQueries({ queryKey: ["roots", id] })
    },
  })
}

export function useDeleteRoot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/roots/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error deleting municipality")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roots"] })
    },
  })
}
