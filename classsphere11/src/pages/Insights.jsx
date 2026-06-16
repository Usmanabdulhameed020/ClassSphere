import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Target, Zap, Users, BarChart3, PieChart, Layout, Activity } from 'lucide-react';

export default function Insights() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-gradient-to-tr from-slate-900 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 px-6 py-2 rounded-full border border-teal-500/30 text-sm font-black uppercase tracking-widest"
          >
            <TrendingUp className="w-4 h-4" />
            The Predictive Advantage
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-8"
          >
            Insights <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-100">ENGINE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Turn educational data into educational impact. Stop guessing who is struggling and start knowing exactly why.
          </motion.p>
        </div>
        
        {/* Animated background data lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
           <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent translate-y-12"></div>
           <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
           <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent -translate-y-12"></div>
        </div>
      </section>

      {/* METRICS SHOWCASE */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {[
            { icon: <Target />, title: "Precision Remediation", desc: "Identify the exact sentence in a textbook that caused a comprehension drop across the entire cohort." },
            { icon: <Zap />, title: "Real-time Telemetry", desc: "Watch engagement metrics pulse in real-time during your lecture, allowing for instant pivot in delivery." },
            { icon: <Users />, title: "Social Learning Dynamics", desc: "Analyze peer-to-peer interaction patterns to identify natural leaders and isolated students." }
          ].map((item, i) => (
            <div key={i} className="space-y-6 p-12 bg-gray-50 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE PREDICTIVE DASHBOARD PREVIEW */}
      <section className="py-32 bg-slate-50 border-y border-gray-100 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-24 items-center">
           <div className="lg:col-span-5 space-y-8">
              <h2 className="text-5xl font-black text-gray-900 leading-tight">A Dashboard that <br />Acts as a Radar.</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light">While other platforms show you historical grades, we show you the future. Our engine spots "learning fatigue" before it leads to a single missed assignment.</p>
              <div className="space-y-6">
                {[
                  { label: "Concept Clarity Score", val: 88 },
                  { label: "Cohort Velocity", val: 72 },
                  { label: "Engagement Persistence", val: 94 }
                ].map((bar, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-gray-700">
                       <span>{bar.label}</span>
                       <span>{bar.val}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${bar.val}%` }}
                         transition={{ duration: 1.5, delay: i * 0.2 }}
                         className="h-full bg-teal-500 rounded-full"
                       ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
           <div className="lg:col-span-7 bg-white p-8 md:p-16 rounded-[60px] shadow-2xl border border-gray-100 space-y-12">
              <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600"><Activity className="w-6 h-6" /></div>
                    <h4 className="font-bold text-gray-900">Weekly Performance Curve</h4>
                 </div>
                 <select className="bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold border-none outline-none">
                    <option>Unit 3: Applied Physics</option>
                 </select>
              </div>
              {/* Abstract Graph */}
              <div className="h-64 flex items-end gap-4 px-4">
                 {[40, 60, 45, 90, 80, 55, 100, 85].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     whileInView={{ height: `${h}%` }}
                     transition={{ duration: 1, delay: i * 0.1 }}
                     className={`flex-1 rounded-t-2xl ${h === 100 ? 'bg-teal-500' : 'bg-slate-100'}`}
                   ></motion.div>
                 ))}
              </div>
              <div className="p-8 bg-teal-50 rounded-3xl border border-teal-100 text-teal-900 font-bold">
                 ⚡ Insight: 14 students are struggling with "Centripetal Force" - Recommend review session before Friday.
              </div>
           </div>
        </div>
      </section>

      {/* FINAL QUOTE & CTA */}
      <section className="py-48 text-center px-6">
         <div className="max-w-5xl mx-auto space-y-16">
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none">Know More. <br />Teach Better.</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8">
               <button className="bg-teal-600 text-white px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-700 transition-all hover:scale-105">Request Trial Access</button>
               <button className="bg-white text-gray-900 border-2 border-gray-200 px-16 py-6 rounded-full font-black text-2xl hover:bg-gray-50 transition-all">View Sample Reports</button>
            </div>
         </div>
      </section>
    </div>
  );
}
