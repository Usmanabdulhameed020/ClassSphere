import React from 'react';
import { motion } from 'framer-motion';
import { Layout, CheckCircle2, Zap, Smartphone, Globe, Shield, ArrowRight, Activity, Users, MessageSquare } from 'lucide-react';

export default function Services() {
  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans antialiased selection:bg-teal-100 overflow-x-hidden">
      
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-32 md:py-56 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/20 mb-8"
          >
            <Layout className="text-white w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-8"
          >
            The Service <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">PIPELINE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-slate-400 max-w-5xl mx-auto font-light leading-relaxed"
          >
            From the initial ingestion of curriculum to the final assessment loop, our services are optimized for pedagogical speed and student mastery.
          </motion.p>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </section>

      {/* SERVICE PILLARS - LARGE GRID */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {[
            { icon: <Activity className="text-teal-600" />, title: "Curriculum Ingestion", desc: "Automated mapping of complex syllabi and source materials into actionable learning milestones using our proprietary neural engine." },
            { icon: <Users className="text-teal-600" />, title: "Cohort Management", desc: "Massive-scale student roster syncing with institutional SIS, providing granular control over learning tracks and pace." },
            { icon: <MessageSquare className="text-teal-600" />, title: "Collaborative Feedback", desc: "Real-time, context-aware communication channels between educators and students, grounded in course materials." },
            { icon: <Shield className="text-teal-600" />, title: "Secure Assessments", desc: "A tamper-proof environment for high-stakes testing, featuring AI-driven integrity monitoring and biometric verification." }
          ].map((item, i) => (
            <div key={i} className="p-16 rounded-[60px] border border-gray-100 bg-white hover:shadow-2xl transition-all space-y-8 group">
              <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-4xl font-black text-gray-900">{item.title}</h3>
              <p className="text-xl text-gray-500 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE INFOGRAPHIC ROW */}
      <section className="py-32 bg-gray-50 border-y border-gray-100 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">Omni-Channel <br /><span className="text-teal-600">Access.</span></h2>
            <p className="text-2xl text-gray-600 font-light leading-relaxed">The classroom isn't just a physical room. Our services extend across all student touchpoints, ensuring consistency everywhere.</p>
            <div className="space-y-6">
              {[
                { icon: <Smartphone />, text: "Native iOS & Android Applications" },
                { icon: <Globe />, text: "Web-Based Command Center" },
                { icon: <Zap />, text: "Offline Mastery Mode" }
              ].map((li, i) => (
                <div key={i} className="flex items-center gap-6 text-xl font-bold text-gray-800">
                  <div className="text-teal-600">{li.icon}</div>
                  {li.text}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/10 blur-[120px] rounded-full translate-x-24"></div>
            <div className="relative bg-white rounded-[80px] shadow-2xl p-16 space-y-12 border border-gray-100">
               <div className="h-4 bg-gray-100 rounded w-1/2"></div>
               <div className="grid grid-cols-3 gap-8">
                  {[1,2,3].map(i => <div key={i} className="h-24 bg-teal-50 rounded-3xl"></div>)}
               </div>
               <div className="h-4 bg-gray-100 rounded w-3/4"></div>
               <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-48 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none">Elevate Your <br /><span className="text-teal-600 underline">Ecosystem.</span></h2>
          <p className="text-2xl text-gray-500 font-light">Deploy ClassSphere services and join the thousands of institutions transforming how education happens.</p>
          <div className="pt-12">
            <button className="bg-slate-900 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:bg-teal-600 transition-all">Start Your Implementation</button>
          </div>
        </div>
      </section>
    </div>
  );
}
