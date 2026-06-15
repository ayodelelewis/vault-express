'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Access granted')
        router.push('/admin')
        router.refresh()
      } else {
        toast.error('Invalid credentials')
      }
    } catch {
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#060D1A' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-10 border" style={{ background: '#0D1F35', borderColor: '#1E3A5C' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center font-black text-lg"
              style={{ background: 'linear-gradient(135deg, #C81E1E, #991B1B)', color: '#fff' }}>
              🔐
            </div>
            <h1 className="font-display font-black text-white text-[28px]">Admin Access</h1>
            <p className="text-white/40 text-[13px] mt-2">Vault Express Operations Center<br/>Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-[14px] font-medium outline-none border-2 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#1E3A5C', color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#E6AF1A'}
                onBlur={e => e.target.style.borderColor = '#1E3A5C'}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-[14px] font-medium outline-none border-2 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#1E3A5C', color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#E6AF1A'}
                onBlur={e => e.target.style.borderColor = '#1E3A5C'}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-[15px] transition-all mt-2"
              style={{ background: 'linear-gradient(135deg, #C81E1E, #991B1B)', color: '#fff' }}>
              {loading ? 'Verifying…' : 'Access Control Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
