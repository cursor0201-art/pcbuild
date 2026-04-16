import { Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <Cpu className="h-16 w-16 text-[#00d4ff]" />
      </motion.div>
    </div>
  );
}
