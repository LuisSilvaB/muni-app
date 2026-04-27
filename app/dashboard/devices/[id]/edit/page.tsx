"use client"

import { useDevice, useUpdateDevice } from '@/lib/devices/hooks'
import { DeviceForm, type DeviceFormData } from '../../components/device-form'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function EditDevicePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: device, isLoading } = useDevice(id)
  const updateDevice = useUpdateDevice()

  async function onSubmit(data: DeviceFormData) {
    updateDevice.mutate({ id, ...data }, {
      onSuccess: () => {
        toast.success('Dispositivo actualizado correctamente')
        router.push('/dashboard/devices')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al actualizar el dispositivo')
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

  if (!device) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Dispositivo no encontrado</h2>
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
        <h1 className="text-2xl font-bold text-slate-900">Editar Dispositivo</h1>
        <p className="text-slate-500">Modifique los datos técnicos del dispositivo.</p>
      </div>
      
      <DeviceForm 
        initialData={device}
        onSubmit={onSubmit} 
        isPending={updateDevice.isPending} 
      />
    </div>
  )
}
