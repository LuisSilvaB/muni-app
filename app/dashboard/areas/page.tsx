"use client"

import { useAreas, useDeleteArea } from '@/lib/areas/hooks'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function AreasPage() {
  const { data: areas, isLoading } = useAreas()
  const deleteArea = useDeleteArea()

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar área?')) return
    deleteArea.mutate(id, {
      onSuccess: () => {
        toast.success('Área eliminada correctamente')
      },
      onError: () => {
        toast.error('Error al eliminar el área')
      }
    })
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
        <Link href="/dashboard/areas/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" /> Nueva Área
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Código</TableHead>
              <TableHead className="font-semibold">Descripción</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas?.map((area) => (
              <TableRow key={area.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">{area.name}</TableCell>
                <TableCell className="text-slate-600">{area.code || '-'}</TableCell>
                <TableCell className="text-slate-600 max-w-xs truncate">{area.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/areas/${area.id}/edit`}>
                      <Button variant="ghost" size="icon" className="text-slate-600 hover:text-teal-600">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(area.id)} 
                      className="text-slate-600 hover:text-red-600"
                      disabled={deleteArea.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!areas || areas.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
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
