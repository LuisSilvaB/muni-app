"use client"

import { useRouter } from "next/navigation"
import { useDevices, useDeleteDevice } from "@/lib/devices/hooks"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { DeviceType, DeviceStatus } from "@/lib/devices/types"

const deviceTypesMap: Record<DeviceType, string> = {
  COMPUTER: 'Computadora',
  PRINTER: 'Impresora',
  SERVER: 'Servidor',
  NETWORK: 'Red',
  OTHER: 'Otro',
}

const deviceStatusesMap: Record<DeviceStatus, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  MAINTENANCE: 'Mantenimiento',
  RETIRED: 'Retirado',
}

export default function DevicesPage() {
  const router = useRouter()
  const { data: devices, isLoading } = useDevices()
  const deleteDevice = useDeleteDevice()

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar dispositivo?")) return
    deleteDevice.mutate(id, {
      onSuccess: () => {
        toast.success("Dispositivo eliminado correctamente")
      },
      onError: () => {
        toast.error("Error al eliminar el dispositivo")
      }
    })
  }

  function viewIncidents(deviceId: string) {
    router.push(`/dashboard/incidencias?deviceId=${deviceId}`)
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dispositivos</h1>
        <Link href="/dashboard/devices/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Dispositivo
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Área</TableHead>
              <TableHead className="font-semibold">Marca</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices?.map((device) => (
              <TableRow key={device.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">{device.name}</TableCell>
                <TableCell className="text-slate-600">{deviceTypesMap[device.type as DeviceType] || device.type}</TableCell>
                <TableCell className="text-slate-600">{device.area?.name || "-"}</TableCell>
                <TableCell className="text-slate-600">{device.brand || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      device.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : device.status === "MAINTENANCE"
                          ? "bg-yellow-100 text-yellow-700"
                          : device.status === "RETIRED"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {deviceStatusesMap[device.status as DeviceStatus] || device.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewIncidents(device.id)}
                      title="Ver Incidencias"
                      className="text-slate-600 hover:text-orange-600"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                    <Link href={`/dashboard/devices/${device.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 hover:text-teal-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(device.id)}
                      className="text-slate-600 hover:text-red-600"
                      disabled={deleteDevice.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!devices || devices.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-slate-500"
                >
                  No hay dispositivos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
