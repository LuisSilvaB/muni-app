"use client"

import { useCreateArea } from '@/lib/areas/hooks'
import { AreaForm, type AreaFormData } from '../components/area-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewAreaPage() {
  const router = useRouter()
  const createArea = useCreateArea()

  async function onSubmit(data: AreaFormData) {
    createArea.mutate(data, {
      onSuccess: () => {
        toast.success('Área creada correctamente')
        router.push('/dashboard/areas')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al crear el área')
        console.error(error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva Área</h1>
        <p className="text-slate-500">Ingrese los datos para registrar una nueva área en el sistema.</p>
      </div>
      
      <AreaForm 
        onSubmit={onSubmit} 
        isPending={createArea.isPending} 
      />
    </div>
  )
}
