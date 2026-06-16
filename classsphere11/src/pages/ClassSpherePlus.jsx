import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Shield, Globe, Headset, HardDrive, Filter, Lock } from 'lucide-react';

export default function ClassSpherePlus() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* GIGANTIC HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-teal-500/20 text-teal-400 px-6 py-2 rounded-full border border-teal-500/30 text-sm font-black uppercase tracking-widest mb-4"
          >
            <Crown className="w-4 h-4" />
            The Ultimate Learning Standard
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none"
          >
            ClassSphere <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">PLUS.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-400 max-w-5xl mx-auto font-light leading-relaxed"
          >
            Beyond the basics. Plus provides the high-octane infrastructure required for modern, large-scale educational institutions.
          </motion.p>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </section>

      {/* THE VALUE PROPOSITION GRID */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Zap className="text-teal-600" />, title: "Priority Processing", desc: "Your AI generations and data syncs take precedence on our global compute cluster." },
            { icon: <Globe className="text-teal-600" />, title: "Global CDN", desc: "Deliver video and interactive content with sub-50ms latency anywhere in the world." },
            { icon: <Headset className="text-teal-600" />, title: "Concierge Support", desc: "Dedicated account managers and 24/7 technical assistance for your entire staff." },
            { icon: <HardDrive className="text-teal-600" />, title: "Unlimited Archive", desc: "Retain every student interaction, assignment, and feedback loop for the life of the institution." }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-2">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE DEEP DIVE - STAGGERED */}
      <section className="py-32 space-y-32">
        {/* Deep Dive 1 */}
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <span className="text-teal-600 font-black uppercase tracking-widest text-sm">Enterprise Control</span>
            <h2 className="text-5xl font-black text-gray-900 leading-tight">Advanced Institutional <br />Governance.</h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light">Plus grants administrators granular control over AI usage policies, content filtering, and security protocols across every department.</p>
            <ul className="space-y-4">
               {[
                 { icon: <Filter />, text: "Custom AI Content Guardrails" },
                 { icon: <Lock />, text: "Single Sign-On (SAML/Okta) Integration" },
                 { icon: <Shield />, text: "Automated FERPA/GDPR Compliance Logs" }
               ].map((li, i) => (
                 <li key={i} className="flex items-center gap-4 text-gray-800 font-bold">
                   <div className="text-teal-600 w-5 h-5">{li.icon}</div>
                   {li.text}
                 </li>
               ))}
            </ul>
          </div>
          <div className="bg-teal-50 rounded-[80px] aspect-[4/3] relative overflow-hidden shadow-2xl">
             <div className="absolute inset-12 bg-white rounded-[40px] shadow-inner p-12 space-y-6">
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="pt-12 grid grid-cols-2 gap-8">
                   <div className="h-32 bg-teal-500 rounded-3xl"></div>
                   <div className="h-32 bg-slate-100 rounded-3xl"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Deep Dive 2 - Reversed */}
        <div className="bg-gray-900 py-32 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="order-2 lg:order-1 relative">
               <div className="w-[120%] h-[500px] bg-teal-500/20 absolute -top-12 -left-24 blur-[120px] rounded-full"></div>
               <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" alt="Students" className="rounded-[60px] relative z-10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <span className="text-teal-400 font-black uppercase tracking-widest text-sm">Enhanced Pedagogy</span>
              <h2 className="text-5xl font-black text-white leading-tight">Augmented Student <br />Outcomes.</h2>
              <p className="text-xl text-slate-400 leading-relaxed font-light">With ClassSphere Plus, students gain access to personalized learning tracks that adapt in real-time, backed by massive historical datasets of successful educational outcomes.</p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                 <div>
                    <div className="text-4xl font-black text-teal-400">40%</div>
                    <p className="text-sm text-slate-500 mt-2 font-bold uppercase tracking-wider">Faster Mastery Speed</p>
                 </div>
                 <div>
                    <div className="text-4xl font-black text-teal-400">2.4x</div>
                    <p className="text-sm text-slate-500 mt-2 font-bold uppercase tracking-wider">Higher Retention Rates</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING CALLOUT */}
      <section className="py-48 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-6xl font-black text-gray-900 tracking-tight leading-none">The Future is <span className="text-teal-600 underline">Plus.</span></h2>
          <p className="text-2xl text-gray-600 font-light">Join the ranks of elite institutions worldwide. ClassSphere Plus scales with your ambition.</p>
          <div className="pt-8">
             <button className="bg-gray-900 text-white px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-colors">Start Institutional Trial</button>
             <p className="mt-8 text-gray-400 font-medium italic">No credit card required for qualified educational partners.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
