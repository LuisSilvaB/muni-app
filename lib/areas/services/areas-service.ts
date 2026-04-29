import { prisma } from "@/lib/prisma"
import type { Area } from "../models"
import { createAreaSchema } from "../models"

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
    const validated = createAreaSchema.parse(data)
    return prisma.area.create({
      data: {
        name: validated.name,
        code: validated.code,
        description: validated.description,
        rootId: validated.rootId,
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
