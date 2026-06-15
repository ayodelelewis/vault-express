'use client'
import Link from 'next/link'
import { ArrowRight, Search, Globe, Shield, Clock, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[680px] navy-gradient flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(196,154,10,0.12) 0%, transparent 65%)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 text-[12px] font-bold tracking-widest"
          style={{ background: 'rgba(196,154,10,0.1)', border: '1px solid rgba(196,154,10,0.3)', color: '#F5CE55' }}>
          <span className="w-2 h-2 rounded-full animate-pulse-gold" style={{ background: '#E6AF1A' }} />
          WORLDWIDE DELIVERY — 195 COUNTRIES
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-white leading-[0.9] mb-5"
          style={{ fontSize: 'clamp(52px, 8vw, 96px)', letterSpacing: '-0.5px' }}>
          THE WORLD&apos;S MOST<br />
          <span className="gold-text">TRUSTED COURIER.</span>
        </h1>

        <p className="text-white/55 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Physical goods, sensitive documents, financial transfers, consignments — 
          delivered with military precision to every corner of the globe.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
          <Link href="/ship"
            className="inline-flex items-center gap-2.5 px-10 py-4 gold-gradient text-navy font-black text-[15px] rounded-xl shadow-gold hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200">
            Ship a Package <ArrowRight size={16} />
          </Link>
          <Link href="/track"
            className="inline-flex items-center gap-2.5 px-10 py-4 text-white font-bold text-[15px] rounded-xl transition-all duration-200 hover:bg-white/12"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
            <Search size={16} />
            Track Shipment
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-0 max-w-[680px] mx-auto rounded-2xl px-10 py-7"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
          {[
            { num: '195+', label: 'Countries', icon: Globe },
            { num: '4.8M', label: 'Daily Shipments', icon: TrendingUp },
            { num: '99.97%', label: 'On-Time Rate', icon: Clock },
            { num: '24/7', label: 'Support', icon: Shield },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex-1 text-center">
              <div className="font-display font-black text-gold-300" style={{ fontSize: '44px', lineHeight: 1 }}>
                {stat.num}
              </div>
              <div className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mt-1">
                {stat.label}
              </div>
              {i < arr.length - 1 && (
                <div className="absolute right-0 top-1/4 h-1/2 w-px bg-white/10" style={{ position: 'relative', marginLeft: 'auto' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
