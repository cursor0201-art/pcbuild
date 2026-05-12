import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Zap } from 'lucide-react';
import { PCComponent, formatPrice } from '../data/components';

interface ProductModalProps {
  component: PCComponent | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (component: PCComponent) => void;
  isSelected?: boolean;
}

export function ProductModal({
  component,
  isOpen,
  onClose,
  onSelect,
  isSelected,
}: ProductModalProps) {
  const { t } = useLanguage();

  if (!component) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,212,255,0.1)]"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 transition-all hover:bg-white/10 hover:text-white border border-white/10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-64 sm:h-96 md:h-auto overflow-hidden bg-white/5 flex items-center justify-center p-8 sm:p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
                <img
                  src={component.image}
                  alt={component.name}
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                />
                {isSelected && (
                  <div className="absolute left-6 top-6 z-10 flex h-12 w-12 items-center justify-center bg-[#00ff88] rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                    <Check className="h-6 w-6 text-black" />
                  </div>
                )}
              </div>

              <div className="flex flex-col p-6 sm:p-10 lg:p-12">
                <div className="mb-2 font-bold text-blue-400 text-xs uppercase tracking-[0.2em]">
                  {component.brand}
                </div>
                <h2 className="mb-8 font-black text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight text-white tracking-tighter">
                  {component.name}
                </h2>

                <div className="mb-10 space-y-8">
                  <div>
                    <h3 className="mb-4 font-black text-white/40 text-[10px] uppercase tracking-[0.2em]">
                      {t('category.specs') || 'Характеристики'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {component.specs.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-2xl"
                        >
                          <Zap className="h-4 w-4 text-blue-400" />
                          <span className="text-white/90 text-sm font-medium truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {component.performance && (
                    <div>
                      <h3 className="mb-4 font-black text-white/40 text-[10px] uppercase tracking-[0.2em]">
                        {t('category.performance') || 'Производительность'}
                      </h3>
                      <div className="flex items-center gap-6 bg-white/5 p-4 rounded-3xl border border-white/5">
                        <div className="flex-1 h-3 overflow-hidden bg-white/10 rounded-full">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${component.performance}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                          />
                        </div>
                        <span className="font-black text-3xl text-white">
                          {Math.round(component.performance)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-6">
                  <div className="flex items-center justify-between border-t border-white/10 pt-8">
                    <span className="font-black text-white/30 text-[10px] uppercase tracking-[0.2em]">{t('category.price') || 'Цена'}</span>
                    <div className="font-black text-4xl sm:text-5xl text-white">
                      {formatPrice(component.price)}{' '}
                      <span className="text-blue-500 text-xl sm:text-2xl">{t('currency')}</span>
                    </div>
                  </div>

                  {onSelect && (
                    <button
                      onClick={() => {
                        onSelect(component);
                        onClose();
                      }}
                      className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
                        isSelected
                          ? 'border-2 border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88] hover:text-black'
                          : 'bg-blue-600 text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.5)]'
                      }`}
                    >
                      {isSelected ? t('component.selected') : t('component.select')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
