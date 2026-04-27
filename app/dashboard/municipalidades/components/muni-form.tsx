"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Root } from '@/lib/roots/types'

const muniSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  ruc: z.string().min(11, 'El RUC debe tener 11 dígitos').max(11, 'El RUC debe tener 11 dígitos').optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional(),
  logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type MuniFormData = z.infer<typeof muniSchema>

interface MuniFormProps {
  initialData?: Root | null
  onSubmit: (data: MuniFormData) => void
  isPending: boolean
}

export function MuniForm({ initialData, onSubmit, isPending }: MuniFormProps) {
  const router = useRouter()
  const form = useForm<MuniFormData>({
    resolver: zodResolver(muniSchema),
    defaultValues: {
      name: initialData?.name || '',
      ruc: initialData?.ruc || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      logoUrl: initialData?.logoUrl || '',
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre de la Municipalidad *</label>
        <Input {...form.register('name')} placeholder="Ej. Municipalidad Distrital de ..." />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">RUC</label>
          <Input {...form.register('ruc')} placeholder="20123456789" />
          {form.formState.errors.ruc && (
            <p className="text-sm text-red-500">{form.formState.errors.ruc.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Teléfono</label>
          <Input {...form.register('phone')} placeholder="01 1234567" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dirección</label>
        <Input {...form.register('address')} placeholder="Av. Principal 123..." />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">URL del Logo</label>
        <Input {...form.register('logoUrl')} placeholder="https://..." />
        {form.formState.errors.logoUrl && (
          <p className="text-sm text-red-500">{form.formState.errors.logoUrl.message}</p>
        )}
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
