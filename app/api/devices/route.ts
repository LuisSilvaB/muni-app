import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rootId = searchParams.get('rootId')
    const areaId = searchParams.get('areaId')

    let query = supabaseAdmin.from('devices').select('*, area:areas(*)').order('name')

    if (rootId) query = query.eq('root_id', rootId)
    if (areaId) query = query.eq('area_id', areaId)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Devices GET error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, serialNumber, brand, model, ipAddress, areaId, rootId, status, notes } = body

    if (!name || !areaId || !rootId) {
      return NextResponse.json({ error: 'Nombre, areaId y rootId son requeridos' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('devices')
      .insert({ 
        name, 
        type, 
        serial_number: serialNumber, 
        brand, 
        model, 
        ip_address: ipAddress, 
        area_id: areaId, 
        root_id: rootId,
        status,
        notes 
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Devices POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}