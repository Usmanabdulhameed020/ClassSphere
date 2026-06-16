import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Layers, Link as LinkIcon, Activity, Database, MessageSquare, Video } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-teal-100 mb-8"
          >
            <Cpu className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-[0.9]"
          >
            Structural <br /><span className="text-teal-600">Resilience.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-slate-500 max-w-4xl mx-auto font-light leading-relaxed"
          >
            ClassSphere is built on a foundation of proprietary distributed architecture, ensuring that learning never stops, even at massive scale.
          </motion.p>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-teal-600/5 -skew-x-12 translate-x-24"></div>
      </section>

      {/* THE FOUR LAYERS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">The Ecosystem Stack</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Every layer of our architecture is optimized for educational workflows and data integrity.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {[
            { icon: <Globe className="w-8 h-8 text-teal-600" />, title: "The Interaction Layer", desc: "A high-performance React-based interface optimized for accessibility and low-bandwidth environments, ensuring every student can learn regardless of their hardware." },
            { icon: <Layers className="w-8 h-8 text-teal-600" />, title: "The Intelligence Mesh", desc: "A distributed neural network that processes pedagogical inputs in real-time, generating personalized feedback and lesson scaffolds on the fly." },
            { icon: <Activity className="w-8 h-8 text-teal-600" />, title: "The Telemetry Engine", desc: "Massive parallel processing of student engagement metrics, identifying comprehension gaps using patent-pending predictive algorithms." },
            { icon: <Database className="w-8 h-8 text-teal-600" />, title: "The Persistence Core", desc: "Multi-regional, high-availability storage cluster with AES-256 field-level encryption, providing absolute security for institutional records." }
          ].map((layer, i) => (
            <div key={i} className="flex gap-10 p-12 bg-white border border-gray-100 rounded-[48px] shadow-sm hover:shadow-xl transition-all">
              <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center shrink-0">
                {layer.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-gray-900">{layer.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed font-light">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEEP TECHNICAL SPECS - IMMERSIVE */}
      <section className="py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 space-y-12">
            <h2 className="text-5xl font-black leading-tight">Built for 100% <br /><span className="text-teal-400">Classroom Uptime.</span></h2>
            <div className="space-y-8">
              {[
                { title: "Dynamic Load Balancing", desc: "Automatically scales resources during peak exam periods to ensure zero latency." },
                { icon: <MessageSquare className="w-6 h-6" />, title: "Real-time Sync", desc: "Proprietary sync protocol keeps student and teacher canvases perfectly aligned." },
                { icon: <Video className="w-6 h-6" />, title: "Video Infrastructure", desc: "Native peer-to-peer virtual classrooms with integrated whiteboards." }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-xl font-bold text-teal-400">{item.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-slate-800/50 border border-slate-700 rounded-[60px] p-8 md:p-16 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
               <div className="space-y-12 relative z-10 font-mono">
                  <div className="flex justify-between border-b border-slate-700 pb-4">
                    <span className="text-slate-500 uppercase tracking-widest text-xs">Uptime Metric</span>
                    <span className="text-teal-400 font-bold">99.999%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-4">
                    <span className="text-slate-500 uppercase tracking-widest text-xs">Data Residency</span>
                    <span className="text-teal-400 font-bold">Multi-Region (Local First)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-4">
                    <span className="text-slate-500 uppercase tracking-widest text-xs">Protocol</span>
                    <span className="text-teal-400 font-bold">LTI v1.3 vAdv Compatible</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-4">
                    <span className="text-slate-500 uppercase tracking-widest text-xs">Encryption</span>
                    <span className="text-teal-400 font-bold">AES-256 GCM</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS GRID */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-8 mb-24">
           <h2 className="text-5xl font-black text-gray-900">Seamlessly Pluggable</h2>
           <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
             Our architecture was designed to co-exist. Whether you use Canvas, Moodle, or a custom homegrown SIS, ClassSphere integrates in minutes.
           </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
           {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center grayscale hover:grayscale-0 transition-all group">
                <div className="w-12 h-12 bg-gray-200 rounded-full group-hover:bg-teal-100 transition-colors"></div>
             </div>
           ))}
        </div>
      </section>

      {/* FINAL CALLOUT */}
      <section className="py-48 bg-teal-600 text-white text-center px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-none">Future-Proof Your Campus.</h2>
          <p className="text-2xl text-teal-100 font-light max-w-3xl mx-auto">Scale from 100 students to 1 million without changing a single line of your institutional code.</p>
          <div className="pt-12">
            <button className="bg-white text-teal-600 px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-transform">Download Architecture PDF</button>
          </div>
        </div>
      </section>
    </div>
  );
}
