import { NextResponse } from 'next/server'
import { AreasService } from '@/lib/areas/services/areas-service'
import { updateAreaSchema } from '@/lib/areas/models'

const areasService = new AreasService()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const area = await areasService.getById(id)

    if (!area) {
      return NextResponse.json({ error: 'Área no encontrada' }, { status: 404 })
    }

    return NextResponse.json(area)
  } catch (error) {
    console.error('Area GET error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validation = updateAreaSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const area = await areasService.update(id, validation.data)

    return NextResponse.json(area)
  } catch (error) {
    console.error('Area PATCH error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await areasService.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Area DELETE error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}