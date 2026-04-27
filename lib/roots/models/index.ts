import { z } from 'zod'

export const rootSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre es requerido'),
  ruc: z.string().length(11, 'El RUC debe tener 11 dígitos').nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional().or(z.literal('')),
  isMain: z.boolean().default(true),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  deletedAt: z.date().or(z.string()).nullable().optional(),
})

export type Root = z.infer<typeof rootSchema>

export const createRootSchema = rootSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  deletedAt: true 
})

export const updateRootSchema = createRootSchema.partial()
