'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  Package, Lock, DollarSign, Layers, CreditCard, Crown, Users, Plus,
  LogOut, RefreshCw, Search, Filter, Edit3, Trash2, CheckCircle,
  TrendingUp, AlertTriangle, Truck, Clock
} from 'lucide-react'
import { STATUS_LABELS } from '@/lib/constants'
import { formatDate, formatCurrency, cn } from '@/lib/utils'

const STATUSES = ['pending','picked_up','in_transit','out_for_delivery','delivered','exception','held','returned']
const TYPE_LABELS: Record<string, string> = {
  physical: 'Physical', digital: 'Sensitive File', money: 'Financial', consignment: 'Consignment'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activePanel, setActivePanel] = useState('all')
  const [searchQ, setSearchQ] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [editingShipment, setEditingShipment] = useState<any>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [tlText, setTlText] = useState('')
  const [tlLoc, setTlLoc] = useState('')
  const [msgType, setMsgType] = useState('info')
  const [msgTitle, setMsgTitle] = useState('')
  const [msgBody, setMsgBody] = useState('')
  const [msgAction, setMsgAction] = useState('')
  const [adminImages, setAdminImages] = useState<string[]>([])

  const fetchShipments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterType) params.set('type', filterType)
      if (filterStatus) params.set('status', filterStatus)
      const res = await fetch(`/api/admin/shipments?${params}`)
      if (res.status === 401) { router.push('/admin/login'); return }
      const data = await res.json()
      setShipments(data.shipments || [])
    } catch { toast.error('Failed to load shipments') }
    finally { setLoading(false) }
  }, [filterType, filterStatus, router])

  useEffect(() => { fetchShipments() }, [fetchShipments])

  async function logout() {
    await fetch('/api/auth/admin', { method: 'DELETE' })
    router.push('/admin/login')
  }

  async function confirmPayment(id: string, currentTimeline: any[]) {
    const updates = {
      id,
      payment: { status: 'confirmed', confirmed_at: new Date().toISOString() },
      status: 'picked_up',
      timeline: [...currentTimeline, {
        text: '✅ Crypto payment confirmed and verified',
        location: '',
        time: new Date().toISOString(),
        type: 'info'
      }]
    }
    const res = await fetch('/api/admin/shipments', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (res.ok) { toast.success('Payment confirmed'); fetchShipments() }
    else toast.error('Failed')
  }

  async function deleteShipment(id: string) {
    if (!confirm('Delete this shipment permanently?')) return
    const res = await fetch('/api/admin/shipments', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) { toast.success('Deleted'); fetchShipments() }
  }

  function openEdit(s: any) {
    setEditingShipment(s)
    setEditForm({ ...s })
    setAdminImages(s.images || [])
    setMsgTitle(s.admin_message?.title || '')
    setMsgBody(s.admin_message?.body || '')
    setMsgAction(s.admin_message?.action || '')
    setMsgType(s.admin_message?.type || 'info')
  }

  function addTLEntry() {
    if (!tlText.trim()) return
    const newEntry = { text: tlText, location: tlLoc, time: new Date().toISOString(), type: 'normal' }
    setEditForm((p: any) => ({ ...p, timeline: [...(p.timeline || []), newEntry] }))
    setTlText(''); setTlLoc('')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAdminImages(p => [...p, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    }
    toast.success('Image(s) added')
  }

  async function saveEdit() {
    const updates = {
      id: editingShipment.id,
      status: editForm.status,
      service: editForm.service,
      current_location: editForm.current_location,
      eta: editForm.eta,
      declared_value: editForm.declared_value,
      timeline: editForm.timeline,
      images: adminImages,
      agent_info: editForm.agent_info,
      admin_message: msgBody ? { type: msgType, title: msgTitle, body: msgBody, action: msgAction, created_at: new Date().toISOString() } : null,
    }
    const res = await fetch('/api/admin/shipments', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (res.ok) {
      toast.success('Shipment updated')
      setEditingShipment(null)
      fetchShipments()
    } else toast.error('Update failed')
  }

  const filtered = shipments.filter(s => {
    const q = searchQ.toLowerCase()
    return !q || s.tracking_number.toLowerCase().includes(q) ||
      s.sender?.name?.toLowerCase().includes(q) ||
      s.recipient?.name?.toLowerCase().includes(q) ||
      s.sender?.country?.toLowerCase().includes(q) ||
      s.recipient?.country?.toLowerCase().includes(q)
  })

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => ['in_transit','picked_up','out_for_delivery'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    exceptions: shipments.filter(s => ['exception','held'].includes(s.status)).length,
    pendingPay: shipments.filter(s => s.payment?.status === 'pending').length,
  }

  const navItems = [
    { id: 'all', label: 'All Shipments', icon: Package, count: stats.total },
    { id: 'physical', label: 'Physical', icon: Package },
    { id: 'digital', label: 'Sensitive Files', icon: Lock },
    { id: 'money', label: 'Financial', icon: DollarSign },
    { id: 'consignment', label: 'Consignments', icon: Layers },
    { id: 'payments', label: 'Crypto Payments', icon: CreditCard, count: stats.pendingPay },
    { id: 'vip', label: 'VIP Members', icon: Crown },
    { id: 'clients', label: 'Clients', icon: Users },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: '#060D1A' }}>
      {/* SIDEBAR */}
      <aside className="w-[230px] flex-shrink-0 border-r flex flex-col" style={{ borderColor: '#1E3A5C' }}>
        <div className="p-5 border-b" style={{ borderColor: '#1E3A5C' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-navy"
              style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)' }}>VX</div>
            <div>
              <div className="font-display font-black text-white text-[15px]">VAULT EXPRESS</div>
              <div className="text-white/30 text-[10px]">Admin Only</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-[9px] font-bold uppercase tracking-[.14em] text-white/20 px-2 mb-2 mt-2">Shipments</div>
          {navItems.slice(0,5).map(item => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => { setActivePanel(item.id); if(item.id !== 'all') setFilterType(item.id === 'all' ? '' : item.id) }}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all mb-0.5',
                  activePanel === item.id ? 'text-gold-300' : 'text-white/45 hover:text-white hover:bg-white/6')}
                style={activePanel === item.id ? { background: 'rgba(196,154,10,0.18)', boxShadow: 'inset 3px 0 0 #E6AF1A' } : {}}>
                <Icon size={15} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
          
          <div className="text-[9px] font-bold uppercase tracking-[.14em] text-white/20 px-2 mb-2 mt-4">Finance & Members</div>
          {navItems.slice(5).map(item => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => setActivePanel(item.id)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all mb-0.5',
                  activePanel === item.id ? 'text-gold-300' : 'text-white/45 hover:text-white hover:bg-white/6')}
                style={activePanel === item.id ? { background: 'rgba(196,154,10,0.18)', boxShadow: 'inset 3px 0 0 #E6AF1A' } : {}}>
                <Icon size={15} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Live stats */}
        <div className="p-3 border-t" style={{ borderColor: '#1E3A5C' }}>
          {[
            { label: 'In Transit', value: stats.inTransit },
            { label: 'Delivered', value: stats.delivered },
            { label: 'Exceptions', value: stats.exceptions },
          ].map(s => (
            <div key={s.label} className="flex justify-between items-center px-3 py-2 rounded-lg mb-1"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-white/35 text-[10px] font-semibold">{s.label}</span>
              <span className="font-display font-black text-gold-300 text-[22px] leading-none">{s.value}</span>
            </div>
          ))}
          <button onClick={logout}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-7" style={{ background: '#F7F9FC' }}>
        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: '#1D4ED8', icon: Package },
            { label: 'In Transit', value: stats.inTransit, color: '#D97706', icon: Truck },
            { label: 'Delivered', value: stats.delivered, color: '#059669', icon: CheckCircle },
            { label: 'Exceptions', value: stats.exceptions, color: '#DC2626', icon: AlertTriangle },
            { label: 'Pay Pending', value: stats.pendingPay, color: '#7C3AED', icon: Clock },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:-translate-y-0.5 transition-all">
                <div className="font-display font-black text-[36px] leading-none" style={{ color: s.color }}>{s.value}</div>
                <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide mt-1">{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* Table header */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-4 flex-wrap">
            <h2 className="font-bold text-gray-900 text-[15px]">
              {activePanel === 'all' ? 'All Shipments' : TYPE_LABELS[activePanel] || activePanel}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search…"
                  className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[12px] outline-none w-[220px] focus:border-amber-400" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-[12px] outline-none focus:border-amber-400 bg-white cursor-pointer">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <button onClick={fetchShipments} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <RefreshCw size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 text-[14px]">Loading shipments…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {['Tracking #','Type','Sender','Recipient','Route','Status','Payment','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-display font-bold text-[16px] text-navy tracking-wide">{s.tracking_number}</span>
                        {s.is_vip && <span className="ml-1 text-[9px]">👑</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full',
                          s.type === 'physical' ? 'bg-blue-50 text-blue-700' :
                          s.type === 'digital' ? 'bg-purple-50 text-purple-700' :
                          s.type === 'money' ? 'bg-green-50 text-green-700' :
                          'bg-cyan-50 text-cyan-700')}>
                          {TYPE_LABELS[s.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[12px] text-gray-900">{s.sender?.name}</div>
                        <div className="text-[10px] text-gray-400">{s.sender?.country}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[12px] text-gray-900">{s.recipient?.name}</div>
                        <div className="text-[10px] text-gray-400">{s.recipient?.country}</div>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-gray-400">
                        {s.sender?.country?.substring(0,8)}<br/>→ {s.recipient?.country?.substring(0,8)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full',
                          `status-${s.status}`)}>
                          {STATUS_LABELS[s.status]}
                        </span>
                        {s.admin_message && <div className="text-[9px] text-amber-600 mt-0.5">💬 msg</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-bold',
                          s.payment?.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600')}>
                          {s.payment ? (s.payment.status === 'confirmed' ? '✅ ' : '⏳ ') + s.payment.coin : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button onClick={() => openEdit(s)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-semibold hover:bg-blue-100 transition-all">
                            <Edit3 size={10} /> Edit
                          </button>
                          {s.payment?.status === 'pending' && (
                            <button onClick={() => confirmPayment(s.id, s.timeline || [])}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-semibold hover:bg-emerald-100 transition-all">
                              <CheckCircle size={10} /> Pay
                            </button>
                          )}
                          <button onClick={() => deleteShipment(s.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-semibold hover:bg-red-100 transition-all">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr><td colSpan={8} className="py-16 text-center text-gray-400 text-[14px]">No shipments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      {editingShipment && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          style={{ background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-[680px] shadow-[0_28px_90px_rgba(0,0,0,0.4)] my-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-black text-[26px] text-navy">Edit Shipment</h3>
              <button onClick={() => setEditingShipment(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="form-label">Status</label>
                <select value={editForm.status || ''} onChange={e => setEditForm((p:any) => ({...p, status: e.target.value}))} className="form-select">
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Declared Value ($)</label>
                <input type="number" value={editForm.declared_value || ''} onChange={e => setEditForm((p:any) => ({...p, declared_value: e.target.value}))} className="form-input" />
              </div>
              <div className="col-span-2">
                <label className="form-label">Current Location (shown live to client)</label>
                <input value={editForm.current_location || ''} onChange={e => setEditForm((p:any) => ({...p, current_location: e.target.value}))} placeholder="e.g. Memphis Distribution Hub, TN, USA" className="form-input" />
              </div>
              <div>
                <label className="form-label">Est. Delivery Date</label>
                <input value={editForm.eta || ''} onChange={e => setEditForm((p:any) => ({...p, eta: e.target.value}))} className="form-input" />
              </div>
            </div>

            {/* Agent info for physical */}
            {(editingShipment.type === 'physical' || editingShipment.type === 'consignment') && (
              <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
                <div className="text-[11px] font-bold text-gray-700 mb-3">📅 Agent Pickup Schedule</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Agent Name</label>
                    <input value={editForm.agent_info?.name || ''} onChange={e => setEditForm((p:any) => ({...p, agent_info: {...(p.agent_info||{}), name: e.target.value}}))} placeholder="Agent John Rivera" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Agent Phone</label>
                    <input value={editForm.agent_info?.phone || ''} onChange={e => setEditForm((p:any) => ({...p, agent_info: {...(p.agent_info||{}), phone: e.target.value}}))} placeholder="+1 800 123 4567" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Pickup Date</label>
                    <input type="date" value={editForm.agent_info?.date || ''} onChange={e => setEditForm((p:any) => ({...p, agent_info: {...(p.agent_info||{}), date: e.target.value}}))} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Time Window</label>
                    <input value={editForm.agent_info?.time_window || ''} onChange={e => setEditForm((p:any) => ({...p, agent_info: {...(p.agent_info||{}), time_window: e.target.value}}))} placeholder="10:00 AM – 2:00 PM" className="form-input" />
                  </div>
                </div>
              </div>
            )}

            {/* Image upload */}
            <div className="mb-5">
              <div className="text-[11px] font-bold text-gray-700 mb-2">📸 Shipment Photos (visible to client when tracking)</div>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                <div className="text-[28px]">🖼️</div>
                <div className="text-[13px] font-semibold text-gray-600">Click to upload shipment photos</div>
                <div className="text-[11px] text-gray-400">JPG, PNG, WEBP</div>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
              {adminImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {adminImages.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="w-20 h-16 object-cover rounded-lg border border-gray-200" />
                      <button onClick={() => setAdminImages(p => p.filter((_,j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="mb-5 border-t border-gray-100 pt-5">
              <div className="text-[11px] font-bold text-gray-700 mb-3">📍 Tracking Timeline</div>
              <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
                {(editForm.timeline || []).map((ev: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex-1">
                      <div className="text-[12px] font-semibold text-gray-800">{ev.text}</div>
                      {ev.location && <div className="text-[10px] text-blue-600">📍 {ev.location}</div>}
                      <div className="text-[10px] text-gray-400">{formatDate(ev.time)}</div>
                    </div>
                    <button onClick={() => setEditForm((p:any) => ({...p, timeline: p.timeline.filter((_:any, j:number) => j !== i)}))}
                      className="text-red-400 hover:text-red-600 text-[12px] font-bold">✕</button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input value={tlText} onChange={e => setTlText(e.target.value)} placeholder="Update text…" className="form-input text-[12px]" />
                <input value={tlLoc} onChange={e => setTlLoc(e.target.value)} placeholder="Location (optional)" className="form-input text-[12px]" />
              </div>
              <button onClick={addTLEntry} className="w-full py-2 bg-navy text-white rounded-lg text-[12px] font-bold hover:bg-navy-50 transition-all">
                + Add Tracking Update
              </button>
            </div>

            {/* Admin message */}
            <div className="mb-5 border-t border-gray-100 pt-5">
              <div className="text-[11px] font-bold text-gray-700 mb-3">💬 Admin Message to Client</div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {(['warning','danger','info','success'] as const).map(t => (
                  <button key={t} onClick={() => setMsgType(t)}
                    className={cn('px-3 py-1.5 rounded-lg text-[11px] font-bold border-2 transition-all',
                      msgType === t ? (t === 'warning' ? 'border-amber-400 bg-amber-50 text-amber-800' :
                        t === 'danger' ? 'border-red-400 bg-red-50 text-red-800' :
                        t === 'info' ? 'border-blue-400 bg-blue-50 text-blue-800' :
                        'border-emerald-400 bg-emerald-50 text-emerald-800') :
                      'border-gray-200 bg-white text-gray-600')}>
                    {t === 'warning' ? '⚠️ Warning' : t === 'danger' ? '🚨 Urgent' : t === 'info' ? 'ℹ️ Info' : '✅ Good News'}
                  </button>
                ))}
              </div>
              <input value={msgTitle} onChange={e => setMsgTitle(e.target.value)} placeholder="Message title" className="form-input mb-2" />
              <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)} placeholder="Message body for the client…" rows={3} className="form-input mb-2 resize-y" />
              <input value={msgAction} onChange={e => setMsgAction(e.target.value)} placeholder="Action button text (optional)" className="form-input" />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button onClick={() => setEditingShipment(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="px-7 py-2.5 gold-gradient text-navy rounded-xl text-[13px] font-black hover:brightness-110 transition-all">Save All Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
