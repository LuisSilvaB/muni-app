import { prisma } from "@/lib/prisma"
import type { Device } from "../models"

export class DevicesService {
  async getAll(rootId?: string, areaId?: string) {
    const where: any = { deletedAt: null }
    if (rootId) where.rootId = rootId
    if (areaId) where.areaId = areaId

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
        serialNumber: data.serialNumber,
        brand: data.brand,
        model: data.model,
        ipAddress: data.ipAddress,
        areaId: data.areaId,
        rootId: data.rootId,
        status: data.status,
        notes: data.notes,
      },
    })
  }

  async update(id: string, data: any) {
    return prisma.device.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.device.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
