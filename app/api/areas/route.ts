import { NextResponse } from 'next/server'
import { AreasService } from '@/lib/areas/services/areas-service'
import { createAreaSchema } from '@/lib/areas/models'

const areasService = new AreasService()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rootId = searchParams.get('rootId')

    const areas = await areasService.getAll(rootId || undefined)

    return NextResponse.json(areas)
  } catch (error) {
    console.error('Areas GET error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = createAreaSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const area = await areasService.create(validation.data)

    return NextResponse.json(area)
  } catch (error) {
    console.error('Areas POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}