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
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20">
      <div className="mx-auto max-w-[1400px] p-6 lg:p-12">
        <h1 className="mb-12 font-black text-6xl uppercase tracking-tighter text-white">
          {t('cart.title')}
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <ShoppingCart className="mb-6 h-24 w-24 text-white/20" />
            <p className="mb-8 text-2xl text-white/40">{t('cart.empty')}</p>
            <button
              onClick={() => navigate('/builder')}
              className="bg-[#00d4ff] px-12 py-4 font-black uppercase text-black transition-colors hover:bg-[#00ff88]"
            >
              {t('hero.cta')}
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
                  className="flex flex-col sm:flex-row gap-6 border border-white/10 bg-[#12121a] p-4 sm:p-6 transition-all hover:border-[#00d4ff]/50"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full sm:h-32 sm:w-40 object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-2 font-bold text-[#00d4ff] text-xs uppercase tracking-wider">
                        {item.category_name}
                      </div>
                      <h3 className="mb-2 font-black text-2xl uppercase text-white">
                        {item.name}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {Array.isArray(item.specs) ? item.specs.join(', ') : String(item.specs)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-black text-2xl text-white">
                        {formatPrice(item.price)}{' '}
                        <span className="text-[#00d4ff] text-sm">{t('currency')}</span>
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
              <div className="border border-[#00d4ff]/30 bg-[#12121a] p-8">
                <h3 className="mb-6 font-black text-2xl uppercase text-[#00d4ff]">
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

                <div className="mb-8 border-t border-[#00d4ff]/30 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-xl uppercase">Total</span>
                    <span className="font-black text-3xl text-white">
                      {formatPrice(total)}{' '}
                      <span className="text-[#00d4ff] text-lg">{t('currency')}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#00d4ff] px-8 py-5 font-black text-lg uppercase text-black transition-all hover:bg-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
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
