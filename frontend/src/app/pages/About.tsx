import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#020617] pt-32 pb-24 text-white">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-12 text-white/80 space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 font-black text-3xl sm:text-5xl md:text-7xl uppercase tracking-tighter text-white"
        >
          {t('about.title')} <span className="text-blue-500">GameZoneBuild</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-64 sm:h-96 w-full rounded-[2.5rem] overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-blue-600/10 z-10" />
          <img 
            src="/hero_pc_hardware.png" 
            className="w-full h-full object-cover"
            alt="Gaming PC Hardware" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6 text-lg leading-relaxed border-l-4 border-blue-500 pl-6 bg-white/5 p-8 rounded-r-3xl glass-card"
        >
          <p>
            <strong className="text-white">GameZoneBuild</strong> — {t('about.p1')}
          </p>
          <p>
            {t('about.p2')}
          </p>
          <p>
            {t('about.p3')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
