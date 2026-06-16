import React from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Quote, Sparkles, Zap, MessageCircle, FileText, Search, Library } from 'lucide-react';

export default function NotebookLM() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-teal-50/50">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white border border-teal-100 rounded-[32px] flex items-center justify-center mx-auto shadow-xl mb-8"
          >
            <BookMarked className="text-teal-600 w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[9rem] font-black text-slate-900 tracking-tighter leading-none"
          >
            Grounded <br /><span className="text-teal-600 italic">Genius.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-600 max-w-5xl mx-auto font-light leading-relaxed"
          >
            NotebookLM turns your static class materials into a living, conversational environment. No hallucinations—just your curriculum, amplified.
          </motion.p>
        </div>
      </section>

      {/* THE DIFFERENCE - COMPARISON */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-12">
              <h2 className="text-5xl font-black text-gray-900">Why Grounding <br />is Everything.</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light">General purpose AI is trained on the entire internet, which often leads to inaccurate or irrelevant answers for students. NotebookLM is locked into your specific sources.</p>
              <div className="space-y-6">
                {[
                  { title: "Source-Cited Answers", desc: "Every response includes a direct link and quote from the uploaded textbook or lecture note." },
                  { title: "Zero Hallucination", desc: "If it's not in your material, the AI won't make it up. It stays within the boundaries you set." },
                  { title: "Custom Terminologies", desc: "The AI adopts your department's specific definitions and nomenclature instantly." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-8 border border-gray-100 rounded-3xl hover:bg-teal-50 transition-colors">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600 shrink-0"><Sparkles className="w-5 h-5" /></div>
                     <div>
                        <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                        <p className="text-gray-500">{item.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>
           <div className="relative">
              <div className="bg-gray-900 rounded-[60px] aspect-[4/5] overflow-hidden shadow-2xl p-1">
                 <div className="h-full w-full bg-white rounded-[58px] p-12 space-y-8 flex flex-col">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                       <Library className="text-teal-600" />
                       <span className="font-bold text-gray-400 text-sm">Source: Bio_Unit_4.pdf</span>
                    </div>
                    <div className="flex-1 space-y-6">
                       <div className="bg-slate-50 p-6 rounded-2xl max-w-[80%]">
                          <p className="text-sm font-medium text-gray-600 uppercase tracking-widest mb-2">Student</p>
                          <p className="text-gray-800 font-bold">How does the mitochondria produce ATP according to chapter 4?</p>
                       </div>
                       <div className="bg-teal-50 p-6 rounded-2xl ml-auto max-w-[80%] border border-teal-100">
                          <p className="text-sm font-medium text-teal-600 uppercase tracking-widest mb-2">NotebookLM</p>
                          <p className="text-gray-800 font-medium">According to page 112, the process involves the electron transport chain where oxygen acts as the final electron acceptor. [Source: Page 112, Para 2]</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FEATURE TILES */}
      <section className="py-32 bg-gray-50 px-6">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <MessageCircle />, title: "Ask Anything", desc: "Students can chat with their textbooks like a study partner." },
              { icon: <FileText />, title: "Auto-Summarize", desc: "Instantly create 1-page cheat sheets from 50-page research papers." },
              { icon: <Search />, title: "Cross-Reference", desc: "Find connections between different lectures and reading assignments." },
              { icon: <Zap />, title: "Concept Quizzing", desc: "Generate self-assessment questions based on the uploaded notes." }
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
                 <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-8 group-hover:scale-110 transition-transform">
                    {card.icon}
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">{card.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* FINAL MASSIVE CTA */}
      <section className="py-48 bg-white text-center px-6">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter">Your Material. <br /><span className="text-teal-600 underline">AI Powered.</span></h2>
            <p className="text-2xl text-gray-500 font-light">Deploy NotebookLM across your department and see the engagement gap close instantly.</p>
            <div className="pt-8">
               <button className="bg-gray-900 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-all">Upload Your First Source</button>
            </div>
         </div>
      </section>
    </div>
  );
}
