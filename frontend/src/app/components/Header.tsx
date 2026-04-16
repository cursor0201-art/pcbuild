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
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-12">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative">
            <Cpu className="h-10 w-10 text-[#00d4ff] transition-all duration-300 group-hover:rotate-90 group-hover:text-[#ff0080]" />
            <div className="absolute inset-0 animate-pulse bg-[#00d4ff]/20 blur-xl" />
          </div>
          <div>
            <div className="font-black text-2xl uppercase tracking-tighter text-white">
              GameZone
            </div>
            <div className="font-black text-xs uppercase tracking-widest text-[#00d4ff]">
              Build
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className={`font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/')
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/builder"
            className={`font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/builder')
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {t('nav.builder')}
          </Link>
          <Link
            to="/cart"
            className={`flex items-center gap-2 font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/cart')
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {t('nav.cart')}
          </Link>

          <div className="ml-4 flex gap-2">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all ${
                language === 'ru'
                  ? 'bg-[#00d4ff] text-black'
                  : 'border border-[#00d4ff]/30 text-white/60 hover:border-[#00d4ff] hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => setLanguage('uz')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider transition-all ${
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
