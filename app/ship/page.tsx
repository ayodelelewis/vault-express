'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import ShipWizard from '@/components/client/ShipWizard'

function ShipContent() {
  const params = useSearchParams()
  const defaultType = params.get('type') || 'physical'
  return <ShipWizard defaultType={defaultType} />
}

export default function ShipPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-66px)] bg-gray-50">
        <div className="navy-gradient py-14 px-6 text-center" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,154,10,0.1) 0%, transparent 70%)' }} />
          <div className="relative">
            <h1 className="font-display font-black text-white text-[52px] leading-none mb-2">
              New <span className="gold-text">Shipment</span>
            </h1>
            <p className="text-white/50 text-[15px]">Complete the form below — tracking number generated instantly</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 pb-16" style={{ marginTop: '-24px' }}>
          <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading…</div>}>
            <ShipContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  )
}
