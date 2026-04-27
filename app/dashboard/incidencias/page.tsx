"use client"

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useIncidents, useDeleteIncident } from '@/lib/incidents/hooks'
import type { Incident, IncidentType, IncidentStatus } from '@/lib/incidents/types'
import { Button } from '@/components/ui/button'
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
import Link from 'next/link'
import { toast } from 'sonner'
import type { IncidentPriority, IncidentType, IncidentStatus } from '@/lib/incidents/types'

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
const incidentStatuses = Object.keys(incidentStatusesMap) as IncidentStatus[]

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
  const searchParams = useSearchParams()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')

  const deviceIdFromUrl = searchParams.get('deviceId') || undefined
  const filters = { 
    status: (filterStatus && filterStatus !== 'all') ? filterStatus : undefined, 
    type: (filterType && filterType !== 'all') ? filterType : undefined, 
    deviceId: deviceIdFromUrl 
  }

  const { data: incidents, isLoading } = useIncidents(undefined, filters)
  const deleteIncident = useDeleteIncident()

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar incidencia?')) return
    deleteIncident.mutate(id, {
      onSuccess: () => {
        toast.success('Incidencia eliminada correctamente')
      },
      onError: () => {
        toast.error('Error al eliminar la incidencia')
      }
    })
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
        <Link href="/dashboard/incidencias/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" /> Nueva Incidencia
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex-1 max-w-xs">
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Estado</label>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v || '')}>
            <SelectTrigger><SelectValue placeholder="Todos los estados" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {incidentStatuses.map(s => <SelectItem key={s} value={s}>{incidentStatusesMap[s]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-xs">
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Tipo</label>
          <Select value={filterType} onValueChange={(v) => setFilterType(v || '')}>
            <SelectTrigger><SelectValue placeholder="Todos los tipos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {incidentTypes.map(t => <SelectItem key={t} value={t}>{incidentTypesMap[t]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-12">Estado</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Prioridad</TableHead>
              <TableHead className="font-semibold">Dispositivo</TableHead>
              <TableHead className="font-semibold">Reportado por</TableHead>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents?.map(incident => (
              <TableRow key={incident.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell title={incidentStatusesMap[incident.status as IncidentStatus]}>
                  <GetStatusIcon status={incident.status} />
                </TableCell>
                <TableCell className="text-slate-600">{incidentTypesMap[incident.type as IncidentType] || incident.type}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${GetPriorityColor({ priority: incident.priority })} border-none`}>
                    {incidentPrioritiesMap[incident.priority as IncidentPriority] || incident.priority}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-slate-900">{incident.device?.name || '-'}</TableCell>
                <TableCell className="text-slate-600">{incident.reporter?.name || incident.reporter?.email || '-'}</TableCell>
                <TableCell className="text-slate-600">{new Date(incident.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/incidencias/${incident.id}`}>
                      <Button variant="ghost" size="icon" className="text-slate-600 hover:text-teal-600" title="Ver detalle">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/incidencias/${incident.id}/edit`}>
                      <Button variant="ghost" size="icon" className="text-slate-600 hover:text-teal-600" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(incident.id)} 
                      className="text-slate-600 hover:text-red-600"
                      disabled={deleteIncident.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!incidents || incidents.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  No hay incidencias registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
