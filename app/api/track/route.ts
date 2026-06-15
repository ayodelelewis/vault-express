import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const tracking = new URL(request.url).searchParams.get('number')?.toUpperCase().trim()
  if (!tracking) return NextResponse.json({ error: 'Tracking number required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('shipments').select('*').eq('tracking_number', tracking).single()

  if (error || !data) return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
  return NextResponse.json({ shipment: data })
}
