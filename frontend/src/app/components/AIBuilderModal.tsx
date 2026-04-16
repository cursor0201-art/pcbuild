import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Cpu } from 'lucide-react';
import { apiService, Product, Category } from '../services/api';

interface PCComponent {
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

interface AIBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuildGenerated?: (components: Record<string, PCComponent>) => void;
}

export function AIBuilderModal({ isOpen, onClose, onBuildGenerated }: AIBuilderModalProps) {
  const { t } = useLanguage();
  const [budget, setBudget] = useState('50000000');
  const [usage, setUsage] = useState<'gaming' | 'streaming' | 'work' | 'all'>('gaming');
  const [performance, setPerformance] = useState<'entry' | 'mid' | 'high' | 'ultra'>('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBuild, setGeneratedBuild] = useState<Record<string, PCComponent> | null>(null);
  const [allComponents, setAllComponents] = useState<PCComponent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories()
        ]);
        
        // Convert products to PCComponent format
        const components = productsResponse.data.results?.map((product: Product) => ({
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
        })) || [];
        
        setAllComponents(components);
        
        // Use category slugs directly (handle paginated response)
        console.log('Categories Response:', categoriesResponse);
        console.log('Categories data type:', typeof categoriesResponse.data);
        
        let categoriesArray: Category[] = [];
        const responseData = categoriesResponse.data as any;
        
        if (responseData.results && Array.isArray(responseData.results)) {
          categoriesArray = responseData.results;
        } else if (Array.isArray(categoriesResponse.data)) {
          categoriesArray = categoriesResponse.data;
        }
        
        const categorySlugs = categoriesArray.map((cat: Category) => cat.slug);
        console.log('Category slugs:', categorySlugs);
        setCategories(categorySlugs);
      } catch (error) {
        console.error('Failed to load data for AI builder:', error);
        // Fallback to defaults
        setCategories(['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooling']);
      }
    };
    loadData();
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const selectedComponents: Record<string, PCComponent> = {};

      categories.forEach((category) => {
        const componentsInCategory = allComponents.filter((c) => c.category_slug === category);
        if (componentsInCategory.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(2, componentsInCategory.length));
          selectedComponents[category] = componentsInCategory[randomIndex];
        }
      });

      setGeneratedBuild(selectedComponents);
      setIsGenerating(false);
    }, 2000);
  };

  const handleUseBuild = () => {
    if (generatedBuild && onBuildGenerated) {
      onBuildGenerated(generatedBuild);
    }
    onClose();
  };

  const total = generatedBuild
    ? Object.values(generatedBuild).reduce((sum, comp) => sum + comp.price, 0)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#00d4ff]/30 bg-[#0d0d12]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#00d4ff]/30 bg-[#0d0d12] p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-[#ff0080]" />
                <h2 className="font-black text-3xl uppercase text-[#00d4ff]">
                  {t('ai.title')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 transition-colors hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8">
              {!generatedBuild ? (
                <div className="space-y-8">
                  <div>
                    <label className="mb-3 block font-bold text-sm uppercase tracking-wider text-white">
                      {t('ai.budget')}
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full border border-white/20 bg-[#12121a] px-6 py-4 font-bold text-2xl text-white outline-none transition-all focus:border-[#00d4ff]"
                      placeholder="50 000 000"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block font-bold text-sm uppercase tracking-wider text-white">
                      {t('ai.usage')}
                    </label>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {(['gaming', 'streaming', 'work', 'all'] as const).map((option) => (
                        <button
                          key={option}
                          onClick={() => setUsage(option)}
                          className={`border px-6 py-4 font-bold text-sm uppercase transition-all ${
                            usage === option
                              ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff]'
                              : 'border-white/20 text-white/60 hover:border-[#00d4ff]/50 hover:text-white'
                          }`}
                        >
                          {t(`ai.usage.${option}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block font-bold text-sm uppercase tracking-wider text-white">
                      {t('ai.performance')}
                    </label>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {(['entry', 'mid', 'high', 'ultra'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setPerformance(level)}
                          className={`border px-6 py-4 font-bold text-sm uppercase transition-all ${
                            performance === level
                              ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff]'
                              : 'border-white/20 text-white/60 hover:border-[#00d4ff]/50 hover:text-white'
                          }`}
                        >
                          {t(`ai.performance.${level}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-[#00d4ff] to-[#ff0080] px-8 py-5 font-black text-lg uppercase text-white transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-3">
                        <Cpu className="h-5 w-5 animate-spin" />
                        ГЕНЕРАЦИЯ...
                      </span>
                    ) : (
                      t('ai.generate')
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="mb-6 border border-[#00ff88]/30 bg-[#00ff88]/5 p-6">
                    <h3 className="mb-2 font-black text-xl uppercase text-[#00ff88]">
                      СБОРКА ГОТОВА!
                    </h3>
                    <p className="text-white/70">
                      ИИ подобрал оптимальную конфигурацию под ваши требования
                    </p>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(generatedBuild).map(([category, component]) => (
                      <div
                        key={category}
                        className="flex items-center gap-4 border border-white/10 bg-[#12121a] p-4"
                      >
                        <div className="h-16 w-20 overflow-hidden bg-black/50">
                          <img
                            src={component.image}
                            alt={component.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 font-bold text-[#00d4ff] text-xs uppercase">
                            {t(`component.${category}`)}
                          </div>
                          <div className="font-bold text-white">{component.name}</div>
                        </div>
                        <div className="font-bold text-right text-white">
                          {(component.price / 1000000).toFixed(1)}M{' '}
                          <span className="text-[#00d4ff] text-xs">{t('currency')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#00d4ff]/30 pt-6">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-black text-xl uppercase text-white">ИТОГО</span>
                      <span className="font-black text-3xl text-white">
                        {(total / 1000000).toFixed(1)}M{' '}
                        <span className="text-[#00d4ff] text-lg">{t('currency')}</span>
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setGeneratedBuild(null)}
                        className="flex-1 border border-white/20 bg-transparent px-8 py-4 font-bold uppercase text-white transition-all hover:border-[#00d4ff] hover:text-[#00d4ff]"
                      >
                        ПЕРЕГЕНЕРИРОВАТЬ
                      </button>
                      <button
                        onClick={handleUseBuild}
                        className="flex-1 bg-[#00d4ff] px-8 py-4 font-bold uppercase text-black transition-all hover:bg-[#00ff88]"
                      >
                        {t('ai.use')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
