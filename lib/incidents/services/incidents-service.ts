import { prisma } from "@/lib/prisma"
import type { Incident } from "../models"

export class IncidentsService {
  async getAll(rootId?: string, filters?: { status?: string; type?: string; deviceId?: string }) {
    const where: any = { deletedAt: null }
    if (rootId) where.root_id = rootId
    if (filters?.status) where.status = filters.status
    if (filters?.type) where.type = filters.type
    if (filters?.deviceId) where.device_id = filters.deviceId

    return prisma.incident.findMany({
      where,
      include: {
        device: true,
        area: true,
        reporter: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async getById(id: string) {
    return prisma.incident.findUnique({
      where: { id },
      include: {
        device: true,
        area: true,
        reporter: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        attachments: true,
      },
    })
  }

  async create(data: any) {
    return prisma.incident.create({
      data: {
        root_id: data.rootId,
        device_id: data.deviceId,
        area_id: data.areaId,
        reported_by_id: data.reportedById,
        type: data.type,
        priority: data.priority,
        status: data.status || 'OPEN',
        description: data.description,
        location: data.location,
        assigned_to_id: data.assignedToId,
      },
    })
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data }
    
    // Mapeo manual
    if (data.deviceId !== undefined) {
      updateData.device_id = data.deviceId
      delete updateData.deviceId
    }
    if (data.areaId !== undefined) {
      updateData.area_id = data.areaId
      delete updateData.areaId
    }
    if (data.assignedToId !== undefined) {
      updateData.assigned_to_id = data.assignedToId
      delete updateData.assignedToId
    }

    return prisma.incident.update({
      where: { id },
      data: updateData,
    })
  }

  async delete(id: string) {
    return prisma.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
