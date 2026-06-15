import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateTrackingNumber, calculateETA } from '@/lib/utils'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'VaultExpressSecretKey2026SuperStrong!!'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tracking_number = generateTrackingNumber()

    let clientEmail: string | null = null
    const token = request.cookies.get('vx_client_session')?.value
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret)
        clientEmail = payload.email as string
      } catch {}
    }

    const { data, error } = await supabaseAdmin
      .from('shipments')
      .insert({
        tracking_number,
        status: 'pending',
        type: body.type || 'physical',
        category: body.category || 'Physical Package',
        items: body.items || [],
        sender: body.sender,
        recipient: body.recipient,
        service: body.service || 'standard',
        declared_value: body.declared_value || 0,
        notes: body.notes || '',
        money_details: body.money_details || null,
        file_name: body.file_name || null,
        images: [],
        current_location: '',
        eta: body.eta || calculateETA(body.service || 'standard'),
        admin_message: null,
        agent_info: null,
        is_vip: body.is_vip || false,
        client_id: clientEmail || body.client_id || null,
        payment: body.payment || null,
        timeline: [{
          text: 'Shipment submitted — awaiting crypto payment verification',
          location: '',
          time: new Date().toISOString(),
          type: 'info'
        }]
      })
      .select()
      .single()

    if (error) throw error

    // Update client shipment count (ignore errors)
    if (clientEmail) {
      try {
        const { data: client } = await supabaseAdmin
          .from('clients')
          .select('shipment_count')
          .eq('email', clientEmail)
          .single()
        if (client) {
          await supabaseAdmin
            .from('clients')
            .update({ shipment_count: (client.shipment_count || 0) + 1 })
            .eq('email', clientEmail)
        }
      } catch {}
    }

    return NextResponse.json({ success: true, tracking_number, shipment: data })
  } catch (error) {
    console.error('Create shipment error:', error)
    return NextResponse.json({ error: 'Failed to create shipment. Please try again.' }, { status: 500 })
  }
}
