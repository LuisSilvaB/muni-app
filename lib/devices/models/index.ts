import { z } from 'zod'
import { DeviceType, DeviceStatus } from '@prisma/client'

export { DeviceType, DeviceStatus }

export const deviceTypeSchema = z.nativeEnum(DeviceType)
export const deviceStatusSchema = z.nativeEnum(DeviceStatus)

export const deviceSchema = z.object({
  id: z.string().uuid(),
  rootId: z.string().uuid(),
  areaId: z.string().uuid(),
  name: z.string().min(1, 'El nombre es requerido'),
  type: deviceTypeSchema.default(DeviceType.COMPUTER),
  serialNumber: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  status: deviceStatusSchema.default(DeviceStatus.ACTIVE),
  ipAddress: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  deletedAt: z.date().or(z.string()).nullable().optional(),
  
  area: z.any().optional(),
  root: z.any().optional(),
})

export type Device = z.infer<typeof deviceSchema>

export const createDeviceSchema = deviceSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  deletedAt: true,
  area: true,
  root: true
})

export const updateDeviceSchema = createDeviceSchema.omit({ rootId: true }).partial()
