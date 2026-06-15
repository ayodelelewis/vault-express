import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, getAdminCookieName } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const validUser = process.env.ADMIN_USERNAME || 'admin'
    const validPass = process.env.ADMIN_PASSWORD || 'VaultExpress2026!'

    if (username !== validUser || password !== validPass) {
      await new Promise(r => setTimeout(r, 1000)) // Brute force delay
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createAdminToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(getAdminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(getAdminCookieName())
  return response
}
