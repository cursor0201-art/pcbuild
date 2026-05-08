import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Truck, ShieldCheck, Headphones, Search, Plus } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="flex-1 space-y-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                Next Gen Performance
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                  Power Your <br />
                  <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Play</span>
                </h1>
                <p className="max-w-md text-slate-400 text-lg font-medium leading-relaxed">
                  Discover the ultimate collection of high-performance PC components, custom builds, and gaming gear. 
                  <span className="text-blue-400"> Built for gamers. Designed to win.</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <button 
                  onClick={() => navigate('/builder')}
                  className="group relative flex items-center gap-3 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button 
                  onClick={() => navigate('/builder')}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                  Build Your PC
                </button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Truck className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white">Free Shipping</div>
                    <div className="text-[9px] text-slate-500 uppercase">On all orders over $99</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white">2 Years Warranty</div>
                    <div className="text-[9px] text-slate-500 uppercase">Premium quality assured</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Headphones className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white">24/7 Support</div>
                    <div className="text-[9px] text-slate-500 uppercase">Always here to help</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Hardware Visuals */}
            <div className="relative flex-1 flex items-center justify-center">
              {/* Central Circle Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border border-blue-500/30 flex items-center justify-center">
                  <div className="w-[300px] h-[300px] rounded-full border border-blue-500/20" />
                </div>
              </div>

              {/* Hardware Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <img 
                  src="/hero_pc_hardware_1778257683839.png" 
                  alt="PC Hardware" 
                  className="max-w-[120%] lg:max-w-none w-[600px] lg:w-[800px] drop-shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-float"
                />
              </motion.div>

              {/* Floating Cards */}
              <div className="absolute right-0 top-1/4 space-y-4 z-20 hidden xl:block">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass-card p-4 rounded-2xl w-56 flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Search className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">RTX 5090</div>
                    <div className="text-[10px] text-slate-500">Performance Beast</div>
                    <div className="text-[10px] text-slate-500">24GB GDDR7</div>
                  </div>
                  <div className="ml-auto h-6 w-6 rounded-full border border-white/10 flex items-center justify-center text-slate-500">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="glass-card p-4 rounded-2xl w-56 flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-400 fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">RYZEN 9800X3D</div>
                    <div className="text-[10px] text-slate-500">Ultimate Gaming CPU</div>
                    <div className="text-[10px] text-slate-500">5.2GHz Boost</div>
                  </div>
                  <div className="ml-auto h-6 w-6 rounded-full border border-white/10 flex items-center justify-center text-slate-500">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16 space-y-4">
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
             <h2 className="text-3xl font-black uppercase tracking-[0.2em]">Shop By <span className="text-blue-500">Category</span></h2>
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Gaming PCs', sub: 'Pre-built. Tested. Game Ready.', price: '$899', img: '/gaming_pc_category_1778257729660.png' },
              { title: 'Graphics Cards', sub: 'Ultimate graphics performance.', price: '$499', img: '/gpu_category_v2_1778258218763.png' },
              { title: 'Processors', sub: 'Raw power for limitless gaming.', price: '$249', img: '/cpu_category_v2_1778258386738.png' },
              { title: 'Peripherals', sub: 'Gear up. Play at your best.', price: '$29', img: '/peripherals_category_v2_1778258472287.png' },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="glass-card p-6 rounded-[2rem] space-y-6 group cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-blue-400 transition-colors">{cat.title}</h3>
                    <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{cat.sub}</p>
                </div>

                <div className="relative h-48 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <img 
                    src={cat.img} 
                    alt={cat.title} 
                    className="max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Starting From</div>
                    <div className="text-xl font-black text-blue-500">{cat.price}</div>
                  </div>
                  <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Plus className="h-5 w-5 text-slate-300" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
