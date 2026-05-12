import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, DollarSign, ArrowRight, Shield, Headset, Cpu } from 'lucide-react';
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

  // Helper to get category fallback info
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
    <div className="min-h-screen bg-[#020617] pt-20 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center py-12 sm:py-20 lg:py-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.02)_25%,rgba(0,212,255,0.02)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.02)_75%,rgba(0,212,255,0.02))] bg-[length:60px_60px] opacity-30" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10"
            >
              <div className="mb-6 flex items-center gap-2 w-fit border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{t('hero.next_gen')}</span>
              </div>

              <h1 className="mb-4 font-black text-6xl sm:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tighter text-white">
                {t('hero.title_part1')}<br />
                <span className="text-blue-500">{t('hero.title_part2')}</span>
              </h1>
              
              <p className="mb-10 text-lg text-slate-400 max-w-xl leading-relaxed">
                {t('hero.description')}
                <span className="block mt-2 text-blue-400/80 font-bold">{t('hero.tagline_extra')}</span>
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/builder')}
                  className="group flex items-center gap-3 bg-blue-600 px-8 py-4 font-black text-white rounded-xl transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAI(true)}
                  className="flex items-center gap-3 border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 font-black text-white rounded-xl transition-all hover:bg-white/10"
                >
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  {t('hero.cta_secondary')}
                </motion.button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-white/5">
                {[
                  { icon: Zap, label: t('stats.shipping.label'), sub: t('stats.shipping.sub') },
                  { icon: Shield, label: t('stats.warranty.label'), sub: t('stats.warranty.sub') },
                  { icon: Headset, label: t('stats.support.label'), sub: t('stats.support.sub') }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-wider">{stat.label}</div>
                      <div className="text-[9px] text-slate-500 font-medium">{stat.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hardware Visuals */}
            <div className="relative flex items-center justify-center lg:justify-start h-full mt-12 lg:mt-0">
              <div className="relative z-10 w-full flex items-center justify-center lg:justify-start scale-100 sm:scale-110 lg:scale-125 lg:-translate-x-24 xl:-translate-x-48">
                <img 
                  src="/hero_composite.png" 
                  className="w-full max-w-[300px] sm:max-w-xl lg:max-w-4xl object-contain drop-shadow-[0_0_100px_rgba(59,130,246,0.2)] animate-float"
                  alt="Premium Hardware" 
                />

                {/* Floating Tech Cards - Styled as clean callouts with photos */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4 lg:space-y-12 z-30 translate-x-12 lg:translate-x-24 hidden sm:block"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-8 lg:-left-12 top-1/2 w-8 lg:w-12 h-px bg-gradient-to-r from-transparent to-blue-500" />
                    <div className="glass-card-dark p-3 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-blue-500/30 w-[15rem] lg:w-[26rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-3 lg:gap-6 overflow-hidden">
                      <div className="relative h-12 lg:h-24 w-16 lg:w-32 flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-50" />
                        <img src="/rtx5090.png" className="relative h-full w-full object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" alt="RTX 5090" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg lg:text-3xl font-black text-white uppercase tracking-tight mb-1">RTX 5090</div>
                        <div className="text-[8px] lg:text-xs text-blue-400 font-black uppercase tracking-[0.2em]">{t('hero.next_gen')}</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-8 lg:-left-12 top-1/2 w-8 lg:w-12 h-px bg-gradient-to-r from-transparent to-blue-500" />
                    <div className="glass-card-dark p-3 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/10 w-[15rem] lg:w-[26rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-3 lg:gap-6 overflow-hidden">
                      <div className="relative h-12 lg:h-24 w-16 lg:w-32 flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-50" />
                        <img src="/9800x3d.png" className="relative h-full w-full object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]" alt="Ryzen 9800X3D" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg lg:text-3xl font-black text-white uppercase tracking-tight mb-1">RYZEN 9800X3D</div>
                        <div className="text-[8px] lg:text-xs text-blue-400 font-black uppercase tracking-[0.2em]">Ultimate Gaming CPU</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-white/5 bg-[#0a0a0f] py-32 sm:py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
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
             <div className="flex items-center gap-4">
               <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500" />
               <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">{t('category.title')}</h2>
               <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 glass-card animate-pulse rounded-3xl" />
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 4).map((category, idx) => {
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
                       <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <img 
                        src={categoryImg} 
                        alt={category.name} 
                        className="max-h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between items-end">
                      <div className="space-y-1">
                        <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">{t('category.starting')}</div>
                        <div className="text-2xl font-black text-blue-500">
                          {minPrice ? (
                            <>{formatPrice(minPrice)} <span className="text-xs">{t('currency')}</span></>
                          ) : (
                            '---'
                          )}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                        <span className="text-white font-bold text-lg">+</span>
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
