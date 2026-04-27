"use client"

import { useCreateRoot } from '@/lib/roots/hooks'
import { MuniForm, type MuniFormData } from '../components/muni-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewMunicipalityPage() {
  const router = useRouter()
  const createRoot = useCreateRoot()

  async function onSubmit(data: MuniFormData) {
    createRoot.mutate(data, {
      onSuccess: () => {
        toast.success('Municipalidad registrada correctamente')
        router.push('/dashboard/municipalidades')
        router.refresh()
      },
      onError: (error) => {
        toast.error('Error al registrar la municipalidad')
        console.error(error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva Municipalidad</h1>
        <p className="text-slate-500">Registre una nueva entidad municipal en el sistema.</p>
      </div>
      
      <MuniForm 
        onSubmit={onSubmit} 
        isPending={createRoot.isPending} 
      />
    </div>
  )
}
