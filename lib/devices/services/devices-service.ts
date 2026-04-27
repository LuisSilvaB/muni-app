import { prisma } from "@/lib/prisma"
import type { Device } from "../models"

export class DevicesService {
  async getAll(rootId?: string, areaId?: string) {
    const where: any = { deletedAt: null }
    if (rootId) where.root_id = rootId
    if (areaId) where.area_id = areaId

    return prisma.device.findMany({
      where,
      include: { area: true },
      orderBy: { name: "asc" },
    })
  }

  async getById(id: string) {
    return prisma.device.findUnique({
      where: { id },
      include: { area: true, root: true },
    })
  }

  async create(data: any) {
    return prisma.device.create({
      data: {
        name: data.name,
        type: data.type,
        serial_number: data.serialNumber,
        brand: data.brand,
        model: data.model,
        ip_address: data.ipAddress,
        area_id: data.areaId,
        root_id: data.rootId,
        status: data.status,
        notes: data.notes,
      },
    })
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data }
    
    // Mapeo manual de camelCase a snake_case para campos de DB
    if (data.serialNumber !== undefined) {
      updateData.serial_number = data.serialNumber
      delete updateData.serialNumber
    }
    if (data.ipAddress !== undefined) {
      updateData.ip_address = data.ipAddress
      delete updateData.ipAddress
    }
    if (data.areaId !== undefined) {
      updateData.area_id = data.areaId
      delete updateData.areaId
    }

    return prisma.device.update({
      where: { id },
      data: updateData,
    })
  }

  async delete(id: string) {
    return prisma.device.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
