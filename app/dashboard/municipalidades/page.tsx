"use client"

import { useRoots, useDeleteRoot } from '@/lib/roots/hooks'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function MunicipalidadesPage() {
  const { data: roots, isLoading } = useRoots()
  const deleteRoot = useDeleteRoot()

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar municipalidad? Esto afectará a todos los datos asociados.')) return
    deleteRoot.mutate(id, {
      onSuccess: () => {
        toast.success('Municipalidad eliminada correctamente')
      },
      onError: () => {
        toast.error('Error al eliminar la municipalidad')
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
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-teal-600" />
          Municipalidades
        </h1>
        <Link href="/dashboard/municipalidades/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" /> Nueva Municipalidad
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">RUC</TableHead>
              <TableHead className="font-semibold">Teléfono</TableHead>
              <TableHead className="font-semibold">Dirección</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roots?.map((root) => (
              <TableRow key={root.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    {root.logoUrl ? (
                      <img src={root.logoUrl} alt={root.name} className="h-8 w-8 rounded-full object-cover border" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border text-slate-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                    )}
                    {root.name}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{root.ruc || '-'}</TableCell>
                <TableCell className="text-slate-600">{root.phone || '-'}</TableCell>
                <TableCell className="text-slate-600 max-w-xs truncate">{root.address || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/municipalidades/${root.id}/edit`}>
                      <Button variant="ghost" size="icon" className="text-slate-600 hover:text-teal-600">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(root.id)} 
                      className="text-slate-600 hover:text-red-600"
                      disabled={deleteRoot.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!roots || roots.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                  No hay municipalidades registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
