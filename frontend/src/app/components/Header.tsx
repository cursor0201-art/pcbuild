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
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#00d4ff]/20 bg-[#0a0a0f]/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 lg:px-12">
        <Link to="/" className="group flex items-center gap-3 shrink-0">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[#00d4ff]/20 bg-black/40 p-1 transition-all duration-300 group-hover:border-[#00d4ff] group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <img 
              src="/favicon.png?v=3" 
              alt="GameZoneBuild" 
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4ff]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="hidden sm:block">
            <div className="font-black text-2xl uppercase tracking-tighter text-white leading-none">
              GameZone
            </div>
            <div className="font-black text-xs uppercase tracking-widest text-[#00d4ff]">
              Build
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-8 overflow-x-auto no-scrollbar ml-2">
          <Link
            to="/"
            className={`font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/')
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/builder"
            className={`font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/builder')
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.builder')}
          </Link>
          <Link
            to="/about"
            className={`font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/about')
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/cart"
            className={`flex items-center gap-1 sm:gap-2 font-bold text-[10px] sm:text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
              isActive('/cart')
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {t('nav.cart')}
          </Link>

          <div className="ml-2 sm:ml-4 flex gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-2 sm:px-4 py-1 sm:py-2 font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all ${
                language === 'ru'
                  ? 'bg-[#00d4ff] text-black'
                  : 'border border-[#00d4ff]/30 text-white/60 hover:border-[#00d4ff] hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => setLanguage('uz')}
              className={`px-2 sm:px-4 py-1 sm:py-2 font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all ${
                language === 'uz'
                  ? 'bg-[#00d4ff] text-black'
                  : 'border border-[#00d4ff]/30 text-white/60 hover:border-[#00d4ff] hover:text-white'
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
