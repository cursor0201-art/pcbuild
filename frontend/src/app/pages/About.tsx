import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export function About() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-24">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-12 text-white/80 space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 font-black text-5xl md:text-7xl uppercase tracking-tighter text-white"
        >
          О сервисе <span className="text-[#00d4ff]">GameZoneBuild</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-lg leading-relaxed border-l-4 border-[#00d4ff] pl-6 bg-[#12121a] p-8"
        >
          <p>
            <strong className="text-white">GameZoneBuild</strong> — это премиальный сервис сборки игровых ПК и рабочих станций в Узбекистане. 
            Мы не просто продаем компьютеры, мы создаем индивидуальные решения под конкретные задачи и бюджет каждого клиента.
          </p>
          <p>
            В GameZoneBuild вы можете быть уверены в качестве каждой детали. Наши специалисты вручную подбирают комплектующие, 
            гарантируя их идеальную совместимость. От мощных киберспортивных машин до тихих систем для 3D-моделирования — 
            GameZoneBuild предлагает лучшие решения на рынке.
          </p>
          <p>
            Почему выбирают GameZoneBuild? Прозрачное ценообразование, профессиональный кабель-менеджмент, стресс-тестирование 
            каждой системы перед выдачей и полноценная гарантия. Доверьте сборку профессионалам GameZoneBuild.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
