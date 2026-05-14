import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, ArrowRight, Shield, Headset, Bot } from 'lucide-react';
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
      <section className="relative flex min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex-col overflow-hidden py-8 sm:py-12 lg:py-10">
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 sm:px-6 lg:px-12">
          <div className="grid w-full flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
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

              <h1 className="mb-4 font-black text-4xl uppercase leading-[0.95] tracking-tighter text-white sm:mb-5 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                {t('hero.title_part1')}<br />
                <span className="text-blue-500">{t('hero.title_part2')}</span>
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:mb-10 sm:text-lg md:text-xl">
                {t('hero.description')}
                <span className="mt-3 block font-black text-lg text-blue-400 sm:mt-4 sm:text-xl">{t('hero.tagline_extra')}</span>
              </p>

              <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-3 lg:gap-x-5">
                <button
                  type="button"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex w-full min-h-[3.25rem] max-w-[20rem] shrink-0 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 px-10 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_8px_32px_rgba(37,99,235,0.35)] transition-all hover:from-blue-500 hover:via-blue-400 hover:to-sky-400 hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)] active:scale-[0.98] sm:w-auto sm:max-w-none sm:min-h-[3.5rem] sm:gap-3 sm:px-12 sm:py-4 sm:text-base lg:px-14 lg:text-lg"
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/builder')}
                  className="inline-flex w-full min-h-[3.25rem] max-w-[20rem] shrink-0 items-center justify-center gap-2.5 rounded-full border-2 border-white/35 bg-slate-950/90 px-10 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-all hover:border-white/55 hover:bg-slate-900/95 hover:shadow-[0_0_24px_rgba(255,255,255,0.06)] active:scale-[0.98] sm:w-auto sm:max-w-none sm:min-h-[3.5rem] sm:gap-3 sm:px-12 sm:py-4 sm:text-base lg:px-14 lg:text-lg"
                >
                  <Sparkles className="h-5 w-5 shrink-0 text-sky-400" strokeWidth={2.25} aria-hidden />
                  {t('hero.cta_secondary')}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAI(true)}
                  className="inline-flex w-full min-h-[3.25rem] max-w-[20rem] shrink-0 items-center justify-center gap-2.5 rounded-full border-2 border-violet-500/45 bg-violet-950/50 px-10 py-3.5 text-sm font-black uppercase tracking-wide text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_28px_rgba(139,92,246,0.12)] backdrop-blur-sm transition-all hover:border-violet-400/70 hover:bg-violet-900/55 hover:shadow-[0_0_32px_rgba(139,92,246,0.2)] active:scale-[0.98] sm:w-auto sm:max-w-none sm:min-h-[3.5rem] sm:gap-3 sm:px-12 sm:py-4 sm:text-base lg:px-14 lg:text-lg"
                >
                  <Bot className="h-5 w-5 shrink-0 text-violet-300" strokeWidth={2.25} aria-hidden />
                  {t('builder.ai.button')}
                </button>
              </div>
            </motion.div>

            {/* Right: hardware + side cards */}
            <div className="relative order-1 flex min-h-[240px] items-center justify-center lg:order-2 lg:min-h-[380px] lg:justify-end">
              <div className="relative z-10 flex w-full max-w-xl flex-row items-center justify-center gap-3 sm:max-w-none sm:gap-5 lg:max-w-none lg:justify-end lg:gap-8">
                <div className="relative flex flex-1 items-center justify-center lg:flex-[1.1]">
                  <div
                    className="pointer-events-none absolute aspect-square w-[min(92vw,440px)] max-w-full rounded-full border border-blue-500/25 bg-blue-500/[0.04] shadow-[0_0_80px_rgba(59,130,246,0.18)] sm:w-[min(85vw,520px)]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute aspect-square w-[min(72vw,360px)] rounded-full border border-blue-400/15 sm:w-[min(65vw,420px)]"
                    aria-hidden
                  />
                  <img
                    src="/hero_composite.png"
                    className="animate-float relative z-10 w-full max-w-[260px] object-contain drop-shadow-[0_0_60px_rgba(59,130,246,0.25)] sm:max-w-md lg:max-w-lg xl:max-w-2xl"
                    alt="Premium Hardware"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="hidden shrink-0 flex-col justify-center gap-3 sm:flex sm:gap-4 lg:gap-5"
                >
                  <motion.div whileHover={{ scale: 1.02 }} className="w-[9.5rem] sm:w-[12.5rem] lg:w-[14rem]">
                    <div className="flex items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-black/70 p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:gap-3 sm:rounded-[1.35rem] sm:p-3.5 lg:p-4">
                      <div className="relative h-11 w-12 shrink-0 sm:h-14 sm:w-16 lg:h-16 lg:w-[4.5rem]">
                        <img
                          src="/rtx5090_clean.png"
                          className="relative h-full w-full object-contain mix-blend-lighten drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                          alt="RTX 5090"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black uppercase tracking-tight text-white sm:text-sm lg:text-base">RTX 5090</div>
                        <div className="text-[8px] font-bold uppercase leading-tight tracking-wide text-slate-400 sm:text-[9px] lg:text-[10px]">
                          {t('hero.next_gen')}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="w-[9.5rem] sm:w-[12.5rem] lg:w-[14rem]">
                    <div className="flex items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-black/70 p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:gap-3 sm:rounded-[1.35rem] sm:p-3.5 lg:p-4">
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
                        <div className="text-[8px] font-bold uppercase leading-tight tracking-wide text-slate-400 sm:text-[9px] lg:text-[10px]">
                          {t('hero.card_ryzen_sub')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Feature strip — full width like reference */}
          <div className="mt-10 w-full border-t border-white/10 pt-8 sm:mt-12 sm:pt-10 lg:mt-14">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
              {[
                { icon: Zap, label: t('stats.shipping.label'), sub: t('stats.shipping.sub') },
                { icon: Shield, label: t('stats.warranty.label'), sub: t('stats.warranty.sub') },
                { icon: Headset, label: t('stats.support.label'), sub: t('stats.support.sub') },
              ].map((stat, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/10 sm:h-12 sm:w-12">
                    <stat.icon className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wide text-white sm:text-sm">{stat.label}</div>
                    <div className="text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="relative border-t border-white/5 py-28 sm:py-36 md:py-44">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-20 flex flex-col items-center space-y-4 sm:mb-28">
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
