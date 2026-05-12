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
    <div className="min-h-screen bg-[#020617] pt-20">
      <div className="mx-auto max-w-[1400px] p-6 lg:p-12">
        <h1 className="mb-8 sm:mb-12 font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
          {t('cart.title')}
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <ShoppingCart className="mb-6 h-24 w-24 text-white/20" />
            <p className="mb-8 text-2xl text-white/40">{t('cart.empty')}</p>
            <button
              onClick={() => navigate('/builder')}
              className="bg-blue-600 px-12 py-5 font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] rounded-2xl active:scale-95"
            >
              {t('checkout.empty.button')}
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
            <div className="space-y-4">
              {cartItems.map((item: DynamicComponent, idx: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col sm:flex-row gap-6 border border-white/10 bg-white/5 p-4 sm:p-6 transition-all hover:border-blue-500/50 rounded-[2rem] glass-card"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full sm:h-32 sm:w-40 object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-2 font-bold text-blue-500 text-xs uppercase tracking-wider">
                        {item.category_name}
                      </div>
                      <h3 className="mb-2 font-black text-xl sm:text-2xl uppercase text-white">
                        {item.name}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {Array.isArray(item.specs) ? item.specs.join(', ') : String(item.specs)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-black text-2xl text-white">
                        {formatPrice(item.price)}{' '}
                        <span className="text-blue-500 text-sm">{t('currency')}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#ff0055] transition-colors hover:text-[#ff0080]"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 lg:h-fit">
              <div className="border border-blue-500/30 bg-white/5 p-8 rounded-[2rem] glass-card">
                <h3 className="mb-6 font-black text-2xl uppercase text-blue-500">
                  {t('cart.total')}
                </h3>

                <div className="mb-8 space-y-4">
                  {cartItems.map((item: DynamicComponent) => (
                    <div
                      key={item.id}
                      className="flex justify-between border-b border-white/5 pb-3"
                    >
                      <span className="text-white/60 text-sm">{item.name}</span>
                      <span className="font-bold text-white text-sm">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-8 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xl uppercase">Total</span>
                    <span className="font-black text-2xl sm:text-3xl text-white">
                      {formatPrice(total)}{' '}
                      <span className="text-blue-500 text-lg">{t('currency')}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-blue-600 px-8 py-5 font-black text-lg uppercase text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] rounded-xl"
                >
                  {t('cart.checkout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
