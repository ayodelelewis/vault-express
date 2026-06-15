'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', picked_up: 'Picked Up', in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  exception: 'Exception', held: 'On Hold', returned: 'Returned',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800', picked_up: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-purple-100 text-purple-800', out_for_delivery: 'bg-emerald-100 text-emerald-800',
  delivered: 'bg-green-100 text-green-800', exception: 'bg-red-100 text-red-800',
  held: 'bg-orange-100 text-orange-800', returned: 'bg-gray-100 text-gray-800',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/client')
      .then(res => res.ok ? res.json() : null)
      .then(async data => {
        if (!data?.user) { router.push('/login'); return }
        setUser(data.user)
        // Fetch this client's shipments
        const res = await fetch(`/api/shipments/client?email=${encodeURIComponent(data.user.email)}`)
        if (res.ok) {
          const d = await res.json()
          setShipments(d.shipments || [])
        }
        setLoading(false)
      })
      .catch(() => router.push('/login'))
  }, [router])

  async function signOut() {
    await fetch('/api/auth/client', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'signout' }) })
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-500 font-medium">Loading your dashboard…</p>
      </div>
    </div>
  )

  const active = shipments.filter(s => !['delivered','returned'].includes(s.status)).length
  const delivered = shipments.filter(s => s.status === 'delivered').length
  const isVip = user?.is_vip

  const rewards = [
    { icon: '✈️', name: 'Free Shipping', desc: 'All shipments free for 12 months' },
    { icon: '⚡', name: 'Same-Day Pickup', desc: 'Priority agent dispatch, 2–4 hours' },
    { icon: '👤', name: 'Dedicated Manager', desc: 'Direct line to your personal manager' },
    { icon: '🔝', name: 'Priority Handling', desc: 'Your orders always jump the queue' },
    { icon: '🔒', name: 'Enhanced Security', desc: 'Expedited customs & inspection' },
    { icon: '📊', name: 'Advanced Analytics', desc: 'Detailed delivery insights' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-66px)] bg-gray-50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-display font-black text-[34px]" style={{ color: '#060D1A' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Client'} 👋
              </h1>
              <p className="text-gray-400 text-[14px] mt-1">Your shipments and account overview</p>
              {isVip ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold mt-2"
                  style={{ background: 'linear-gradient(135deg, #1a1a30, #2d2d50)', color: '#F5CE55', border: '1px solid rgba(245,206,85,0.3)' }}>
                  👑 VIP Member — Free Shipping Active
                  {user?.vip_expires_at && ` · Expires ${new Date(user.vip_expires_at).toLocaleDateString()}`}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold mt-2 bg-gray-100 text-gray-500">
                  🔓 Standard Account
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/ship"
                className="flex items-center gap-2 px-5 py-2.5 font-black text-[13px] rounded-xl"
                style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)', color: '#060D1A' }}>
                📦 New Shipment
              </Link>
              <button onClick={signOut}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 font-semibold text-[13px] rounded-xl hover:bg-red-100 transition-all">
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { n: shipments.length, l: 'Total Shipments', c: '#1D4ED8' },
              { n: active, l: 'Active', c: '#D97706' },
              { n: delivered, l: 'Delivered', c: '#059669' },
              { n: isVip ? `$${(shipments.length * 49.99).toFixed(0)}` : '$0', l: 'VIP Savings', c: '#7C3AED' },
            ].map(s => (
              <div key={s.l} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="font-display font-black text-[40px] leading-none" style={{ color: s.c }}>{s.n}</div>
                <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipments */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[15px] mb-5" style={{ color: '#060D1A' }}>📦 My Shipments</h3>
              {shipments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3 opacity-30">📦</div>
                  <p className="text-gray-400 text-[14px] font-medium">No shipments yet</p>
                  <p className="text-gray-300 text-[12px] mt-1">Create your first shipment below</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {shipments.slice(0, 6).map(s => (
                    <div key={s.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="font-display font-bold text-[16px]" style={{ color: '#060D1A' }}>{s.tracking_number}</div>
                        <div className="text-gray-400 text-[12px] mt-0.5">{s.category} · {s.sender?.country} → {s.recipient?.country}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[s.status] || s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/ship"
                className="mt-4 block w-full py-3 font-black text-[14px] rounded-xl text-center"
                style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)', color: '#060D1A' }}>
                + Create New Shipment
              </Link>
              {shipments.length > 0 && (
                <Link href="/track"
                  className="mt-2 block w-full py-2.5 font-semibold text-[13px] rounded-xl text-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all border border-gray-200">
                  🔍 Track a Shipment
                </Link>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[15px] mb-5" style={{ color: '#060D1A' }}>🎁 VIP Benefits</h3>
              <div className="space-y-2">
                {rewards.map(r => (
                  <div key={r.name} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[22px]">{r.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-[13px]">{r.name}</div>
                      <div className="text-gray-400 text-[11px]">{r.desc}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isVip ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-400'}`}>
                      {isVip ? 'Active' : 'VIP Only'}
                    </span>
                  </div>
                ))}
              </div>
              {!isVip && (
                <div className="mt-4 p-5 rounded-xl text-center"
                  style={{ background: 'linear-gradient(135deg, #1a1a30, #12192e)', border: '1px solid rgba(196,154,10,0.2)' }}>
                  <div className="text-[28px] mb-2">👑</div>
                  <div className="font-bold text-[15px] mb-1"
                    style={{ background: 'linear-gradient(135deg, #F5CE55, #E6AF1A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Unlock All Benefits
                  </div>
                  <div className="text-white/50 text-[12px] mb-3">$500/year — unlimited free shipping for 12 months</div>
                  <button className="px-6 py-2.5 rounded-xl font-black text-[13px] transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #F5A623)', color: '#0a0a15' }}>
                    Activate VIP →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account info */}
          <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[15px] mb-4" style={{ color: '#060D1A' }}>👤 Account Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { l: 'Full Name', v: user?.name },
                { l: 'Email', v: user?.email },
                { l: 'Phone', v: user?.phone || 'Not provided' },
                { l: 'Member Since', v: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
              ].map(item => (
                <div key={item.l} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{item.l}</div>
                  <div className="font-semibold text-gray-800 text-[13px] truncate">{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
