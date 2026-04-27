import { NextResponse } from 'next/server'
import { DevicesService } from '@/lib/devices/services/devices-service'
import { createDeviceSchema } from '@/lib/devices/models'

const devicesService = new DevicesService()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rootId = searchParams.get('rootId')
    const areaId = searchParams.get('areaId')

    const devices = await devicesService.getAll(rootId || undefined, areaId || undefined)

    return NextResponse.json(devices)
  } catch (error) {
    console.error('Devices GET error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = createDeviceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.format() }, { status: 400 })
    }

    const device = await devicesService.create(validation.data)

    return NextResponse.json(device)
  } catch (error) {
    console.error('Devices POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}