import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, ArrowRight, Shield, Headset, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIBuilderModal } from '../components/AIBuilderModal';
import { apiService, Category, formatPrice } from '../services/api';

/** Hero side cards — тёмный glass (переменные в theme.css) */
const heroFloatCardClass =
  'relative flex w-full items-center gap-4 overflow-hidden rounded-xl border border-sky-400/40 bg-[#0a101e]/80 p-3 sm:p-4 shadow-[0_0_30px_rgba(56,189,248,0.1)] backdrop-blur-md transition-all hover:border-sky-400/70 hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] group';

const heroCtaPrimaryClass =
  'group inline-flex h-12 sm:h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-sm sm:text-base font-black uppercase tracking-wide text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] active:scale-[0.98]';

const heroCtaSecondaryClass =
  'group inline-flex h-12 sm:h-14 shrink-0 items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-transparent px-8 text-sm sm:text-base font-black uppercase tracking-wide text-white shadow-none transition-all hover:border-sky-400/60 hover:bg-sky-500/10 active:scale-[0.98]';

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
    <div className="min-h-screen bg-[#020617]">
      {/* Hero Section */}
      <section className="relative flex items-center py-12 sm:py-16 lg:py-0 overflow-visible lg:min-h-[calc(100vh-4rem)] bg-[#030712]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#030712] to-[#030712]" />

        <div className="relative mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-6 sm:px-10 lg:px-16">
          <div className="grid w-full flex-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 order-1 flex flex-col items-start gap-5 pt-16 lg:order-1 lg:max-w-2xl lg:pt-0"
            >
              <div className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-[#0a101e] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)]" />
                {t('hero.next_gen')}
              </div>

              <h1 className="flex flex-col font-outfit font-black text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] leading-[1.0] uppercase tracking-tighter w-full">
                <span className="text-white drop-shadow-md">{t('hero.title_part1')}</span>
                <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] mt-1">{t('hero.title_part2')}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed">
                {t('hero.description')}
                <span className="block mt-2 text-sky-400 font-bold">{t('hero.tagline_extra')}</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/builder')}
                  className={`${heroCtaPrimaryClass} w-full sm:w-auto`}
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowAI(true)} 
                  className={`${heroCtaSecondaryClass} w-full sm:w-auto`}
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-sky-400" strokeWidth={2} aria-hidden />
                  {t('hero.cta_secondary')}
                </button>
              </div>
            </motion.div>

            {/* Right: hardware + side cards */}
            <div className="relative order-2 mt-12 flex min-h-[300px] items-center justify-center lg:order-2 lg:mt-0 lg:min-h-[450px]">
              <div className="relative z-10 flex w-full max-w-xl flex-row items-center justify-center gap-2 pr-1 sm:max-w-none sm:gap-5 sm:pr-2 lg:justify-start lg:gap-6">
                <div className="relative flex min-w-0 flex-1 items-center justify-center lg:flex-[1.1]">
                  {/* Glowing rings exactly like the mockup */}
                  <div
                    className="pointer-events-none absolute aspect-square w-[min(100vw,480px)] max-w-full rounded-full border-[3px] border-sky-500/20 shadow-[0_0_80px_rgba(56,189,248,0.15)] sm:w-[min(94vw,560px)]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute aspect-square w-[min(88vw,420px)] rounded-full border-[8px] border-blue-500/40 shadow-[0_0_60px_rgba(59,130,246,0.5),inset_0_0_40px_rgba(59,130,246,0.5)] sm:w-[min(82vw,480px)]"
                    aria-hidden
                  />
                  <img
                    src="/hero_composite.png"
                    className="relative z-10 w-full max-w-[340px] sm:max-w-lg lg:max-w-2xl xl:max-w-3xl object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] scale-105"
                    alt="Premium Hardware"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="flex w-[11rem] shrink-0 flex-col items-start gap-3 sm:w-[13rem] sm:gap-4 lg:w-[16rem] lg:gap-5"
                >
                  <motion.div whileHover={{ scale: 1.02 }} className="w-full">
                    <div className={heroFloatCardClass}>
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-[#060b18] shadow-[inset_0_0_15px_rgba(56,189,248,0.2)] p-2">
                        <img
                          src="/gpu.png"
                          className="h-full w-full object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                          alt="RTX 5090"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-black uppercase text-white tracking-wide">RTX 5090</div>
                        <div className="text-[9px] text-slate-400 leading-tight mt-0.5 uppercase font-medium">Performance Beast<br/>24GB GDDR7</div>
                      </div>
                      <div className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 group-hover:bg-sky-500/30 transition-colors">
                        <ArrowRight className="h-3 w-3 text-sky-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="w-full">
                    <div className={heroFloatCardClass}>
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-[#060b18] shadow-[inset_0_0_15px_rgba(56,189,248,0.2)] p-2">
                        <img
                          src="/cpu.png"
                          className="h-full w-full object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                          alt="Ryzen 9800X3D"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-black uppercase text-white tracking-wide">RYZEN 9800X3D</div>
                        <div className="text-[9px] text-slate-400 leading-tight mt-0.5 uppercase font-medium">Ultimate Gaming CPU<br/>5.2GHz Boost</div>
                      </div>
                      <div className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 group-hover:bg-sky-500/30 transition-colors">
                        <ArrowRight className="h-3 w-3 text-sky-400" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="relative z-0 mx-auto mt-12 w-full max-w-[1000px] rounded-[1.5rem] border border-sky-500/30 bg-[#060b18]/90 backdrop-blur-md px-4 py-2 sm:px-8 sm:py-4 shadow-[0_0_40px_rgba(56,189,248,0.1)]">
            <div className="flex flex-col sm:flex-row items-center justify-between divide-y sm:divide-y-0 sm:divide-x divide-sky-500/20">
              {[
                { icon: Zap, label: 'FREE SHIPPING', sub: 'On all orders over $99' },
                { icon: Shield, label: '2 YEARS WARRANTY', sub: 'Premium quality assured' },
                { icon: Headset, label: '24/7 SUPPORT', sub: 'Always here to help' },
              ].map((stat, i) => (
                <div key={i} className="flex-1 flex flex-row items-center justify-center gap-4 py-4 sm:py-2 px-2 sm:px-6 w-full sm:w-auto">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-500/10 shadow-[0_0_10px_rgba(56,189,248,0.15)]">
                    <stat.icon className="h-5 w-5 text-sky-400" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-white leading-none mb-1.5">
                      {stat.label}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-medium leading-none text-slate-400">
                      {stat.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Shop By Category Panel */}
          <div className="relative z-0 mx-auto mt-12 w-full max-w-[1200px] rounded-3xl border border-sky-500/20 bg-[#060b18]/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.1)] mb-12">
            <div className="flex items-center justify-center mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-sky-500/20" />
              <div className="relative bg-[#060b18] px-6 py-1 border border-sky-500/30 rounded-full text-base sm:text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                <span className="text-white">SHOP BY</span> <span className="text-sky-400">CATEGORY</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-48 glass-card-dark animate-pulse rounded-2xl" />
                ))
              ) : categories.length > 0 ? (
                categories.slice(0, 4).map((category) => {
                  const fallback = getCategoryFallback(category.slug);
                  const categoryImg = category.image_url || fallback.img;
                  const minPrice = category.min_price;
                  
                  return (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/builder')}
                      className="relative flex flex-col p-4 rounded-2xl bg-gradient-to-br from-[#0a101e] to-[#040812] border border-sky-500/20 shadow-[inset_0_0_15px_rgba(59,130,246,0.05)] cursor-pointer hover:border-sky-400/50 transition-all overflow-hidden h-48 group"
                    >
                      <div className="space-y-1 z-10 relative">
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">{category.name}</h3>
                        <p className="text-[9px] text-slate-400 font-medium tracking-wide pr-8">{fallback.sub}</p>
                      </div>

                      <div className="absolute top-4 right-4 h-6 w-6 rounded-full border border-sky-500/30 bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-400 transition-colors z-10">
                         <ArrowRight className="h-3 w-3 text-sky-400 group-hover:text-white" />
                      </div>

                      <div className="absolute bottom-[-10%] right-[-10%] h-32 w-32 flex items-center justify-center z-0 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500">
                         <img src={categoryImg} alt={category.name} className="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]" />
                      </div>

                      <div className="absolute bottom-4 left-4 z-10">
                         <div className="text-[8px] text-slate-500 uppercase font-medium tracking-widest">{t('category.starting') || 'STARTING FROM'}</div>
                         <div className="text-base font-bold text-sky-400">
                           {minPrice ? <>{formatPrice(minPrice)} <span className="text-[8px] text-sky-400/70">{t('currency')}</span></> : '---'}
                         </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : null}
            </div>
          </div>
        </div>
      </section>

      
      {/* Features Section */}
      <section className="bg-[#020617] py-24 border-t border-white/5 relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
        
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10">
          <h2 className="mb-10 font-black text-2xl md:text-4xl uppercase tracking-tighter text-white">
            {t('features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: t('features.ai.title'),
                desc: t('features.ai.desc'),
                color: '#ec4899',
              },
              {
                icon: Zap,
                title: t('features.compatibility.title'),
                desc: t('features.compatibility.desc'),
                color: '#0ea5e9',
              },
              {
                icon: DollarSign,
                title: t('features.price.title'),
                desc: t('features.price.desc'),
                color: '#22c55e',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card-dark p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top left, ${feature.color}15, transparent 70%)`
                  }}
                />
                
                <feature.icon 
                  className="h-14 w-14 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ color: feature.color }}
                  strokeWidth={2.5}
                />
                
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section Removed (Integrated into Hero) */}

      {/* SEO Text Section */}
      <section className="bg-[#050508] py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-[900px] px-6 lg:px-12 text-slate-400 space-y-8">
          <h2 className="mb-8 font-black text-2xl md:text-4xl uppercase tracking-tighter text-white leading-tight">
            {t('seo.title')}
          </h2>
          <div className="space-y-6 sm:space-y-8 text-base sm:text-lg leading-[1.8] sm:leading-[1.9]">
            <p>{t('seo.p1')}</p>
            <p>{t('seo.p2')}</p>
            <p>{t('seo.p3')}</p>
            <p>{t('seo.p4')}</p>
          </div>
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
