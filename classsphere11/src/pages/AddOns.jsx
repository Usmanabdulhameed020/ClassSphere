import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Puzzle, Combine, Layers, Zap, Heart, MessageSquare, ArrowRight } from 'lucide-react';

export default function AddOns() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-gradient-to-br from-teal-50 via-white to-white">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-teal-100 mb-8"
          >
            <Puzzle className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[9rem] font-black text-slate-900 tracking-tighter leading-[0.85]"
          >
            Bespoke <br /><span className="text-teal-600 italic">MODULARITY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-500 max-w-5xl mx-auto font-light leading-relaxed"
          >
            No two institutions are identical. ClassSphere Add-ons allow you to extend your platform with specialized capabilities tailored to your unique curriculum.
          </motion.p>
        </div>
      </section>

      {/* FEATURED ADD-ONS - LARGE CARDS */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-24">
         <div className="grid lg:grid-cols-2 gap-12">
            {[
              { title: "STEM Simulation Lab", desc: "Interactive, high-fidelity physics and chemistry simulations grounded in our AI engine. Students can conduct experiments in a safe, infinitely repeatable digital environment.", icon: <Zap />, color: "bg-teal-50 text-teal-600" },
              { title: "Global Language Suite", desc: "Immersive translation tools that go beyond words. Includes dialect-specific AI tutors and automated localized content generation for diverse classrooms.", icon: <Combine />, color: "bg-teal-50 text-teal-600" },
              { title: "Deep LMS Integrator", desc: "Atomic-level sync with Canvas, Blackboard, and Moodle. Move grades, assignments, and rosters between platforms with zero friction and 100% integrity.", icon: <Layers />, color: "bg-teal-50 text-teal-600" },
              { title: "Wellbeing Monitor", desc: "A privacy-first layer that uses AI to detect patterns of student burnout or disengagement, alerting counselors before a crisis occurs.", icon: <Heart />, color: "bg-teal-50 text-teal-600" }
            ].map((addon, i) => (
              <div key={i} className="p-16 rounded-[60px] border border-gray-100 bg-white hover:shadow-2xl transition-all space-y-8 group">
                 <div className={`w-20 h-20 ${addon.color} rounded-3xl flex items-center justify-center`}>{addon.icon}</div>
                 <h3 className="text-4xl font-black text-gray-900">{addon.title}</h3>
                 <p className="text-xl text-gray-500 font-light leading-relaxed">{addon.desc}</p>
                 <button className="flex items-center gap-4 text-gray-900 font-black text-lg group/btn">
                    View Technical Specs <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                 </button>
              </div>
            ))}
         </div>
      </section>

      {/* EXTENSION ARCHITECTURE */}
      <section className="py-32 bg-slate-900 text-white px-6">
         <div className="max-w-5xl mx-auto text-center space-y-12">
            <h2 className="text-5xl md:text-7xl font-black">Built for <span className="text-teal-400">Extensibility.</span></h2>
            <p className="text-2xl text-slate-400 font-light leading-relaxed">Our robust API and LTI v1.3 compliance mean that if you can dream of a specialized tool, you can plug it into the ClassSphere core.</p>
            <div className="grid md:grid-cols-3 gap-12 pt-12">
               <div className="space-y-4">
                  <div className="text-4xl font-black text-teal-400">500+</div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Certified Partners</p>
               </div>
               <div className="space-y-4">
                  <div className="text-4xl font-black text-teal-400">10ms</div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Inter-module Latency</p>
               </div>
               <div className="space-y-4">
                  <div className="text-4xl font-black text-teal-400">100%</div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Data Portability</p>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-48 px-6 text-center bg-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">Customize Your <br /><span className="text-teal-600 underline">Ecosystem.</span></h2>
            <p className="text-2xl text-gray-500 font-light">Explore our full marketplace of institutional add-ons or talk to our developers about building a custom module.</p>
            <div className="pt-12">
               <button className="bg-teal-600 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all">Explore Marketplace</button>
            </div>
         </div>
      </section>
    </div>
  );
}
