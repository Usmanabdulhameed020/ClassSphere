import React from 'react';

export default function InsightsEngine() {
  return (
    <section className="w-full bg-white py-24 px-5 font-sans antialiased border-b border-[#dadce0]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Premium UI Predictive Analytics Wireframe */}
        <div className="lg:col-span-6 space-y-4 bg-[#f8f9fa] border border-[#dadce0] rounded-[32px] p-6 sm:p-8 shadow-sm group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center pb-4 border-b border-[#dadce0]">
            <div>
              <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider block">Predictive Telemetry</span>
              <h4 className="text-sm font-bold text-[#1f1f1f]">Cohort Performance Curve</h4>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-[#e0f2f1] text-[#008080] rounded-md">Live Stream</span>
          </div>

          {/* Abstract Line Graph Graphic */}
          <div className="h-40 w-full flex items-end gap-3 pt-6 relative">
            <div className="absolute inset-x-0 bottom-6 border-b border-dashed border-[#dadce0]"></div>
            <div className="absolute inset-x-0 bottom-16 border-b border-dashed border-[#dadce0]"></div>
            <div className="w-full h-12 bg-[#dadce0]/50 rounded-md transition-all group-hover:bg-[#008080]/20"></div>
            <div className="w-full h-24 bg-[#dadce0]/50 rounded-md transition-all group-hover:bg-[#008080]/40"></div>
            <div className="w-full h-20 bg-[#dadce0]/50 rounded-md transition-all group-hover:bg-[#008080]/30"></div>
            <div className="w-full h-32 bg-[#008080] rounded-md shadow-sm"></div>
          </div>

          <div className="bg-white border border-[#dadce0] rounded-xl p-3 text-xs text-[#5f6368] flex items-center justify-between">
            <span>System recommendation triggered:</span>
            <span className="font-bold text-[#008080]">Deploy Concept Review</span>
          </div>
        </div>

        {/* Right Column: Editorial Value Pitch */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008080] bg-[#e0f2f1] px-3 py-1.5 rounded-full inline-block">
            Advanced Analytics
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1f1f1f] tracking-tight leading-tight">
            See comprehension gaps before they become bad grades.
          </h2>
          <p className="text-[#5f6368] text-base leading-relaxed">
            Legacy gradebooks only tell you what happened in the past. Our integrated engine actively monitors assignment progress, automatically highlighting exactly which educational concepts are stalling your cohort.
          </p>
        </div>

      </div>
    </section>
  );
}