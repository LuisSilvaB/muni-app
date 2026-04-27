"use client"

import { useArea, useUpdateArea } from '@/lib/areas/hooks'
import { AreaForm, type AreaFormData } from '../../components/area-form'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function EditAreaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: area, isLoading } = useArea(id)
  const updateArea = useUpdateArea()

  async function onSubmit(data: AreaFormData) {
    updateArea.mutate({ id, ...data }, {
      onSuccess: () => {
        toast.success('Área actualizada correctamente')
        router.push('/dashboard/areas')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al actualizar el área')
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

  if (!area) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Área no encontrada</h2>
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
        <h1 className="text-2xl font-bold text-slate-900">Editar Área</h1>
        <p className="text-slate-500">Modifique los datos del área seleccionada.</p>
      </div>
      
      <AreaForm 
        initialData={area}
        onSubmit={onSubmit} 
        isPending={updateArea.isPending} 
      />
    </div>
  )
}
