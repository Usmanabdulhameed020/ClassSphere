import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileLock, Eye, UserX, Database, Globe, Scale, ScrollText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/20 mb-8"
          >
            <Eye className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none"
          >
            Absolute <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">DISCRETION.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-400 max-w-5xl mx-auto font-light leading-relaxed"
          >
            We believe that privacy is a human right, especially in the context of learning. Our platform is built to disappear when it comes to your personal data.
          </motion.p>
        </div>
      </section>

      {/* PRIVACY PRINCIPLES */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="grid lg:grid-cols-3 gap-12">
            {[
              { icon: <UserX />, title: "Identity Shielding", desc: "Student names are decoupled from behavioral data in our core processing engine, ensuring that learning insights never compromise anonymity." },
              { icon: <Database />, title: "Zero Data-Selling", desc: "We are an educational partner, not an advertising network. Your institutional data is never sold, traded, or used for external profit." },
              { icon: <FileLock />, title: "Institutional Ownership", desc: "You own the data. We merely act as the secure vault. You can withdraw and delete your records at any time." }
            ].map((item, i) => (
              <div key={i} className="space-y-8 p-16 bg-gray-50 rounded-[60px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group text-center">
                 <div className="text-teal-600 mx-auto w-12 h-12">{item.icon}</div>
                 <h3 className="text-3xl font-black text-gray-900">{item.title}</h3>
                 <p className="text-xl text-gray-600 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* TRANSPARENCY ROW */}
      <section className="py-32 bg-slate-50 border-y border-gray-100 px-6">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">Radical <br />Transparency.</h2>
               <p className="text-2xl text-gray-600 font-light leading-relaxed">Our privacy logs are open to institutional audits. We provide a real-time dashboard showing exactly how and where your data is being processed.</p>
               <div className="space-y-8">
                  {[
                    "Full Data Processing Logs",
                    "Third-Party Access Audits",
                    "Automated Privacy Impact Scores",
                    "Encryption Key Rotation Status"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-6 text-xl font-bold text-gray-800">
                       <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                       {text}
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-white rounded-[80px] shadow-2xl p-12 md:p-24 relative overflow-hidden">
               <div className="space-y-8">
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-24 bg-teal-50 border border-teal-100 rounded-3xl p-6 flex items-center justify-center text-teal-600 font-black">PRIVACY SCORE: 99.8%</div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL QUOTE */}
      <section className="py-48 px-6 text-center bg-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-600 mb-8">
               <ScrollText className="w-10 h-10" />
            </div>
            <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">Privacy is <br /><span className="text-teal-600 underline">Pedagogical.</span></h2>
            <p className="text-2xl text-gray-500 font-light max-w-3xl mx-auto">When students feel safe, they take more risks. When they take more risks, they learn more. We protect that safety.</p>
            <div className="pt-12">
               <button className="bg-gray-900 text-white px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-all">Download Privacy Framework</button>
            </div>
         </div>
      </section>
    </div>
  );
}
