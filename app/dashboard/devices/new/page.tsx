"use client"

import { useCreateDevice } from '@/lib/devices/hooks'
import { DeviceForm, type DeviceFormData } from '../components/device-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewDevicePage() {
  const router = useRouter()
  const createDevice = useCreateDevice()

  async function onSubmit(data: DeviceFormData) {
    createDevice.mutate(data, {
      onSuccess: () => {
        toast.success('Dispositivo creado correctamente')
        router.push('/dashboard/devices')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al crear el dispositivo')
        console.error(error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nuevo Dispositivo</h1>
        <p className="text-slate-500">Registre un nuevo equipo o recurso tecnológico en el sistema.</p>
      </div>
      
      <DeviceForm 
        onSubmit={onSubmit} 
        isPending={createDevice.isPending} 
      />
    </div>
  )
}
