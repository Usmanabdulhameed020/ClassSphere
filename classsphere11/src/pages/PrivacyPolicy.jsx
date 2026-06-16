import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, UserCheck, Scale, ScrollText, Download, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <ShieldCheck className="text-teal-600 w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-none"
          >
            Privacy <br /><span className="text-teal-600">MANIFESTO.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-slate-500 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Last Updated: June 5, 2026. This isn't just a legal requirement; it's our foundational promise to the students and educators who trust us with their journey.
          </motion.p>
        </div>
      </section>

      {/* POLICY CONTENT - LARGE BLOCKS */}
      <section className="py-32 px-6 max-w-5xl mx-auto space-y-24">
         <div className="grid md:grid-cols-12 gap-12 border-b border-gray-100 pb-12">
            <div className="md:col-span-4"><h3 className="text-2xl font-black uppercase tracking-widest text-teal-600">01. Intent</h3></div>
            <div className="md:col-span-8 space-y-6 text-xl text-gray-600 leading-relaxed font-light">
               <p>We collect data solely to facilitate and improve the educational experience. We do not engage in behavioral advertising, profile students for non-educational purposes, or sell data to third-party brokers.</p>
               <p>Every piece of data gathered has a clear pedagogical purpose, which is documented and auditable by institutional administrators.</p>
            </div>
         </div>

         <div className="grid md:grid-cols-12 gap-12 border-b border-gray-100 pb-12">
            <div className="md:col-span-4"><h3 className="text-2xl font-black uppercase tracking-widest text-teal-600">02. Collection</h3></div>
            <div className="md:col-span-8 space-y-8">
               {[
                 { title: "Educational Records", desc: "Grades, assignments, and feedback loops are stored in encrypted enclaves owned by the institution." },
                 { title: "Interaction Metadata", desc: "We analyze how students engage with content (speed, repetition, stalls) to fuel our Insights Engine." },
                 { title: "Communications", desc: "Private class chats and Gem interactions are end-to-end encrypted and never monitored by ClassSphere staff." }
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <h4 className="text-2xl font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xl text-gray-500 font-light">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="grid md:grid-cols-12 gap-12 border-b border-gray-100 pb-12">
            <div className="md:col-span-4"><h3 className="text-2xl font-black uppercase tracking-widest text-teal-600">03. Rights</h3></div>
            <div className="md:col-span-8 space-y-6 text-xl text-gray-600 leading-relaxed font-light">
               <p>Students and families have the absolute right to view, port, and request the deletion of their personal data, subject to institutional record-retention policies.</p>
               <div className="bg-teal-50 p-8 rounded-3xl border border-teal-100 flex items-center gap-6">
                  <Download className="text-teal-600 shrink-0" />
                  <span className="text-teal-900 font-bold">Download Data Request Form</span>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL CALLOUT */}
      <section className="py-48 bg-slate-900 text-white text-center px-6">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl font-black">Transparency is <span className="text-teal-400">Total.</span></h2>
            <p className="text-2xl text-slate-400 font-light">Questions about our privacy framework? Our legal and ethical compliance team is available for direct consultation.</p>
            <div className="pt-12">
               <button className="bg-white text-slate-900 px-16 py-6 rounded-full font-black text-2xl hover:bg-teal-600 hover:text-white transition-all">Speak with Compliance</button>
            </div>
         </div>
      </section>
    </div>
  );
}
