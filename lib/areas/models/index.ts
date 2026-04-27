import { z } from 'zod'

export const areaSchema = z.object({
  id: z.string().uuid(),
  rootId: z.string().uuid(),
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  deletedAt: z.date().or(z.string()).nullable().optional(),
})

export type Area = z.infer<typeof areaSchema>

export const createAreaSchema = areaSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  deletedAt: true 
})

export const updateAreaSchema = createAreaSchema.omit({ rootId: true }).partial()
