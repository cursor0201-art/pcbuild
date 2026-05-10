import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Cpu, Send, ShoppingCart, CheckCircle2, User, Bot, RefreshCcw } from 'lucide-react';
import { apiService, Product, Category } from '../services/api';
import { useNavigate } from 'react-router';

interface PCComponent {
  id: string;
  name: string;
  brand: string;
  specs: string[];
  price: number;
  image: string;
  performance?: number;
  formatted_price?: string;
  category_slug: string;
  category_name: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  build?: Record<string, PCComponent> | null;
  total_price?: number;
}

interface AIBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuildGenerated?: (components: Record<string, PCComponent>) => void;
}

export function AIBuilderModal({ isOpen, onClose, onBuildGenerated }: AIBuilderModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: t('ai.welcome')
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!promptText.trim() || isGenerating) return;

    const userMessage: Message = { role: 'user', content: promptText };
    setMessages(prev => [...prev, userMessage]);
    setPromptText('');
    setIsGenerating(true);
    setIsAddedToCart(false);

    try {
      // Pass history to backend (excluding build data to keep payload small)
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await apiService.generateAIBuild(userMessage.content, history);
      
      if (response.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.message || '',
          build: response.build || null,
          total_price: response.total_price
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `${t('ai.error.title')}: ${response.error || t('ai.error.fallback')}` 
        }]);
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || "Network error"}` 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = (build: Record<string, PCComponent>) => {
    const components = Object.values(build);
    localStorage.setItem('pcbuilder-cart', JSON.stringify(components));
    setIsAddedToCart(true);
    
    // Optional: Sync with other pages if they use a custom event
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[85vh] flex flex-col border border-[#00d4ff]/20 bg-[#0a0a0f] shadow-[0_0_100px_rgba(0,212,255,0.1)] rounded-[2.5rem] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-[#0d0d12]/50 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#ff0080]/20 blur-xl rounded-full" />
                  <Sparkles className="relative h-8 w-8 text-[#ff0080] animate-pulse" />
                </div>
                <div>
                  <h2 className="font-black text-2xl uppercase tracking-tighter text-white">
                    {t('ai.title')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">AI Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="group relative h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all"
              >
                <X className="h-5 w-5 text-white/60 group-hover:text-white" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-[#ff0080] to-[#7000ff]'
                  }`}>
                    {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                  </div>
                  
                  <div className={`max-w-[85%] space-y-4 ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-6 rounded-[2rem] text-lg leading-relaxed shadow-xl ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.build && (
                      <div className="mt-4 border border-[#00d4ff]/30 bg-[#00d4ff]/5 p-6 rounded-[2.5rem] overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-black text-xl text-[#00d4ff] uppercase tracking-tighter">
                            {t('ai.success.title')}
                          </h4>
                          <div className="text-right">
                            <div className="text-[10px] text-white/40 uppercase font-black">{t('ai.total')}</div>
                            <div className="text-2xl font-black text-white">
                              {((msg.total_price || 0) / 1000000).toFixed(1)}M <span className="text-[#00d4ff] text-sm uppercase">{t('currency')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                          {Object.entries(msg.build).map(([category, component]) => (
                            <div key={category} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                              <img src={component.image} className="h-12 w-12 object-contain bg-black/40 rounded-lg p-1" />
                              <div className="min-w-0">
                                <div className="text-[9px] text-blue-400 font-bold uppercase truncate">{t(`component.${category}`)}</div>
                                <div className="text-xs font-bold text-white truncate">{component.name}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-3">
                          <p className="text-center text-sm font-bold text-[#00ff88] uppercase tracking-wider mb-2">
                            {t('ai.ask_satisfaction')}
                          </p>
                          <div className="flex gap-3">
                            {!isAddedToCart ? (
                              <button
                                onClick={() => handleAddToCart(msg.build!)}
                                className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#0088ff] px-6 py-4 rounded-2xl font-black text-xs uppercase text-white shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                {t('ai.add_to_cart')}
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate('/checkout')}
                                className="flex-1 bg-gradient-to-r from-[#00ff88] to-[#00aa55] px-6 py-4 rounded-2xl font-black text-xs uppercase text-black shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                {t('ai.checkout_now')}
                              </button>
                            )}
                            <button
                              onClick={() => setMessages(prev => [...prev, { role: 'user', content: t('ai.regenerate') }])}
                              className="px-6 py-4 rounded-2xl border border-white/10 bg-white/5 font-black text-xs uppercase text-white hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isGenerating && (
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#ff0080] to-[#7000ff] flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white/5 p-6 rounded-[2rem] rounded-tl-none border border-white/10 flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-[#ff0080] animate-spin" />
                    <span className="font-black text-sm uppercase tracking-widest text-[#ff0080]">
                      {t('ai.thinking')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-[#0d0d12]/50 border-t border-white/5">
              <div className="relative flex items-end gap-4 max-w-4xl mx-auto">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00d4ff] to-[#ff0080] rounded-[2rem] opacity-20 blur group-focus-within:opacity-40 transition-all" />
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={t('ai.placeholder')}
                    className="relative w-full min-h-[60px] max-h-[150px] bg-[#12121a] border border-white/10 rounded-[1.5rem] p-4 pr-12 text-white outline-none focus:border-[#00d4ff]/50 transition-all resize-none overflow-hidden"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isGenerating || !promptText.trim()}
                    className="absolute right-3 bottom-3 h-10 w-10 flex items-center justify-center rounded-xl bg-[#00d4ff] text-black hover:bg-[#00ff88] disabled:opacity-50 disabled:hover:bg-[#00d4ff] transition-all shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
