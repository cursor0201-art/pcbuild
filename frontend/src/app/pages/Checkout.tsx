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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl border border-[#00ff88]/30 bg-[#12121a] p-16 text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center border-4 border-[#00ff88] bg-[#00ff88]/10">
              <Check className="h-12 w-12 text-[#00ff88]" />
            </div>
          </div>
          <h2 className="mb-4 font-black text-5xl uppercase text-white">
            ЗАКАЗ ПРИНЯТ
          </h2>
          <p className="mb-8 text-white/70 text-xl">
            Мы свяжемся с вами в ближайшее время для подтверждения заказа.
          </p>
          <div className="font-black text-3xl text-white">
            {formatPrice(finalTotal || total)}{' '}
            <span className="text-[#00d4ff] text-xl">{t('currency')}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Check if cart is empty and show empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] pt-20">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center border-4 border-[#ff0080] bg-[#ff0080]/10">
              <X className="h-12 w-12 text-[#ff0080]" />
            </div>
          </div>
          <h2 className="mb-4 font-black text-5xl uppercase text-white">
            CART IS EMPTY
          </h2>
          <p className="mb-8 text-white/70 text-xl">
            Please add items to your cart before checkout.
          </p>
          <button
            onClick={() => navigate('/builder')}
            className="bg-[#00d4ff] px-8 py-4 font-black text-lg uppercase text-black transition-all hover:bg-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
          >
            GO TO BUILDER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20">
      <div className="mx-auto max-w-[1200px] p-6 lg:p-12">
        <h1 className="mb-8 sm:mb-12 font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
          {t('checkout.title')}
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="mb-6 font-black text-2xl uppercase text-[#00d4ff]">
                {t('checkout.contact')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-bold text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.name')}
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-white/20 bg-[#12121a] px-6 py-4 text-white outline-none transition-all focus:border-[#00d4ff]"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-bold text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-white/20 bg-[#12121a] px-6 py-4 text-white outline-none transition-all focus:border-[#00d4ff]"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-bold text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-white/20 bg-[#12121a] px-6 py-4 text-white outline-none transition-all focus:border-[#00d4ff]"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-6 font-black text-2xl uppercase text-[#00d4ff]">
                {t('checkout.delivery')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-bold text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.city')}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-white/20 bg-[#12121a] px-6 py-4 text-white outline-none transition-all focus:border-[#00d4ff]"
                    placeholder="Ташкент"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-bold text-sm uppercase tracking-wider text-white/80">
                    {t('checkout.address')}
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full border border-white/20 bg-[#12121a] px-6 py-4 text-white outline-none transition-all focus:border-[#00d4ff]"
                    placeholder="ул. Амира Темура, д. 123, кв. 45"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-6 font-black text-2xl uppercase text-[#00d4ff]">
                {t('checkout.comment')}
              </h2>
              <div>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-white/20 bg-[#12121a] px-6 py-4 text-white outline-none transition-all focus:border-[#00d4ff]"
                  placeholder="Additional comments..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00d4ff] px-8 py-5 font-black text-lg uppercase text-black transition-all hover:bg-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
            >
              {t('checkout.submit')}
            </button>
          </form>

          <div className="lg:sticky lg:top-32 lg:h-fit">
            <div className="border border-[#00d4ff]/30 bg-[#12121a] p-8">
              <h3 className="mb-6 font-black text-2xl uppercase text-[#00d4ff]">
                {t('cart.total')}
              </h3>

              <div className="mb-8 space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/60 text-sm">AMD Ryzen 9 7950X</span>
                  <span className="font-bold text-white text-sm">
                    {formatPrice(12500000)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/60 text-sm">NVIDIA RTX 4090</span>
                  <span className="font-bold text-white text-sm">
                    {formatPrice(42000000)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#00d4ff]/30 pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-xl uppercase">Total</span>
                  <span className="font-black text-3xl text-white">
                    {formatPrice(total)}{' '}
                    <span className="text-[#00d4ff] text-lg">{t('currency')}</span>
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
