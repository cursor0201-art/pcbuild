import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Check, X } from 'lucide-react';
import { formatPrice } from '../data/components-api';
import { apiService } from '../services/api';

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

// Cart items will be loaded from localStorage
const getCartItems = (): DynamicComponent[] => {
  const cartData = localStorage.getItem('pcbuilder-cart');
  return cartData ? JSON.parse(cartData) : [];
};

export function Checkout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [cartItems, setCartItems] = useState<DynamicComponent[]>(getCartItems());
  
  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    comment: ''
  });

  const [finalTotal, setFinalTotal] = useState(0);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('?? Starting order submission...');
    console.log('?? Cart items:', cartItems);
    console.log('?? Total:', total);
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      alert('Cart is empty! Please add items to your cart before checkout.');
      return;
    }
    
    try {
      // Prepare order data
      const orderData = {
        customer_name: formData.customer_name || 'Customer Name',
        phone: formData.phone || '+998900000000',
        email: formData.email || 'customer@example.com',
        comment: formData.comment || `Order from PC Builder - Total: ${formatPrice(total)}`,
        items: cartItems.map(item => ({
          product_id: item.id, // UUID from backend
          name: item.name, // Required field for backend
          price: item.price, // Required field for backend
          quantity: 1
        }))
      };

      console.log('📋 Order data prepared:', orderData);

      // Send order to backend
      console.log('🔄 Sending order to backend...');
      const response = await apiService.createOrder(orderData);
      
      console.log('📨 Backend response:', response);
      
      if (response.success) {
        console.log('✅ Order created successfully!');
        // Store total before clearing
        setFinalTotal(total);
        // Clear cart after successful order
        localStorage.removeItem('pcbuilder-cart');
        setCartItems([]);
        setSubmitted(true);
      } else {
        console.error('❌ Failed to create order:', response.error);
        alert(`Failed to create order: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Order submission error:', error);
      alert(`Order submission error: ${error.message || 'Unknown error'}`);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] pt-16 sm:pt-20 px-3 sm:px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full border border-blue-500/30 bg-white/5 p-6 sm:p-8 lg:p-16 text-center rounded-lg sm:rounded-2xl glass-card"
        >
          <div className="mb-6 sm:mb-8 flex justify-center">
            <img 
              src="/hero_pc.png" 
              loading="lazy"
              className="h-32 sm:h-48 lg:h-64 object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]" 
              alt="Order Success" 
            />
          </div>
          <h2 className="mb-3 sm:mb-4 font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-white">
            {t('checkout.success.title')}
          </h2>
          <p className="mb-6 sm:mb-8 text-white/70 text-sm sm:text-base md:text-lg lg:text-xl">
            {t('checkout.success.message')}
          </p>
          <div className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white">
            {formatPrice(finalTotal || total)}{' '}
            <div className="text-blue-500 text-sm sm:text-base md:text-lg lg:text-xl leading-none">{t('currency')}</div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Check if cart is empty and show empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] pt-16 sm:pt-20 px-3 sm:px-6">
        <div className="text-center w-full max-w-md">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="flex h-20 sm:h-24 w-20 sm:w-24 items-center justify-center border-4 border-red-500 bg-red-500/10 rounded-full">
              <X className="h-10 sm:h-12 w-10 sm:w-12 text-red-500" />
            </div>
          </div>
          <h2 className="mb-3 sm:mb-4 font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase text-white">
            {t('checkout.empty.title')}
          </h2>
          <p className="mb-6 sm:mb-8 text-white/70 text-sm sm:text-base md:text-lg">
            {t('checkout.empty.message')}
          </p>
          <button
            onClick={() => navigate('/builder')}
            className="bg-blue-600 px-6 sm:px-8 py-3 sm:py-4 font-black text-sm sm:text-base uppercase text-white transition-all hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] rounded-lg sm:rounded-xl touch-target"
          >
            {t('checkout.empty.button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-16 sm:pt-20">
      <div className="mx-auto max-w-[1200px] p-3 sm:p-6 lg:p-12">
        <h1 className="mb-6 sm:mb-8 lg:mb-12 font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white">
          {t('checkout.title')}
        </h1>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-[1fr,360px]">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="mb-4 sm:mb-6 font-black text-lg sm:text-xl lg:text-2xl uppercase text-blue-500">
                {t('checkout.contact')}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="mb-2 block font-bold text-xs sm:text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.name')}
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-white/10 bg-white/5 px-4 sm:px-6 py-4 sm:py-5 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/10 rounded-2xl text-sm sm:text-base font-medium"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-bold text-xs sm:text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-white/10 bg-white/5 px-4 sm:px-6 py-4 sm:py-5 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/10 rounded-2xl text-sm sm:text-base font-medium"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-bold text-xs sm:text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-white/10 bg-white/5 px-4 sm:px-6 py-4 sm:py-5 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/10 rounded-2xl text-sm sm:text-base font-medium"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 sm:mb-6 font-black text-lg sm:text-xl lg:text-2xl uppercase text-[#00d4ff]">
                {t('checkout.delivery')}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="mb-2 block font-bold text-xs sm:text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.city')}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    placeholder="Ташкент"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-bold text-xs sm:text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.address')}
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base resize-none"
                    placeholder="ул. Амира Темура, д. 123, кв. 45"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 sm:mb-6 font-black text-lg sm:text-xl lg:text-2xl uppercase text-[#00d4ff]">
                {t('checkout.comment')}
              </h2>
              <div>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-white/10 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-white outline-none transition-all focus:border-blue-500 focus:bg-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base resize-none"
                  placeholder="Additional comments..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 px-4 sm:px-8 py-3 sm:py-4 lg:py-5 font-black text-xs sm:text-sm lg:text-base uppercase text-white transition-all hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] rounded-lg sm:rounded-xl active:scale-95 touch-target"
            >
              {t('checkout.submit')}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-blue-500/30 bg-white/5 p-4 sm:p-6 rounded-lg sm:rounded-2xl glass-card">
              <h3 className="mb-4 sm:mb-6 font-black text-lg sm:text-xl lg:text-2xl uppercase text-blue-500">
                {t('cart.total')}
              </h3>

              <div className="mb-4 sm:mb-6 space-y-2 max-h-48 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-white/5 pb-2 text-[10px] sm:text-xs">
                    <span className="text-white/60 truncate mr-2">{item.name}</span>
                    <span className="font-bold text-white whitespace-nowrap">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-blue-500/30 pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-base sm:text-lg lg:text-xl uppercase">{t('checkout.total')}</span>
                  <span className="font-black text-xl sm:text-2xl lg:text-3xl text-white">
                    {formatPrice(total)}{' '}
                    <span className="text-blue-500 text-xs sm:text-sm lg:text-base leading-none block">{t('currency')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
