import { NextResponse } from "next/server"
import { RootsService } from "@/lib/roots/services/roots-service"
import { createRootSchema } from "@/lib/roots/models"

const rootsService = new RootsService()

export async function GET() {
  try {
    const roots = await rootsService.getAll()
    return NextResponse.json(roots)
  } catch (error) {
    console.error("Error fetching municipalities:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validation = createRootSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const root = await rootsService.create(validation.data)
    return NextResponse.json(root)
  } catch (error) {
    console.error("Error creating municipality:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
