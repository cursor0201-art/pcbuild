import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, ArrowRight, Shield, Headset, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIBuilderModal } from '../components/AIBuilderModal';
import { apiService, Category, formatPrice } from '../services/api';

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

  const getCategoryFallback = (slug: string) => {
    const fallbacks: Record<string, { img: string; sub: string }> = {
      'videokarty': { img: '/gpu.png', sub: 'Ultimate graphics performance.' },
      'protsessory': { img: '/cpu.png', sub: 'Raw power for limitless gaming.' },
      'korpusa': { img: '/gaming_pc.png', sub: 'Pre-built. Tested. Game Ready.' },
      'periferiya': { img: '/peripherals.png', sub: 'Gear up. Play at your best.' },
    };
    return fallbacks[slug] || { img: '/gaming_pc.png', sub: 'High-quality components.' };
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-16 sm:pt-20 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center py-8 sm:py-16 lg:py-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10 order-2 lg:order-1"
            >
              <div className="mb-5 flex items-center gap-2 w-fit border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-400">{t('hero.next_gen')}</span>
              </div>

              <h1 className="mb-5 font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase leading-[0.88] tracking-tighter text-white">
                {t('hero.title_part1')}<br />
                <span className="text-blue-500">{t('hero.title_part2')}</span>
              </h1>

              <p className="mb-8 text-sm sm:text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
                {t('hero.description')}
                <span className="block mt-2 text-blue-400/80 font-bold">{t('hero.tagline_extra')}</span>
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 mb-10">
                <button
                  onClick={() => navigate('/builder')}
                  className="group flex items-center gap-2 sm:gap-3 bg-blue-600 px-8 sm:px-10 py-4 sm:py-5 font-black text-sm sm:text-base text-white rounded-xl transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setShowAI(true)}
                  className="flex items-center gap-2 sm:gap-3 border border-white/20 bg-white/5 backdrop-blur-sm px-8 sm:px-10 py-4 sm:py-5 font-black text-sm sm:text-base text-white rounded-xl transition-all hover:bg-white/10"
                >
                  <Cpu className="h-5 w-5 text-blue-400" />
                  {t('hero.cta_secondary')}
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 py-6 border-t border-white/5">
                {[
                  { icon: Zap, label: t('stats.shipping.label'), sub: t('stats.shipping.sub') },
                  { icon: Shield, label: t('stats.warranty.label'), sub: t('stats.warranty.sub') },
                  { icon: Headset, label: t('stats.support.label'), sub: t('stats.support.sub') }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-wider leading-tight">{stat.label}</div>
                      <div className="text-[7px] sm:text-[9px] text-slate-500 font-medium leading-tight">{stat.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Hardware Visuals */}
            <div className="relative order-1 lg:order-2 flex items-center justify-center lg:justify-start h-full mt-4 lg:mt-0">
              <div className="relative z-10 w-full flex items-center justify-center lg:justify-start scale-90 sm:scale-100 lg:scale-110 xl:scale-125 lg:-translate-x-16 xl:-translate-x-32">
                <img
                  src="/hero_composite.png"
                  className="w-full max-w-[280px] sm:max-w-md lg:max-w-2xl xl:max-w-4xl object-contain drop-shadow-[0_0_80px_rgba(59,130,246,0.2)] animate-float"
                  alt="Premium Hardware"
                />

                {/* Floating Tech Cards */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 space-y-3 lg:space-y-8 z-30 translate-x-8 sm:translate-x-12 lg:translate-x-20 hidden sm:block"
                >
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div className="absolute -left-6 lg:-left-10 top-1/2 w-6 lg:w-10 h-px bg-gradient-to-r from-transparent to-blue-500" />
                    <div className="glass-card-dark p-2 sm:p-4 lg:p-5 rounded-2xl lg:rounded-[2rem] border border-blue-500/30 w-[10rem] sm:w-[14rem] lg:w-[22rem] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-hidden">
                      <div className="relative h-10 sm:h-16 lg:h-20 w-12 sm:w-20 lg:w-28 flex-shrink-0">
                        <img src="/rtx5090_clean.png" className="relative h-full w-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] mix-blend-screen" alt="RTX 5090" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-xl lg:text-2xl font-black text-white uppercase tracking-tight mb-0.5">RTX 5090</div>
                        <div className="text-[7px] sm:text-[9px] lg:text-[10px] text-blue-400 font-black uppercase tracking-[0.15em] leading-tight">{t('hero.next_gen')}</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div className="absolute -left-6 lg:-left-10 top-1/2 w-6 lg:w-10 h-px bg-gradient-to-r from-transparent to-blue-500" />
                    <div className="glass-card-dark p-2 sm:p-4 lg:p-5 rounded-2xl lg:rounded-[2rem] border border-white/10 w-[10rem] sm:w-[14rem] lg:w-[22rem] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-hidden">
                      <div className="relative h-10 sm:h-16 lg:h-20 w-12 sm:w-20 lg:w-28 flex-shrink-0">
                        <img src="/ryzen9000_clean.png" className="relative h-full w-full object-contain drop-shadow-[0_0_15px_rgba(200,100,0,0.4)] mix-blend-screen" alt="Ryzen 9800X3D" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-xl lg:text-2xl font-black text-white uppercase tracking-tight mb-0.5">RYZEN 9800X3D</div>
                        <div className="text-[7px] sm:text-[9px] lg:text-[10px] text-blue-400 font-black uppercase tracking-[0.15em] leading-tight">Ultimate Gaming CPU</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="py-24 sm:py-32 md:py-40 relative border-t border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16 sm:mb-24 space-y-4">
             <div className="flex items-center gap-4">
               <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-blue-500" />
               <h2 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">{t('category.title')}</h2>
               <div className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-blue-500" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 glass-card animate-pulse rounded-3xl" />
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 4).map((category) => {
                const fallback = getCategoryFallback(category.slug);
                const categoryImg = category.image_url || fallback.img;
                const minPrice = category.min_price;
                
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate('/builder')}
                    className="glass-card-dark p-6 rounded-[2rem] space-y-6 group cursor-pointer border border-white/5 hover:border-blue-500/50 transition-all duration-500"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">{category.name}</h3>
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{fallback.sub}</p>
                    </div>

                    <div className="relative h-48 flex items-center justify-center">
                       <img src={categoryImg} alt={category.name} className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">{t('category.starting')}</div>
                        <div className="text-2xl font-black text-blue-500">
                          {minPrice ? <>{formatPrice(minPrice)} <span className="text-xs">{t('currency')}</span></> : '---'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : null}
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
