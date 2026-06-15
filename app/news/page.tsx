import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Link from 'next/link'

const articles = [
  {
    category: 'FRAUD ALERT', urgent: true,
    title: '7 Red Flags That Identify a Fake Shipping Company',
    excerpt: 'Shipping fraud has increased 340% since 2024. Scammers create convincing fake courier websites to steal money. Here is exactly what to look for before trusting any courier with your goods or money.',
    date: 'Jun 12, 2026', readTime: '5 min',
    tips: [
      'Domain registered less than 12 months ago — verify at whois.com',
      'No physical street address or verifiable phone number',
      'Requests payment via gift cards, wire transfer, or anonymous crypto wallets',
      'Promises guaranteed customs clearance for high-value items',
      'No company registration number or trade authority listing',
      'Tracking numbers that don\'t work on the official site',
      'Pressure to pay immediately or "lose your shipment slot"',
    ]
  },
  {
    category: 'INDUSTRY NEWS', urgent: false,
    title: 'Global Shipping Rates Stabilize in 2026 After Supply Chain Recovery',
    excerpt: 'International freight costs have returned to pre-pandemic levels as major shipping lanes recover. Container availability is at an all-time high, reducing costs for businesses and individuals shipping internationally.',
    date: 'Jun 10, 2026', readTime: '3 min',
  },
  {
    category: 'SECURITY GUIDE', urgent: false,
    title: 'How to Ship High-Value Items Safely: Insurance and Documentation',
    excerpt: 'When shipping items valued over $10,000, proper documentation is critical. Always declare accurate values, obtain comprehensive transit insurance, and only use couriers with proven high-value handling protocols and physical verification.',
    date: 'Jun 8, 2026', readTime: '6 min',
    tips: [
      'Always get written confirmation of declared value acceptance',
      'Photograph items before packaging with timestamp',
      'Require signature confirmation at delivery',
      'Use tamper-evident packaging for high-value items',
      'Keep all tracking records and communication',
    ]
  },
  {
    category: 'CRYPTO NEWS', urgent: false,
    title: 'Major Couriers Begin Accepting Crypto Payments in 2026',
    excerpt: 'DHL, FedEx and regional couriers are piloting cryptocurrency payment systems for international shipments. Bitcoin, USDT and USDC reduce forex conversion costs and enable faster cross-border settlements for high-value transfers.',
    date: 'Jun 6, 2026', readTime: '4 min',
  },
  {
    category: 'FRAUD ALERT', urgent: true,
    title: 'Warning: Customs Fee Scam Targeting International Recipients',
    excerpt: 'A widespread scam involves fake "customs clearance" emails demanding payment before delivering packages. Legitimate customs fees are NEVER collected via email links, gift cards, or crypto sent to random wallets.',
    date: 'Jun 4, 2026', readTime: '4 min',
    tips: [
      'Real customs agencies send official postal notices, not emails',
      'Customs fees are paid IN PERSON at the postal office or customs facility',
      'Never click payment links in emails claiming to be from customs',
      'Call your national customs agency directly to verify any fees',
      'Real couriers never ask you to pay customs to them directly',
    ]
  },
  {
    category: 'TIPS & GUIDES', urgent: false,
    title: 'Complete International Shipping Documentation Checklist',
    excerpt: 'Missing documents cause 60% of all international shipping delays. Commercial invoices, packing lists, certificates of origin, and customs declarations are mandatory for smooth clearance in most countries.',
    date: 'Jun 2, 2026', readTime: '7 min',
    tips: [
      'Commercial Invoice: item description, value, quantity, HS code',
      'Packing List: exact weights and dimensions of each package',
      'Certificate of Origin: required for preferential trade rates',
      'Customs Declaration: must match invoice values exactly',
      'Import Permits: check destination country requirements first',
    ]
  },
  {
    category: 'INDUSTRY NEWS', urgent: false,
    title: 'Same-Day Drone Delivery Now Available in 12 Major Cities Worldwide',
    excerpt: 'Autonomous drone delivery has expanded to 12 cities including Dubai, Singapore, London, and New York. While limited to packages under 5kg, the technology is rapidly advancing for broader commercial use.',
    date: 'May 30, 2026', readTime: '3 min',
  },
  {
    category: 'SECURITY GUIDE', urgent: false,
    title: 'Protecting Sensitive Documents During International Transfer',
    excerpt: 'Legal documents, medical records, and classified data require special handling during international courier transfer. End-to-end encryption, chain of custody documentation, and tamper-evident packaging are non-negotiable for sensitive transfers.',
    date: 'May 28, 2026', readTime: '5 min',
  },
  {
    category: 'FRAUD ALERT', urgent: true,
    title: 'Advance Fee Fraud: The "Inheritance Package" Courier Scam Explained',
    excerpt: 'Victims are told a large sum of money or valuable package is waiting for them, but they must pay courier fees upfront to release it. This is always fraud. No legitimate courier holds packages pending advance payment from recipients.',
    date: 'May 25, 2026', readTime: '4 min',
    tips: [
      'No legitimate courier charges recipients to release a package',
      'Any "inheritance", "lottery prize", or "government funds" package is a scam',
      'Real packages are fully paid by the sender before dispatch',
      'Never pay money to receive money — this is the golden rule',
      'Report to your national fraud authority immediately',
    ]
  },
]

export default function NewsPage() {
  const urgent = articles.filter(a => a.urgent)
  const regular = articles.filter(a => !a.urgent)

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-66px)] bg-gray-50">
        {/* Header */}
        <div className="py-16 px-6 text-center" style={{ background: 'linear-gradient(180deg, #060D1A 0%, #0D1F35 100%)', position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(196,154,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,154,10,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="relative">
            <h1 className="font-display font-black text-white mb-3" style={{ fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 0.95 }}>
              Shipping News &<br /><span style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A, #F5CE55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fraud Alerts</span>
            </h1>
            <p className="text-white/50 text-[16px] max-w-xl mx-auto">
              Stay informed about the global shipping industry and protect yourself from fraud
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Fraud Alerts First */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-100 text-red-700">⚠️ Fraud Alerts</div>
              <div className="h-px flex-1 bg-red-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {urgent.map((a, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-red-100 overflow-hidden hover:border-red-300 hover:-translate-y-1 transition-all duration-200 shadow-sm">
                  <div className="bg-red-600 px-5 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{a.category}</span>
                      <span className="text-[10px] font-semibold text-white/70">{a.date}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[15px] text-gray-900 mb-2 leading-snug">{a.title}</h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{a.excerpt}</p>
                    {a.tips && (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <div className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-2.5">⚠️ Warning Signs / What To Do</div>
                        <ul className="space-y-1.5">
                          {a.tips.map((tip, j) => (
                            <li key={j} className="flex items-start gap-2 text-[12px] text-red-800 leading-snug">
                              <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="text-[11px] text-gray-400 mt-3">{a.readTime} read</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regular News */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-700">📰 Industry News & Guides</div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {regular.map((a, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:-translate-y-1 transition-all duration-200 shadow-sm">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      a.category.includes('SECURITY') ? 'bg-amber-50 text-amber-700' :
                      a.category.includes('CRYPTO') ? 'bg-purple-50 text-purple-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>{a.category}</span>
                    <span className="text-[11px] text-gray-400">{a.date} · {a.readTime}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[15px] text-gray-900 mb-2 leading-snug">{a.title}</h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed mb-3">{a.excerpt}</p>
                    {a.tips && (
                      <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
                        <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">📋 Key Points</div>
                        <ul className="space-y-1">
                          {a.tips.map((tip, j) => (
                            <li key={j} className="flex items-start gap-2 text-[12px] text-amber-800 leading-snug">
                              <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vault Express Guarantee */}
          <div className="mt-12 rounded-2xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #7F1D1D, #991B1B)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="text-[48px] mb-4">🛡️</div>
            <h3 className="font-display font-black text-white text-[32px] mb-3">Vault Express Anti-Fraud Guarantee</h3>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-2xl mx-auto mb-6">
              Every Vault Express shipment comes with a unique tracking number, encrypted communication, and verified agent dispatch.
              We will NEVER ask you to pay fees via gift cards, request your password, or contact you from unofficial channels.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['✅ Verified Agent ID','✅ Encrypted Tracking','✅ Official Receipts','✅ No Gift Card Fees','✅ Registered Company'].map(g => (
                <span key={g} className="bg-white/10 text-white text-[12px] font-semibold px-4 py-2 rounded-full border border-white/20">{g}</span>
              ))}
            </div>
            <Link href="/ship"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-[14px] no-underline"
              style={{ background: 'linear-gradient(135deg, #FFD700, #F5A623)', color: '#0a0a15', textDecoration: 'none' }}>
              Ship Safely with Vault Express →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
