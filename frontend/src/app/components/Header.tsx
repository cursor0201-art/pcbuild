import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangPanelOpen, setIsLangPanelOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  const updateCartCount = () => {
    try {
      const cartData = localStorage.getItem('pcbuilder-cart');
      const items = cartData ? JSON.parse(cartData) : [];
      const validItems = Array.isArray(items) ? items.filter((item) => item && item.id) : [];
      setCartCount(validItems.length);
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.builder'), path: '/builder' },
    { name: t('nav.about'), path: '/about' },
  ];

  const openMenu = () => {
    setIsLangPanelOpen(false);
    setIsMenuOpen(true);
  };

  const openLangPanel = () => {
    setIsMenuOpen(false);
    setIsLangPanelOpen(true);
  };

  const langPanelLinks = [
    { name: t('nav.builder'), path: '/builder' },
    { name: t('nav.about'), path: '/about' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 lg:px-12">
        <Link to="/" className="group flex shrink-0 items-center gap-3 z-50">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 bg-blue-500 blur-md opacity-40 transition-opacity group-hover:opacity-60" />
            <svg viewBox="0 0 24 24" className="relative h-full w-full fill-current text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="font-black text-2xl uppercase leading-none tracking-tighter text-white">GAMEZONE</div>
        </Link>

        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                isActive(link.path) ? 'text-blue-500' : 'text-white/60 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 z-50 lg:gap-6">
          <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            {['ru', 'uz'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang as 'ru' | 'uz')}
                className={`touch-target rounded-md px-3 py-1.5 text-[10px] font-bold transition-all ${
                  language === lang ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            to="/cart"
            className={`relative flex touch-target rounded-lg p-2.5 transition-colors hover:bg-white/5 sm:p-3 ${
              isActive('/cart') ? 'text-blue-500' : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-black text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              {cartCount}
            </span>
          </Link>

          {/* Mobile menu triggers removed */}
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 z-[100] h-screen w-screen overflow-y-auto bg-[#020617] lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex h-full flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex h-16 items-center justify-between border-b border-white/5 px-3">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-2">
                  <div className="relative h-7 w-7">
                    <div className="absolute inset-0 bg-blue-500 opacity-50 blur-md" />
                    <svg viewBox="0 0 24 24" className="relative h-full w-full fill-current text-blue-500">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="text-sm font-bold uppercase leading-none tracking-tighter text-white">GAMEZONE</div>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="touch-target rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-2 p-4">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-xl p-4 text-xl font-bold uppercase tracking-tight transition-colors ${
                    isActive('/')
                      ? 'border border-blue-500/30 bg-blue-500/10 text-blue-500'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  {t('nav.home')}
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLangPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 z-[100] h-screen w-screen overflow-y-auto bg-[#020617] lg:hidden"
            onClick={() => setIsLangPanelOpen(false)}
          >
            <div className="flex h-full flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex h-16 items-center justify-between border-b border-white/5 px-3">
                <span className="text-sm font-bold uppercase tracking-wide text-white/90">{t('nav.lang_menu')}</span>
                <button
                  type="button"
                  onClick={() => setIsLangPanelOpen(false)}
                  className="touch-target rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-6 p-4 pb-safe">
                <div>
                  <div className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {t('nav.language')}
                  </div>
                  <div className="flex gap-3">
                    {['ru', 'uz'].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang as 'ru' | 'uz')}
                        className={`flex-1 touch-target rounded-xl border py-3.5 text-sm font-bold uppercase transition-all ${
                          language === lang
                            ? 'border-blue-500 bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                            : 'border-white/10 bg-white/5 text-white/60 hover:text-white/85'
                        }`}
                      >
                        {lang === 'ru' ? 'РУ' : 'УЗ'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    {t('nav.section_links')}
                  </div>
                  <div className="flex flex-col gap-2">
                    {langPanelLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsLangPanelOpen(false)}
                        className={`rounded-xl p-4 text-lg font-bold uppercase tracking-tight transition-colors ${
                          isActive(link.path)
                            ? 'border border-blue-500/30 bg-blue-500/10 text-blue-500'
                            : 'text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link
                      to="/cart"
                      onClick={() => setIsLangPanelOpen(false)}
                      className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                        isActive('/cart')
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-500'
                          : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg font-bold uppercase tracking-tight">{t('nav.cart')}</span>
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-black text-white">
                          {cartCount}
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
