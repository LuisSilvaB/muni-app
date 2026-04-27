import { NextResponse } from 'next/server'
import { DevicesService } from '@/lib/devices/services/devices-service'
import { updateDeviceSchema } from '@/lib/devices/models'

const devicesService = new DevicesService()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const device = await devicesService.getById(id)

    if (!device) {
      return NextResponse.json({ error: 'Dispositivo no encontrado' }, { status: 404 })
    }

    return NextResponse.json(device)
  } catch (error) {
    console.error('Device GET error:', error)
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
    const validation = updateDeviceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const device = await devicesService.update(id, validation.data)

    return NextResponse.json(device)
  } catch (error) {
    console.error('Device PATCH error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await devicesService.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Device DELETE error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}