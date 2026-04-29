"use client"

import { useIncident, useUpdateIncident } from '@/lib/incidents/hooks'
import { useDevices } from '@/lib/devices/hooks'
import { IncidentForm, type IncidentFormData } from '../../components/incident-form'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function EditIncidentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: incident, isLoading } = useIncident(id)
  const { data: devices } = useDevices()
  const updateIncident = useUpdateIncident()

  async function onSubmit(data: IncidentFormData) {
    const device = devices?.find(d => d.id === data.deviceId)
    const payload = {
      deviceId: data.deviceId,
      areaId: device?.areaId || '',
      type: data.type,
      priority: data.priority,
      status: data.status,
      description: data.description,
      location: data.location || undefined,
      solution: data.solution || undefined,
      observations: data.observations || undefined,
      assignedToId: data.assignedToId || undefined,
    }

    updateIncident.mutate({ id, ...payload }, {
      onSuccess: () => {
        toast.success('Incidencia actualizada correctamente')
        router.push('/dashboard/incidencias')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al actualizar la incidencia')
        console.error(error)
      }
    })
  }

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
        <button 
          onClick={() => router.back()}
          className="text-teal-600 hover:underline mt-2"
        >
          Volver atrás
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Editar Incidencia</h1>
        <p className="text-slate-500">Actualice la información de seguimiento de la incidencia.</p>
      </div>
      
      <IncidentForm 
        initialData={incident}
        onSubmit={onSubmit} 
        isPending={updateIncident.isPending} 
      />
    </div>
  )
}
