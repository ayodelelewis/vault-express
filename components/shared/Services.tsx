import Link from 'next/link'
import { Package, Lock, DollarSign, Layers, Gem, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Package,
    name: 'Physical Items',
    desc: 'Packages, goods, freight of any size. Agent dispatched for secure pickup.',
    rate: 'Standard rates',
    rateColor: 'text-emerald-700 bg-emerald-50',
    href: '/ship?type=physical',
  },
  {
    icon: Lock,
    name: 'Sensitive Files',
    desc: 'AES-256 encrypted document and data transfer. Legal, medical, classified.',
    rate: '3× Premium rate',
    rateColor: 'text-amber-700 bg-amber-50',
    href: '/ship?type=digital',
  },
  {
    icon: DollarSign,
    name: 'Financial Transfer',
    desc: 'Currency, bullion, bearer instruments. Full AML/KYC compliance.',
    rate: '5× Premium rate',
    rateColor: 'text-red-700 bg-red-50',
    href: '/ship?type=money',
  },
  {
    icon: Layers,
    name: 'Consignments',
    desc: 'Bulk commercial freight and industrial equipment. Any scale, any destination.',
    rate: 'Commercial rates',
    rateColor: 'text-amber-700 bg-amber-50',
    href: '/ship?type=consignment',
  },
  {
    icon: Gem,
    name: 'Luxury & High-Value',
    desc: 'Art, jewelry, watches, collectibles. Vault-grade security from door to door.',
    rate: 'Vault Secure rates',
    rateColor: 'text-purple-700 bg-purple-50',
    href: '/ship?type=physical',
  },
]

export default function Services() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-black text-navy text-[48px] leading-none mb-3">
            What We Move
          </h2>
          <p className="text-gray-500 text-[17px] max-w-lg mx-auto leading-relaxed">
            From next-day envelopes to multi-million dollar consignments — 
            every shipment handled with absolute discretion and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((svc) => {
            const Icon = svc.icon
            return (
              <Link key={svc.name} href={svc.href}
                className="group relative bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 text-center transition-all duration-250 hover:border-gold-400 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(196,154,10,0.15)] no-underline cursor-pointer">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-navy flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={24} className="text-gold-300" />
                </div>
                <h3 className="font-bold text-navy text-[14px] mb-2">{svc.name}</h3>
                <p className="text-gray-500 text-[12px] leading-relaxed mb-4">{svc.desc}</p>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${svc.rateColor}`}>
                  {svc.rate}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Quick track bar */}
        <div className="mt-14 p-6 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quick Track</div>
            <input
              type="text"
              placeholder="Enter tracking number e.g. VXAB123456"
              className="w-full text-[15px] bg-transparent outline-none text-navy font-medium placeholder:text-gray-300"
            />
          </div>
          <Link href="/track"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 gold-gradient text-navy font-bold text-[13px] rounded-xl">
            Track <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
