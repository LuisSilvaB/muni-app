import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/store/auth-store"
import type { Device, DeviceType, DeviceStatus } from "../types"

export function useDevices(rootId?: string, areaId?: string) {
  const { selectedRootId } = useAuthStore()
  const effectiveRootId = rootId || selectedRootId

  return useQuery<Device[]>({
    queryKey: ["devices", effectiveRootId, areaId],
    queryFn: async () => {
      if (!effectiveRootId) return []
      const params = new URLSearchParams()
      params.set("rootId", effectiveRootId)
      if (areaId) params.set("areaId", areaId)
      const res = await fetch(`/api/devices?${params}`)
      if (!res.ok) throw new Error("Error fetching devices")
      return res.json()
    },
    enabled: !!effectiveRootId,
  })
}

export function useDevice(id: string) {
  return useQuery<Device>({
    queryKey: ["devices", id],
    queryFn: async () => {
      const res = await fetch(`/api/devices/${id}`)
      if (!res.ok) throw new Error("Error fetching device")
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateDevice() {
  const queryClient = useQueryClient()
  const { selectedRootId } = useAuthStore()

  return useMutation({
    mutationFn: async (data: Partial<Device> & { areaId: string }) => {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rootId: selectedRootId }),
      })
      if (!res.ok) throw new Error("Error creating device")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Device>) => {
      const res = await fetch(`/api/devices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Error updating device")
      return res.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
      queryClient.invalidateQueries({ queryKey: ["devices", id] })
    },
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/devices/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error deleting device")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}

export { type Device, type DeviceType, type DeviceStatus }