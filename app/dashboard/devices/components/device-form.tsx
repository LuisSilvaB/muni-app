"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAreas } from '@/lib/areas/hooks'
import type { Device, DeviceType, DeviceStatus } from '@/lib/devices/types'

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

const deviceTypes = Object.keys(deviceTypesMap) as DeviceType[]
const deviceStatuses = Object.keys(deviceStatusesMap) as DeviceStatus[]

const deviceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(deviceTypes),
  areaId: z.string().min(1, 'El área es requerida'),
  serialNumber: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  ipAddress: z.string().optional(),
  status: z.enum(deviceStatuses),
  notes: z.string().optional(),
})

export type DeviceFormData = z.infer<typeof deviceSchema>

interface DeviceFormProps {
  initialData?: Device | null
  onSubmit: (data: DeviceFormData) => void
  isPending: boolean
}

export function DeviceForm({ initialData, onSubmit, isPending }: DeviceFormProps) {
  const router = useRouter()
  const { data: areas } = useAreas()
  
  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: (initialData?.type as DeviceType) || 'COMPUTER',
      areaId: initialData?.areaId || '',
      serialNumber: initialData?.serialNumber || '',
      brand: initialData?.brand || '',
      model: initialData?.model || '',
      ipAddress: initialData?.ipAddress || '',
      status: (initialData?.status as DeviceStatus) || 'ACTIVE',
      notes: initialData?.notes || '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre *</label>
          <Input {...form.register('name')} placeholder="Ej. PC-01" />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo *</label>
          <Select 
            value={form.watch('type')} 
            onValueChange={(v) => form.setValue('type', v as DeviceType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {deviceTypesMap[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Área *</label>
                  <Select
                    value={form.watch("areaId")}
                    onValueChange={(v) => {
                      if (v) form.setValue("areaId", v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas?.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.areaId && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.areaId.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Serial</label>
                  <Input {...form.register("serialNumber")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca</label>
                  <Input {...form.register("brand")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Input {...form.register("model")} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">IP</label>
                  <Input {...form.register("ipAddress")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) =>
                      form.setValue("status", v as DeviceStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {deviceStatusesMap[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notas</label>
        <Textarea {...form.register('notes')} rows={3} placeholder="Notas adicionales..." />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="bg-teal-600 hover:bg-teal-700 min-w-[100px]">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
