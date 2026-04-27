import { NextResponse } from 'next/server'
import { IncidentsService } from '@/lib/incidents/services/incidents-service'
import { createIncidentSchema } from '@/lib/incidents/models'

const incidentsService = new IncidentsService()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rootId = searchParams.get('rootId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const deviceId = searchParams.get('deviceId')

    const incidents = await incidentsService.getAll(rootId || undefined, {
      status: status || undefined,
      type: type || undefined,
      deviceId: deviceId || undefined,
    })

    return NextResponse.json(incidents)
  } catch (error) {
    console.error('Incidents GET error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Normalizar body de snake_case (si viene del form viejo) a camelCase (lo que espera el esquema Zod)
    const normalizedBody = {
      ...body,
      rootId: body.rootId || body.root_id,
      deviceId: body.deviceId || body.device_id,
      areaId: body.areaId || body.area_id,
      reportedById: body.reportedById || body.reported_by_id,
      assignedToId: body.assignedToId || body.assigned_to_id,
    }

    const validation = createIncidentSchema.safeParse(normalizedBody)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const incident = await incidentsService.create(validation.data)

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Incidents POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}