import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/store/auth-store"
import type { Incident, IncidentType, IncidentPriority, IncidentStatus } from "../types"

export function useIncidents(rootId?: string, filters?: { status?: string; type?: string; deviceId?: string }) {
  const { selectedRootId } = useAuthStore()
  const effectiveRootId = rootId || selectedRootId

  return useQuery<Incident[]>({
    queryKey: ["incidents", effectiveRootId, filters],
    queryFn: async () => {
      if (!effectiveRootId) return []
      const params = new URLSearchParams()
      params.set("rootId", effectiveRootId)
      if (filters?.status) params.set("status", filters.status)
      if (filters?.type) params.set("type", filters.type)
      if (filters?.deviceId) params.set("deviceId", filters.deviceId)
      const res = await fetch(`/api/incidents?${params}`)
      if (!res.ok) throw new Error("Error fetching incidents")
      return res.json()
    },
    enabled: !!effectiveRootId,
  })
}

export function useIncident(id: string) {
  return useQuery<Incident>({
    queryKey: ["incidents", id],
    queryFn: async () => {
      const res = await fetch(`/api/incidents/${id}`)
      if (!res.ok) throw new Error("Error fetching incident")
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateIncident() {
  const queryClient = useQueryClient()
  const { selectedRootId, user } = useAuthStore()

  return useMutation({
    mutationFn: async (data: Partial<Incident>) => {
      if (!selectedRootId || !user) throw new Error("No session")
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          rootId: selectedRootId,
          reportedById: user.id,
        }),
      })
      if (!res.ok) throw new Error("Error creating incident")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] })
    },
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Incident>) => {
      const updateData: Record<string, unknown> = { ...data }
      if (data.status === "RESOLVED" && data.solution) {
        updateData.resolved_at = new Date().toISOString()
      }
      if (data.status === "CLOSED") {
        updateData.closed_at = new Date().toISOString()
      }
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
      if (!res.ok) throw new Error("Error updating incident")
      return res.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] })
      queryClient.invalidateQueries({ queryKey: ["incidents", id] })
    },
  })
}

export function useDeleteIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/incidents/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error deleting incident")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] })
    },
  })
}

export { type Incident, type IncidentType, type IncidentPriority, type IncidentStatus }