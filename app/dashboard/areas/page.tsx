"use client"

import { useState } from 'react'
import { useAreas, useCreateArea, useUpdateArea, useDeleteArea } from '@/lib/areas/hooks'
import type { Area } from '@/lib/areas/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'

const areaSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().optional(),
  description: z.string().optional(),
})

type AreaFormData = z.infer<typeof areaSchema>

export default function AreasPage() {
  const [open, setOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<Area | null>(null)

  const { data: areas, isLoading } = useAreas()
  const createArea = useCreateArea()
  const updateArea = useUpdateArea()
  const deleteArea = useDeleteArea()

  const form = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: { name: '', code: '', description: '' },
  })

  const isPending = createArea.isPending || updateArea.isPending || deleteArea.isPending

  function onSubmit(data: AreaFormData) {
    if (editingArea) {
      updateArea.mutate({ id: editingArea.id, ...data })
    } else {
      createArea.mutate(data)
    }
  }

  function onOpenChange(open: boolean) {
    setOpen(open)
    if (!open) {
      setEditingArea(null)
      form.reset({ name: '', code: '', description: '' })
    }
  }

  function startEdit(area: Area) {
    setEditingArea(area)
    form.reset({ name: area.name, code: area.code || '', description: area.description || '' })
    setOpen(true)
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar área?')) return
    deleteArea.mutate(id)
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Áreas</h1>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" /> Nueva Área
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingArea ? 'Editar' : 'Nueva'} Área</DialogTitle>
              <DialogDescription>Ingrese los datos del área.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código</label>
                  <Input {...form.register('code')} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea {...form.register('description')} rows={3} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending} className="bg-teal-600 hover:bg-teal-700">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas?.map((area) => (
              <TableRow key={area.id}>
                <TableCell className="font-medium">{area.name}</TableCell>
                <TableCell>{area.code || '-'}</TableCell>
                <TableCell>{area.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(area)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(area.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!areas || areas.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No hay áreas registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}