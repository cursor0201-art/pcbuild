import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../data/components-api';

// Dynamic component interface matching Builder
interface DynamicComponent {
  id: string;
  name: string;
  brand: string;
  specs: string[];
  price: number;
  image: string;
  performance?: number;
  formatted_price?: string;
  category_slug: string;
  category_name: string;
}

// Cart items will be managed through state or local storage
const getCartItems = (): DynamicComponent[] => {
  const cartData = localStorage.getItem('pcbuilder-cart');
  return cartData ? JSON.parse(cartData) : [];
};

export function Cart() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(getCartItems());

  // Debug: Check if items are loaded
  console.log('🛒 Cart items loaded:', cartItems);
  console.log('📦 localStorage data:', localStorage.getItem('pcbuilder-cart'));

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const removeFromCart = (itemId: string) => {
    const newCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newCartItems);
    localStorage.setItem('pcbuilder-cart', JSON.stringify(newCartItems));
    // Dispatch event to update header
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 sm:pt-28 lg:pt-32">
      <div className="mx-auto max-w-[1400px] p-3 sm:p-6 lg:p-12">
        <div className="bg-red-600 text-white p-4 text-center font-bold text-2xl mb-10">
          DEBUG: CART PAGE LOADED
        </div>
        <h1 className="mb-6 sm:mb-8 lg:mb-12 font-black text-4xl sm:text-6xl lg:text-8xl uppercase tracking-tighter text-blue-500 text-center">
          КОРЗИНА
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24">
            <ShoppingCart className="mb-6 h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 text-white/20" />
            <p className="mb-8 text-lg sm:text-xl md:text-2xl text-white/40">{t('cart.empty')}</p>
            <button
              onClick={() => navigate('/builder')}
              className="bg-blue-600 px-6 sm:px-12 py-3 sm:py-5 font-black uppercase tracking-widest text-white text-sm sm:text-base transition-all hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] rounded-lg sm:rounded-2xl active:scale-95 touch-target"
            >
              {t('checkout.empty.button')}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-[1fr,380px]">
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item: DynamicComponent, idx: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 border border-white/10 bg-white/5 p-3 sm:p-4 lg:p-6 transition-all hover:border-blue-500/50 rounded-lg sm:rounded-2xl glass-card"
                >
                  <div className="h-40 sm:h-32 lg:h-40 w-full sm:w-40 lg:w-48 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-1 sm:mb-2 font-bold text-blue-500 text-[10px] sm:text-xs uppercase tracking-wider">
                        {item.category_name}
                      </div>
                      <h3 className="mb-1 sm:mb-2 font-black text-base sm:text-lg lg:text-xl uppercase text-white">
                        {item.name}
                      </h3>
                      <p className="text-white/60 text-xs sm:text-sm line-clamp-2">
                        {Array.isArray(item.specs) ? item.specs.join(', ') : String(item.specs)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 sm:mt-0">
                      <div className="font-black text-lg sm:text-xl lg:text-2xl text-white">
                        {formatPrice(item.price)}{' '}
                        <span className="text-blue-500 text-xs sm:text-sm lg:text-base">{t('currency')}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-red-500 text-xs sm:text-sm uppercase transition-all touch-target"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('cart.remove')}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="border border-blue-500/30 bg-white/5 p-4 sm:p-6 rounded-lg sm:rounded-2xl glass-card lg:sticky lg:top-28 lg:h-fit">
              <h2 className="mb-4 font-black text-lg sm:text-xl uppercase text-blue-500">
                {t('checkout.summary')}
              </h2>

              <div className="mb-4 space-y-2 max-h-48 overflow-y-auto">
                {cartItems.map((item: DynamicComponent) => (
                  <div key={item.id} className="flex justify-between text-[10px] sm:text-xs">
                    <span className="text-white/60 truncate mr-2">{item.name}</span>
                    <span className="font-bold text-white whitespace-nowrap">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-white/40 text-[10px] uppercase tracking-[0.2em]">{t('checkout.subtotal')}</span>
                  <span className="font-black text-lg sm:text-xl text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-white/40 text-[10px] uppercase tracking-[0.2em]">{t('checkout.tax')}</span>
                  <span className="font-bold text-white text-xs">{t('checkout.included')}</span>
                </div>
              </div>

              <div className="mb-6 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[10px] uppercase text-white/60">{t('checkout.total')}</span>
                  <div className="font-black text-2xl sm:text-3xl text-white">
                    {formatPrice(total)}{' '}
                    <div className="text-blue-500 text-xs sm:text-sm leading-none">{t('currency')}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="group w-full bg-blue-600 px-4 sm:px-6 py-3 sm:py-4 font-black uppercase tracking-widest text-white text-xs sm:text-sm transition-all hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] rounded-lg sm:rounded-xl active:scale-[0.98] touch-target"
              >
                {t('checkout.proceed')}
              </button>

              <button
                onClick={() => navigate('/builder')}
                className="w-full mt-3 border border-white/20 bg-white/5 hover:bg-white/10 px-4 sm:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-white text-xs sm:text-sm transition-all rounded-lg sm:rounded-xl touch-target"
              >
                {t('checkout.continue')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
