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
            <AlertTriangle className="h-32 w-32 text-[#7070ff]" />
            <div className="absolute inset-0 animate-pulse bg-[#7070ff]/20 blur-3xl" />
          </div>
        </div>

        <h1 className="mb-4 font-black text-9xl uppercase text-white">404</h1>
        <h2 className="mb-8 font-black text-3xl uppercase text-[#2323ff]">
          СТРАНИЦА НЕ НАЙДЕНА
        </h2>
        <p className="mb-12 text-white/60 text-xl">
          Похоже, эта страница была удалена или никогда не существовала
        </p>

        <button
          onClick={() => navigate('/')}
          className="bg-[#2323ff] px-12 py-5 font-black text-lg uppercase text-white transition-all hover:bg-[#7070ff] hover:shadow-[0_0_30px_rgba(35,35,255,0.3)]"
        >
          НА ГЛАВНУЮ
        </button>
      </motion.div>
    </div>
  );
}
