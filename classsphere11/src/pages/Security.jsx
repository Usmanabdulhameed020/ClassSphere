import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle, Globe, Server, ShieldAlert } from 'lucide-react';

export default function Security() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-500 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/20 mb-8"
          >
            <ShieldCheck className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none"
          >
            Fortress <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">PRIVACY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-400 max-w-5xl mx-auto font-light leading-relaxed"
          >
            In an era of data vulnerability, ClassSphere sets the gold standard for educational security. We protect student data as if it were our own children's.
          </motion.p>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </section>

      {/* SECURITY PILLARS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {[
            { icon: <Lock />, title: "Zero-Knowledge Architecture", desc: "We employ end-to-end encryption where even our engineers cannot access individual student records or private class communications." },
            { icon: <EyeOff />, title: "Anonymized Analytics", desc: "Our Insights Engine processes metadata to improve learning outcomes while keeping individual identities strictly shielded." },
            { icon: <ShieldAlert />, title: "Proactive Threat Hunting", desc: "AI-driven security monitors watch for anomalous access patterns 24/7, neutralizing threats before they reach your data." }
          ].map((item, i) => (
            <div key={i} className="space-y-8 p-16 bg-gray-50 rounded-[60px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black text-gray-900">{item.title}</h3>
              <p className="text-xl text-gray-600 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INFRASTRUCTURE DEEP DIVE */}
      <section className="py-32 bg-slate-50 border-y border-gray-100 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-12">
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">Beyond <br />Compliance.</h2>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">Meeting regulations is the floor, not the ceiling. We've built proprietary protocols that exceed global standards for data residency and encryption.</p>
              <div className="space-y-6">
                 {[
                   "Field-Level Encryption at Rest",
                   "Multi-Factor Biometric Authentication",
                   "Automated Data Purge Protocols",
                   "Hardware Security Modules (HSM)"
                 ].map((text, i) => (
                   <div key={i} className="flex items-center gap-4 text-xl font-bold text-gray-800">
                      <CheckCircle className="text-teal-600 w-6 h-6" />
                      {text}
                   </div>
                 ))}
              </div>
           </div>
           <div className="bg-white rounded-[80px] shadow-2xl p-12 md:p-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-teal-600/5 -skew-y-12"></div>
              <div className="relative z-10 space-y-12">
                 <div className="flex items-center gap-8">
                    <Globe className="w-16 h-16 text-teal-600" />
                    <div>
                       <h4 className="text-2xl font-black">Global Data Residency</h4>
                       <p className="text-gray-500">Your data stays in your region. Localized clusters ensure compliance with local laws.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <Server className="w-16 h-16 text-teal-600" />
                    <div>
                       <h4 className="text-2xl font-black">Isolated Enclaves</h4>
                       <p className="text-gray-500">Institutional data is physically and logically separated to prevent cross-contamination.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-48 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">Trust, <br /><span className="text-teal-600 underline">Verified.</span></h2>
          <p className="text-2xl text-gray-500 font-light">Download our comprehensive security whitepaper or schedule a briefing with our Chief Security Officer.</p>
          <div className="pt-12 flex flex-col md:flex-row justify-center gap-8">
             <button className="bg-slate-900 text-white px-16 py-8 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-all">Download Security PDF</button>
             <button className="bg-white text-gray-900 border-2 border-gray-200 px-16 py-8 rounded-full font-black text-2xl hover:bg-gray-50 transition-all">Speak with an Expert</button>
          </div>
        </div>
      </section>
    </div>
  );
}
