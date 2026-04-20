import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Sparkles, Zap, DollarSign, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { AIBuilderModal } from '../components/AIBuilderModal';

export function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-5rem)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 via-transparent to-[#ff0080]/10" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.02)_25%,rgba(0,212,255,0.02)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.02)_75%,rgba(0,212,255,0.02))] bg-[length:60px_60px] opacity-30" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 inline-block border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-6 py-2 font-black text-[#00d4ff] text-xs uppercase tracking-widest"
            >
              {t('hero.tagline')}
            </motion.div>

            <h1 className="mb-4 font-black text-6xl md:text-8xl uppercase leading-none tracking-tighter text-white lg:text-9xl">
              {t('hero.title')}
            </h1>
            <h1 className="mb-12 bg-gradient-to-r from-[#00d4ff] via-[#ff0080] to-[#00ff88] bg-clip-text font-black text-6xl md:text-8xl uppercase leading-none tracking-tighter text-transparent lg:text-9xl">
              {t('hero.subtitle')}
            </h1>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/builder')}
                className="group flex items-center gap-3 bg-[#00d4ff] px-10 py-5 font-black text-black text-lg uppercase tracking-wider transition-all hover:bg-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
              >
                {t('hero.cta')}
                <ArrowRight className="transition-transform group-hover:translate-x-2" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAI(true)}
                className="flex items-center gap-3 border-2 border-[#ff0080] bg-transparent px-10 py-5 font-black text-lg uppercase tracking-wider text-[#ff0080] transition-all hover:bg-[#ff0080] hover:text-white hover:shadow-[0_0_30px_rgba(255,0,128,0.5)]"
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
            <div className="relative h-[600px] w-[600px]">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#00d4ff]/20 to-[#ff0080]/20 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=600&fit=crop"
                alt="Gaming PC"
                className="relative h-full w-full object-cover opacity-80"
                style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' }}
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
                className="group relative overflow-hidden border border-white/10 bg-[#12121a] p-8 transition-all hover:border-[#00d4ff]/50"
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
