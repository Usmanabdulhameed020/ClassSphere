import React from 'react';

export default function GuardianPortal() {
  return (
    <section className="w-full bg-[#f8f9fa] py-24 px-5 font-sans antialiased border-b border-[#dadce0]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Narrative Content */}
        <div className="lg:col-span-6 space-y-6 lg:order-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008080] block">
            Extended Ecosystem
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1f1f1f] tracking-tight leading-tight">
            Bring families into the loop without the manual emails.
          </h2>
          <p className="text-[#5f6368] text-base leading-relaxed">
            Give parents a dedicated, beautifully streamlined window into their student's progress. No confusing navigation paths—just custom timelines, milestone announcements, and upcoming task trackers.
          </p>
        </div>

        {/* Right Column: Premium Portal Abstract Component */}
        <div className="lg:col-span-6 lg:order-2 bg-white border border-[#dadce0] rounded-[32px] p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#004d4d] text-white flex items-center justify-center font-bold text-sm">
              G
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1f1f1f]">Guardian Portal</h4>
              <p className="text-xs text-[#5f6368]">Secure Family Access</p>
            </div>
          </div>
          
          {/* Timeline Feed Block */}
          <div className="space-y-4 relative pl-6 border-l-2 border-[#e0f2f1]">
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-2 h-2 rounded-full bg-[#008080]"></div>
              <h5 className="text-xs font-bold text-[#1f1f1f]">Unit 3 Math Benchmark Completed</h5>
              <p className="text-[11px] text-[#5f6368] mt-0.5">Exceeded baseline growth target by 14%.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-2 h-2 rounded-full bg-[#dadce0]"></div>
              <h5 className="text-xs font-bold text-[#5f6368]">Upcoming Field Trip Form</h5>
              <p className="text-[11px] text-[#5f6368] mt-0.5">Requires verification signature by Friday.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}