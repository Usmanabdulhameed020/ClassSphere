import React from 'react';
import { motion } from 'framer-motion';
import { Building2, School, Landmark, GraduationCap, MapPin, Phone, Mail, Globe, Users2 } from 'lucide-react';

export default function Access() {
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
            <Building2 className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[9rem] font-black text-slate-900 tracking-tighter leading-none"
          >
            Institutional <br /><span className="text-teal-600">ONBOARDING.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-slate-500 max-w-5xl mx-auto font-light leading-relaxed"
          >
            Scale ClassSphere across your entire campus or district. Our institutional access program provides the governance and support needed for 10,000+ student deployments.
          </motion.p>
        </div>
      </section>

      {/* TIERS OF ACCESS */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
         {[
           { icon: <School />, title: "K-12 Districts", desc: "Centralized management for multiple schools, COPPA-compliant student privacy, and parent-teacher association tools." },
           { icon: <GraduationCap />, title: "Higher Education", desc: "Massive scale for universities, LTI v1.3 integration for research tools, and alumni engagement portals." },
           { icon: <Landmark />, title: "Government & NGO", desc: "Broad-spectrum educational accessibility for national learning initiatives and non-profit training programs." }
         ].map((tier, i) => (
           <div key={i} className="p-16 rounded-[60px] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all space-y-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-teal-600">{tier.icon}</div>
              <h3 className="text-3xl font-black text-gray-900">{tier.title}</h3>
              <p className="text-lg text-gray-500 leading-relaxed font-light">{tier.desc}</p>
              <button className="bg-gray-50 px-8 py-3 rounded-full font-bold text-sm hover:bg-teal-600 hover:text-white transition-colors uppercase tracking-widest">Enquire Now</button>
           </div>
         ))}
      </section>

      {/* DEPLOYMENT PROCESS */}
      <section className="py-32 bg-slate-900 text-white px-6">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <h2 className="text-5xl md:text-7xl font-black leading-tight">Fast-Track <br /><span className="text-teal-400">Deployment.</span></h2>
               <div className="space-y-12">
                  {[
                    { step: "01", title: "Assessment", desc: "Our specialists analyze your current infrastructure and SIS capabilities." },
                    { step: "02", title: "Configuration", desc: "We build a custom instance of ClassSphere with your branding and governance rules." },
                    { step: "03", title: "Activation", desc: "Staff training and mass-migration of student records with 24/7 hyper-care support." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-8">
                       <span className="text-5xl font-black text-slate-800">{item.step}</span>
                       <div className="space-y-2">
                          <h4 className="text-2xl font-bold">{item.title}</h4>
                          <p className="text-slate-400 font-light">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-slate-800 rounded-[80px] p-12 md:p-24 space-y-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]"></div>
               <h3 className="text-3xl font-black">Direct Inquiry Form</h3>
               <div className="space-y-6">
                  <input type="text" placeholder="Institution Name" className="w-full bg-slate-900 border border-slate-700 p-6 rounded-3xl outline-none focus:border-teal-500 transition-colors" />
                  <div className="grid grid-cols-2 gap-6">
                     <input type="text" placeholder="Contact Name" className="w-full bg-slate-900 border border-slate-700 p-6 rounded-3xl outline-none focus:border-teal-500 transition-colors" />
                     <input type="email" placeholder="Work Email" className="w-full bg-slate-900 border border-slate-700 p-6 rounded-3xl outline-none focus:border-teal-500 transition-colors" />
                  </div>
                  <textarea placeholder="Tell us about your campus scale..." className="w-full bg-slate-900 border border-slate-700 p-6 rounded-3xl h-48 outline-none focus:border-teal-500 transition-colors"></textarea>
                  <button className="w-full bg-teal-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-teal-500 transition-all">Submit Institutional Request</button>
               </div>
            </div>
         </div>
      </section>

      {/* GLOBAL FOOTPRINT */}
      <section className="py-48 px-6 max-w-7xl mx-auto text-center space-y-16">
         <div className="space-y-4">
            <h2 className="text-5xl font-black text-gray-900">A Global Standard.</h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">Used in 42 countries and over 1,200 institutions. From urban public districts to Ivy League research centers.</p>
         </div>
         <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="w-48 h-12 bg-gray-200 rounded-xl"></div>
            ))}
         </div>
      </section>
    </div>
  );
}
