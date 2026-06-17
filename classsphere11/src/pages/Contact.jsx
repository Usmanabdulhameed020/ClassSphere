import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, MessageSquare, Globe, Loader2 } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function Contact() {
  const [subject, setSubject] = useState('General Inquiry');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_BASE_URL}/api/auth/contact`, {
        firstName,
        lastName,
        email,
        subject,
        message
      });
      setSuccess('Your inquiry was successfully transmitted! Check your inbox for confirmation.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transmit message. Please check your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans antialiased selection:bg-teal-100 overflow-x-hidden pt-24">
      
      {/* MASSIVE HERO */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-teal-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-teal-100 mb-8"
          >
            <MessageSquare className="text-white w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[9rem] font-black text-slate-900 tracking-tighter leading-[0.9]"
          >
            Start the <br /><span className="text-teal-600 italic">Conversation.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-slate-500 max-w-4xl mx-auto font-light leading-relaxed"
          >
            Whether you're a single educator or a national department of education, we're here to help you scale your learning vision.
          </motion.p>
        </div>
      </section>

      {/* CONTACT GRID - FORM AND CHANNELS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          
          <div className="space-y-12">
            <h2 className="text-5xl font-black text-gray-900 leading-tight">Reach Our <br /><span className="text-teal-600">Specialists.</span></h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { icon: <Phone />, title: "Voice", detail: "+234 902 8542 607", desc: "Direct institutional hotline." },
                { icon: <Mail />, title: "Email", detail: "classsphere10@gmail.com", desc: "Strategy and support." },
                { icon: <MapPin />, title: "Presence", detail: "Ilorin, Kwara State, Nigeria", desc: "Our global headquarters." },
                { icon: <Globe />, title: "Global", detail: "42 Countries", desc: "Supporting local learning." }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all space-y-4">
                  <div className="text-teal-600">{item.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                  <p className="text-teal-600 font-bold">{item.detail}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[80px] p-12 md:p-24 shadow-2xl relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]"></div>
             <h3 className="text-4xl font-black mb-12 relative z-10">Send a Secure Inquiry</h3>
             
             {success && (
               <div className="mb-8 p-6 bg-teal-950/40 border border-teal-500/30 text-teal-400 rounded-3xl text-sm font-bold relative z-10">
                 {success}
               </div>
             )}
             
             {error && (
               <div className="mb-8 p-6 bg-rose-950/40 border border-rose-500/30 text-rose-400 rounded-3xl text-sm font-bold relative z-10">
                 {error}
               </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-2 border-b border-slate-700 pb-4 text-left">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-500">Subject</label>
                   <select 
                     value={subject}
                     onChange={(e) => setSubject(e.target.value)}
                     className="w-full bg-transparent border-none py-2 text-xl font-bold text-teal-400 outline-none appearance-none cursor-pointer"
                   >
                      <option className="bg-slate-900" value="General Inquiry">General Inquiry</option>
                      <option className="bg-slate-900" value="Technical Support">Technical Support</option>
                      <option className="bg-slate-900" value="Pilot Application">Pilot Application</option>
                      <option className="bg-slate-900" value="Institutional Onboarding">Institutional Onboarding</option>
                   </select>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2 border-b border-slate-700 pb-4 text-left">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">First Name</label>
                      <input 
                        type="text" required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-transparent border-none py-2 text-xl font-bold text-white outline-none" 
                        placeholder="Alex" 
                      />
                   </div>
                   <div className="space-y-2 border-b border-slate-700 pb-4 text-left">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Last Name</label>
                      <input 
                        type="text" required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-transparent border-none py-2 text-xl font-bold text-white outline-none" 
                        placeholder="Rivera" 
                      />
                   </div>
                </div>
                <div className="space-y-2 border-b border-slate-700 pb-4 text-left">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-500">Institutional Email</label>
                   <input 
                     type="email" required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full bg-transparent border-none py-2 text-xl font-bold text-white outline-none" 
                     placeholder="alex@university.edu" 
                   />
                </div>
                <div className="space-y-2 border-b border-slate-700 pb-4 text-left">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-500">Message</label>
                   <textarea 
                     required
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     className="w-full bg-transparent border-none py-2 text-xl font-bold text-white outline-none h-32" 
                     placeholder="Tell us about your learning goals..."
                   ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-slate-900 py-6 rounded-3xl font-black text-xl hover:bg-teal-400 hover:text-slate-900 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                   {isLoading ? (
                     <>Transmitting Inquiry <Loader2 className="w-6 h-6 animate-spin" /></>
                   ) : (
                     <>Transmit Message <Send className="w-6 h-6" /></>
                   )}
                </button>
             </form>
          </div>

        </div>
      </section>

      {/* FINAL TRANSITION */}
      <section className="py-48 bg-teal-600 text-white text-center px-6">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">Global Network. <br />Local Care.</h2>
            <p className="text-2xl text-teal-100 font-light max-w-2xl mx-auto">Our distributed strategy team operates across every time zone to ensure you're never learning alone.</p>
         </div>
      </section>

    </div>
  );
}
