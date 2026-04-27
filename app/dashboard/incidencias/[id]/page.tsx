"use client"

import { useIncident } from '@/lib/incidents/hooks'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft, Pencil, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import type { IncidentPriority, IncidentStatus, IncidentType } from '@/lib/incidents/types'

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

function GetStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'OPEN': return <AlertCircle className="h-5 w-5 text-red-500" />
    case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-yellow-500" />
    case 'RESOLVED': return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'CLOSED': return <XCircle className="h-5 w-5 text-gray-500" />
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

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: incident, isLoading } = useIncident(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Incidencia no encontrada</h2>
        <Button variant="link" onClick={() => router.back()}>Volver atrás</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="pl-0">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
        <Link href={`/dashboard/incidencias/${id}/edit`}>
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" /> Editar
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <GetStatusIcon status={incident.status} />
            <h1 className="text-2xl font-bold text-slate-900">Incidencia #{incident.id.slice(-6)}</h1>
            <Badge className={GetPriorityColor({ priority: incident.priority })}>
              {incidentPrioritiesMap[incident.priority as IncidentPriority] || incident.priority}
            </Badge>
          </div>
          <p className="text-slate-500">Reportada el {new Date(incident.created_at).toLocaleString()}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Información General</h3>
              <div className="space-y-3">
                <div>
                  <span className="block text-sm text-slate-500">Tipo de Incidencia</span>
                  <span className="font-medium">{incidentTypesMap[incident.type as IncidentType] || incident.type}</span>
                </div>
                <div>
                  <span className="block text-sm text-slate-500">Estado Actual</span>
                  <span className="font-medium">{incidentStatusesMap[incident.status as IncidentStatus] || incident.status}</span>
                </div>
                <div>
                  <span className="block text-sm text-slate-500">Ubicación</span>
                  <span className="font-medium">{incident.location || 'No especificada'}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Activos Relacionados</h3>
              <div className="space-y-3">
                <div>
                  <span className="block text-sm text-slate-500">Dispositivo</span>
                  <span className="font-medium text-teal-600">{incident.device?.name}</span>
                </div>
                <div>
                  <span className="block text-sm text-slate-500">Área</span>
                  <span className="font-medium">{incident.area?.name}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Personal</h3>
              <div className="space-y-3">
                <div>
                  <span className="block text-sm text-slate-500">Reportado por</span>
                  <span className="font-medium">{incident.reporter?.name || incident.reporter?.email}</span>
                </div>
                <div>
                  <span className="block text-sm text-slate-500">Asignado a</span>
                  <span className="font-medium">{incident.assignee?.name || 'Pendiente de asignación'}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Descripción del Problema</h3>
              <p className="text-slate-700 bg-slate-50 p-3 rounded border italic">
                "{incident.description}"
              </p>
            </section>
          </div>
        </div>

        {(incident.solution || incident.observations) && (
          <div className="p-6 border-t bg-teal-50/30 grid grid-cols-1 md:grid-cols-2 gap-8">
            {incident.solution && (
              <section>
                <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-2">Solución Aplicada</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{incident.solution}</p>
                {incident.resolved_at && (
                  <span className="block text-xs text-slate-500 mt-2">
                    Resuelto el {new Date(incident.resolved_at).toLocaleString()}
                  </span>
                )}
              </section>
            )}
            {incident.observations && (
              <section>
                <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-2">Observaciones Adicionales</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{incident.observations}</p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
