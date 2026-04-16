import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Check, X, Sparkles, Info } from 'lucide-react';
import { PCComponent, getComponentsByCategory, formatPrice } from '../data/components-api';
import { AIBuilderModal } from '../components/AIBuilderModal';
import { ProductModal } from '../components/ProductModal';

const categories: PCComponent['category'][] = [
  'cpu',
  'gpu',
  'motherboard',
  'ram',
  'storage',
  'psu',
  'case',
  'cooling',
];

export function Builder() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedComponents, setSelectedComponents] = useState<Record<string, PCComponent>>({});
  const [activeCategory, setActiveCategory] = useState<PCComponent['category']>('cpu');
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PCComponent | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [components, setComponents] = useState<PCComponent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load components when category changes
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        const categoryComponents = await getComponentsByCategory(activeCategory);
        setComponents(categoryComponents);
      } catch (error) {
        console.error('Failed to load components:', error);
        setComponents([]);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, [activeCategory]);

  const toggleComponent = (component: PCComponent) => {
    setSelectedComponents((prev) => {
      const newSelection = { ...prev };
      if (newSelection[component.category]?.id === component.id) {
        delete newSelection[component.category];
      } else {
        newSelection[component.category] = component;
      }
      return newSelection;
    });
  };

  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, comp) => sum + comp.price,
    0
  );

  const selectedInCategory = selectedComponents[activeCategory];

  const isCompatible = Object.keys(selectedComponents).length >= 3;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20">
      <div className="mx-auto max-w-[1800px] p-6 lg:p-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-black text-5xl uppercase tracking-tighter text-white lg:text-6xl">
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
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full border px-6 py-4 text-left font-bold text-sm uppercase tracking-wider transition-all ${
                  activeCategory === category
                    ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff]'
                    : 'border-white/10 bg-[#12121a] text-white/60 hover:border-[#00d4ff]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  {t(`component.${category}`)}
                  {selectedComponents[category] && (
                    <Check className="h-4 w-4 text-[#00ff88]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Component Selection */}
          <div className="space-y-4">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-black text-3xl uppercase text-white">
                {t(`component.${activeCategory}`)}
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
                components.map((component: PCComponent) => {
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
                          <span className="text-[#00d4ff] text-sm">
                            {t('currency')}
                          </span>
                        </div>
                        {component.performance && (
                          <div className="border border-[#00ff88]/30 bg-[#00ff88]/10 px-3 py-1 font-bold text-[#00ff88] text-xs">
                            {component.performance}%
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
                  const comp = selectedComponents[category];
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between border-b border-white/5 pb-3"
                    >
                      <span className="text-white/60 text-xs uppercase">
                        {t(`component.${category}`)}
                      </span>
                      {comp ? (
                        <span className="font-bold text-white text-xs">
                          {formatPrice(comp.price)}
                        </span>
                      ) : (
                        <span className="text-white/30 text-xs">—</span>
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
          setSelectedComponents(components);
          setShowAIModal(false);
        }}
      />

      <ProductModal
        component={selectedProduct}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelect={(component) => toggleComponent(component)}
        isSelected={selectedProduct ? selectedComponents[selectedProduct.category]?.id === selectedProduct.id : false}
      />
    </div>
  );
}
