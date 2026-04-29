"use client"

import { useCreateIncident } from '@/lib/incidents/hooks'
import { useDevices } from '@/lib/devices/hooks'
import { IncidentForm, type IncidentFormData } from '../components/incident-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewIncidentPage() {
  const router = useRouter()
  const createIncident = useCreateIncident()
  const { data: devices } = useDevices()

  async function onSubmit(data: IncidentFormData) {
    const device = devices?.find(d => d.id === data.deviceId)
    const payload = {
      deviceId: data.deviceId,
      areaId: device?.areaId || '',
      type: data.type,
      priority: data.priority,
      status: data.status || 'OPEN',
      description: data.description,
      location: data.location || undefined,
      solution: data.solution || undefined,
      observations: data.observations || undefined,
      assignedToId: data.assignedToId || undefined,
    }

    createIncident.mutate(payload, {
      onSuccess: () => {
        toast.success('Incidencia reportada correctamente')
        router.push('/dashboard/incidencias')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al reportar la incidencia')
        console.error(error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva Incidencia</h1>
        <p className="text-slate-500">Reporte un nuevo problema técnico o requerimiento de soporte.</p>
      </div>
      
      <IncidentForm 
        onSubmit={onSubmit} 
        isPending={createIncident.isPending} 
      />
    </div>
  )
}
