import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, FileText, Scale, CheckCircle2, ShieldAlert, ScrollText, AlertCircle, ArrowRight } from 'lucide-react';

export default function Terms() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white border border-gray-200 rounded-[32px] flex items-center justify-center mx-auto shadow-xl mb-8"
          >
            <Gavel className="text-teal-600 w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-none"
          >
            Service <br /><span className="text-teal-600">CHARTER.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-slate-500 max-w-4xl mx-auto font-light leading-relaxed"
          >
            By using ClassSphere, you are entering into a partnership dedicated to academic integrity, mutual respect, and the pursuit of knowledge.
          </motion.p>
        </div>
      </section>

      {/* CHARTER ARTICLES */}
      <section className="py-32 px-6 max-w-5xl mx-auto space-y-32">
         {[
           { title: "Academic Integrity", icon: <CheckCircle2 />, desc: "Users agree to use our AI tools as aids for learning, not as a means to circumvent academic rigor. Plagiarism and automated cheating are strictly prohibited and may lead to account termination." },
           { title: "Institutional Governance", icon: <Scale />, desc: "The ultimate authority over class content, student access, and grade records remains with the hosting institution. ClassSphere acts as the processor, not the arbiter." },
           { title: "Responsible AI Usage", icon: <AlertCircle />, desc: "Users must not attempt to 'jailbreak' AI personas or use the platform to generate harmful, biased, or non-educational content." },
           { title: "Data Continuity", icon: <ScrollText />, desc: "ClassSphere guarantees 99.9% uptime and provides automated backup protocols to ensure that no student work is ever lost due to system failure." }
         ].map((item, i) => (
           <div key={i} className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-1 text-teal-600">{item.icon}</div>
              <div className="md:col-span-11 space-y-6">
                 <h3 className="text-4xl font-black text-gray-900">Article 0{i+1}: {item.title}</h3>
                 <p className="text-2xl text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </div>
           </div>
         ))}
      </section>

      {/* ACCEPTANCE BLOCK */}
      <section className="py-32 bg-gray-50 border-y border-gray-100 px-6">
         <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-widest">Acknowledgment</h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light italic">"We understand that technology is a tool, not a replacement for the human connection that defines great education. We agree to use ClassSphere to elevate that connection."</p>
            <div className="pt-8">
               <button className="bg-teal-600 text-white px-16 py-6 rounded-full font-black text-2xl shadow-xl hover:scale-105 transition-all">Accept & Enter Platform</button>
            </div>
         </div>
      </section>

      {/* FINAL QUOTE */}
      <section className="py-48 px-6 text-center bg-white">
         <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-sm">Legally Binding Charter</p>
            <p className="text-gray-400 font-medium">For inquiries regarding custom institutional service level agreements (SLAs), please contact our legal department at <span className="text-teal-600">legal@classsphere.com</span></p>
         </div>
      </section>
    </div>
  );
}
