import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'VaultExpressSecretKey2026SuperStrong!!'
)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('vx_client_session')?.value
    if (!token) return NextResponse.json({ shipments: [] }, { status: 401 })

    const { payload } = await jwtVerify(token, secret)
    const email = payload.email as string

    const { data, error } = await supabaseAdmin
      .from('shipments')
      .select('*')
      .eq('client_id', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ shipments: data || [] })
  } catch {
    return NextResponse.json({ shipments: [] })
  }
}
