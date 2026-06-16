import React from 'react';
import { Link } from 'react-router-dom';

export default function FinalClosure() {
  return (
    <section className="w-full bg-white py-24 px-5 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Main High-End Dark CTA Slate Card */}
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#003333] via-[#004d4d] to-[#002626] p-8 md:p-16 text-center text-white shadow-2xl space-y-8">
          
          {/* Subtle Background Radial Aura for Luxury Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#008080]/20 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Core Content */}
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#80cbd2] bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full inline-block">
              Deploy Next-Gen Learning
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight pt-2">
              Ready to elevate your institution's digital core?
            </h2>
            <p className="text-sm md:text-base text-teal-100/70 max-w-lg mx-auto leading-relaxed">
              Step away from fragmented legacy software. Join forward-thinking schools transforming classroom workflows into fluid, unified learning pipelines.
            </p>
          </div>

          {/* Premium Interactive Button Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-4">
            <Link to="/access" className="w-full sm:w-auto bg-white text-[#004d4d] px-8 py-4 rounded-full font-bold text-sm tracking-tight shadow-md transition-all duration-300 hover:bg-[#e0f2f1] hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] text-center">
              Request institutional access
            </Link>
            <Link to="/demo" className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm tracking-tight transition-all duration-300 hover:bg-white/5 hover:border-white/40 text-center">
              Explore live demo sandbox
            </Link>
          </div>

          {/* Premium Micro Footer Note */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs text-teal-200/50">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              FERPA & COPPA Compliant
            </span>
            <span>•</span>
            <span>Zero configuration setup</span>
            <span>•</span>
            <span>Free pilot options available</span>
          </div>

        </div>

      </div>
    </section>
  );
}