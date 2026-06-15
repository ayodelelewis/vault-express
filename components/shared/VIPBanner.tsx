import Link from 'next/link'
import { Crown, Zap, User, ArrowUp, Lock, BarChart3, CheckCircle } from 'lucide-react'

const features = [
  { icon: '✈️', text: 'Free shipping for 12 months' },
  { icon: '⚡', text: 'Same-day agent pickup' },
  { icon: '👤', text: 'Dedicated account manager' },
  { icon: '🔝', text: 'Absolute highest priority' },
  { icon: '🔒', text: 'Enhanced security clearance' },
  { icon: '📊', text: 'Advanced tracking analytics' },
]

export default function VIPBanner() {
  return (
    <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #1a1a30 0%, #12192e 40%, #0a1020 100%)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-5 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">👑</div>
        
        <h2 className="font-display font-black text-[52px] mb-3 gold-text leading-none">
          VIP Membership
        </h2>
        <p className="text-white/60 text-[17px] leading-relaxed mb-10 max-w-xl mx-auto">
          One annual subscription. Unlimited free shipping. Every order treated with 
          absolute highest priority from the moment it&apos;s placed.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 max-w-xl mx-auto">
          {features.map((f) => (
            <div key={f.text}
              className="flex items-center gap-2.5 text-[13px] text-white/80 rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-[18px]">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <div className="font-display font-black text-white text-[64px] leading-none mb-2">
          <span className="text-[24px] text-white/40">$</span>500
          <span className="text-[24px] text-white/40">/year</span>
        </div>
        <p className="text-white/35 text-[13px] mb-8">Less than $42/month for unlimited global shipping</p>

        <Link href="/login?tab=register&vip=1"
          className="inline-flex items-center gap-2.5 px-12 py-4 text-[16px] font-black rounded-xl transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #F5A623)',
            color: '#0a0a15',
            boxShadow: '0 6px 24px rgba(255,166,0,0.45)'
          }}>
          <Crown size={18} />
          Join VIP Membership
        </Link>
      </div>
    </section>
  )
}
