import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

const services = [
  { icon: '📦', name: 'Physical Items', desc: 'Packages, goods, freight of any size. Agent dispatched for secure pickup.', rate: 'Standard rates', color: 'bg-blue-50 text-blue-700' },
  { icon: '🔒', name: 'Sensitive Files', desc: 'AES-256 encrypted document transfer. Legal, medical, classified.', rate: '3× Premium rate', color: 'bg-amber-50 text-amber-700' },
  { icon: '💰', name: 'Financial Transfer', desc: 'Currency, bullion, bearer instruments. Full AML/KYC compliance.', rate: '5× Premium rate', color: 'bg-red-50 text-red-700' },
  { icon: '🗂️', name: 'Consignments', desc: 'Bulk commercial freight and industrial equipment. Any scale.', rate: 'Commercial rates', color: 'bg-amber-50 text-amber-700' },
  { icon: '💎', name: 'Luxury Goods', desc: 'Art, jewelry, watches, collectibles. Vault-grade security.', rate: 'Vault Secure rates', color: 'bg-purple-50 text-purple-700' },
]

const newsArticles = [
  {
    category: 'SHIPPING NEWS',
    title: 'Global Shipping Rates Stabilize in 2026 After Supply Chain Recovery',
    excerpt: 'International freight costs have returned to pre-pandemic levels as major shipping lanes fully recover. Experts predict continued stability through Q3 2026 with improvements in last-mile delivery infrastructure.',
    date: 'Jun 12, 2026',
    readTime: '3 min read',
    icon: '🚢',
  },
  {
    category: 'FRAUD ALERT',
    title: 'How to Spot Shipping Fraud: 7 Red Flags Every Sender Must Know',
    excerpt: 'Shipping fraud has increased 340% since 2024. Common scams include fake tracking numbers, advance fee fraud, and impersonation of legitimate couriers. Learn how to verify your courier is legitimate before sending anything.',
    date: 'Jun 10, 2026',
    readTime: '5 min read',
    icon: '⚠️',
    tips: [
      'Never pay customs fees via gift cards or crypto to unknown wallets',
      'Verify tracking numbers directly on the official courier website',
      'Legitimate couriers never ask for your password or OTP',
      'Always get a physical receipt with company letterhead',
      'Check the courier\'s physical address and company registration',
      'Avoid couriers with no verifiable reviews or history',
      'Real couriers never guarantee 100% customs clearance',
    ]
  },
  {
    category: 'INDUSTRY UPDATE',
    title: 'DHL, FedEx and UPS Announce New Crypto Payment Pilots in 2026',
    excerpt: 'Major logistics companies are testing cryptocurrency payment systems for international shipments. Bitcoin and stablecoins like USDT are being trialled for cross-border transactions to reduce forex conversion costs.',
    date: 'Jun 8, 2026',
    readTime: '4 min read',
    icon: '₿',
  },
  {
    category: 'SECURITY GUIDE',
    title: 'Protecting High-Value Shipments: Insurance and Documentation Best Practices',
    excerpt: 'When shipping items valued over $10,000, proper documentation is critical. Always declare accurate values, obtain comprehensive transit insurance, and use a courier with proven high-value handling protocols.',
    date: 'Jun 5, 2026',
    readTime: '6 min read',
    icon: '🛡️',
  },
  {
    category: 'FRAUD ALERT',
    title: 'Warning: Rise of Fake Courier Websites Targeting International Senders',
    excerpt: 'Cybersecurity researchers have identified over 2,000 fake courier websites in 2026 alone. These sites mimic legitimate couriers, collect payment, then disappear. Always verify SSL certificates and domain age before using any courier.',
    date: 'Jun 3, 2026',
    readTime: '4 min read',
    icon: '🚨',
    tips: [
      'Check the domain was registered more than 1 year ago',
      'Look for a physical address and phone number that you can call',
      'Search the company name + "scam" or "review" before paying',
      'Use a credit card for purchase protection, never wire transfers',
      'Verify the business is registered with your country\'s trade authority',
    ]
  },
  {
    category: 'TIPS & GUIDES',
    title: 'Complete Guide to Shipping Documents for International Parcels',
    excerpt: 'Every international shipment requires proper documentation. Commercial invoices, packing lists, certificates of origin, and customs declarations are mandatory for smooth clearance. Missing documents cause 60% of all shipping delays.',
    date: 'Jun 1, 2026',
    readTime: '7 min read',
    icon: '📋',
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative min-h-[660px] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #060D1A 0%, #0D1F35 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(196,154,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,154,10,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,154,10,0.12) 0%, transparent 70%)' }} />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 text-[12px] font-bold tracking-widest"
              style={{ background: 'rgba(196,154,10,0.1)', border: '1px solid rgba(196,154,10,0.3)', color: '#F5CE55' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: '#E6AF1A', animation: 'pulse 2s infinite' }} />
              WORLDWIDE DELIVERY — 195 COUNTRIES
            </div>

            <h1 className="font-display font-black text-white mb-5"
              style={{ fontSize: 'clamp(52px, 8vw, 90px)', lineHeight: 0.9, letterSpacing: '-0.5px' }}>
              THE WORLD&apos;S MOST<br />
              <span style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A, #F5CE55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TRUSTED COURIER.
              </span>
            </h1>

            <p className="text-white/55 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
              Physical goods, sensitive documents, financial transfers — delivered with military precision to every corner of the globe. Crypto payments accepted.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
              <Link href="/ship"
                className="inline-flex items-center gap-2 px-10 py-4 font-black text-[15px] rounded-xl transition-all hover:brightness-110 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A, #F5CE55)', color: '#060D1A', boxShadow: '0 4px 20px rgba(196,154,10,0.4)' }}>
                📦 Ship a Package
              </Link>
              <Link href="/track"
                className="inline-flex items-center gap-2 px-10 py-4 font-bold text-[15px] text-white rounded-xl transition-all hover:bg-white/12"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                🔍 Track Shipment
              </Link>
            </div>

            <div className="flex items-stretch justify-center max-w-[700px] mx-auto rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { num: '195+', label: 'Countries' },
                { num: '4.8M', label: 'Daily Shipments' },
                { num: '99.97%', label: 'On-Time Rate' },
                { num: '24/7', label: 'Support' },
              ].map((s, i) => (
                <div key={s.label} className="flex-1 text-center py-6 px-4" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <div className="font-display font-black text-[40px] leading-none" style={{ color: '#E6AF1A' }}>{s.num}</div>
                  <div className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-display font-black text-[46px] mb-3" style={{ color: '#060D1A' }}>What We Move</h2>
              <p className="text-gray-500 text-[17px] max-w-lg mx-auto leading-relaxed">
                From next-day envelopes to multi-million dollar consignments — handled with absolute discretion.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {services.map(svc => (
                <Link key={svc.name} href="/ship"
                  className="group bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 text-center transition-all duration-200 hover:border-yellow-400 hover:-translate-y-1 no-underline"
                  style={{ textDecoration: 'none' }}>
                  <div className="text-[42px] mb-4">{svc.icon}</div>
                  <h3 className="font-bold text-[14px] mb-2" style={{ color: '#060D1A' }}>{svc.name}</h3>
                  <p className="text-gray-500 text-[12px] leading-relaxed mb-4">{svc.desc}</p>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${svc.color}`}>{svc.rate}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* VIP */}
        <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #1a1a30 0%, #12192e 40%, #0a1020 100%)' }}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-[56px] mb-5">👑</div>
            <h2 className="font-display font-black text-[52px] mb-4"
              style={{ background: 'linear-gradient(135deg, #F5CE55, #E6AF1A, #C49A0A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VIP Membership
            </h2>
            <p className="text-white/60 text-[17px] leading-relaxed mb-10 max-w-xl mx-auto">
              One annual subscription. Unlimited free shipping. Every order treated with absolute highest priority from the moment it&apos;s placed.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 max-w-xl mx-auto">
              {['✈️ Free shipping 12 months','⚡ Same-day agent pickup','👤 Dedicated manager','🔝 Highest priority always','🔒 Enhanced security','📊 Advanced tracking'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[12px] text-white/80 rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {f}
                </div>
              ))}
            </div>
            <div className="font-display font-black text-white text-[60px] leading-none mb-2">
              <span className="text-[24px] text-white/40">$</span>500<span className="text-[24px] text-white/40">/year</span>
            </div>
            <p className="text-white/35 text-[13px] mb-8">Less than $42/month for unlimited global shipping</p>
            <Link href="/login"
              className="inline-flex items-center gap-2.5 px-12 py-4 text-[16px] font-black rounded-xl transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #FFD700, #F5A623)', color: '#0a0a15', boxShadow: '0 6px 24px rgba(255,166,0,0.45)' }}>
              👑 Join VIP Membership
            </Link>
          </div>
        </section>

        {/* NEWS */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-display font-black text-[46px] mb-3" style={{ color: '#060D1A' }}>Shipping News & Fraud Alerts</h2>
              <p className="text-gray-500 text-[17px] max-w-lg mx-auto leading-relaxed">
                Stay informed about the shipping industry and protect yourself from fraud.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.map((article, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-widest ${
                        article.category.includes('FRAUD') || article.category.includes('ALERT')
                          ? 'bg-red-50 text-red-700'
                          : article.category.includes('SECURITY')
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {article.category}
                      </span>
                      <span className="text-[28px]">{article.icon}</span>
                    </div>
                    <h3 className="font-bold text-[15px] text-gray-900 mb-3 leading-snug">{article.title}</h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{article.excerpt}</p>
                    {article.tips && (
                      <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
                        <div className="text-[11px] font-black text-red-700 uppercase tracking-widest mb-2">⚠️ Warning Signs</div>
                        <ul className="space-y-1.5">
                          {article.tips.map((tip, j) => (
                            <li key={j} className="flex items-start gap-2 text-[12px] text-red-800">
                              <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fraud protection banner */}
            <div className="mt-10 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #7F1D1D, #991B1B)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="text-[48px] mb-4">🛡️</div>
              <h3 className="font-display font-black text-white text-[32px] mb-3">Vault Express Fraud Protection Guarantee</h3>
              <p className="text-white/70 text-[15px] leading-relaxed max-w-2xl mx-auto mb-6">
                Every Vault Express shipment comes with a unique tracking number, encrypted communication, and verified agent dispatch. We will NEVER ask you to pay customs fees via gift cards, request your password, or contact you from unofficial email addresses.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['✅ Verified Agent Dispatch','✅ Encrypted Tracking','✅ Official Receipts Only','✅ No Gift Card Payments','✅ Verified Company Registration'].map(g => (
                  <span key={g} className="bg-white/10 text-white text-[12px] font-semibold px-4 py-2 rounded-full border border-white/20">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
