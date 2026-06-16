import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, BookOpen, Users, BarChart, ShieldCheck } from 'lucide-react';

export default function ClassSphereAI() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-gradient-to-br from-teal-50 via-white to-white">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-teal-200 mb-8"
          >
            <Brain className="text-white w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none"
          >
            Cognitive <span className="text-teal-600">Amplification.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed"
          >
            ClassSphere AI isn't just a tool; it's a pedagogical partner designed to augment the human element of teaching, not replace it.
          </motion.p>
        </div>
        {/* Background Graphic elements */}
        <div className="absolute top-1/2 left-0 w-full h-[500px] bg-teal-50/30 -skew-y-6 -z-0 translate-y-24"></div>
      </section>

      {/* SECTION 1: THE CORE PILLARS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Reclaiming the <br />
              <span className="text-teal-600">Joy of Teaching.</span>
            </h2>
            <div className="space-y-8">
              {[
                { icon: <Sparkles className="text-teal-600" />, title: "Automated Lesson Scaffolding", desc: "Generate multi-level lesson plans based on any document, instantly aligned to common core standards." },
                { icon: <BookOpen className="text-teal-600" />, title: "Contextual Content Creation", desc: "Turn raw research into engaging classroom narratives, quizzes, and interactive study guides." },
                { icon: <Users className="text-teal-600" />, title: "Personalized Coaching", desc: "Every student receives AI-driven feedback that mirrors your unique teaching voice and expectations." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-900 aspect-square rounded-[60px] overflow-hidden shadow-2xl relative">
               <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200" alt="Learning" className="object-cover w-full h-full opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-12">
                     <div className="text-6xl font-black mb-4">85%</div>
                     <p className="text-xl font-medium text-teal-300 uppercase tracking-widest">Reduction in Admin Load</p>
                  </div>
               </div>
            </div>
            {/* Floating Element */}
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-sm">
              <p className="text-gray-900 font-bold italic">"For the first time in a decade, I'm spending more time with my students and less time with spreadsheets."</p>
              <p className="mt-4 text-sm text-gray-500 font-bold">— Dr. Elena Vance, Department Head</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DEEP DIVE */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-5xl font-black text-gray-900">How it Transforms the Classroom</h2>
            <p className="text-xl text-gray-600">We've integrated AI at every touchpoint of the learning lifecycle.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { label: "01", title: "Ingestion", desc: "Feed the AI your raw materials—videos, PDFs, or handwritten notes. It understands the underlying concepts." },
              { label: "02", title: "Synthesis", desc: "The engine creates a logical flow of learning, identifying prerequisites and potential misconceptions." },
              { label: "03", title: "Evolution", desc: "As students interact, the content morphs to meet their speed, ensuring no one is left behind or bored." }
            ].map((box, i) => (
              <div key={i} className="space-y-6 bg-white p-12 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
                <span className="text-7xl font-black text-teal-100 group-hover:text-teal-600 transition-colors">{box.label}</span>
                <h3 className="text-2xl font-bold text-gray-900">{box.title}</h3>
                <p className="text-gray-600 leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: SCALE & IMPACT */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="bg-teal-600 rounded-[60px] p-12 md:p-24 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black leading-tight">Ready to activate <br />intelligence in your institution?</h2>
              <p className="text-xl text-teal-100 leading-relaxed">Join over 1,200 universities already using ClassSphere AI to redefine the educational experience for their faculty and students.</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-white text-teal-600 px-10 py-5 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform">Get Started Free</button>
                <button className="bg-teal-700 text-white px-10 py-5 rounded-full font-black text-lg border border-teal-500">Contact Sales</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {[
                { val: "12M+", label: "Tasks Automated" },
                { val: "94%", label: "Teacher Satisfaction" },
                { val: "22%", label: "Gains in Engagement" },
                { val: "180+", label: "Languages Supported" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="text-4xl font-black mb-2">{stat.val}</div>
                  <div className="text-sm font-bold text-teal-200 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL MASSIVE QUOTE */}
      <section className="py-48 px-6 text-center bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <p className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight italic">
            "ClassSphere AI isn't about teaching students what to think, but giving them the tools to explore how they think."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 overflow-hidden">
               <img src="https://i.pravatar.cc/100?img=32" alt="Educator" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-xl">Prof. Sarah Jenkins</p>
              <p className="text-gray-500 font-medium">Director of Digital Learning, Stanford Innovation Lab</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
