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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl border border-[#00d4ff]/30 bg-[#0d0d12]"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 text-white/60 transition-colors hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-96 overflow-hidden bg-black/50 md:h-auto">
                <img
                  src={component.image}
                  alt={component.name}
                  className="h-full w-full object-cover"
                />
                {isSelected && (
                  <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center bg-[#00d4ff]">
                    <Check className="h-6 w-6 text-black" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              <div className="flex flex-col p-8">
                <div className="mb-2 font-bold text-[#00d4ff] text-sm uppercase tracking-wider">
                  {component.brand}
                </div>
                <h2 className="mb-6 font-black text-4xl uppercase leading-tight text-white">
                  {component.name}
                </h2>

                <div className="mb-8 space-y-4">
                  <div>
                    <h3 className="mb-3 font-bold text-white/60 text-xs uppercase tracking-wider">
                      Характеристики
                    </h3>
                    <div className="space-y-2">
                      {component.specs.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 border-l-2 border-[#00d4ff]/30 bg-[#12121a] py-2 pl-4 pr-6"
                        >
                          <Zap className="h-4 w-4 text-[#00d4ff]" />
                          <span className="text-white">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {component.performance && (
                    <div>
                      <h3 className="mb-3 font-bold text-white/60 text-xs uppercase tracking-wider">
                        Производительность
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-3 overflow-hidden bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${component.performance}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88]"
                          />
                        </div>
                        <span className="font-black text-2xl text-white">
                          {component.performance}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-end justify-between border-t border-white/10 pt-6">
                    <span className="font-bold text-white/60 text-sm uppercase">Цена</span>
                    <div className="font-black text-4xl text-white">
                      {formatPrice(component.price)}{' '}
                      <span className="text-[#00d4ff] text-xl">{t('currency')}</span>
                    </div>
                  </div>

                  {onSelect && (
                    <button
                      onClick={() => {
                        onSelect(component);
                        onClose();
                      }}
                      className={`w-full px-8 py-5 font-black text-lg uppercase transition-all ${
                        isSelected
                          ? 'border-2 border-[#00ff88] bg-transparent text-[#00ff88] hover:bg-[#00ff88] hover:text-black'
                          : 'bg-[#00d4ff] text-black hover:bg-[#00ff88]'
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
