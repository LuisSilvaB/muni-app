"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Area } from '@/lib/areas/types'

const areaSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().optional(),
  description: z.string().optional(),
})

export type AreaFormData = z.infer<typeof areaSchema>

interface AreaFormProps {
  initialData?: Area | null
  onSubmit: (data: AreaFormData) => void
  isPending: boolean
}

export function AreaForm({ initialData, onSubmit, isPending }: AreaFormProps) {
  const router = useRouter()
  const form = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre *</label>
          <Input {...form.register('name')} placeholder="Ej. Contabilidad" />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Código</label>
          <Input {...form.register('code')} placeholder="Ej. CONT-01" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <Textarea {...form.register('description')} rows={4} placeholder="Descripción del área..." />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="bg-teal-600 hover:bg-teal-700 min-w-[100px]">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
