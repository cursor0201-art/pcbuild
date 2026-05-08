import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/5 py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-50" />
                <svg viewBox="0 0 24 24" className="relative h-full w-full text-blue-500 fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tighter text-white uppercase">
                Neon <span className="text-blue-500">Tech</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Crafting high-performance gaming machines for the next generation of players. Premium components, expert builds.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Builder', 'Components', 'Deals'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'Shipping Policy', 'Warranty', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Contact</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li>+998 99 999 19 94</li>
              <li>support@neontech.com</li>
              <li>Tashkent, Uzbekistan</li>
            </ul>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2026 Neon Tech. All rights reserved.
          </p>
          <div className="flex gap-8 text-slate-600 text-xs">
            <Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
