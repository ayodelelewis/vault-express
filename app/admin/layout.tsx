import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Vault Express',
  robots: { index: false, follow: false }, // Never indexed by search engines
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#060D1A' }}>
      {children}
    </div>
  )
}
