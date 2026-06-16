import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Heart, User, Star, Smile, Award, ShieldCheck, Zap } from 'lucide-react';

export default function Gems() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl mb-8 animate-pulse"
          >
            <Gem className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black text-slate-900 tracking-tighter leading-[0.85] mb-8"
          >
            The Persona <br /><span className="text-teal-600 italic">Protocol.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-slate-500 max-w-4xl mx-auto font-light leading-relaxed"
          >
            ClassSphere Gems are custom-designed AI experts tailored to your specific teaching style and subject matter. Imagine a dedicated tutor for every student.
          </motion.p>
        </div>
      </section>

      {/* THREE PERSONA TYPES */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="grid lg:grid-cols-3 gap-12">
            {[
              { type: "The Socratic Mentor", desc: "Never gives the answer directly. Instead, asks leading questions that guide students toward self-discovery of complex concepts.", color: "bg-teal-50 text-teal-600" },
              { type: "The Practical Engineer", desc: "Focuses on real-world applications. Explains physics through bridges and history through modern geopolitical shifts.", color: "bg-teal-50 text-teal-600" },
              { type: "The Creative Muse", desc: "Helps students break through writer's block or artistic ruts by offering diverse inspiration and safe experimentation.", color: "bg-teal-50 text-teal-600" }
            ].map((gem, i) => (
              <div key={i} className="p-16 rounded-[60px] border border-gray-100 flex flex-col items-center text-center space-y-8 hover:shadow-2xl transition-all">
                 <div className={`w-24 h-24 ${gem.color} rounded-full flex items-center justify-center`}>
                    <User className="w-10 h-10" />
                 </div>
                 <h3 className="text-3xl font-black text-gray-900">{gem.type}</h3>
                 <p className="text-gray-500 leading-relaxed font-light">{gem.desc}</p>
                 <button className="text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-8 decoration-teal-500 text-teal-600">Configure this Gem</button>
              </div>
            ))}
         </div>
      </section>

      {/* IMMERSIVE FEATURE ROW */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <h2 className="text-5xl md:text-7xl font-black leading-tight">Infinitely <br /><span className="text-teal-400">Patient.</span></h2>
               <p className="text-2xl text-slate-400 font-light leading-relaxed">Unlike human tutors, Gems never tire. A student can ask the same question in 50 different ways, and the Gem will patiently adapt its explanation every single time.</p>
               <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <Heart className="text-teal-400 w-10 h-10" />
                     <h4 className="text-2xl font-bold">Empathetic Design</h4>
                     <p className="text-slate-500 text-sm">Gems detect frustration in student prompts and adjust their tone to be more encouraging.</p>
                  </div>
                  <div className="space-y-4">
                     <Award className="text-teal-400 w-10 h-10" />
                     <h4 className="text-2xl font-bold">Goal Oriented</h4>
                     <p className="text-slate-500 text-sm">Every interaction is mapped back to your course's learning objectives.</p>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-teal-500/20 blur-[100px] rounded-full"></div>
               <div className="relative bg-slate-800 border border-slate-700 rounded-[60px] p-12 space-y-10">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xl"><Smile className="w-8 h-8" /></div>
                     <div>
                        <h4 className="text-xl font-bold italic text-white">"Chemistry Gem"</h4>
                        <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Active Assistant</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-4 bg-slate-700 rounded w-full"></div>
                     <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                     <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  </div>
                  <div className="pt-8 flex justify-between items-center">
                     <div className="flex -space-x-4">
                        {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-600"></div>)}
                     </div>
                     <span className="text-teal-400 font-bold">8.4k Active Students</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL IMPACT SECTION */}
      <section className="py-48 px-6 text-center max-w-5xl mx-auto space-y-16">
         <h2 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">Scale Your <br />Teaching Personality.</h2>
         <p className="text-2xl text-gray-600 font-light max-w-3xl mx-auto">Create a suite of Gems that reflect your institution's values and expertise. One instructor, thousands of personalized sessions.</p>
         <div className="pt-8">
            <button className="bg-teal-600 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all">Build a Gem Prototype</button>
         </div>
      </section>
    </div>
  );
}
