import { NextResponse } from "next/server"
import { RootsService } from "@/lib/roots/services/roots-service"
import { updateRootSchema } from "@/lib/roots/models"

const rootsService = new RootsService()

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const root = await rootsService.getById(id)
    if (!root) {
      return NextResponse.json({ error: "Municipality not found" }, { status: 404 })
    }
    return NextResponse.json(root)
  } catch (error) {
    console.error("Error fetching municipality:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const validation = updateRootSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const root = await rootsService.update(id, validation.data)
    return NextResponse.json(root)
  } catch (error) {
    console.error("Error updating municipality:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await rootsService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting municipality:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
