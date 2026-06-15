'use client'
import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Search, MapPin, Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { STATUS_LABELS } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'

const STEPS = ['pending','picked_up','in_transit','out_for_delivery','delivered']

export default function TrackPage() {
  const [trackNum, setTrackNum] = useState('')
  const [shipment, setShipment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function doTrack() {
    if (!trackNum.trim()) return
    setLoading(true); setNotFound(false); setShipment(null)
    try {
      const res = await fetch(`/api/track?number=${encodeURIComponent(trackNum.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setShipment(data.shipment)
      } else setNotFound(true)
    } catch { setNotFound(true) }
    finally { setLoading(false) }
  }

  const si = shipment ? STEPS.indexOf(shipment.status) : -1
  const m = shipment?.admin_message

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-66px)] bg-gray-50">
        {/* Header */}
        <div className="navy-gradient py-16 px-6 text-center" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,154,10,0.1) 0%, transparent 70%)' }} />
          <div className="relative max-w-xl mx-auto">
            <h1 className="font-display font-black text-white text-[52px] leading-none mb-3">
              Track Your <span className="gold-text">Shipment</span>
            </h1>
            <p className="text-white/50 text-[15px] mb-8">Live status, full timeline, and admin messages in real time</p>
            <div className="flex gap-3">
              <input
                value={trackNum}
                onChange={e => setTrackNum(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && doTrack()}
                placeholder="Enter tracking number e.g. VXAB123456"
                className="flex-1 px-5 py-4 rounded-xl text-[15px] font-medium outline-none border-2 transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
                onFocus={e => { e.target.style.borderColor = '#E6AF1A'; e.target.style.background = 'rgba(255,255,255,0.12)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
              />
              <button onClick={doTrack} disabled={loading}
                className="px-7 py-4 gold-gradient text-navy font-black text-[14px] rounded-xl shadow-gold hover:brightness-110 transition-all whitespace-nowrap">
                {loading ? 'Searching…' : 'Track →'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">
          {notFound && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-[16px] font-semibold">No shipment found</p>
              <p className="text-[13px] mt-1">Check your tracking number and try again</p>
            </div>
          )}

          {shipment && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-fadeUp">
              {/* Header */}
              <div className="navy-gradient px-7 py-6 flex justify-between items-start flex-wrap gap-4" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,154,10,0.08) 0%, transparent 70%)' }} />
                <div className="relative">
                  <h2 className="text-white font-bold text-[18px] mb-1">
                    {shipment.category}
                    {shipment.items?.length ? `: ${shipment.items.map((i: any) => i.description).join(', ')}` : ''}
                  </h2>
                  <p className="text-white/50 text-[12px]">
                    {shipment.tracking_number} · {shipment.service} · {shipment.sender?.country} → {shipment.recipient?.country}
                  </p>
                </div>
                <div className="relative text-right">
                  <span className={cn('inline-block px-4 py-1.5 rounded-full text-[11px] font-bold', `status-${shipment.status}`)}>
                    {STATUS_LABELS[shipment.status]}
                  </span>
                  {shipment.payment && (
                    <div className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold mt-2',
                      shipment.payment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                      {shipment.payment.status === 'confirmed' ? '✅ Payment Confirmed' : '⏳ Payment Pending'}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-7">
                {/* Admin images */}
                {shipment.images?.length > 0 && (
                  <div className="mb-5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">📸 Shipment Photos</div>
                    <div className="flex gap-2 flex-wrap">
                      {shipment.images.map((src: string, i: number) => (
                        <img key={i} src={src} alt="" onClick={() => window.open(src, '_blank')}
                          className="w-24 h-20 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition-all" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Current location */}
                {shipment.current_location && (
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full animate-glow flex-shrink-0" style={{ background: '#E6AF1A' }} />
                    <div>
                      <div className="font-bold text-gray-900 text-[14px]">{shipment.current_location}</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">Current known location</div>
                    </div>
                  </div>
                )}

                {/* Agent info */}
                {shipment.agent_info?.name && ['pending','picked_up'].includes(shipment.status) && (
                  <div className="mb-4 border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[18px]">📅</span>
                      <span className="font-bold text-blue-900 text-[14px]">Agent Pickup Scheduled</span>
                    </div>
                    <p className="text-blue-800 text-[13px] leading-relaxed">
                      <strong>Agent:</strong> {shipment.agent_info.name} — {shipment.agent_info.phone}<br/>
                      <strong>Date:</strong> {shipment.agent_info.date} · <strong>Window:</strong> {shipment.agent_info.time_window}
                    </p>
                  </div>
                )}

                {/* Admin message */}
                {m?.body && (
                  <div className={cn('mb-5 rounded-xl p-4 border-2',
                    m.type === 'warning' ? 'bg-amber-50 border-amber-300' :
                    m.type === 'danger' ? 'bg-red-50 border-red-300' :
                    m.type === 'info' ? 'bg-blue-50 border-blue-300' :
                    'bg-emerald-50 border-emerald-300')}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[20px]">
                        {m.type === 'warning' ? '⚠️' : m.type === 'danger' ? '🚨' : m.type === 'info' ? 'ℹ️' : '✅'}
                      </span>
                      <span className={cn('font-bold text-[14px]',
                        m.type === 'warning' ? 'text-amber-900' : m.type === 'danger' ? 'text-red-900' :
                        m.type === 'info' ? 'text-blue-900' : 'text-emerald-900')}>
                        {m.title || 'Notice from Vault Express'}
                      </span>
                    </div>
                    <p className={cn('text-[13px] leading-relaxed',
                      m.type === 'warning' ? 'text-amber-800' : m.type === 'danger' ? 'text-red-800' :
                      m.type === 'info' ? 'text-blue-800' : 'text-emerald-800')}>
                      {m.body}
                    </p>
                    {m.action && (
                      <button className="mt-3 px-4 py-2 rounded-lg text-[13px] font-bold text-white"
                        style={{ background: m.type === 'warning' ? '#F59E0B' : m.type === 'danger' ? '#DC2626' : m.type === 'info' ? '#1D4ED8' : '#059669' }}>
                        {m.action}
                      </button>
                    )}
                  </div>
                )}

                {/* Progress steps */}
                <div className="flex items-start mb-4">
                  {STEPS.map((st, i) => (
                    <div key={st} className="flex items-start flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2',
                          si > i ? 'bg-navy border-navy text-white' :
                          si === i ? 'border-gold-400 text-navy animate-glow' : 'border-gray-200 bg-white text-gray-400')}
                          style={si === i ? { background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)' } : {}}>
                          {si > i ? '✓' : i + 1}
                        </div>
                        <div className={cn('text-[9px] font-bold text-center mt-1.5 max-w-[64px] leading-tight uppercase tracking-wide',
                          si >= i ? 'text-gray-800' : 'text-gray-400')}>
                          {STATUS_LABELS[st]}
                        </div>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn('flex-1 h-0.5 mt-4', si > i ? 'bg-navy' : 'bg-gray-200')} />
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-gray-400 text-[13px] mb-1">
                  Est. delivery: <strong className="text-gray-800">{shipment.eta || '—'}</strong>
                </p>

                {/* Timeline */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Tracking History</div>
                  <div className="space-y-3">
                    {[...(shipment.timeline || [])].reverse().map((ev: any, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 border-2',
                          ev.type === 'issue' ? 'bg-red-500 border-red-500' :
                          ev.type === 'done' ? 'bg-emerald-500 border-emerald-500' :
                          ev.type === 'info' ? 'bg-blue-500 border-blue-500' :
                          'border-gold-400 bg-gold-400')} />
                        <div>
                          <div className="font-semibold text-gray-900 text-[13px]">{ev.text}</div>
                          {ev.location && <div className="text-blue-600 text-[11px] font-medium mt-0.5">📍 {ev.location}</div>}
                          <div className="text-gray-400 text-[11px] mt-0.5">{formatDate(ev.time)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
