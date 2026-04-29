import { prisma } from "@/lib/prisma"
import type { Incident } from "../models"

export class IncidentsService {
  async getAll(rootId?: string, filters?: { status?: string; type?: string; deviceId?: string }) {
    const where: any = { deletedAt: null }
    if (rootId) where.rootId = rootId
    if (filters?.status) where.status = filters.status
    if (filters?.type) where.type = filters.type
    if (filters?.deviceId) where.deviceId = filters.deviceId

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
        rootId: data.rootId,
        deviceId: data.deviceId,
        areaId: data.areaId,
        reportedById: data.reportedById,
        type: data.type,
        priority: data.priority,
        status: data.status || 'OPEN',
        description: data.description,
        location: data.location,
        assignedToId: data.assignedToId,
      },
    })
  }

  async update(id: string, data: any) {
    return prisma.incident.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
