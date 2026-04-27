import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rootId = searchParams.get('rootId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const deviceId = searchParams.get('deviceId')

    let query = supabaseAdmin
      .from('incidents')
      .select('*, device:devices(*), area:areas(*), reporter:users!reported_by_id(*), assignee:users!assigned_to_id(*)')
      .order('created_at', { ascending: false })

    if (rootId) query = query.eq('root_id', rootId)
    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)
    if (deviceId) query = query.eq('device_id', deviceId)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Incidents GET error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { deviceId, areaId, rootId, reportedById, type, priority, description, location } = body

    if (!deviceId || !areaId || !rootId || !reportedById || !description) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('incidents')
      .insert({
        device_id: deviceId,
        area_id: areaId,
        root_id: rootId,
        reported_by_id: reportedById,
        type,
        priority,
        description,
        location,
        status: 'OPEN',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Incidents POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}