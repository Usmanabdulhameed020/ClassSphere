import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Heart, MessageCircle, Bell, History, ArrowRight, Star } from 'lucide-react';

export default function Portals() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-teal-50/30">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-600 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-teal-200 mb-8"
          >
            <Users className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[9rem] font-black text-slate-900 tracking-tighter leading-[0.85]"
          >
            The Unified <br /><span className="text-teal-600 italic">Loop.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-600 max-w-5xl mx-auto font-light leading-relaxed"
          >
            One ecosystem. Three distinct perspectives. ClassSphere Portals bridge the communication gap between educators, students, and families.
          </motion.p>
        </div>
      </section>

      {/* PORTAL SHOWCASE - THREE LARGE CARDS */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-32">
         {/* Instructor Helm */}
         <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
               <span className="text-teal-600 font-black uppercase tracking-widest text-sm">For Educators</span>
               <h2 className="text-5xl font-black text-gray-900 leading-tight">The Instructor <br />Helm.</h2>
               <p className="text-xl text-gray-600 leading-relaxed font-light">A high-command center for curriculum design, real-time assessment monitoring, and automated administrative tasks. Spend your time teaching, not clicking.</p>
               <button className="flex items-center gap-4 text-teal-600 font-black text-lg group">
                  Explore the Helm <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
            <div className="bg-slate-900 rounded-[60px] aspect-video relative overflow-hidden shadow-2xl group">
               <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-50"></div>
               <div className="absolute inset-12 border border-white/10 rounded-3xl p-8 space-y-4">
                  <div className="h-2 bg-white/20 rounded w-1/4"></div>
                  <div className="h-2 bg-white/20 rounded w-full"></div>
                  <div className="h-2 bg-white/20 rounded w-3/4"></div>
               </div>
            </div>
         </div>

         {/* Student Path */}
         <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 bg-teal-600 rounded-[60px] aspect-video relative overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]"></div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
               <span className="text-teal-600 font-black uppercase tracking-widest text-sm">For Students</span>
               <h2 className="text-5xl font-black text-gray-900 leading-tight">The Learning <br />Path.</h2>
               <p className="text-xl text-gray-600 leading-relaxed font-light">A gamified, linear experience that removes the anxiety of "what's next." Students stay focused on mastery with personalized goals and built-in study aids.</p>
               <button className="flex items-center gap-4 text-teal-600 font-black text-lg group">
                  See the Path <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </div>

         {/* Guardian Portal */}
         <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
               <span className="text-teal-600 font-black uppercase tracking-widest text-sm">For Families</span>
               <h2 className="text-5xl font-black text-gray-900 leading-tight">The Guardian <br />Window.</h2>
               <p className="text-xl text-gray-600 leading-relaxed font-light">No more asking "how was school?" Families get a beautifully curated feed of achievements, upcoming deadlines, and direct channels to educators.</p>
               <button className="flex items-center gap-4 text-teal-600 font-black text-lg group">
                  Open the Window <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
            <div className="bg-teal-50 rounded-[60px] aspect-video relative overflow-hidden shadow-2xl flex items-center justify-center">
               <Heart className="w-32 h-32 text-teal-200" />
            </div>
         </div>
      </section>

      {/* FEATURE GRID - IMMERSIVE */}
      <section className="py-32 bg-slate-900 text-white px-6">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-6">
               <h2 className="text-5xl font-black">Connected Features.</h2>
               <p className="text-xl text-slate-400 font-light">Data flows seamlessly between portals to keep everyone in sync.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { icon: <MessageCircle />, title: "Tri-Way Chat", desc: "Secure messaging between parent, teacher, and student." },
                 { icon: <Bell />, title: "Smart Alerts", desc: "Automated notifications for milestones, not just deadlines." },
                 { icon: <History />, title: "Journey Logs", desc: "A permanent record of a student's growth throughout the years." },
                 { icon: <Star />, title: "Badge System", desc: "Celebrate micro-wins with cross-portal recognition." }
               ].map((item, i) => (
                 <div key={i} className="p-10 bg-slate-800/50 border border-slate-700 rounded-[40px] space-y-6 hover:bg-slate-800 transition-all">
                    <div className="text-teal-400">{item.icon}</div>
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FINAL QUOTE */}
      <section className="py-48 bg-white text-center px-6">
         <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">Education is a <br /><span className="text-teal-600 underline decoration-teal-200">Community.</span></h2>
            <p className="text-2xl text-gray-500 font-light max-w-3xl mx-auto">ClassSphere Portals turn the solitary act of studying into a supported community journey.</p>
            <div className="pt-12">
               <button className="bg-gray-900 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all">Enable My Institution</button>
            </div>
         </div>
      </section>
    </div>
  );
}
