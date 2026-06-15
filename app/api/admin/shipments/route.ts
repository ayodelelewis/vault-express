import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminToken, getAdminCookieName } from '@/lib/auth'

async function checkAdmin(request: NextRequest) {
  const token = request.cookies.get(getAdminCookieName())?.value
  if (!token || !(await verifyAdminToken(token))) return false
  return true
}

export async function GET(request: NextRequest) {
  if (!(await checkAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  let query = supabaseAdmin.from('shipments').select('*').order('created_at', { ascending: false })
  
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  if (type) query = query.eq('type', type)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ shipments: data })
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await request.json()
  const { data, error } = await supabaseAdmin
    .from('shipments').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, shipment: data })
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await supabaseAdmin.from('shipments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
