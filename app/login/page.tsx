'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [tab, setTab] = useState<'signin'|'register'>(params.get('tab') === 'register' ? 'register' : 'signin')
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setError('')
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email: form.email, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid email or password'); return }
      router.push('/dashboard')
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email: form.email, password: form.password, name: form.name, phone: form.phone })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      setSuccess('Account created! Signing you in…')
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const vipFeats = [
    '✈️ Free shipping for 12 months',
    '⚡ Same-day agent pickup',
    '👤 Dedicated account manager',
    '🔝 Highest priority on every order',
    '🔒 Enhanced security clearance',
    '📊 Advanced tracking analytics',
  ]

  return (
    <div className="min-h-[calc(100vh-66px)] bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Auth Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="text-center mb-7">
            <div className="w-16 h-16 mx-auto mb-4 rounded-[18px] flex items-center justify-center font-black text-xl"
              style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A, #F5CE55)', color: '#060D1A' }}>VX</div>
            <h1 className="font-display font-black text-[28px]" style={{ color: '#060D1A' }}>Client Portal</h1>
            <p className="text-gray-400 text-[13px] mt-1">Access rewards, shipments & VIP benefits</p>
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {(['signin','register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all ${tab === t ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                style={tab === t ? { background: '#060D1A' } : {}}>
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700 font-medium">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[13px] text-emerald-700 font-medium">{success}</div>
          )}

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Email Address</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="john@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[14px] outline-none transition-all focus:border-yellow-400" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[14px] outline-none transition-all focus:border-yellow-400" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 font-black text-[15px] rounded-xl hover:brightness-110 transition-all mt-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)', color: '#060D1A' }}>
                {loading ? 'Signing in…' : 'Sign In to My Account'}
              </button>
              <p className="text-center text-[12px] text-gray-400">
                No account?{' '}
                <button type="button" onClick={() => setTab('register')} className="font-bold" style={{ color: '#C49A0A' }}>
                  Create one →
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Full Name *</label>
                <input value={form.name} onChange={set('name')} placeholder="John Smith"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[14px] outline-none transition-all focus:border-yellow-400" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="john@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[14px] outline-none transition-all focus:border-yellow-400" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Password *</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[14px] outline-none transition-all focus:border-yellow-400" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Phone (optional)</label>
                <input value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[14px] outline-none transition-all focus:border-yellow-400" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 font-black text-[15px] rounded-xl hover:brightness-110 transition-all mt-1 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)', color: '#060D1A' }}>
                {loading ? 'Creating account…' : 'Create My Account'}
              </button>
              <p className="text-center text-[12px] text-gray-400">
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('signin')} className="font-bold" style={{ color: '#C49A0A' }}>
                  Sign in →
                </button>
              </p>
            </form>
          )}
        </div>

        {/* VIP Card */}
        <div className="rounded-2xl p-7 text-center"
          style={{ background: 'linear-gradient(135deg, #1a1a30 0%, #12192e 40%, #0a1020 100%)', border: '1px solid rgba(196,154,10,0.2)' }}>
          <div className="text-[44px] mb-3">👑</div>
          <h2 className="font-display font-black text-[26px] mb-2"
            style={{ background: 'linear-gradient(135deg, #F5CE55, #E6AF1A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            VIP Membership
          </h2>
          <p className="text-white/55 text-[13px] leading-relaxed mb-5">
            One subscription. Unlimited shipping. Every order treated with absolute highest priority.
          </p>
          <div className="space-y-2 mb-5 text-left">
            {vipFeats.map(f => (
              <div key={f} className="flex items-center gap-2.5 text-[12px] text-white/75 py-2 px-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {f}
              </div>
            ))}
          </div>
          <div className="font-display font-black text-white text-[52px] leading-none mb-1">
            <span className="text-[22px] text-white/35">$</span>500<span className="text-[22px] text-white/35">/yr</span>
          </div>
          <p className="text-white/30 text-[11px] mb-5">Less than $42/month for unlimited global shipping</p>
          <button className="w-full py-3.5 rounded-xl font-black text-[15px] transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #FFD700, #F5A623)', color: '#0a0a15', boxShadow: '0 5px 20px rgba(255,166,0,0.4)' }}>
            🔓 Activate VIP Now
          </button>
          <p className="text-white/30 text-[11px] mt-3">Register or sign in first to activate VIP</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
        <LoginForm />
      </Suspense>
      <Footer />
    </>
  )
}
