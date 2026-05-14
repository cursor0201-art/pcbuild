import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, ArrowRight, Shield, Headset, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIBuilderModal } from '../components/AIBuilderModal';
import { apiService, Category, formatPrice } from '../services/api';

/** Hero side cards — тёмный glass (переменные в theme.css) */
const heroFloatCardClass =
  'flex w-full items-center gap-2.5 overflow-hidden rounded-2xl border border-[var(--hero-float-border)] bg-[var(--hero-float-bg)] p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] [backdrop-filter:blur(var(--hero-float-blur))] [-webkit-backdrop-filter:blur(var(--hero-float-blur))] sm:gap-3 sm:rounded-[1.25rem] sm:p-3.5';

const heroCtaPrimaryClass =
  'group inline-flex h-12 min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-xl border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-400 px-8 text-sm font-black uppercase tracking-wide text-white shadow-[0_8px_32px_rgba(37,99,235,0.45)] transition-all hover:shadow-[0_0_28px_rgba(255,255,255,0.35),0_12px_48px_rgba(59,130,246,0.55)] active:scale-[0.98] sm:gap-3 sm:px-10 sm:text-base lg:text-lg';

const heroCtaSecondaryClass =
  'inline-flex h-12 min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-black uppercase tracking-wide text-white shadow-none transition-all hover:border-white/30 hover:bg-white/[0.08] active:scale-[0.98] sm:gap-3 sm:px-10 sm:text-base lg:text-lg';

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
      <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center py-16 lg:py-0 overflow-hidden">
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />

        <div className="relative mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-6 sm:px-10 lg:px-16">
          <div className="grid w-full flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-20 xl:gap-32">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10 order-2 lg:order-1"
            >
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 sm:mb-5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 sm:text-[10px]">{t('hero.next_gen')}</span>
              </div>

              <h1 className="mb-6 font-black text-4xl sm:text-6xl lg:text-[5rem] xl:text-[6rem] 2xl:text-[7rem] uppercase leading-[0.92] tracking-tighter text-white">
                {t('hero.title_part1')}<br />
                <span className="text-blue-500">{t('hero.title_part2')}</span>
              </h1>

              <p className="mb-10 text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl leading-relaxed">
                {t('hero.description')}
                <span className="block mt-4 text-blue-400 font-bold text-lg sm:text-xl">{t('hero.tagline_extra')}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className={heroCtaPrimaryClass}
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </button>

                <button type="button" onClick={() => setShowAI(true)} className={heroCtaSecondaryClass}>
                  <Sparkles className="h-5 w-5 shrink-0 text-sky-400" strokeWidth={2.25} aria-hidden />
                  {t('hero.cta_secondary')}
                </button>
              </div>
            </motion.div>

            {/* Right: hardware + side cards */}
            <div className="relative order-1 flex min-h-[200px] items-center justify-center pb-2 sm:min-h-[240px] sm:pb-0 lg:order-2 lg:min-h-[450px] lg:justify-end lg:-mt-12">
              <div className="relative z-10 flex w-full max-w-xl flex-row items-center justify-center gap-2 pr-1 sm:max-w-none sm:gap-5 sm:pr-2 lg:justify-end lg:gap-6">
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
                    className="w-full max-w-[320px] sm:max-w-xl lg:max-w-3xl xl:max-w-5xl object-contain drop-shadow-[0_0_80px_rgba(59,130,246,0.2)] animate-float"
                    alt="Premium Hardware"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="flex w-[9.25rem] shrink-0 flex-col items-end gap-3 self-end sm:w-[11rem] sm:gap-4 sm:self-auto lg:w-[14.5rem] lg:gap-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} className="w-full">
                    <div className={heroFloatCardClass}>
                      <div className="relative h-11 w-12 shrink-0 sm:h-14 sm:w-16 lg:h-16 lg:w-[4.5rem]">
                        <img
                          src="/rtx5090_clean.png"
                          className="relative h-full w-full object-contain mix-blend-lighten drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                          alt="RTX 5090"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black uppercase tracking-tight text-white sm:text-sm lg:text-base">RTX 5090</div>
                        <div className="text-[9px] font-semibold uppercase leading-tight tracking-wide text-slate-300 sm:text-[9px] lg:text-[10px]">
                          {t('hero.next_gen')}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="w-full">
                    <div className={heroFloatCardClass}>
                      <div className="relative h-11 w-12 shrink-0 sm:h-14 sm:w-16 lg:h-16 lg:w-[4.5rem]">
                        <img
                          src="/ryzen9000_clean.png"
                          className="relative h-full w-full object-contain mix-blend-lighten drop-shadow-[0_0_12px_rgba(251,146,60,0.25)]"
                          alt="Ryzen 9800X3D"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black uppercase leading-tight tracking-tight text-white sm:text-xs lg:text-sm">
                          RYZEN 9800X3D
                        </div>
                        <div className="text-[9px] font-semibold uppercase leading-tight tracking-wide text-slate-300 sm:text-[9px] lg:text-[10px]">
                          {t('hero.card_ryzen_sub')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Feature strip — без лишних слоёв поверх иконок */}
          <div className="relative z-0 mx-auto mt-8 w-full max-w-[1100px] border-t border-white/10 pt-6 sm:mt-10 sm:pt-8 lg:mt-14 lg:pt-10">
            <div className="flex flex-row items-start justify-between gap-10">
              {[
                { icon: Zap, label: t('stats.shipping.label'), sub: t('stats.shipping.sub') },
                { icon: Shield, label: t('stats.warranty.label'), sub: t('stats.warranty.sub') },
                { icon: Headset, label: t('stats.support.label'), sub: t('stats.support.sub') },
              ].map((stat, i) => (
                <div key={i} className="relative z-0 flex min-w-0 flex-1 flex-row items-start gap-3 sm:max-w-[32%]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-400/35 bg-blue-500/20 shadow-[0_0_20px_rgba(56,189,248,0.15)] sm:h-12 sm:w-12">
                    <stat.icon className="h-6 w-6 text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.45)] sm:h-6 sm:w-6" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 space-y-1.5 pt-0.5">
                    <div className="text-sm font-bold uppercase tracking-wide text-white sm:text-sm">{stat.label}</div>
                    <div className="text-xs font-medium leading-snug text-slate-400 sm:text-xs">{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-[#020617] py-24 border-t border-white/5 relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
        
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10">
          <h2 className="mb-16 font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
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
          <div className="flex items-center justify-center gap-6 mb-16">
            <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-blue-500/50" />
            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white">
              {t('category.title')}
            </h2>
            <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-blue-500/50" />
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
      <section className="bg-[#050508] py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-[900px] px-6 lg:px-12 text-slate-400 space-y-8">
          <h2 className="mb-10 font-black text-3xl md:text-5xl uppercase tracking-tighter text-white leading-tight">
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
