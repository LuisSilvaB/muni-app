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
import { useDevices } from '@/lib/devices/hooks'
import type { Incident, IncidentType, IncidentPriority, IncidentStatus } from '@/lib/incidents/types'

const incidentTypesMap: Record<IncidentType, string> = {
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
  NETWORK: 'Red',
  POWER: 'Energía',
  OTHER: 'Otro',
}

const incidentPrioritiesMap: Record<IncidentPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

const incidentStatusesMap: Record<IncidentStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En Progreso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
}

const incidentTypes = Object.keys(incidentTypesMap) as IncidentType[]
const incidentPriorities = Object.keys(incidentPrioritiesMap) as IncidentPriority[]
const incidentStatuses = Object.keys(incidentStatusesMap) as IncidentStatus[]

const incidentSchema = z.object({
  deviceId: z.string().min(1, 'El dispositivo es requerido'),
  type: z.enum(incidentTypes),
  priority: z.enum(incidentPriorities),
  status: z.enum(incidentStatuses).optional(),
  description: z.string().min(1, 'La descripción es requerida'),
  location: z.string().optional(),
  assignedToId: z.string().optional(),
  solution: z.string().optional(),
  observations: z.string().optional(),
})

export type IncidentFormData = z.infer<typeof incidentSchema>

interface IncidentFormProps {
  initialData?: Incident | null
  onSubmit: (data: IncidentFormData) => void
  isPending: boolean
}

export function IncidentForm({ initialData, onSubmit, isPending }: IncidentFormProps) {
  const router = useRouter()
  const { data: devices } = useDevices()
  
  const form = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      deviceId: initialData?.deviceId || '',
      type: (initialData?.type as IncidentType) || 'HARDWARE',
      priority: (initialData?.priority as IncidentPriority) || 'MEDIUM',
      status: (initialData?.status as IncidentStatus) || 'OPEN',
      description: initialData?.description || '',
      location: initialData?.location || '',
      assignedToId: initialData?.assignedToId || '',
      solution: initialData?.solution || '',
      observations: initialData?.observations || '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Dispositivo *</label>
           <Select 
             value={form.watch('deviceId')} 
             onValueChange={(v) => v && form.setValue('deviceId', v)}
           >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar equipo" />
            </SelectTrigger>
            <SelectContent>
              {devices?.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.deviceId && (
            <p className="text-sm text-red-500">{form.formState.errors.deviceId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo *</label>
           <Select 
             value={form.watch('type')} 
             onValueChange={(v) => v && form.setValue('type', v as IncidentType)}
           >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {incidentTypes.map(t => (
                <SelectItem key={t} value={t}>{incidentTypesMap[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Prioridad *</label>
           <Select 
             value={form.watch('priority')} 
             onValueChange={(v) => v && form.setValue('priority', v as IncidentPriority)}
           >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {incidentPriorities.map(p => (
                <SelectItem key={p} value={p}>{incidentPrioritiesMap[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción del problema *</label>
        <Textarea {...form.register('description')} rows={4} placeholder="Describa el problema detalladamente..." />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ubicación específica</label>
          <Input {...form.register('location')} placeholder="Ej. Oficina 203, segundo piso" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
           <Select 
             value={form.watch('status')} 
             onValueChange={(v) => v && form.setValue('status', v as IncidentStatus)}
           >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {incidentStatuses.map(s => (
                <SelectItem key={s} value={s}>{incidentStatusesMap[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {initialData && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-slate-900">Seguimiento y Resolución</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Técnico Asignado (ID)</label>
            <Input {...form.register('assignedToId')} placeholder="ID del técnico" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Solución aplicada</label>
            <Textarea {...form.register('solution')} rows={3} placeholder="Detalles de la reparación o solución..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Observaciones</label>
            <Textarea {...form.register('observations')} rows={2} />
          </div>
        </div>
      )}

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
