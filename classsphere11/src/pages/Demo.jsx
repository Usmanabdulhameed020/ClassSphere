import React from 'react';
import { motion } from 'framer-motion';
import { Play, Monitor, Layers, Zap, Clock, Users, ArrowRight, Shield } from 'lucide-react';

export default function Demo() {
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
            <Play className="text-white w-10 h-10 fill-current" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none"
          >
            Live <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">SANDBOX.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-400 max-w-5xl mx-auto font-light leading-relaxed"
          >
            Don't just take our word for it. Step into a pre-configured ClassSphere environment and experience the future of pedagogy firsthand.
          </motion.p>
        </div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.15)_0%,transparent_70%)]"></div>
      </section>

      {/* THE DEMO ENVIRONMENT SELECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-24">
         <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-gray-900">Choose Your Perspective.</h2>
            <p className="text-xl text-gray-500 font-light">Select a role to see how ClassSphere adapts to your specific needs.</p>
         </div>

         <div className="grid lg:grid-cols-2 gap-12">
            {[
              { role: "The Instructor", title: "Course Architect", desc: "Build a unit on 'Quantum Mechanics' in under 3 minutes using AI lesson scaffolding and real-time resource syncing.", color: "bg-teal-600" },
              { role: "The Student", title: "Mastery Journey", desc: "Interact with the student path, chat with a Chemistry Gem, and see how personalized tracks reduce learning anxiety.", color: "bg-slate-900" }
            ].map((box, i) => (
              <div key={i} className="group relative overflow-hidden rounded-[60px] aspect-square flex flex-col justify-end p-16 text-white shadow-2xl transition-all hover:scale-[1.02]">
                 <div className={`absolute inset-0 ${box.color} transition-all group-hover:scale-110`}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div className="relative z-10 space-y-6">
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-teal-400">{box.role}</span>
                    <h3 className="text-5xl font-black">{box.title}</h3>
                    <p className="text-xl text-slate-200 font-light leading-relaxed">{box.desc}</p>
                    <button className="bg-white text-gray-900 px-10 py-5 rounded-full font-black flex items-center gap-4 group/btn">
                       Launch This Demo <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* INTERACTIVE FEATURE HIGHLIGHTS */}
      <section className="py-32 bg-gray-50 px-6">
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { icon: <Monitor />, title: "Dual-Screen View", desc: "Experience how the teacher's helm and student's path sync perfectly in real-time." },
              { icon: <Layers />, title: "AI Scaffold Demo", desc: "Upload a sample PDF and watch the engine generate a 4-week curriculum map." },
              { icon: <Zap />, title: "Live Telemetry", desc: "See mock student data pulse into the Insights Engine as assignments are 'completed'." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[40px] border border-gray-100 space-y-6 shadow-sm hover:shadow-xl transition-all">
                 <div className="text-teal-600">{item.icon}</div>
                 <h4 className="text-2xl font-bold text-gray-900">{item.title}</h4>
                 <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* FINAL MASSIVE CTA */}
      <section className="py-48 bg-white text-center px-6">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">Ready for a <br /><span className="text-teal-600 underline">Private Guided Tour?</span></h2>
            <p className="text-2xl text-gray-500 font-light">Our educational engineers are available for 1-on-1 walkthroughs tailored to your department's specific curriculum needs.</p>
            <div className="pt-12">
               <button className="bg-teal-600 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:bg-slate-900 transition-all">Schedule a Guided Demo</button>
            </div>
         </div>
      </section>
    </div>
  );
}
