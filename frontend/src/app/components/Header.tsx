import { Link, useLocation } from 'react-router';
import { ShoppingCart, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 lg:px-12">
        <Link to="/" className="group flex items-center gap-3 shrink-0">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 bg-blue-500 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
            <svg viewBox="0 0 24 24" className="relative h-full w-full text-blue-500 fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-xl uppercase tracking-tighter text-white leading-none">
              Neon <span className="text-blue-500">Tech</span>
            </div>
          </div>
        </Link>

        <nav className="flex flex-1 justify-end items-center gap-2 sm:gap-8 overflow-x-auto no-scrollbar ml-2">
          <Link
            to="/"
            className={`font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/')
                ? 'text-blue-500'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/builder"
            className={`font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/builder')
                ? 'text-blue-500'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.builder')}
          </Link>
          <Link
            to="/about"
            className={`font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/about')
                ? 'text-blue-500'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/cart"
            className={`flex items-center gap-1 sm:gap-2 font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/cart')
                ? 'text-blue-500'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {t('nav.cart')}
          </Link>

          <div className="ml-1 sm:ml-4 flex gap-1 sm:gap-2 shrink-0 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                language === 'ru'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => setLanguage('uz')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                language === 'uz'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              UZ
            </button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
