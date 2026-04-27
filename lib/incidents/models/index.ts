import { z } from 'zod'
import { IncidentType, IncidentPriority, IncidentStatus } from '@prisma/client'

export { IncidentType, IncidentPriority, IncidentStatus }

export const incidentTypeSchema = z.nativeEnum(IncidentType)
export const incidentPrioritySchema = z.nativeEnum(IncidentPriority)
export const incidentStatusSchema = z.nativeEnum(IncidentStatus)

export const incidentSchema = z.object({
  id: z.string().uuid(),
  rootId: z.string().uuid(),
  deviceId: z.string().uuid(),
  areaId: z.string().uuid(),
  reportedById: z.string().uuid(),
  assignedToId: z.string().uuid().nullable().optional(),
  type: incidentTypeSchema.default(IncidentType.HARDWARE),
  priority: incidentPrioritySchema.default(IncidentPriority.MEDIUM),
  status: incidentStatusSchema.default(IncidentStatus.OPEN),
  description: z.string().min(1, 'La descripción es requerida'),
  solution: z.string().nullable().optional(),
  observations: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  resolvedAt: z.date().or(z.string()).nullable().optional(),
  closedAt: z.date().or(z.string()).nullable().optional(),
  deletedAt: z.date().or(z.string()).nullable().optional(),

  device: z.any().optional(),
  area: z.any().optional(),
  reporter: z.any().optional(),
  assignee: z.any().optional(),
})

export type Incident = z.infer<typeof incidentSchema>

export const createIncidentSchema = incidentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  resolvedAt: true, 
  closedAt: true, 
  deletedAt: true,
  device: true,
  area: true,
  reporter: true,
  assignee: true
})

export const updateIncidentSchema = createIncidentSchema.omit({ rootId: true, reportedById: true }).partial()
