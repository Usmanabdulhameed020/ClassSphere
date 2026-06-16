import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Landmark, Scale, ClipboardCheck, BookOpen, UserCheck, ScrollText } from 'lucide-react';

export default function Compliance() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-teal-100 mb-8"
          >
            <Landmark className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-none"
          >
            Regulatory <br /><span className="text-teal-600">CERTITUDE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-500 max-w-5xl mx-auto font-light leading-relaxed"
          >
            ClassSphere is engineered from the ground up to meet and exceed the world's most stringent educational data protection laws.
          </motion.p>
        </div>
      </section>

      {/* COMPLIANCE STANDARDS GRID */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="grid md:grid-cols-2 gap-12">
            {[
              { title: "FERPA Compliance", desc: "The Family Educational Rights and Privacy Act. We provide granular access controls that allow institutions to strictly manage who can view student educational records.", icon: <UserCheck /> },
              { title: "COPPA Compliance", desc: "Children's Online Privacy Protection Act. Our platform includes specialized 'Under-13' modes that disable data collection and social features by default.", icon: <ShieldCheck /> },
              { title: "GDPR Excellence", desc: "For our European partners, we offer full 'Right to be Forgotten' automation and localized data residency within EU clusters.", icon: <Scale /> },
              { title: "SOC 2 Type II", desc: "ClassSphere undergoes annual independent audits to verify our security, availability, and processing integrity at a granular level.", icon: <ClipboardCheck /> }
            ].map((box, i) => (
              <div key={i} className="p-16 rounded-[60px] border border-gray-100 bg-white hover:shadow-2xl transition-all space-y-6">
                 <div className="text-teal-600 w-12 h-12">{box.icon}</div>
                 <h3 className="text-3xl font-black text-gray-900">{box.title}</h3>
                 <p className="text-xl text-gray-600 font-light leading-relaxed">{box.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* DATA GOVERNANCE DEEP DIVE */}
      <section className="py-32 bg-slate-900 text-white px-6">
         <div className="max-w-5xl mx-auto space-y-16">
            <h2 className="text-5xl md:text-7xl font-black text-center">Data Governance <br /><span className="text-teal-400">Framework.</span></h2>
            <div className="space-y-12">
               {[
                 { title: "Automated Impact Assessments", desc: "Every software update is automatically scanned against our regulatory framework to ensure no compliance regressions." },
                 { title: "Data Portability", desc: "Institutions retain 100% ownership. Export your entire dataset in standardized formats (LTI/OneRoster) at any time." },
                 { title: "Incident Response", desc: "Our 24/7 dedicated legal and security response team ensures rapid transparency and mitigation in any anomaly event." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-12 items-start border-b border-white/10 pb-12">
                    <span className="text-3xl font-black text-slate-800">0{i+1}</span>
                    <div className="space-y-4">
                       <h4 className="text-2xl font-bold text-teal-400">{item.title}</h4>
                       <p className="text-xl text-slate-400 font-light">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FINAL QUOTE */}
      <section className="py-48 px-6 text-center bg-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-600 mb-8">
               <ScrollText className="w-10 h-10" />
            </div>
            <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">Your Trust is Our <br /><span className="text-teal-600 underline">Foundational Code.</span></h2>
            <p className="text-2xl text-gray-500 font-light">View our full transparency report and current system status.</p>
            <div className="pt-8">
               <button className="bg-gray-900 text-white px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-all">Institutional Compliance Dashboard</button>
            </div>
         </div>
      </section>
    </div>
  );
}
