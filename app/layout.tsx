import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Vault Express — Premium Global Logistics',
  description: 'World-class courier and logistics. Physical items, sensitive files, financial transfers, and consignments — delivered with precision to 195+ countries. Crypto payments accepted.',
  keywords: 'courier, logistics, shipping, international delivery, crypto payments, document transfer',
  openGraph: {
    title: 'Vault Express — Premium Global Logistics',
    description: 'The world\'s most trusted courier. 195+ countries. Crypto payments.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#060D1A',
              color: '#fff',
              borderLeft: '4px solid #E6AF1A',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 10px 36px rgba(0,0,0,0.3)',
            },
            success: {
              style: { borderLeftColor: '#059669' },
              iconTheme: { primary: '#059669', secondary: '#fff' }
            },
            error: {
              style: { borderLeftColor: '#DC2626' },
              iconTheme: { primary: '#DC2626', secondary: '#fff' }
            }
          }}
        />
      </body>
    </html>
  )
}
