import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, DollarSign, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIBuilderModal } from '../components/AIBuilderModal';
import { apiService, Category } from '../services/api';

export function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        if (response.success && response.data) {
          // If response.data is the paginated object, extract results
          const rawData = response.data as any;
          if (rawData.results) {
            setCategories(rawData.results);
          } else if (Array.isArray(response.data)) {
            setCategories(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Helper to get category image and info
  const getCategoryInfo = (slug: string) => {
    const info: Record<string, { img: string; sub: string; price: string }> = {
      'videokarty': { img: '/gpu.png', sub: 'Ultimate graphics performance.', price: '$499' },
      'protsessory': { img: '/cpu.png', sub: 'Raw power for limitless gaming.', price: '$249' },
      'korpusa': { img: '/gaming_pc.png', sub: 'Pre-built. Tested. Game Ready.', price: '$899' },
      'periferiya': { img: '/peripherals.png', sub: 'Gear up. Play at your best.', price: '$29' },
    };
    return info[slug] || { img: '/gaming_pc.png', sub: 'High-quality components.', price: '---' };
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-20 text-white">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-5rem)] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.02)_25%,rgba(0,212,255,0.02)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.02)_75%,rgba(0,212,255,0.02))] bg-[length:60px_60px] opacity-30" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl w-full"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 inline-block w-fit max-w-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-4 py-2 sm:px-6 sm:py-2 font-black text-[#00d4ff] text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest"
            >
              <span className="block w-full whitespace-normal leading-relaxed">{t('hero.tagline')}</span>
            </motion.div>

            <h1 className="mb-2 sm:mb-4 font-black text-3xl sm:text-6xl md:text-8xl uppercase leading-[1.1] tracking-tighter text-white lg:text-9xl break-words">
              {t('hero.title')}
            </h1>
            <h1 className="mb-8 sm:mb-12 bg-gradient-to-r from-[#00d4ff] via-[#ff0080] to-[#00ff88] bg-clip-text font-black text-3xl sm:text-6xl md:text-8xl uppercase leading-[1.1] tracking-tighter text-transparent lg:text-9xl break-words">
              {t('hero.subtitle')}
            </h1>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/builder')}
                className="group flex w-full sm:w-auto items-center justify-center gap-3 bg-[#00d4ff] px-6 sm:px-10 py-4 sm:py-5 font-black text-black text-base sm:text-lg uppercase tracking-wider transition-all hover:bg-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
              >
                {t('hero.cta')}
                <ArrowRight className="transition-transform group-hover:translate-x-2" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAI(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-3 border-2 border-[#ff0080] bg-[#ff0080]/10 sm:bg-transparent px-6 sm:px-10 py-4 sm:py-5 font-black text-base sm:text-lg uppercase tracking-wider text-[#ff0080] transition-all hover:bg-[#ff0080] hover:text-white hover:shadow-[0_0_30px_rgba(255,0,128,0.5)]"
              >
                <Sparkles className="h-5 w-5" />
                {t('hero.ai')}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
          >
            <div className="relative h-[600px] w-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[450px] h-[450px] rounded-full border border-blue-500/20" />
              </div>
              <img
                src="/hero_pc_hardware.png"
                alt="Gaming Hardware"
                className="relative z-10 w-full max-w-[700px] object-contain animate-float drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-[#00d4ff]/20 bg-[#0d0d12] py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 font-black text-4xl md:text-6xl uppercase tracking-tighter text-white"
          >
            {t('features.title')}
          </motion.h2>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: t('features.ai.title'),
                desc: t('features.ai.desc'),
                color: '#ff0080',
              },
              {
                icon: Zap,
                title: t('features.compatibility.title'),
                desc: t('features.compatibility.desc'),
                color: '#00d4ff',
              },
              {
                icon: DollarSign,
                title: t('features.price.title'),
                desc: t('features.price.desc'),
                color: '#00ff88',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden glass-card p-8 rounded-[2rem] transition-all"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}10, transparent)`,
                  }}
                />
                <feature.icon
                  className="mb-6 h-12 w-12 transition-all group-hover:scale-110"
                  style={{ color: feature.color }}
                />
                <h3 className="mb-4 font-black text-2xl uppercase tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="font-medium text-base text-white/70 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 relative border-t border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16 space-y-4">
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
             <h2 className="text-xl sm:text-3xl font-black uppercase tracking-[0.2em]">{t('builder.select')} <span className="text-blue-500">{t('nav.builder')}</span></h2>
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 glass-card animate-pulse rounded-[2rem]" />
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 4).map((category, idx) => {
                const info = getCategoryInfo(category.slug);
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate('/builder')}
                    className="glass-card p-6 rounded-[2rem] space-y-6 group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-blue-400 transition-colors">{category.name}</h3>
                        <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{info.sub}</p>
                    </div>

                    <div className="relative h-48 flex items-center justify-center overflow-hidden">
                       <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <img 
                        src={info.img} 
                        alt={category.name} 
                        className="max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Starting From</div>
                        <div className="text-xl font-black text-blue-500">{info.price}</div>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <span className="text-slate-300 font-bold">+</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                No categories found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEO Text Section */}
      <section className="bg-[#0a0a0f] py-24 border-t border-[#00d4ff]/10">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-12 text-white/80 space-y-6">
          <h2 className="mb-8 font-black text-3xl md:text-4xl uppercase tracking-tighter text-white">
            {t('seo.title')}
          </h2>
          <p className="text-lg leading-relaxed">{t('seo.p1')}</p>
          <p className="text-lg leading-relaxed">{t('seo.p2')}</p>
          <p className="text-lg leading-relaxed">{t('seo.p3')}</p>
          <p className="text-lg leading-relaxed">{t('seo.p4')}</p>
        </div>
      </section>

      <AIBuilderModal
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        onBuildGenerated={() => {
          setShowAI(false);
          navigate('/builder');
        }}
      />
    </div>
  );
}
