import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, Globe, Building, Users, Clock, Send, MapPin, ArrowRight } from 'lucide-react';

export default function Sales() {
  return (
    <div className="pt-24 min-h-screen bg-white font-sans antialiased selection:bg-teal-100">
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12 text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-100 mb-8"
            >
              <Building className="text-white w-10 h-10" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-[0.9]"
            >
              Talk to <br /><span className="text-teal-600 italic">Strategy.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-slate-500 font-light leading-relaxed"
            >
              Our institutional specialists are ready to help you design a deployment strategy that fits your campus scale and pedagogical goals.
            </motion.p>
          </div>
          <div className="bg-white rounded-[80px] p-12 md:p-24 shadow-2xl border border-gray-100 space-y-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-full h-full bg-teal-600/5 -skew-y-12"></div>
             <h3 className="text-4xl font-black text-gray-900 relative z-10">Get in touch.</h3>
             <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">First Name</label>
                      <input type="text" className="w-full bg-gray-50 border-b-2 border-gray-200 py-4 px-2 outline-none focus:border-teal-600 transition-colors" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Last Name</label>
                      <input type="text" className="w-full bg-gray-50 border-b-2 border-gray-200 py-4 px-2 outline-none focus:border-teal-600 transition-colors" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-gray-400">Institutional Email</label>
                   <input type="email" className="w-full bg-gray-50 border-b-2 border-gray-200 py-4 px-2 outline-none focus:border-teal-600 transition-colors" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-gray-400">How can we help?</label>
                   <textarea className="w-full bg-gray-50 border-b-2 border-gray-200 py-4 px-2 outline-none focus:border-teal-600 transition-colors h-32"></textarea>
                </div>
                <button className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-teal-600 transition-all flex items-center justify-center gap-4">
                   Send Message <Send className="w-6 h-6" />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* CONTACT CHANNELS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="grid lg:grid-cols-3 gap-12">
            {[
              { icon: <Phone />, title: "Institutional Hotline", detail: "+1 (800) CLS-SPHR", desc: "Direct access for department heads and IT directors." },
              { icon: <Mail />, title: "General Inquiries", detail: "hello@classsphere.com", desc: "Expect a response from our education team within 4 hours." },
              { icon: <MapPin />, title: "HQ Strategy Center", detail: "Palo Alto, CA", desc: "Visit us for a deep-dive workshop on digital transformation." }
            ].map((item, i) => (
              <div key={i} className="p-16 rounded-[60px] border border-gray-100 flex flex-col items-center text-center space-y-6 hover:shadow-2xl transition-all">
                 <div className="text-teal-600 w-12 h-12">{item.icon}</div>
                 <h4 className="text-2xl font-black text-gray-900">{item.title}</h4>
                 <p className="text-teal-600 font-bold text-xl">{item.detail}</p>
                 <p className="text-gray-500 font-light">{item.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* GLOBAL SALES FOOTPRINT */}
      <section className="py-32 bg-slate-900 text-white px-6">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
               <h2 className="text-5xl font-black leading-tight">Global Support <br /><span className="text-teal-400">Local Presence.</span></h2>
               <p className="text-xl text-slate-400 font-light leading-relaxed">With strategy centers in London, Singapore, and New York, our team understands the local nuances of global educational markets.</p>
               <div className="flex gap-12 pt-8">
                  <div>
                     <div className="text-4xl font-black">24h</div>
                     <p className="text-slate-500 text-sm font-bold uppercase mt-2">Response Guarantee</p>
                  </div>
                  <div>
                     <div className="text-4xl font-black">120+</div>
                     <p className="text-slate-500 text-sm font-bold uppercase mt-2">Specialists Globally</p>
                  </div>
               </div>
            </div>
            <div className="bg-slate-800 rounded-[60px] aspect-square relative overflow-hidden group">
               <div className="absolute inset-0 bg-teal-500/10 animate-pulse"></div>
               <div className="absolute inset-16 border-2 border-dashed border-slate-700 rounded-full animate-[spin_60s_linear_infinite]"></div>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-48 text-center px-6">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">Your Future <br />Starts with a <span className="text-teal-600 underline">Hello.</span></h2>
            <div className="pt-8">
               <button className="bg-teal-600 text-white px-20 py-8 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all">Request a Strategy Call</button>
            </div>
         </div>
      </section>
    </div>
  );
}
