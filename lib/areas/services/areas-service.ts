import { prisma } from "@/lib/prisma"
import type { Area, CreateArea } from "../models"

export class AreasService {
  async getAll(rootId?: string) {
    const where: any = { deletedAt: null }
    if (rootId) where.root_id = rootId

    return prisma.area.findMany({
      where,
      orderBy: { name: "asc" },
    })
  }

  async getById(id: string) {
    return prisma.area.findUnique({
      where: { id },
    })
  }

  async create(data: any) {
    return prisma.area.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        root_id: data.rootId,
      },
    })
  }

  async update(id: string, data: any) {
    return prisma.area.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.area.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
