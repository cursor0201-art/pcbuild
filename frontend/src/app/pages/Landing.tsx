import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, ArrowRight, Shield, Headset, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIBuilderModal } from '../components/AIBuilderModal';
import { apiService, Category, formatPrice } from '../services/api';

/** Hero side cards — тёмный glass (переменные в theme.css) */
const heroFloatCardClass =
  'relative flex w-full items-center gap-4 overflow-hidden rounded-[1.25rem] border border-sky-400/50 bg-[#020617]/60 p-3 sm:p-4 shadow-[0_0_20px_rgba(56,189,248,0.15),inset_0_0_15px_rgba(56,189,248,0.1)] backdrop-blur-md hover:border-sky-400/80 transition-all';

const heroCtaPrimaryClass =
  'group inline-flex h-14 min-h-14 sm:h-16 sm:min-h-16 shrink-0 items-center justify-center gap-3 rounded-2xl border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-400 px-10 text-base sm:px-12 sm:text-lg lg:text-xl font-black uppercase tracking-wide text-white shadow-[0_12px_48px_rgba(37,99,235,0.5)] transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.4),0_16px_64px_rgba(59,130,246,0.6)] active:scale-[0.98]';

const heroCtaSecondaryClass =
  'inline-flex h-14 min-h-14 sm:h-16 sm:min-h-16 shrink-0 items-center justify-center gap-3 rounded-2xl border-2 border-white/10 bg-white/5 px-10 text-base sm:px-12 sm:text-lg lg:text-xl font-black uppercase tracking-wide text-white shadow-none transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-[0.98]';

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
      <section className="relative flex items-center py-12 sm:py-16 lg:py-0 overflow-visible lg:min-h-[calc(100vh-5rem)]">
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />

        <div className="relative mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-6 sm:px-10 lg:px-16">
          <div className="grid w-full flex-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 order-1 flex flex-col items-start gap-4 pt-16 lg:order-1 lg:max-w-3xl lg:pt-0"
            >
              {/* Spacer for mobile to avoid header overlap */}
              <div className="h-20 lg:hidden" />
              <div className="flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 sm:text-xs">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                {t('hero.next_gen')}
              </div>

              <h1 className="flex flex-col font-outfit font-black text-2xl leading-[1.0] uppercase tracking-tighter sm:text-4xl lg:text-5xl xl:text-6xl">
                <span className="text-white">{t('hero.title_part1')}</span>
                <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">{t('hero.title_part2')}</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-xl leading-relaxed">
                {t('hero.description')}
                <span className="block mt-2 text-blue-400 font-black text-base sm:text-lg lg:text-xl tracking-tight">{t('hero.tagline_extra')}</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <button
                  type="button"
                  onClick={() => navigate('/builder')}
                  className={`${heroCtaPrimaryClass} w-full sm:w-auto`}
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                </button>

                <button 
                  type="button" 
                  onClick={() => setShowAI(true)} 
                  className={`${heroCtaSecondaryClass} w-full sm:w-auto`}
                >
                  <Sparkles className="h-6 w-6 shrink-0 text-sky-400" strokeWidth={2.5} aria-hidden />
                  {t('hero.cta_secondary')}
                </button>
              </div>
            </motion.div>

            {/* Right: hardware + side cards */}
            <div className="relative order-2 mt-12 flex min-h-[300px] items-center justify-center lg:order-2 lg:mt-0 lg:min-h-[450px]">
              <div className="relative z-10 flex w-full max-w-xl flex-row items-center justify-center gap-2 pr-1 sm:max-w-none sm:gap-5 sm:pr-2 lg:justify-start lg:gap-6">
                <div className="relative flex min-w-0 flex-1 items-center justify-center lg:flex-[1.05]">
                  {/* Неоновые кольца за железом — мягкое синее свечение */}
                  <div
                    className="pointer-events-none absolute aspect-square w-[min(100vw,520px)] max-w-full rounded-full border border-sky-400/20 bg-gradient-to-b from-blue-500/[0.12] via-blue-600/[0.06] to-transparent shadow-[0_0_100px_rgba(56,189,248,0.22),0_0_60px_rgba(59,130,246,0.18)] sm:w-[min(94vw,620px)]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute aspect-square w-[min(88vw,440px)] rounded-full border border-blue-400/25 shadow-[inset_0_0_40px_rgba(59,130,246,0.12),0_0_50px_rgba(14,165,233,0.15)] sm:w-[min(82vw,500px)]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute aspect-square w-[min(72vw,360px)] rounded-full border border-white/10 bg-blue-500/5 sm:w-[min(66vw,420px)]"
                    aria-hidden
                  />
                  <img
                    src="/hero_composite.png"
                    className="w-full max-w-[360px] sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl object-contain mix-blend-lighten brightness-110 animate-float scale-110"
                    alt="Premium Hardware"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="flex w-[11rem] shrink-0 flex-col items-start gap-3 sm:w-[13rem] sm:gap-4 lg:w-[16rem] lg:gap-5"
                >
                  <motion.div whileHover={{ scale: 1.03 }} className="w-full">
                    <div className={heroFloatCardClass}>
                      <div className="relative h-20 w-24 shrink-0 sm:h-24 sm:w-28 lg:h-28 lg:w-32 flex items-center justify-center">
                        <img
                          src="/rtx5090_clean.png"
                          className="relative h-full w-full object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                          alt="RTX 5090"
                        />
                      </div>
                      <div className="min-w-0 flex-1 py-1">
                        <div className="text-sm font-black uppercase tracking-tight text-white sm:text-base lg:text-base mb-1">RTX 5090</div>
                        <div className="text-[9px] font-medium leading-tight tracking-wide text-sky-200/70 sm:text-[10px] lg:text-[10px] line-clamp-2 pr-6">
                          Performance Beast 24GB GDDR7
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 group-hover:bg-sky-500/30 transition-colors">
                        <ArrowRight className="h-3 w-3 text-sky-400" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} className="w-full">
                    <div className={heroFloatCardClass}>
                      <div className="relative h-20 w-24 shrink-0 sm:h-24 sm:w-28 lg:h-28 lg:w-32 flex items-center justify-center">
                        <img
                          src="/ryzen9000_clean.png"
                          className="relative h-full w-full object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                          alt="Ryzen 9800X3D"
                        />
                      </div>
                      <div className="min-w-0 flex-1 py-1">
                        <div className="text-sm font-black uppercase tracking-tight text-white sm:text-base lg:text-base mb-1">
                          RYZEN 9800X3D
                        </div>
                        <div className="text-[9px] font-medium leading-tight tracking-wide text-sky-200/70 sm:text-[10px] lg:text-[10px] line-clamp-2 pr-6">
                          Ultimate Gaming CPU
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 group-hover:bg-sky-500/30 transition-colors">
                        <ArrowRight className="h-3 w-3 text-sky-400" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Feature strip — без лишних слоёв поверх иконок */}
          <div className="relative z-0 mx-auto mt-10 w-full max-w-[1000px] border border-sky-400/50 bg-[#020617]/70 backdrop-blur-xl rounded-[2rem] sm:rounded-full p-2 sm:p-3 shadow-[0_0_30px_rgba(56,189,248,0.15),inset_0_0_20px_rgba(56,189,248,0.1)]">
            <div className="flex flex-col sm:flex-row items-center justify-between divide-y sm:divide-y-0 sm:divide-x divide-sky-400/30">
              {[
                { icon: Zap, label: 'FREE SHIPPING', sub: 'On all orders over $99' },
                { icon: Shield, label: '2 YEARS WARRANTY', sub: 'Premium quality assured' },
                { icon: Headset, label: '24/7 SUPPORT', sub: 'Always here to help' },
              ].map((stat, i) => (
                <div key={i} className="flex-1 flex flex-row items-center justify-center gap-3 py-3 sm:py-2 px-4 group w-full sm:w-auto">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-400/30 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.2)] group-hover:scale-110 transition-transform">
                    <stat.icon className="h-5 w-5 text-sky-400" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="text-xs font-black uppercase tracking-wider text-white leading-none mb-1">
                      {stat.label}
                    </div>
                    <div className="text-[10px] font-medium leading-none text-sky-200/60">
                      {stat.sub}
                    </div>
                  </div>
                </div>
              ))}
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

      {/* Category Section — Теперь ПОСЛЕ "Почему мы" */}
      <section id="categories" className="relative scroll-mt-24 border-t border-white/5 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex items-center justify-center mb-16 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-blue-500/20" />
            <div className="relative bg-[#020617] px-8 py-2 border border-blue-500/30 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.15)] flex items-center">
               <h2 className="font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-widest text-white m-0">
                 {t('category.title') || 'SHOP BY CATEGORY'}
               </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 glass-card-dark animate-pulse rounded-3xl" />
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
                    className="relative flex flex-col p-6 rounded-[1.5rem] bg-gradient-to-b from-[#0a0f1c] to-[#020617] border border-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.05),0_10px_30px_rgba(0,0,0,0.5)] group cursor-pointer hover:border-blue-400/60 transition-all duration-500 overflow-hidden"
                  >
                    <div className="space-y-1 z-10">
                      <h3 className="text-lg font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">{category.name}</h3>
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide">{fallback.sub}</p>
                    </div>

                    <div className="absolute bottom-6 left-6 h-8 w-8 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all z-10">
                       <ArrowRight className="h-4 w-4 text-blue-400 group-hover:text-white" />
                    </div>

                    <div className="relative h-32 sm:h-40 mt-6 flex items-center justify-center mb-10 z-0">
                       <img src={categoryImg} alt={category.name} className="max-h-full max-w-[140px] sm:max-w-[180px] object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
                    </div>

                    <div className="absolute bottom-6 right-6 text-right z-10">
                       <div className="text-[9px] text-slate-500 uppercase font-medium tracking-widest">{t('category.starting') || 'STARTING FROM'}</div>
                       <div className="text-lg sm:text-xl font-bold text-blue-400">
                         {minPrice ? <>{formatPrice(minPrice)} <span className="text-[10px] sm:text-xs text-blue-400/70">{t('currency')}</span></> : '---'}
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
