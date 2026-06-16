import React from 'react';

export default function CommandCenter() {
  return (
    <section className="w-full bg-[#f8f9fa] py-24 px-5 font-sans antialiased border-b border-[#dadce0]">
      <div className="max-w-[1200px] mx-auto space-y-16">
        
        {/* Section Typography Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008080] block mb-3">
            Dual Ecosystem Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1f1f1f] tracking-tight leading-tight">
            One unified canvas.<br />Two tailored perspectives.
          </h2>
          <p className="text-[#5f6368] text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
            We replaced fragmented tabs, messy sidebars, and cluttered assignment streams with a clean, dual-sided workspace designed for focus.
          </p>
        </div>

        {/* The Split Canvas Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Canvas: Instructor Control */}
          <div className="bg-white border border-[#dadce0] rounded-[32px] p-8 md:p-12 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 text-xs font-bold text-[#008080] bg-[#e0f2f1] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008080]"></span>
                The Teacher's Helm
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1f1f1f]">
                Command without the cognitive load.
              </h3>
              <p className="text-sm md:text-base text-[#5f6368] leading-relaxed">
                Build entire modular units in seconds using an inline builder. Drag and drop resources, set automated mastery thresholds, and let the background engine auto-organize your calendar view.
              </p>
            </div>

            {/* High-End Minimalist UI Abstract Layer */}
            <div className="mt-12 space-y-3 bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center pb-2 border-b border-[#dadce0]">
                <div className="h-3 bg-[#008080] rounded w-1/4"></div>
                <div className="h-2 bg-[#dadce0] rounded w-12"></div>
              </div>
              <div className="h-2 bg-[#dadce0]/60 rounded w-full"></div>
              <div className="h-2 bg-[#dadce0]/60 rounded w-5/6"></div>
              <div className="flex gap-2 pt-1">
                <div className="h-5 bg-[#e0f2f1] rounded-md w-20"></div>
                <div className="h-5 bg-[#e0f2f1] rounded-md w-16"></div>
              </div>
            </div>
          </div>

          {/* Right Canvas: Student Focus */}
          <div className="bg-[#004d4d] rounded-[32px] p-8 md:p-12 flex flex-col justify-between text-white shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 text-xs font-bold text-[#80cbd2] bg-white/10 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#80cbd2]"></span>
                The Student's Focus Engine
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                An intentional space to actually learn.
              </h3>
              <p className="text-sm md:text-base text-teal-100/80 leading-relaxed">
                No endless lists of missing assignments to cause anxiety. Students open a clean, personalized linear track that highlights exactly what to explore next, built-in study notes, and continuous progress loops.
              </p>
            </div>

            {/* High-End Minimalist UI Abstract Layer (Dark Mode) */}
            <div className="mt-12 space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-sm backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#80cbd2]/20 flex items-center justify-center text-[#80cbd2]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="h-2 bg-white/80 rounded w-1/3"></div>
              </div>
              <div className="pl-9 space-y-2">
                <div className="h-1.5 bg-white/20 rounded w-full"></div>
                <div className="h-1.5 bg-white/20 rounded w-4/5"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}