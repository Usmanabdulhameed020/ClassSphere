import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Code2, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

// Animation variants for reusability
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // Custom premium ease-out
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardHoverEffects = {
  hover: { 
    y: -8, 
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function About() {
  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans antialiased selection:bg-teal-100 overflow-x-hidden">
      
      {/* SECTION 1: THE MASSIVE HERO OPENING */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 to-white py-32 md:py-48 px-6 border-b border-gray-100">
        <motion.div 
          className="max-w-5xl mx-auto text-center space-y-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="text-xs font-bold tracking-[0.3em] text-teal-600 uppercase bg-teal-50 px-4 py-2 rounded-full">
            Our Purpose
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-none">
            We are reshaping how the world <span className="text-teal-600">learns together.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            ClassSphere is a modern, high-performance learning ecosystem built to bring teachers, students, and curriculum into perfect harmony.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2: THE PROBLEM (WHY WE BUILT THIS) */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text: Triggers when in viewport */}
          <motion.div 
            className="lg:col-span-5 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className="text-xs font-bold tracking-widest text-teal-600 uppercase block">
              The Catalyst
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Education tools became too complicated.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We noticed a frustrating trend in modern education: platforms were getting bloated. Instead of helping teachers teach, software was forcing them to spend hours wrestling with messy interfaces and slow loading times.
            </p>
          </motion.div>
          
          {/* Right Cards: Staggered entry animation on scroll */}
          <motion.div 
            className="lg:col-span-7 grid sm:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeInUp}
              whileHover="hover"
              className="p-8 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 cursor-pointer"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">The Old Way</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clunky systems, lost assignments, slow database responses, and security vulnerabilities that put student data at risk.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 25px -5px rgb(13 148 136 / 0.05), 0 8px 10px -6px rgb(13 148 136 / 0.05)",
                transition: { duration: 0.3 }
              }}
              className="p-8 bg-teal-50/60 rounded-2xl border border-teal-100/50 space-y-4 cursor-pointer"
            >
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-teal-900">The ClassSphere Way</h4>
              <p className="text-teal-950 text-sm leading-relaxed">
                An ultra-fast pipeline powered by React, Node.js, and MongoDB that delivers real-time updates and effortless task handling.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: THE CORE VISION SPLIT BLOCK */}
      <section className="bg-gray-900 text-white py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">
              Our Long-term Vision
            </span>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Empowering educators with frictionless technology.
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              We believe classroom software should disappear into the background. Teachers should focus entirely on inspiring minds, and students should have instant, crystal-clear access to their tasks, grades, and community feeds without lag.
            </p>
            <div className="pt-4">
              <button className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition font-semibold group">
                <span>See our architecture road map</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/50 border border-gray-800 p-12 rounded-3xl space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex gap-6 group cursor-pointer">
              <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-gray-900 transition-all duration-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors">Built for Scale</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Our MongoDB cloud architecture ensures that whether you have 10 students or 10,000, your platform responds instantly.</p>
              </div>
            </div>

            <div className="flex gap-6 group cursor-pointer">
              <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-gray-900 transition-all duration-300">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors">Modern Engineering</h4>
                <p className="text-gray-400 text-sm leading-relaxed">By combining asynchronous Express.js servers with a reactive front-end, data syncs without constant browser refreshes.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: THE VALUES GRID */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-b border-gray-100">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-teal-600 uppercase">
            What We Stand For
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            The principles driving our development.
          </h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="space-y-4 p-6 rounded-xl hover:bg-teal-50/40 transition-colors duration-300">
            <div className="text-3xl font-bold text-teal-200">01</div>
            <h3 className="text-2xl font-bold text-gray-900">Accessibility First</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              Every card, layout option, button, and navigation flow is designed to be fully readable and highly accessible on any device, anywhere.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4 p-6 rounded-xl hover:bg-teal-50/40 transition-colors duration-300">
            <div className="text-3xl font-bold text-teal-200">02</div>
            <h3 className="text-2xl font-bold text-gray-900">Absolute Transparency</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              No hidden processes. From grading metrics to activity streams, everything is clearly visible to users instantly based on their platform roles.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4 p-6 rounded-xl hover:bg-teal-50/40 transition-colors duration-300">
            <div className="text-3xl font-bold text-teal-200">03</div>
            <h3 className="text-2xl font-bold text-gray-900">Ironclad Security</h3>
            <p className="text-gray-600 leading-relaxed font-light">
              Using robust JWT authentication parameters and secure browser cookies to shield grades and personal information from unauthorized access.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5: THE TEAM AND FOUNDERS SECTION */}
      <section className="py-32 bg-gray-50/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-widest text-teal-600 uppercase block mb-3">
                The Architects
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Meet the minds behind ClassSphere.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-6">
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                We are a distributed collective of engineers, instructional designers, and product creators obsessed with rebuilding how technology works inside modern schools.
              </p>
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Team Member 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover="hover"
              className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer"
            >
              <motion.div 
                variants={{ hover: { scale: 1.05 } }}
                className="aspect-square w-full bg-teal-50 rounded-xl flex items-center justify-center text-teal-600"
              >
                <Users className="w-12 h-12 stroke-[1]" />
              </motion.div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Alex Rivera</h4>
                <p className="text-sm font-medium text-teal-600">Full-Stack Architect</p>
              </div>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover="hover"
              className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer"
            >
              <motion.div 
                variants={{ hover: { scale: 1.05 } }}
                className="aspect-square w-full bg-teal-50 rounded-xl flex items-center justify-center text-teal-600"
              >
                <GraduationCap className="w-12 h-12 stroke-[1]" />
              </motion.div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Sarah Jenkins</h4>
                <p className="text-sm font-medium text-teal-600">Lead UX Designer</p>
              </div>
            </motion.div>

            {/* Team Member 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover="hover"
              className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer"
            >
              <motion.div 
                variants={{ hover: { scale: 1.05 } }}
                className="aspect-square w-full bg-teal-50 rounded-xl flex items-center justify-center text-teal-600"
              >
                <Code2 className="w-12 h-12 stroke-[1]" />
              </motion.div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Marcus Vance</h4>
                <p className="text-sm font-medium text-teal-600">Backend Infrastructure</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: MASSIVE FINAL CALL TO ACTION */}
      <section className="bg-teal-600 text-white py-36 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Join thousands of classrooms today.
          </h2>
          <p className="text-xl text-teal-50 font-light max-w-2xl mx-auto">
            Ready to experience a faster, cleaner, and entirely intuitive educational workspace? Create your ClassSphere profile now.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-lg transition-colors hover:bg-teal-50"
            >
              Get Started for Free
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-teal-700 text-white font-semibold rounded-xl border border-teal-500 transition-colors hover:bg-teal-800"
            >
              Contact Sales Team
            </motion.button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}