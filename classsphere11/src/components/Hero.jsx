import React, { useState } from 'react';
import { ChevronRight, Star, ArrowRight, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem('cs_signups') || '[]');
        localStorage.setItem('cs_signups', JSON.stringify([...saved, { email, ts: Date.now() }]));
        setStatus('success');
        setEmail('');
      } catch (err) {
        setStatus('error');
      }
    }, 900);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24 sm:pt-32 pb-12 sm:pb-20">
      {/* Abstract Background Elements - Drifting & Pulsing */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[40%] h-[60%] sm:h-[40%] bg-teal-50 rounded-full blur-[100px] sm:blur-[120px] opacity-60" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] sm:w-[40%] h-[60%] sm:h-[40%] bg-teal-50 rounded-full blur-[100px] sm:blur-[120px] opacity-60" 
      />
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-xs sm:text-sm font-semibold border border-teal-100 shadow-sm"
            >
              <Star className="w-4 h-4 fill-teal-600" />
              <span>Trusted by 1,200+ top universities</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]"
            >
              Elevate your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
                Learning Experience
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              ClassSphere is the premier ecosystem for modern education. Deliver seamless curricula, real-time assessments, and unmatched student engagement.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <form onSubmit={handleSubmit} className="relative flex w-full sm:w-auto group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full sm:w-80 px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all shadow-sm group-hover:shadow-md"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="hidden xs:inline">{status === 'loading' ? '...' : 'Join Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center gap-2 text-slate-600 font-bold hover:text-teal-600 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-600 group-hover:fill-teal-600" />
                </div>
                <span className="text-sm sm:text-base">See it in action</span>
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-6 sm:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">99.9%</div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Uptime</div>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">4.9/5</div>
                <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative px-4 sm:px-0"
          >
            <div className="relative z-10 p-3 sm:p-4 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                alt="Student learning" 
                className="rounded-[1.5rem] sm:rounded-[2rem] w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
              />
              
              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 sm:top-10 -left-2 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 sm:gap-4 max-w-[160px] sm:max-w-none"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 fill-teal-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">Top Rated</div>
                  <div className="text-[10px] sm:text-xs text-slate-500">2026 EdTech Award</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-6 sm:bottom-10 -right-2 sm:-right-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-50"
              >
                <div className="flex -space-x-3 mb-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                    </div>
                  ))}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-teal-600 flex items-center justify-center text-[10px] text-white font-bold">
                    +12k
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Active Students</div>
              </motion.div>
            </div>
            
            {/* Background Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] sm:w-[120%] h-[110%] sm:h-[120%] border border-teal-50 rounded-full -z-10" />
          </motion.div>

        </div>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Qfggd7CtFU0?si=la7Kg9CKey1l6qFb"
                title="Product Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                scrolling="no"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
