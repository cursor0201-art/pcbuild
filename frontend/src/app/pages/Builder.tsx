import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Info } from 'lucide-react';
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
          const response = await apiService.getCategories();
          console.log('API Service Response:', response);
          console.log('API Service data type:', typeof response.data);
          
          if (response.success && response.data) {
            // Handle paginated response: {success: true, data: {count: 2, results: [...]}}
            const responseData = response.data as any;
            if (responseData.results && Array.isArray(responseData.results)) {
              categoriesArray = responseData.results;
            } else if (Array.isArray(response.data)) {
              categoriesArray = response.data;
            }
          }
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
    <div className="min-h-screen bg-[#0a0a0f] pt-20">
      <div className="mx-auto max-w-[1800px] p-6 lg:p-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tighter text-white lg:text-6xl">
            {t('builder.title')}
          </h1>
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 border border-[#ff0080] bg-transparent px-6 py-3 font-bold text-sm uppercase text-[#ff0080] transition-all hover:bg-[#ff0080] hover:text-white"
          >
            <Sparkles className="h-4 w-4" />
            {t('builder.ai.button')}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px,1fr,400px]">
          {/* Categories Sidebar */}
          <div className="space-y-2">
            <div className="mb-4 font-bold text-[#00d4ff] text-sm uppercase tracking-wider">
              {t('builder.select')}
            </div>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`w-full border px-6 py-4 text-left font-bold text-sm uppercase tracking-wider transition-all ${
                  activeCategory === category.slug
                    ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff]'
                    : 'border-white/10 bg-[#12121a] text-white/60 hover:border-[#00d4ff]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  {category.name}
                  {selectedComponents[category.slug] && (
                    <Check className="h-4 w-4 text-[#00ff88]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Component Selection */}
          <div className="space-y-4">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-black text-xl md:text-3xl uppercase text-white">
                {categories.find(c => c.slug === activeCategory)?.name || 'Components'}
              </h2>
              {selectedInCategory && (
                <span className="font-bold text-[#00ff88] text-sm uppercase">
                  {t('component.selected')}
                </span>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {loading ? (
                <div className="col-span-2 text-center py-12">
                  <div className="text-white/60">Loading components...</div>
                </div>
              ) : components.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <div className="text-white/60">No components found in this category</div>
                </div>
              ) : (
                components.map((component) => {
                  const isSelected = selectedInCategory?.id === component.id;
                  return (
                    <motion.div
                      key={component.id}
                      whileHover={{ y: -4 }}
                      className={`group relative cursor-pointer overflow-hidden border bg-[#12121a] transition-all ${
                        isSelected
                          ? 'border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                          : 'border-white/10 hover:border-[#00d4ff]/50'
                      }`}
                    >
                      <div
                        className="relative h-48 overflow-hidden bg-black/50"
                        onClick={() => toggleComponent(component)}
                      >
                        <img
                          src={component.image}
                          alt={component.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(component);
                            setShowProductModal(true);
                          }}
                          className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center border border-white/30 bg-black/50 backdrop-blur-sm transition-all hover:border-[#00d4ff] hover:bg-[#00d4ff]"
                        >
                          <Info className="h-4 w-4 text-white" />
                        </button>
                        {isSelected && (
                          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-[#00d4ff]">
                            <Check className="h-5 w-5 text-black" />
                          </div>
                        )}
                      </div>

                      <div className="p-6" onClick={() => toggleComponent(component)}>
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
                            <span className="text-[#00d4ff] text-sm">
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
            <div className="border border-[#00d4ff]/30 bg-[#12121a] p-6">
              <h3 className="mb-4 font-black text-2xl uppercase text-[#00d4ff]">
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

              <div className="mb-6 border-t border-[#00d4ff]/30 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-xl uppercase">Total</span>
                  <span className="font-black text-3xl text-white">
                    {formatPrice(totalPrice)}{' '}
                    <span className="text-[#00d4ff] text-lg">{t('currency')}</span>
                  </span>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-2">
                {isCompatible ? (
                  <>
                    <Check className="h-5 w-5 text-[#00ff88]" />
                    <span className="font-bold text-[#00ff88] text-sm">
                      {t('builder.compatibility.ok')}
                    </span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-white/30" />
                    <span className="text-white/30 text-sm">
                      Select at least 3 components
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() => navigate('/cart')}
                disabled={Object.keys(selectedComponents).length === 0}
                className="w-full bg-[#00d4ff] px-8 py-4 font-black uppercase text-black transition-all hover:bg-[#00ff88] disabled:cursor-not-allowed disabled:opacity-30"
              >
                {t('builder.checkout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AIBuilderModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onBuildGenerated={(components) => {
          console.log('AI Builder: Received components:', components);
          
          const convertedComponents: Record<string, DynamicComponent> = {};
          
          Object.entries(components).forEach(([slug, comp]: [string, any]) => {
            // Ensure data follows DynamicComponent interface
            const dynamicComp: DynamicComponent = {
              id: comp.id,
              name: comp.name,
              brand: comp.brand,
              // Specs can be string or array from backend, ensure array of strings
              specs: Array.isArray(comp.specs) 
                ? comp.specs.map((s: any) => String(s))
                : typeof comp.specs === 'object' 
                  ? Object.values(comp.specs).map((s: any) => String(s))
                  : [String(comp.specs)],
              price: typeof comp.price === 'string' ? parseFloat(comp.price) : comp.price,
              // Backend sends image_url, Builder expects image
              image: comp.image_url || comp.image || 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop',
              category_slug: comp.category_slug || slug,
              category_name: comp.category_name || slug,
              performance: comp.performance || (85 + Math.random() * 15),
              formatted_price: comp.formatted_price
            };
            convertedComponents[dynamicComp.category_slug] = dynamicComp;
          });
          
          console.log('AI Builder: Converted selection:', convertedComponents);
          
          // Save to localStorage for cart
          const cartItems = Object.values(convertedComponents);
          localStorage.setItem('pcbuilder-cart', JSON.stringify(cartItems));
          
          setSelectedComponents(convertedComponents);
          setShowAIModal(false);
          
          // Optionally notify user
          console.log('AI Builder: Selection applied and saved to cart');
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
