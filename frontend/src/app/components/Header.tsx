import { Link } from 'react-router';
import { ShoppingCart, Search, User } from 'lucide-react';
import { motion } from 'motion/react';

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 px-6 lg:px-12"
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between">
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {['Products', 'Gaming PCs', 'Components', 'Peripherals', 'Deals'].map((item) => (
            <Link
              key={item}
              to="#"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="text-slate-300 hover:text-white transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="relative text-slate-300 hover:text-white transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
              2
            </span>
          </button>
          <button className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all">
            Sign In
          </button>
        </div>
      </div>
    </motion.header>
  );
}
