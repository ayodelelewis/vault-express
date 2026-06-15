import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'VaultExpressSecretKey2026SuperStrong!!'
)

async function createClientToken(userId: string, email: string) {
  return new SignJWT({ userId, email, role: 'client' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (action === 'register') {
      if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

      // Check existing
      const { data: existing } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Email already registered. Please sign in.' }, { status: 409 })
      }

      const password_hash = await bcrypt.hash(password, 12)

      const { data, error } = await supabaseAdmin
        .from('clients')
        .insert({
          email: email.toLowerCase(),
          name,
          phone: phone || null,
          password_hash,
          is_vip: false,
          shipment_count: 0,
        })
        .select()
        .single()

      if (error) throw error

      const token = await createClientToken(data.id, data.email)
      const response = NextResponse.json({ success: true, user: { id: data.id, email: data.email, name: data.name, is_vip: false } })
      response.cookies.set('vx_client_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
      return response
    }

    if (action === 'signin') {
      const { data: client, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error || !client) {
        await new Promise(r => setTimeout(r, 500))
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      const valid = await bcrypt.compare(password, client.password_hash)
      if (!valid) {
        await new Promise(r => setTimeout(r, 500))
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      const token = await createClientToken(client.id, client.email)
      const response = NextResponse.json({
        success: true,
        user: { id: client.id, email: client.email, name: client.name, is_vip: client.is_vip, vip_expires_at: client.vip_expires_at }
      })
      response.cookies.set('vx_client_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
      return response
    }

    if (action === 'signout') {
      const response = NextResponse.json({ success: true })
      response.cookies.delete('vx_client_session')
      return response
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('vx_client_session')?.value
    if (!token) return NextResponse.json({ user: null }, { status: 401 })

    const { jwtVerify } = await import('jose')
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('id, email, name, phone, is_vip, vip_expires_at, shipment_count, created_at')
      .eq('id', userId)
      .single()

    if (error || !client) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({ user: client })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
