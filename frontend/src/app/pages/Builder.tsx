import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Info, Cpu } from 'lucide-react';
import { apiService, Product, Category } from '../services/api';
import { AIBuilderModal } from '../components/AIBuilderModal';
import { ProductModal } from '../components/ProductModal';

export interface DynamicComponent {
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

export function Builder() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedComponents, setSelectedComponents] = useState<Record<string, DynamicComponent>>(() => {
    try {
      const saved = localStorage.getItem('pcbuilder-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        const initialSaved: Record<string, DynamicComponent> = {};
        parsed.forEach((item: DynamicComponent) => {
          if (item && item.category_slug) {
            initialSaved[item.category_slug] = item;
          }
        });
        return initialSaved;
      }
    } catch(e) {
      console.error(e);
    }
    return {};
  });
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DynamicComponent | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [components, setComponents] = useState<DynamicComponent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategoriesData = async () => {
      try {
        // Extract categories from paginated response
        let categoriesArray: Category[] = [];
        
        // Try apiService
        try {
          const response = await apiService.getCategories() as any;
          console.log('DEBUG: Full Category Response:', response);
          
          let rawData = response.data;
          // If response.data is the wrapper, look inside
          if (response.success && response.data) {
             rawData = response.data;
          } else if (response.results) {
             rawData = response;
          }

          if (rawData) {
            if (Array.isArray(rawData.results)) {
              categoriesArray = rawData.results;
            } else if (Array.isArray(rawData)) {
              categoriesArray = rawData;
            }
          }
          
          console.log('DEBUG: Extracted categoriesArray:', categoriesArray);
        } catch (apiError) {
          console.warn('API Service failed, using direct call:', apiError);
          
          // Handle direct call with paginated response
          if (directData.data && directData.data.results && Array.isArray(directData.data.results)) {
            categoriesArray = directData.data.results;
          } else if (Array.isArray(directData.data)) {
            categoriesArray = directData.data;
          }
        }
        
        console.log('Final categories array:', categoriesArray);
        setCategories(categoriesArray);
        
        // Set first category as active if none selected
        if (categoriesArray.length > 0 && !activeCategory) {
          setActiveCategory(categoriesArray[0].slug);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Fallback to empty array
        setCategories([]);
      }
    };
    loadCategoriesData();
  }, []);

  // Load components when category changes
  useEffect(() => {
    if (!activeCategory) return;
    
    const loadComponents = async () => {
      setLoading(true);
      try {
        const response = await apiService.getProducts({ category_slug: activeCategory });
        if (response.success && response.data.results) {
          const dynamicComponents = response.data.results.map((product: Product) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            specs: Object.entries(product.specs).map(([key, value]) => `${value}`),
            price: parseFloat(product.price),
            formatted_price: product.formatted_price,
            image: product.image_url || 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
            category_slug: product.category_slug,
            category_name: product.category_name,
            performance: 85 + Math.random() * 15,
          }));
          setComponents(dynamicComponents);
        }
      } catch (error) {
        console.error('Failed to load components:', error);
        setComponents([]);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, [activeCategory]);

  const toggleComponent = (component: DynamicComponent) => {
    console.log('🔄 toggleComponent called with:', component);
    console.log('🏷️ Component category_slug:', component.category_slug);
    console.log('🆔 Component ID:', component.id);
    
    setSelectedComponents((prev) => {
      console.log('📋 Previous selection:', prev);
      
      const newSelection = { ...prev };
      if (newSelection[component.category_slug]?.id === component.id) {
        console.log('❌ Removing component from selection');
        delete newSelection[component.category_slug];
      } else {
        console.log('✅ Adding component to selection');
        newSelection[component.category_slug] = component;
      }
      
      console.log('🆕 New selection:', newSelection);
      
      // Save to localStorage for cart
      const cartItems = Object.values(newSelection);
      localStorage.setItem('pcbuilder-cart', JSON.stringify(cartItems));
      
      // Debug: Check if items are saved
      console.log('💾 Saved to localStorage:', cartItems);
      console.log('📦 localStorage now contains:', localStorage.getItem('pcbuilder-cart'));
      
      // Dispatch event to update header
      window.dispatchEvent(new Event('cart-updated'));
      
      return newSelection;
    });
  };

  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, comp) => sum + comp.price,
    0
  );

  const selectedInCategory = selectedComponents[activeCategory];

  const isCompatible = Object.keys(selectedComponents).length >= 3;

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ru-RU').replace(/,/g, ' ');
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-20">
      <div className="mx-auto max-w-[1800px] p-6 lg:p-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white lg:text-6xl">
            {t('builder.title')}
          </h1>
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 border border-blue-500 bg-transparent px-6 py-3 font-bold text-sm uppercase text-blue-500 transition-all hover:bg-blue-500 hover:text-white rounded-xl"
          >
            <Sparkles className="h-4 w-4" />
            {t('builder.ai.button')}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px,1fr,400px]">
          {/* Categories Sidebar */}
          <div className="space-y-2">
            <div className="mb-2 sm:mb-4 font-bold text-[#00d4ff] text-sm uppercase tracking-wider">
              {t('builder.select')}
            </div>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar snap-x">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                  className={`shrink-0 w-[180px] lg:w-full border px-4 py-3 sm:px-6 sm:py-4 text-left font-bold text-xs sm:text-sm uppercase tracking-wider transition-all snap-start rounded-xl ${
                    activeCategory === category.slug
                      ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-blue-500/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate mr-2">{category.name}</span>
                    {selectedComponents[category.slug] && (
                      <Check className="h-4 w-4 shrink-0 text-[#00ff88]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Component Selection */}
          <div className="space-y-4">
            <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-black text-lg sm:text-xl md:text-3xl uppercase text-white truncate mr-2">
                {categories.find(c => c.slug === activeCategory)?.name || 'Components'}
              </h2>
              {selectedInCategory && (
                <span className="font-bold text-[#00ff88] text-sm uppercase">
                  {t('component.selected')}
                </span>
              )}
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
              {loading ? (
                <div className="col-span-full text-center py-24">
                   <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                    <Cpu className="h-16 w-16 text-blue-500 animate-spin mb-4 mx-auto" />
                  </div>
                  <div className="text-white/40 font-black uppercase tracking-widest">{t('builder.loading') || 'Загрузка...'}</div>
                </div>
              ) : components.length === 0 ? (
                <div className="col-span-full text-center py-24">
                  <div className="text-white/20 font-black uppercase tracking-widest">{t('builder.empty') || 'Нет компонентов в этой категории'}</div>
                </div>
              ) : (
                components.map((component) => {
                  const isSelected = selectedInCategory?.id === component.id;
                  return (
                    <motion.div
                      key={component.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative cursor-pointer overflow-hidden border bg-[#0a0a0f]/40 backdrop-blur-xl transition-all duration-300 rounded-[2.5rem] flex flex-col ${
                        isSelected
                          ? 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]'
                          : 'border-white/5 hover:border-blue-500/30'
                      }`}
                    >
                      <div
                        className="relative h-64 overflow-hidden bg-white/5 flex items-center justify-center p-8"
                        onClick={() => toggleComponent(component)}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
                        <img
                          src={component.image}
                          alt={component.name}
                          className="relative z-10 h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(component);
                            setShowProductModal(true);
                          }}
                          className="absolute left-6 top-6 z-20 flex h-10 w-10 items-center justify-center border border-white/10 bg-black/50 backdrop-blur-md transition-all hover:border-blue-500 hover:bg-blue-500 rounded-xl"
                        >
                          <Info className="h-5 w-5 text-white" />
                        </button>
                        {isSelected && (
                          <div className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}

                        {component.performance && (
                          <div className="absolute bottom-6 right-6 z-20 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                            <span className="text-[10px] font-black text-blue-400">{Math.round(component.performance)}%</span>
                          </div>
                        )}
                      </div>

                      <div className="p-8 flex-1 flex flex-col" onClick={() => toggleComponent(component)}>
                        <div className="mb-2 font-bold text-[#00d4ff] text-xs uppercase tracking-wider">
                          {component.brand}
                        </div>
                        <h3 className="mb-3 font-black text-white text-xl uppercase leading-tight">
                          {component.name}
                        </h3>
                        <div className="mb-4 space-y-1">
                          {component.specs.slice(0, 3).map((spec: string, idx: number) => (
                            <div key={idx} className="text-white/60 text-xs">
                              {spec}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="font-black text-2xl text-white">
                            {formatPrice(component.price)}{' '}
                            <span className="text-blue-500 text-sm">
                              {t('currency')}
                            </span>
                          </div>
                          {component.performance && (
                            <div className="border border-[#00ff88]/30 bg-[#00ff88]/10 px-3 py-1 font-bold text-[#00ff88] text-xs">
                              {Math.round(component.performance)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-32 lg:h-fit">
            <div className="border border-blue-500/30 bg-white/5 p-6 rounded-[2rem] glass-card">
              <h3 className="mb-4 font-black text-2xl uppercase text-blue-500">
                {t('builder.total')}
              </h3>

              <div className="mb-6 space-y-3">
                {categories.map((category) => {
                  const comp = selectedComponents[category.slug];
                  return (
                    <div
                      key={category.slug}
                      className="flex items-center justify-between border-b border-white/5 pb-3"
                    >
                      <span className="text-white/60 text-xs uppercase">
                        {category.name}
                      </span>
                      {comp ? (
                        <span className="font-bold text-white text-xs">
                          {formatPrice(comp.price)}
                        </span>
                      ) : (
                        <span className="text-white/30 text-xs">-</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mb-8 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-white/40 text-[10px] uppercase tracking-[0.2em]">{t('builder.total') || 'Итого'}</span>
                  <span className="font-black text-3xl sm:text-4xl text-white">
                    {formatPrice(Object.values(selectedComponents).reduce((sum, item) => sum + item.price, 0))}{' '}
                    <span className="text-blue-500 text-lg">{t('currency')}</span>
                  </span>
                </div>

                {Object.keys(selectedComponents).length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white/40 text-[10px] uppercase tracking-[0.2em]">{t('category.performance') || 'Мощность сборки'}</span>
                      <span className="font-black text-xl text-[#00ff88]">
                        {Math.round(Object.values(selectedComponents).reduce((acc, curr) => acc + (curr.performance || 0), 0) / Object.keys(selectedComponents).length)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(Object.values(selectedComponents).reduce((acc, curr) => acc + (curr.performance || 0), 0) / Object.keys(selectedComponents).length)}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8 flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                {isCompatible ? (
                  <>
                    <div className="h-8 w-8 flex items-center justify-center bg-[#00ff88]/20 rounded-lg">
                      <Check className="h-5 w-5 text-[#00ff88]" />
                    </div>
                    <span className="font-bold text-[#00ff88] text-xs uppercase tracking-wider">
                      {t('builder.compatibility.ok')}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-8 w-8 flex items-center justify-center bg-white/10 rounded-lg">
                      <X className="h-5 w-5 text-white/30" />
                    </div>
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                      {t('builder.compatibility.min') || 'Выберите минимум 3 компонента'}
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() => navigate('/checkout')}
                disabled={Object.keys(selectedComponents).length === 0}
                className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-8 py-5 font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] disabled:cursor-not-allowed disabled:opacity-30 active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {t('builder.checkout')}
                  <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AIBuilderModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onBuildGenerated={(components) => {
          console.log('🚀 AI Builder: Received raw components from API:', components);
          
          const convertedComponents: Record<string, DynamicComponent> = {};
          
          // Helper to find the best matching category slug from our current categories state
          const findBestCategorySlug = (aiSlug: string, comp: any) => {
             const lowerAISlug = aiSlug.toLowerCase();
             const lowerAIName = (comp.category_name || '').toLowerCase();
             
             // Dictionary of common mappings
             const mapping: Record<string, string[]> = {
               'processor': ['cpu', 'processor', 'процессор', 'проц'],
               'videokarta': ['gpu', 'video', 'graphics', 'видеокарта', 'видюха', 'vga'],
               'materinskaya-plata': ['motherboard', 'mainboard', 'plate', 'материнка', 'плата', 'm/b'],
               'operativnaya-pamyat': ['ram', 'memory', 'память', 'оперативка', 'dram'],
               'blok-pitaniya': ['psu', 'power', 'block', 'блок питания', 'бп'],
               'korpus': ['case', 'chassis', 'корпус'],
               'ssd': ['ssd', 'solid', 'ссд'],
               'tverdotelnyj-nakopitel': ['storage', 'drive', 'disk', 'накопитель', 'диск', 'hdd'],
               'sistema-ohlazhdeniya': ['cooling', 'fan', 'cooler', 'охлаждение', 'кулер']
             };

             // 1. Try dictionary match
             for (const [realSlug, aliases] of Object.entries(mapping)) {
               if (aliases.some(alias => lowerAISlug.includes(alias) || lowerAIName.includes(alias))) {
                 if (categories.some(c => c.slug === realSlug)) return realSlug;
               }
             }

             // 2. Try direct match with AI slug
             if (categories.some(c => c.slug === aiSlug)) return aiSlug;
             // 3. Try match with component's own category_slug
             if (comp.category_slug && categories.some(c => c.slug === comp.category_slug)) return comp.category_slug;
             
             // 4. Fallback to name similarity
             const match = categories.find(c => 
               c.name.toLowerCase().includes(lowerAISlug) || 
               lowerAISlug.includes(c.name.toLowerCase()) ||
               c.slug.includes(aiSlug) ||
               aiSlug.includes(c.slug)
             );
             return match ? match.slug : aiSlug;
          };

          Object.entries(components).forEach(([slug, comp]: [string, any]) => {
            const targetSlug = findBestCategorySlug(slug, comp);
            console.log(`🔍 AI Mapping: "${slug}" -> "${targetSlug}"`);

            const dynamicComp: DynamicComponent = {
              id: String(comp.id || Math.random().toString(36).substr(2, 9)),
              name: comp.name || 'Unknown Component',
              brand: comp.brand || 'Generic',
              specs: Array.isArray(comp.specs) 
                ? comp.specs.map((s: any) => String(s))
                : typeof comp.specs === 'object' 
                  ? Object.values(comp.specs).map((s: any) => String(s))
                  : [String(comp.specs || '')],
              price: typeof comp.price === 'string' ? parseFloat(comp.price) : (Number(comp.price) || 0),
              image: comp.image_url || comp.image || 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
              category_slug: targetSlug,
              category_name: categories.find(c => c.slug === targetSlug)?.name || comp.category_name || slug,
              performance: comp.performance || (85 + Math.random() * 15),
              formatted_price: comp.formatted_price
            };
            convertedComponents[targetSlug] = dynamicComp;
          });
          
          const cartItems = Object.values(convertedComponents);
          console.log('📦 AI Builder: Final mapped items:', cartItems);
          
          localStorage.setItem('pcbuilder-cart', JSON.stringify(cartItems));
          setSelectedComponents(convertedComponents);
          
          setShowAIModal(false);
          // Small delay to ensure state is updated before showing success
          setTimeout(() => {
            alert("Сборка готова! Теперь вы можете оформить заказ.");
          }, 100);
        }}
      />

      <ProductModal
        component={selectedProduct}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelect={(component) => toggleComponent(component)}
        isSelected={selectedProduct ? selectedComponents[selectedProduct.category_slug]?.id === selectedProduct.id : false}
      />
    </div>
  );
}
