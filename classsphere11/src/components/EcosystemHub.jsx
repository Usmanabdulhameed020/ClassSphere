import React from 'react';

export default function EcosystemHub() {
  return (
    <section className="w-full bg-white py-24 px-5 font-sans antialiased overflow-hidden border-b border-[#dadce0]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: High-End Interactive Visual Orbit */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] lg:min-h-[440px]">
          {/* Outer Orbit Ring */}
          <div className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full border border-dashed border-[#dadce0] animate-[spin_120s_linear_infinite]"></div>
          
          {/* Inner Orbit Ring */}
          <div className="absolute w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full border border-[#e0f2f1] animate-[spin_80s_linear_infinite_reverse]"></div>
          
          {/* Center Core: Your Platform Logo Placeholder */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-br from-[#86d3d3] to-[#eeeeee] shadow-xl flex items-center justify-center z-10 border border-white/20">
            <img src="/logo.png" alt="" />
          </div>

          {/* Floating Node 1: Document/Drive Sync (Top Left) */}
          <div className="absolute transform -translate-x-24 -translate-y-24 md:-translate-x-36 md:-translate-y-36 bg-white border border-[#dadce0] p-3 rounded-2xl shadow-sm flex items-center gap-2.5 z-20 transition-transform duration-300 hover:scale-105">
            <div className="w-5 h-5 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
            </div>
            <span className="text-xs font-semibold text-[#1f1f1f]">Cloud Drives</span>
          </div>

          {/* Floating Node 2: Video/Virtual Classroom (Top Right) */}
          <div className="absolute transform translate-x-24 -translate-y-16 md:translate-x-36 md:-translate-y-24 bg-white border border-[#dadce0] p-3 rounded-2xl shadow-sm flex items-center gap-2.5 z-20 transition-transform duration-300 hover:scale-105">
            <div className="w-5 h-5 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </div>
            <span className="text-xs font-semibold text-[#1f1f1f]">Live Rooms</span>
          </div>

          {/* Floating Node 3: SIS / OneRoster Roster Sync (Bottom Center) */}
          <div className="absolute transform translate-y-28 md:translate-y-36 bg-white border border-[#dadce0] p-3 rounded-2xl shadow-sm flex items-center gap-2.5 z-20 transition-transform duration-300 hover:scale-105">
            <div className="w-5 h-5 rounded bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
            <span className="text-xs font-semibold text-[#1f1f1f]">SIS Roster API</span>
          </div>
        </div>

        {/* Right Column: Narrative Copy & Architecture Specs */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#008080] block">
              Frictionless Coexistence
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1f1f1f] tracking-tight leading-tight">
              Plugs right into your existing campus stack.
            </h2>
            <p className="text-[#5f6368] text-base leading-relaxed">
              Transitioning to a modern workspace shouldn't mean rebuilding your database from scratch. Our platform syncs silently with institutional infrastructure in real-time.
            </p>
          </div>

          {/* Spec Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#1f1f1f] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#008080]"></div>
                OneRoster & LTI v1.3 vAdv
              </h4>
              <p className="text-xs text-[#5f6368] leading-relaxed">
                Native compliance with global ed-tech interoperability protocols for immediate deployment.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#1f1f1f] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#008080]"></div>
                Bidirectional Grade Sync
              </h4>
              <p className="text-xs text-[#5f6368] leading-relaxed">
                Evaluations recorded on our canvas sync back to legacy school information systems automatically.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}