import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy py-10 px-6 border-t border-white/8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center text-navy font-black text-xs">VX</div>
          <span className="font-display font-black text-xl text-white">VAULT <span className="text-gold-300">EXPRESS</span></span>
        </div>
        <div className="flex items-center gap-6 text-white/40 text-[13px]">
          <Link href="/ship" className="hover:text-white/70 transition-colors">Ship</Link>
          <Link href="/track" className="hover:text-white/70 transition-colors">Track</Link>
          <Link href="/login" className="hover:text-white/70 transition-colors">Login</Link>
        </div>
        <p className="text-white/25 text-[12px]">© 2026 Vault Express. All rights reserved.</p>
      </div>
    </footer>
  )
}
