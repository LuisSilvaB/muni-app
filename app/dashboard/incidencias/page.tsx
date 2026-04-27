"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAreas } from '@/lib/areas/hooks'
import { useDevices } from '@/lib/devices/hooks'
import { useIncidents, useCreateIncident, useUpdateIncident, useDeleteIncident } from '@/lib/incidents/hooks'
import type { Incident, IncidentType, IncidentPriority, IncidentStatus } from '@/lib/incidents/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react'

const incidentTypes: IncidentType[] = ['HARDWARE', 'SOFTWARE', 'NETWORK', 'POWER', 'OTHER']
const incidentPriorities: IncidentPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const incidentStatuses: IncidentStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

const incidentSchema = z.object({
  deviceId: z.string().min(1, 'El dispositivo es requerido'),
  type: z.enum(incidentTypes),
  priority: z.enum(incidentPriorities),
  description: z.string().min(1, 'La descripción es requerida'),
  location: z.string().optional(),
  assignedToId: z.string().optional(),
  solution: z.string().optional(),
  observations: z.string().optional(),
})

type IncidentFormData = z.infer<typeof incidentSchema>

function GetStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'OPEN': return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-yellow-500" />
    case 'RESOLVED': return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'CLOSED': return <XCircle className="h-4 w-4 text-gray-500" />
    default: return null
  }
}

function GetPriorityColor({ priority }: { priority: string }) {
  switch (priority) {
    case 'CRITICAL': return 'bg-red-100 text-red-700'
    case 'HIGH': return 'bg-orange-100 text-orange-700'
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-700'
    case 'LOW': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function IncidenciasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')

  const deviceIdFromUrl = searchParams.get('deviceId') || undefined
  const filters = { status: filterStatus || undefined, type: filterType || undefined, deviceId: deviceIdFromUrl }

  const { data: incidents, isLoading } = useIncidents(undefined, filters)
  const { data: devices } = useDevices()
  const { data: areas } = useAreas()
  const createIncident = useCreateIncident()
  const updateIncident = useUpdateIncident()
  const deleteIncident = useDeleteIncident()

  const form = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      deviceId: '', type: 'HARDWARE', priority: 'MEDIUM', description: '', location: '', assignedToId: '', solution: '', observations: ''
    },
  })

  const isPending = createIncident.isPending || updateIncident.isPending || deleteIncident.isPending

  function onSubmit(data: IncidentFormData) {
    const device = devices?.find(d => d.id === data.deviceId)
    const payload = {
      device_id: data.deviceId,
      area_id: device?.area_id || '',
      type: data.type,
      priority: data.priority,
      description: data.description,
      location: data.location || undefined,
      solution: data.solution || undefined,
      observations: data.observations || undefined,
      assigned_to_id: data.assignedToId || undefined,
    }
    if (editingIncident) {
      updateIncident.mutate({ id: editingIncident.id, ...payload })
    } else {
      createIncident.mutate(payload)
    }
  }

  function onOpenChange(open: boolean) {
    setOpen(open)
    if (!open) {
      setEditingIncident(null)
      form.reset({ deviceId: '', type: 'HARDWARE', priority: 'MEDIUM', description: '', location: '', assignedToId: '', solution: '', observations: '' })
    }
  }

  function startEdit(incident: Incident) {
    setEditingIncident(incident)
    form.reset({
      deviceId: incident.device_id,
      type: incident.type,
      priority: incident.priority,
      description: incident.description,
      location: incident.location || '',
      assignedToId: incident.assignee?.id || '',
      solution: incident.solution || '',
      observations: incident.observations || '',
    })
    setOpen(true)
  }

  function viewDetail(incident: Incident) {
    setSelectedIncident(incident)
    setShowDetail(true)
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Incidencias</h1>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" /> Nueva Incidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingIncident ? 'Editar' : 'Nueva'} Incidencia</DialogTitle>
              <DialogDescription>Reporte una nueva incidencia.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dispositivo *</label>
                  <Select value={form.watch('deviceId')} onValueChange={(v) => { if (v) form.setValue('deviceId', v) }}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {devices?.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.deviceId && (
                    <p className="text-sm text-red-500">{form.formState.errors.deviceId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo *</label>
                  <Select value={form.watch('type')} onValueChange={(v) => form.setValue('type', v as IncidentType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridad *</label>
                  <Select value={form.watch('priority')} onValueChange={(v) => form.setValue('priority', v as IncidentPriority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {incidentPriorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción del problema *</label>
                <Textarea {...form.register('description')} rows={3} />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ubicación</label>
                  <Input {...form.register('location')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asignar a (ID)</label>
                  <Input {...form.register('assignedToId')} placeholder="ID del técnico" />
                </div>
              </div>
              {editingIncident && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Solución</label>
                    <Textarea {...form.register('solution')} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observaciones</label>
                    <Textarea {...form.register('observations')} rows={2} />
                  </div>
                </>
              )}
              <DialogFooter>
                <Button type="submit" disabled={isPending} className="bg-teal-600 hover:bg-teal-700">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v || '')}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Todos los estados" /></SelectTrigger>
          <SelectContent>
            {incidentStatuses.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => setFilterType(v || '')}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Todos los tipos" /></SelectTrigger>
          <SelectContent>
            {incidentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Reportado por</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents?.map(incident => (
              <TableRow key={incident.id}>
                <TableCell><GetStatusIcon status={incident.status} /></TableCell>
                <TableCell>{incident.type}</TableCell>
                <TableCell>
                  <Badge className={GetPriorityColor({ priority: incident.priority })}>{incident.priority}</Badge>
                </TableCell>
                <TableCell className="font-medium">{incident.device?.name || '-'}</TableCell>
                <TableCell>{incident.reporter?.name || incident.reporter?.email || '-'}</TableCell>
                <TableCell>{new Date(incident.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => viewDetail(incident)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(incident)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteIncident.mutate(incident.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!incidents || incidents.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No hay incidencias registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showDetail && selectedIncident && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalle de Incidencia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-slate-500">Estado:</span> <span className="font-medium">{selectedIncident.status}</span></div>
                <div><span className="text-sm text-slate-500">Tipo:</span> <span className="font-medium">{selectedIncident.type}</span></div>
                <div><span className="text-sm text-slate-500">Prioridad:</span> <Badge className={GetPriorityColor({ priority: selectedIncident.priority })}>{selectedIncident.priority}</Badge></div>
                <div><span className="text-sm text-slate-500">Dispositivo:</span> <span className="font-medium">{selectedIncident.device?.name}</span></div>
                <div><span className="text-sm text-slate-500">Área:</span> <span className="font-medium">{selectedIncident.area?.name}</span></div>
                <div><span className="text-sm text-slate-500">Reportado por:</span> <span className="font-medium">{selectedIncident.reporter?.name}</span></div>
                <div><span className="text-sm text-slate-500">Asignado a:</span> <span className="font-medium">{selectedIncident.assignee?.name || '-'}</span></div>
                <div><span className="text-sm text-slate-500">Fecha:</span> <span className="font-medium">{new Date(selectedIncident.created_at).toLocaleString()}</span></div>
              </div>
              <div><span className="text-sm text-slate-500">Descripción:</span><p className="mt-1">{selectedIncident.description}</p></div>
              {selectedIncident.solution && <div><span className="text-sm text-slate-500">Solución:</span><p className="mt-1">{selectedIncident.solution}</p></div>}
              {selectedIncident.observations && <div><span className="text-sm text-slate-500">Observaciones:</span><p className="mt-1">{selectedIncident.observations}</p></div>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetail(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}