'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/client')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setUser(d.user) })
      .catch(() => {})
  }, [pathname])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/ship', label: 'Ship Now' },
    { href: '/track', label: 'Track' },
    { href: '/news', label: 'News' },
  ]

  return (
    <nav style={{ background: 'rgba(6,13,26,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(196,154,10,0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-6 h-[66px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline" style={{ textDecoration: 'none' }}>
          <div className="w-9 h-9 rounded-[9px] flex items-center justify-center font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A, #F5CE55)', color: '#060D1A' }}>
            VX
          </div>
          <span className="font-display font-black text-[26px] text-white tracking-[0.3px]">
            VAULT<span style={{ color: '#E6AF1A' }}> EXPRESS</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1.5">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all no-underline"
              style={{
                background: pathname === link.href ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                color: pathname === link.href ? '#fff' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: pathname === link.href ? '0 0 0 2px rgba(196,154,10,0.3)' : 'none',
                textDecoration: 'none',
              }}>
              {link.label}
            </Link>
          ))}

          {user ? (
            <Link href="/dashboard"
              className="ml-1 px-4 py-2 rounded-lg text-[13px] font-bold no-underline flex items-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
              👤 {user.name?.split(' ')[0] || 'Account'}
              {user.is_vip && ' 👑'}
            </Link>
          ) : (
            <Link href="/login"
              className="ml-1 px-4 py-2 rounded-lg text-[13px] font-semibold no-underline"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
              Login
            </Link>
          )}

          <Link href="/ship"
            className="ml-1 px-4 py-2 rounded-lg text-[13px] font-bold no-underline"
            style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)', color: '#060D1A', textDecoration: 'none' }}>
            Ship Now
          </Link>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(6,13,26,0.98)' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-[14px] font-semibold text-white/80 hover:bg-white/8 transition-all no-underline"
              style={{ textDecoration: 'none' }}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link href="/dashboard" onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-[14px] font-semibold text-white/80 no-underline" style={{ textDecoration: 'none' }}>
              👤 My Account {user.is_vip && '👑'}
            </Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-[14px] font-semibold text-white/80 no-underline" style={{ textDecoration: 'none' }}>
              Login
            </Link>
          )}
          <Link href="/ship" onClick={() => setOpen(false)}
            className="mt-1 px-4 py-3 rounded-lg text-[14px] font-bold text-center no-underline"
            style={{ background: 'linear-gradient(135deg, #C49A0A, #E6AF1A)', color: '#060D1A', textDecoration: 'none' }}>
            Ship Now
          </Link>
        </div>
      )}
    </nav>
  )
}
