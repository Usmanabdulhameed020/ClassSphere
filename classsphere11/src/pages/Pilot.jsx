import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Zap, MessageCircle, BarChart, CheckCircle2, ArrowRight, Star } from 'lucide-react';

export default function Pilot() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-900 text-white text-center">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/20 mb-8 animate-bounce"
          >
            <Rocket className="text-white w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none"
          >
            Join the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-100">VANGUARD.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-400 max-w-5xl mx-auto font-light leading-relaxed"
          >
            Be among the first institutions to pilot the next generation of ClassSphere AI tools. Shape the future of education while gaining a competitive edge.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
      </section>

      {/* WHY PILOT? - LARGE TILES */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl font-black text-gray-900">The Pilot Advantage.</h2>
            <p className="text-xl text-gray-500 font-light">Direct influence on our product roadmap and white-glove onboarding.</p>
         </div>
         <div className="grid lg:grid-cols-2 gap-12">
            {[
              { icon: <Target className="w-12 h-12" />, title: "Custom Feature Co-Creation", desc: "Collaborate directly with our engineers to build tools that solve your department's unique friction points." },
              { icon: <Users className="w-12 h-12" />, title: "Hyper-Care Support", desc: "A dedicated 'Pilot Squad' of educational engineers on call for your faculty during the entire semester." },
              { icon: <Star className="w-12 h-12" />, title: "Early Beta Access", desc: "Test our most experimental AI personas and insights engines before they hit the global market." },
              { icon: <BarChart className="w-12 h-12" />, title: "Impact Case Study", desc: "We help you measure and document the pedagogical gains for publication and institutional recognition." }
            ].map((box, i) => (
              <div key={i} className="p-16 rounded-[60px] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all space-y-6 group">
                 <div className="text-teal-600 transition-transform group-hover:scale-110">{box.icon}</div>
                 <h3 className="text-4xl font-black text-gray-900">{box.title}</h3>
                 <p className="text-xl text-gray-600 font-light leading-relaxed">{box.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* PILOT PHASES */}
      <section className="py-32 bg-teal-600 text-white px-6 overflow-hidden relative">
         <div className="max-w-7xl mx-auto space-y-24 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-center">The Roadmap to <br />Transformation.</h2>
            <div className="grid md:grid-cols-3 gap-16">
               {[
                 { phase: "Ph I", title: "Alignment", desc: "Defining success metrics and identifying pilot faculty cohorts." },
                 { phase: "Ph II", title: "Integration", desc: "Seamless sync with your SIS and pilot-specific guardrail configuration." },
                 { phase: "Ph III", title: "Execution", desc: "Live classroom usage with bi-weekly feedback loops and data analysis." }
               ].map((item, i) => (
                 <div key={i} className="space-y-6">
                    <span className="text-2xl font-black text-teal-200 tracking-widest uppercase">{item.phase}</span>
                    <h4 className="text-4xl font-black">{item.title}</h4>
                    <p className="text-xl text-teal-50 font-light">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-48 px-6 text-center bg-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">Limited <br /><span className="text-teal-600 underline">Availability.</span></h2>
            <p className="text-2xl text-gray-500 font-light">We only accept 10 institutional pilot partners per semester to ensure hyper-care quality. Apply for the Fall 2026 cohort today.</p>
            <div className="pt-12">
               <button className="bg-gray-900 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-all">Submit Pilot Application</button>
            </div>
         </div>
      </section>
    </div>
  );
}
