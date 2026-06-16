import React from 'react';
import { motion } from 'framer-motion';
import { Key, Lock, ShieldCheck, FileDigit, RefreshCw, Cpu, Server, CheckCircle2 } from 'lucide-react';

export default function Encryption() {
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
            <Key className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none"
          >
            Cryptographic <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">TRUST.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-400 max-w-5xl mx-auto font-light leading-relaxed"
          >
            Every byte of student data is shielded by multi-layer, industry-standard encryption protocols. We treat educational records with the same rigor as financial transactions.
          </motion.p>
        </div>
      </section>

      {/* ENCRYPTION LAYERS */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
         {[
           { icon: <Lock />, title: "AES-256 At Rest", desc: "Data in our databases and file storage clusters is encrypted using the Advanced Encryption Standard with 256-bit keys." },
           { icon: <RefreshCw />, title: "TLS 1.3 In Transit", desc: "Every packet moving between the student's device and our servers is protected by the latest transport layer security protocols." },
           { icon: <Cpu />, title: "Field-Level Security", desc: "Sensitive identifiers are encrypted individually at the application layer before they even reach the database." }
         ].map((item, i) => (
           <div key={i} className="p-16 rounded-[60px] bg-gray-50 border border-gray-100 space-y-8 hover:shadow-2xl transition-all">
              <div className="text-teal-600 w-12 h-12">{item.icon}</div>
              <h3 className="text-3xl font-black text-gray-900">{item.title}</h3>
              <p className="text-xl text-gray-500 font-light leading-relaxed">{item.desc}</p>
           </div>
         ))}
      </section>

      {/* TECHNICAL RIGOR DEEP DIVE */}
      <section className="py-32 bg-slate-50 border-y border-gray-100 px-6">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">Invisible <br />Protection.</h2>
               <p className="text-2xl text-gray-600 font-light leading-relaxed">Security shouldn't slow down learning. Our encryption engine is optimized to provide near-zero latency while maintaining absolute integrity.</p>
               <div className="space-y-6">
                  {[
                    { label: "Key Rotation", desc: "Cryptographic keys are automatically rotated every 24 hours." },
                    { label: "Hardware Security", desc: "Physical keys are stored in FIPS 140-2 Level 3 certified modules." },
                    { label: "Quantum Readiness", desc: "Our R&D team is already testing post-quantum cryptographic standards." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <h4 className="text-xl font-bold text-gray-900">{item.label}</h4>
                       <p className="text-gray-500">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-slate-900 rounded-[80px] p-12 md:p-24 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center gap-12">
               <div className="absolute inset-0 bg-teal-500/5 -skew-y-12"></div>
               <FileDigit className="w-48 h-48 text-teal-500/20" />
               <div className="text-center space-y-4 relative z-10">
                  <div className="text-4xl font-black text-white">0% Breaches</div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Since Inception</p>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL QUOTE */}
      <section className="py-48 px-6 text-center bg-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">Security is <br /><span className="text-teal-600 underline">Quiet.</span></h2>
            <p className="text-2xl text-gray-500 font-light">ClassSphere works silently in the background, ensuring that your institutional focus remains exactly where it should be: on teaching and learning.</p>
            <div className="pt-12">
               <button className="bg-gray-900 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-all">Request Security Briefing</button>
            </div>
         </div>
      </section>
    </div>
  );
}
