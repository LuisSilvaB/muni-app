import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rootId = searchParams.get('rootId')

    let query = supabaseAdmin.from('areas').select('*').order('name')

    if (rootId) {
      query = query.eq('root_id', rootId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Areas GET error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, description, rootId } = body

    if (!name || !rootId) {
      return NextResponse.json({ error: 'Nombre y rootId son requeridos' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('areas')
      .insert({ name, code, description, root_id: rootId })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Areas POST error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}