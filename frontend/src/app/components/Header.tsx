import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  // Sync cart count
  const updateCartCount = () => {
    const cartData = localStorage.getItem('pcbuilder-cart');
    const items = cartData ? JSON.parse(cartData) : [];
    setCartCount(items.length);
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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 lg:px-12">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3 shrink-0 z-50">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 bg-blue-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <svg viewBox="0 0 24 24" className="relative h-full w-full text-blue-500 fill-current drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="font-black text-2xl uppercase tracking-tighter text-white leading-none">
            <span className="text-blue-500">G</span>AMEZONE
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-bold text-sm uppercase tracking-wider transition-colors ${
                isActive(link.path) ? 'text-blue-500' : 'text-white/60 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-6 z-50">
          {/* Language Switcher (Desktop) */}
          <div className="hidden md:flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            {['ru', 'uz'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as 'ru' | 'uz')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                  language === lang ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            to="/cart"
            className={`relative p-2 transition-colors ${
              isActive('/cart') ? 'text-blue-500' : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 h-4 w-4 bg-blue-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white/60 hover:text-white lg:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 h-screen w-screen bg-[#020617] lg:hidden z-[100] overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Menu Header (Logo + Close) */}
              <div className="flex h-20 items-center justify-between px-4 border-b border-white/5">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-3">
                  <div className="relative h-8 w-8">
                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-50" />
                    <svg viewBox="0 0 24 24" className="relative h-full w-full text-blue-500 fill-current">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="font-bold text-lg uppercase tracking-tighter text-white leading-none">
                    GameZone<span className="text-blue-500">Build</span>
                  </div>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white/60 hover:text-white">
                  <X className="h-8 w-8" />
                </button>
              </div>

              <nav className="flex flex-col p-8 gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl font-bold uppercase tracking-tight ${
                      isActive(link.path) ? 'text-blue-500' : 'text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Select Language</div>
                  <div className="flex gap-3">
                    {['ru', 'uz'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang as 'ru' | 'uz');
                          setIsMenuOpen(false);
                        }}
                        className={`flex-1 py-3 font-bold text-xs uppercase rounded-xl border transition-all ${
                          language === lang 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                            : 'bg-white/5 border-white/10 text-white/60'
                        }`}
                      >
                        {lang === 'ru' ? 'Русский' : "O'zbekcha"}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
