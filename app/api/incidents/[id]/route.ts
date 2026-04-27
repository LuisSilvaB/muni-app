import { NextResponse } from 'next/server'
import { IncidentsService } from '@/lib/incidents/services/incidents-service'
import { updateIncidentSchema } from '@/lib/incidents/models'

const incidentsService = new IncidentsService()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const incident = await incidentsService.getById(id)

    if (!incident) {
      return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 })
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Incident GET error:', error)
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
    
    // Normalizar body
    const normalizedBody = {
      ...body,
      deviceId: body.deviceId || body.device_id,
      areaId: body.areaId || body.area_id,
      assignedToId: body.assignedToId || body.assigned_to_id,
    }

    const validation = updateIncidentSchema.safeParse(normalizedBody)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const updateData: any = { ...validation.data }
    if (validation.data.status === 'RESOLVED' && validation.data.solution) {
      updateData.resolved_at = new Date()
    }
    if (validation.data.status === 'CLOSED') {
      updateData.closed_at = new Date()
    }

    const incident = await incidentsService.update(id, updateData)

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Incident PATCH error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await incidentsService.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Incident DELETE error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}