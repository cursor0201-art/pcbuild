import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] pt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <AlertTriangle className="h-32 w-32 text-[#ff0080]" />
            <div className="absolute inset-0 animate-pulse bg-[#ff0080]/20 blur-3xl" />
          </div>
        </div>

        <h1 className="mb-4 font-black text-9xl uppercase text-white">404</h1>
        <h2 className="mb-8 font-black text-3xl uppercase text-[#00d4ff]">
          СТРАНИЦА НЕ НАЙДЕНА
        </h2>
        <p className="mb-12 text-white/60 text-xl">
          Похоже, эта страница была удалена или никогда не существовала
        </p>

        <button
          onClick={() => navigate('/')}
          className="bg-[#00d4ff] px-12 py-5 font-black text-lg uppercase text-black transition-all hover:bg-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
        >
          НА ГЛАВНУЮ
        </button>
      </motion.div>
    </div>
  );
}
