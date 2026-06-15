'use client'
import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Check, Plus, X, Copy, Upload } from 'lucide-react'
import { COUNTRIES, WALLETS, SERVICE_TIERS, HIGH_TARIFF_COUNTRIES } from '@/lib/constants'
import { calculatePrice, calculateETA, cn, formatBytes } from '@/lib/utils'

const SHIP_TYPES = [
  { id: 'physical', icon: '📦', label: 'Physical Item', desc: 'Packages and goods. Agent dispatched for pickup.', fee: 'Standard rates', feeColor: 'text-emerald-700 bg-emerald-50' },
  { id: 'digital', icon: '🔒', label: 'Sensitive File', desc: 'AES-256 encrypted document transfer.', fee: '3× Premium rate', feeColor: 'text-amber-700 bg-amber-50' },
  { id: 'money', icon: '💰', label: 'Financial Transfer', desc: 'Currency, bullion. Full AML/KYC compliance.', fee: '5× Premium rate', feeColor: 'text-red-700 bg-red-50' },
  { id: 'consignment', icon: '🗂️', label: 'Consignment', desc: 'Bulk commercial freight, any scale.', fee: 'Commercial rates', feeColor: 'text-amber-700 bg-amber-50' },
]

const COINS = ['BTC','ETH','USDT','USDC'] as const
const STEPS = ['Type & Items','Addresses','Documents','Review','Payment']

interface Item { desc: string; qty: number; weight: number }

export default function ShipWizard({ defaultType }: { defaultType: string }) {
  const [step, setStep] = useState(0)
  const [type, setType] = useState(defaultType)
  const [items, setItems] = useState<Item[]>([{ desc: '', qty: 1, weight: 0.5 }])
  const [service, setService] = useState('express')
  const [declaredVal, setDeclaredVal] = useState(0)
  const [notes, setNotes] = useState('')
  const [sender, setSender] = useState({ name:'',phone:'',email:'',address:'',country:'' })
  const [recip, setRecip] = useState({ name:'',phone:'',email:'',address:'',country:'' })
  const [file1, setFile1] = useState<File|null>(null)
  const [file2, setFile2] = useState<File|null>(null)
  const [moneyAmt, setMoneyAmt] = useState(0)
  const [moneyType, setMoneyType] = useState('cash')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [coin, setCoin] = useState<typeof COINS[number]|null>(null)
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [done, setDone] = useState(false)

  const price = calculatePrice(service, type, declaredVal, recip.country, moneyAmt)
  const eta = calculateETA(service)
  const wallet = coin ? WALLETS[coin] : null
  const cryptoAmt = wallet ? (price * wallet.rate).toFixed(wallet.decimals) : '0'

  function validate(s: number) {
    if (s === 0) {
      if (!type) { toast.error('Select a shipment type'); return false }
      if (type !== 'money' && !items[0].desc.trim()) { toast.error('Add at least one item'); return false }
    }
    if (s === 1) {
      if (!sender.name || !sender.country) { toast.error('Fill in sender details'); return false }
      if (!recip.name || !recip.country) { toast.error('Fill in recipient details'); return false }
    }
    if (s === 2 && type === 'money' && !termsAccepted) {
      toast.error('Accept the Financial Transfer Terms & Conditions'); return false
    }
    if (s === 4 && !coin) { toast.error('Select a payment method'); return false }
    if (s === 4 && !txHash.trim()) { toast.error('Paste your transaction hash'); return false }
    return true
  }

  async function submit() {
    if (!validate(4)) return
    setLoading(true)
    try {
      const body = {
        type, category: SHIP_TYPES.find(t => t.id === type)?.label || type,
        items: items.filter(i => i.desc.trim()),
        sender, recipient: recip, service,
        declared_value: declaredVal, notes,
        money_details: type === 'money' ? { amount: moneyAmt, transfer_type: moneyType } : null,
        file_name: file1?.name || file2?.name || null,
        eta, is_vip: false,
        payment: { coin, coin_name: wallet?.name, usd_amount: price, crypto_amount: cryptoAmt, tx_hash: txHash, status: 'pending', submitted_at: new Date().toISOString() }
      }
      const res = await fetch('/api/shipments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setTrackingNumber(data.tracking_number)
      setDone(true)
      toast.success('Shipment created: ' + data.tracking_number)
    } catch {
      toast.error('Failed to submit shipment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="bg-navy rounded-2xl p-10 text-center mt-6 border"
      style={{ borderColor: 'rgba(196,154,10,0.2)', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,154,10,0.08) 0%, transparent 70%)' }} />
      <div className="relative text-5xl mb-4">🎉</div>
      <div className="relative text-[11px] text-white/40 font-bold uppercase tracking-widest mb-2">Your Tracking Number</div>
      <div className="relative font-display font-black text-[56px] text-gold-300 tracking-[5px] mb-4 leading-none">{trackingNumber}</div>
      <p className="relative text-white/65 text-[14px] leading-relaxed max-w-md mx-auto mb-6">
        Shipment submitted! Payment is being verified (30–60 min). 
        {(type === 'physical' || type === 'consignment') && ' A Vault Express agent will contact you within 2–4 hours to schedule pickup.'}
        {type === 'money' && ' A compliance specialist will email you formal instructions within 1 hour.'}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={() => navigator.clipboard.writeText(trackingNumber).then(() => toast.success('Copied!'))}
          className="relative flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-xl border border-white/20 hover:bg-white/10 transition-all">
          <Copy size={14} /> Copy Number
        </button>
        <a href={`/track?number=${trackingNumber}`}
          className="relative flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-xl border border-white/20 hover:bg-white/10 transition-all">
          🔍 Track Now →
        </a>
        <a href="/login" className="relative flex items-center gap-2 px-5 py-2.5 gold-gradient text-navy text-[13px] font-black rounded-xl">
          👑 Join VIP — Ship Free
        </a>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 overflow-hidden">
      {/* Step indicator */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-start flex-1">
              <div className="flex flex-col items-center">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all',
                  i < step ? 'bg-emerald-500 border-emerald-500 text-white' :
                  i === step ? 'border-gold-400 text-navy' :
                  'border-gray-200 bg-white text-gray-400')}
                  style={i === step ? { background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)' } : {}}>
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <div className={cn('text-[9px] font-bold text-center mt-1.5 whitespace-nowrap uppercase tracking-wide',
                  i <= step ? 'text-gray-700' : 'text-gray-300')}>
                  {label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-0.5 mt-4 mx-2 transition-all', i < step ? 'bg-emerald-400' : 'bg-gray-200')} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Step 0: Type & Items */}
        {step === 0 && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2.5 mb-4">Select Shipment Type</div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SHIP_TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={cn('relative text-left rounded-xl p-4 border-2 transition-all',
                    type === t.id ? 'border-gold-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30')}>
                  {type === t.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full gold-gradient flex items-center justify-center">
                      <Check size={11} className="text-navy font-black" />
                    </div>
                  )}
                  <div className="text-[28px] mb-2">{t.icon}</div>
                  <div className="font-bold text-gray-900 text-[13px] mb-1">{t.label}</div>
                  <div className="text-gray-500 text-[11px] leading-relaxed mb-2.5">{t.desc}</div>
                  <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full', t.feeColor)}>{t.fee}</span>
                </button>
              ))}
            </div>

            {type !== 'money' && (
              <>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2.5 mb-4">Items in This Shipment</div>
                <div className="grid grid-cols-[1fr_80px_90px_32px] gap-2 px-2 mb-2">
                  {['Description','Qty','Weight (lb)',''].map(h => (
                    <div key={h} className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{h}</div>
                  ))}
                </div>
                <div className="space-y-2 mb-3">
                  {items.map((item, i) => (
                    <div key={i} className="grid grid-cols-[1fr_80px_90px_32px] gap-2 bg-gray-50 rounded-xl px-3 py-2.5 items-center">
                      <input value={item.desc} onChange={e => setItems(p => p.map((it,j) => j===i ? {...it, desc:e.target.value} : it))}
                        placeholder="e.g. MacBook Pro, Legal Documents" className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-amber-400 w-full" />
                      <input type="number" value={item.qty} onChange={e => setItems(p => p.map((it,j) => j===i ? {...it, qty:+e.target.value} : it))}
                        min={1} className="bg-white border border-gray-200 rounded-lg px-2 py-2 text-[12px] text-center outline-none focus:border-amber-400 w-full" />
                      <input type="number" value={item.weight} onChange={e => setItems(p => p.map((it,j) => j===i ? {...it, weight:+e.target.value} : it))}
                        step={0.1} min={0} className="bg-white border border-gray-200 rounded-lg px-2 py-2 text-[12px] text-center outline-none focus:border-amber-400 w-full" />
                      <button onClick={() => setItems(p => p.filter((_,j) => j!==i))} disabled={items.length===1} className="text-red-400 hover:text-red-600 disabled:opacity-30 p-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setItems(p => [...p, { desc:'', qty:1, weight:0.5 }])}
                  className="flex items-center gap-1.5 px-4 py-2 bg-navy text-white rounded-lg text-[12px] font-bold hover:bg-navy-50 transition-all">
                  <Plus size={13} /> Add Item
                </button>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <label className="form-label">Service Tier</label>
                <select value={service} onChange={e => setService(e.target.value)} className="form-select">
                  {Object.entries(SERVICE_TIERS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label} — from ${v.basePrice}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Declared Value (USD)</label>
                <input type="number" value={declaredVal} onChange={e => setDeclaredVal(+e.target.value)} min={0} step={0.01} placeholder="0.00" className="form-input" />
              </div>
              <div className="col-span-2">
                <label className="form-label">Special Handling Instructions</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="e.g. Fragile — Handle with care. Temperature sensitive." className="form-input resize-y" />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Addresses */}
        {step === 1 && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2.5 mb-4">📤 Sender Information</div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[['Full Name','name','John Smith'],['Phone','phone','+1 (555) 000-0000'],['Email','email','john@example.com']].map(([l,k,p]) => (
                <div key={k as string}>
                  <label className="form-label">{l as string}</label>
                  <input value={(sender as any)[k as string]} onChange={e => setSender(prev => ({...prev, [k as string]: e.target.value}))} placeholder={p as string} type={k==='email'?'email':'text'} className="form-input" />
                </div>
              ))}
              <div>
                <label className="form-label">Origin Country</label>
                <select value={sender.country} onChange={e => setSender(p => ({...p, country: e.target.value}))} className="form-select">
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Full Address</label>
                <input value={sender.address} onChange={e => setSender(p => ({...p, address: e.target.value}))} placeholder="123 Main St, Miami, FL 33101" className="form-input" />
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2.5 mb-4">📥 Recipient Information</div>
            <div className="grid grid-cols-2 gap-4">
              {[['Full Name','name','Jane Doe'],['Phone','phone','+44 7700 900000'],['Email','email','jane@example.com']].map(([l,k,p]) => (
                <div key={k as string}>
                  <label className="form-label">{l as string}</label>
                  <input value={(recip as any)[k as string]} onChange={e => setRecip(prev => ({...prev, [k as string]: e.target.value}))} placeholder={p as string} type={k==='email'?'email':'text'} className="form-input" />
                </div>
              ))}
              <div>
                <label className="form-label">Destination Country</label>
                <select value={recip.country} onChange={e => setRecip(p => ({...p, country: e.target.value}))} className="form-select">
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Full Address</label>
                <input value={recip.address} onChange={e => setRecip(p => ({...p, address: e.target.value}))} placeholder="456 High Street, London, EC1A 1BB, UK" className="form-input" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div>
            {type === 'digital' && (
              <div>
                <p className="text-gray-500 text-[13px] mb-4 leading-relaxed">
                  Upload the sensitive file below. All transfers use <strong>AES-256 end-to-end encryption</strong>. Sensitive files attract a <strong className="text-red-600">3× premium surcharge</strong>.
                </p>
                <label className={cn('flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all',
                  file1 ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-amber-400 hover:bg-amber-50/30')}>
                  <div className="text-[36px]">{file1 ? '✅' : '📂'}</div>
                  <div className="font-bold text-gray-700 text-[14px]">{file1 ? file1.name : 'Click to upload sensitive file'}</div>
                  <div className="text-gray-400 text-[12px]">{file1 ? formatBytes(file1.size) : 'PDF, DOCX, ZIP, JPG, PNG, MP4 · Max 500MB'}</div>
                  <input type="file" className="hidden" onChange={e => setFile1(e.target.files?.[0] || null)} />
                </label>
              </div>
            )}
            {type === 'money' && (
              <div>
                <div className="rounded-2xl p-6 mb-5 border" style={{ background: 'linear-gradient(135deg, #0F172A, #1A2540)', borderColor: 'rgba(196,154,10,0.2)' }}>
                  <div className="text-gold-300 font-bold text-[14px] mb-4">💰 Financial Transfer Details</div>
                  {[
                    ['Transfer Type', <select key="mt" value={moneyType} onChange={e => setMoneyType(e.target.value)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '5px 9px', borderRadius: 6, fontSize: 12, outline: 'none' }}><option value="cash">Physical Cash</option><option value="bullion">Gold/Bullion</option><option value="bearer">Bearer Instruments</option><option value="crypto-hw">Hardware Wallet</option><option value="check">Certified Cheque</option></select>],
                    ['Declared Amount (USD)', <input key="ma" type="number" value={moneyAmt} onChange={e => setMoneyAmt(+e.target.value)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '5px 9px', borderRadius: 6, fontSize: 12, outline: 'none', width: 150 }} />],
                    ['Base Shipping (5× tier)', <span key="f" className="font-bold text-gold-300">${(199.99 * 5).toFixed(2)}</span>],
                    ['Compliance Fee (3.5%)', <span key="c" className="text-white/80">${(moneyAmt * 0.035).toFixed(2)}</span>],
                    ['Mandatory Insurance (2%)', <span key="i" className="text-white/80">${(moneyAmt * 0.02).toFixed(2)}</span>],
                    ['Total', <span key="t" className="font-bold text-gold-300 text-[16px]">${price.toFixed(2)}</span>],
                  ].map(([label, val], i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-white/55 text-[12px]">{label as string}</span>
                      {val}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto text-[12px] text-gray-500 leading-relaxed mb-4">
                  <p className="font-bold text-gray-800 mb-3">⚖️ Financial Transfer Terms & Conditions</p>
                  <p className="mb-2"><strong>1. AML/KYC:</strong> All transfers must comply with AML and KYC regulations in both jurisdictions.</p>
                  <p className="mb-2"><strong>2. Legitimacy:</strong> You declare all funds are of entirely legitimate origin. False declaration is a criminal offence.</p>
                  <p className="mb-2"><strong>3. Insurance:</strong> Mandatory insurance at 2% of declared amount is required and non-negotiable.</p>
                  <p className="mb-2"><strong>4. Regulatory Reporting:</strong> Transfers exceeding $10,000 are subject to mandatory FATF reporting.</p>
                  <p className="mb-2"><strong>5. Specialist Agent:</strong> A dedicated specialist is assigned to your transfer. Formal instructions sent within 1 hour.</p>
                  <p className="mb-2"><strong>6. Delays:</strong> Vault Express bears no liability for delays caused by regulatory requirements or inspections.</p>
                  <p><strong>7. Right of Refusal:</strong> We reserve the right to refuse any transfer that cannot be satisfactorily verified.</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer py-3 px-4 bg-amber-50 rounded-xl border border-amber-200">
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                  <span className="text-[13px] font-semibold text-amber-900">I have read and agree to the Financial Transfer Terms & Conditions</span>
                </label>
              </div>
            )}
            {(type === 'physical' || type === 'consignment') && (
              <div>
                <p className="text-gray-500 text-[13px] mb-4 leading-relaxed">
                  Optionally attach an invoice, packing list, or customs declaration to speed up processing.
                </p>
                <label className={cn('flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all',
                  file2 ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-amber-400 hover:bg-amber-50/30')}>
                  <div className="text-[36px]">{file2 ? '✅' : '📋'}</div>
                  <div className="font-bold text-gray-700 text-[14px]">{file2 ? file2.name : 'Attach Supporting Documents (Optional)'}</div>
                  <div className="text-gray-400 text-[12px]">{file2 ? formatBytes(file2.size) : 'Invoice, packing list, customs declaration'}</div>
                  <input type="file" className="hidden" onChange={e => setFile2(e.target.files?.[0] || null)} />
                </label>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { title: '📦 Type', content: <><p className="font-bold text-gray-900">{SHIP_TYPES.find(t=>t.id===type)?.label}</p>{items.filter(i=>i.desc).length > 0 && <p className="text-gray-400 text-[11px] mt-1">{items.filter(i=>i.desc).map(i=>`${i.desc} × ${i.qty}`).join(', ')}</p>}</> },
                { title: '🗺 Route', content: <><p className="font-bold text-gray-900">{sender.country}</p><p className="text-gray-400 text-[18px] my-0.5">↓</p><p className="font-bold text-gray-900">{recip.country}</p></> },
                { title: '📤 From', content: <><p className="font-bold text-gray-900">{sender.name}</p><p className="text-gray-400 text-[12px]">{sender.phone}</p><p className="text-gray-400 text-[12px]">{sender.address}</p></> },
                { title: '📥 To', content: <><p className="font-bold text-gray-900">{recip.name}</p><p className="text-gray-400 text-[12px]">{recip.phone}</p><p className="text-gray-400 text-[12px]">{recip.address}</p></> },
              ].map(({ title, content }) => (
                <div key={title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">{title}</div>
                  <div className="text-[13px] text-gray-700 leading-relaxed">{content}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-5 flex justify-between items-center mb-3" style={{ background: '#060D1A', border: '1px solid rgba(196,154,10,0.25)' }}>
              <div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Total Amount Due</div>
                <div className="font-display font-black text-gold-300" style={{ fontSize: 42, lineHeight: 1.1 }}>${price.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-[13px] font-semibold">{SERVICE_TIERS[service as keyof typeof SERVICE_TIERS]?.label}</div>
                <div className="text-white/40 text-[11px] mt-0.5">Est. delivery: {eta}</div>
              </div>
            </div>

            {(type === 'money' || type === 'digital' || HIGH_TARIFF_COUNTRIES.includes(recip.country)) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[12px] text-amber-800 mb-3">
                {type === 'money' ? '💰 Financial transfer (5× base) + compliance and insurance fees applied.' :
                 type === 'digital' ? '🔒 Sensitive file surcharge (3× base) applied for encrypted handling.' :
                 '🌍 High-compliance destination — additional processing fee of $25 included.'}
              </div>
            )}
            {(type === 'physical' || type === 'consignment') && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-[12px] text-blue-800">
                📅 <strong>Agent Pickup:</strong> After payment confirmation, a Vault Express agent will contact you within <strong>2–4 hours</strong> to schedule convenient pickup. VIP members get <strong>same-day dispatch</strong>.
              </div>
            )}
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div>
            <div className="rounded-2xl p-7 text-center mb-6" style={{ background: '#060D1A', border: '1px solid rgba(196,154,10,0.2)', position: 'relative', overflow: 'hidden' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,154,10,0.1) 0%, transparent 70%)' }} />
              <div className="relative text-[11px] text-white/40 font-bold uppercase tracking-widest">Amount Due</div>
              <div className="relative font-display font-black text-gold-300" style={{ fontSize: 56, lineHeight: 1, margin: '8px 0 4px' }}>${price.toFixed(2)}</div>
              <div className="relative text-white/40 text-[12px]">Select a cryptocurrency to complete payment</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {COINS.map(c => {
                const w = WALLETS[c]
                return (
                  <button key={c} onClick={() => setCoin(c)}
                    className={cn('relative text-left rounded-xl p-4 border-2 transition-all',
                      coin === c ? 'border-gold-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300')}>
                    {coin === c && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full gold-gradient flex items-center justify-center">
                        <Check size={11} className="text-navy" />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[18px] mb-3"
                      style={{ background: w.bg, color: w.color }}>
                      {c === 'BTC' ? '₿' : c === 'ETH' ? 'Ξ' : c === 'USDT' ? '₮' : '◎'}
                    </div>
                    <div className="font-bold text-gray-900 text-[14px]">{c} — {w.name}</div>
                    <div className="text-gray-400 text-[11px] mt-1">{w.network}</div>
                  </button>
                )
              })}
            </div>

            {coin && wallet && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold" style={{ background: wallet.bg, color: wallet.color }}>{coin}</span>
                  <span className="text-[13px] font-semibold text-gray-700">Send to this wallet address</span>
                </div>
                <div className="font-mono text-[13px] bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 mb-3 break-all leading-relaxed text-gray-800">
                  {wallet.address}
                </div>
                <button onClick={() => navigator.clipboard.writeText(wallet.address).then(() => toast.success('Copied!'))}
                  className="w-full mb-3 py-2.5 bg-navy text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 hover:bg-navy-50 transition-all">
                  <Copy size={14} /> Copy Wallet Address
                </button>
                <div className="text-center text-[14px] text-gray-500 mb-4">
                  Send exactly: <strong className="text-gray-900 text-[20px]">{cryptoAmt}</strong>{' '}
                  <span className="font-bold text-navy">{coin}</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-[12px] text-amber-800 leading-relaxed mb-4">
                  <strong>⚠️ Important:</strong> Send ONLY {coin} to this address. Sending a different coin results in permanent loss. Send the exact amount shown. After sending, paste your TX hash below and click Confirm.
                </div>
                <div className="flex gap-2.5">
                  <input value={txHash} onChange={e => setTxHash(e.target.value)}
                    placeholder="Paste transaction hash / TX ID here…"
                    className="flex-1 form-input text-[13px]" />
                  <button onClick={submit} disabled={loading}
                    className="px-5 py-3 bg-emerald-600 text-white font-bold text-[13px] rounded-xl hover:bg-emerald-700 transition-all whitespace-nowrap disabled:opacity-60">
                    {loading ? 'Submitting…' : 'Confirm →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-7 pt-5 border-t border-gray-100">
          <button onClick={() => setStep(p => Math.max(0, p-1))} disabled={step === 0}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-all">
            ← Back
          </button>
          {step < 4 && (
            <button onClick={() => { if (validate(step)) setStep(p => p+1) }}
              className="px-7 py-2.5 gold-gradient text-navy font-black text-[13px] rounded-xl hover:brightness-110 transition-all">
              {step === 3 ? 'Proceed to Payment →' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
