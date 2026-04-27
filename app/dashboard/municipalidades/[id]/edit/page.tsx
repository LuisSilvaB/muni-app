"use client"

import { useRoot, useUpdateRoot } from '@/lib/roots/hooks'
import { MuniForm, type MuniFormData } from '../../components/muni-form'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function EditMunicipalityPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: root, isLoading } = useRoot(id)
  const updateRoot = useUpdateRoot()

  async function onSubmit(data: MuniFormData) {
    updateRoot.mutate({ id, ...data }, {
      onSuccess: () => {
        toast.success('Municipalidad actualizada correctamente')
        router.push('/dashboard/municipalidades')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al actualizar la municipalidad')
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

  if (!root) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Municipalidad no encontrada</h2>
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
        <h1 className="text-2xl font-bold text-slate-900">Editar Municipalidad</h1>
        <p className="text-slate-500">Modifique los datos institucionales de la municipalidad.</p>
      </div>
      
      <MuniForm 
        initialData={root}
        onSubmit={onSubmit} 
        isPending={updateRoot.isPending} 
      />
    </div>
  )
}
