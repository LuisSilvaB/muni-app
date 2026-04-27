import { prisma } from "@/lib/prisma"
import type { Root } from "../models"

export class RootsService {
  async getAll() {
    return prisma.root.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    })
  }

  async getById(id: string) {
    return prisma.root.findUnique({
      where: { id },
    })
  }

  async create(data: any) {
    return prisma.root.create({
      data: {
        name: data.name,
        ruc: data.ruc,
        address: data.address,
        phone: data.phone,
        logoUrl: data.logoUrl,
        isMain: data.isMain ?? true,
      },
    })
  }

  async update(id: string, data: any) {
    return prisma.root.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.root.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
