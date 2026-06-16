import React from 'react';
import { Link } from 'react-router-dom';

export default function ISS() {
  const steps = [
    {
      num: "01",
      title: "Intelligent Ingestion",
      desc: "Drop in a syllabus, video link, or reading file. The system instantly maps out core competencies and learning milestones."
    },
    {
      num: "02",
      title: "Adaptive Delivery",
      desc: "Students receive assignments customized to their current comprehension levels, while maintaining your core curriculum standards."
    },
    {
      num: "03",
      title: "Continuous Feedback Loops",
      desc: "As work happens, real-time telemetry surfaces actionable coaching moments before the assignment is even turned in."
    }
  ];

  return (
    <section className="w-full bg-white py-24 px-5 font-sans antialiased border-t border-[#dadce0]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: High-End Editorial Copy */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008080] bg-[#e0f2f1] px-3.5 py-1.5 rounded-full inline-block">
            The Paradigm Shift
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1f1f1f] tracking-tight leading-[1.1]">
            Beyond the digital file cabinet.
          </h2>
          <p className="text-base lg:text-lg text-[#5f6368] leading-relaxed weight-light">
            Legacy classrooms treat assignments like stagnant documents. We treat learning as a living, fluid pipeline that actively works alongside both instructor and student.
          </p>
          <div className="pt-4">
            <Link to="/architecture" className="group inline-flex items-center gap-2 bg-[#008080] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-[#004d4d] hover:shadow-md">
              See the architecture
              <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Column: Premium Asymmetric Pipeline Cards */}
        <div className="lg:col-span-7 space-y-6 relative">
          {/* Subtle connecting line element in the background */}
          <div className="absolute left-[39px] top-12 bottom-12 w-[1px] bg-gradient-to-b from-[#008080] via-[#dadce0] to-transparent hidden sm:block"></div>

          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="relative group bg-[#f8f9fa] border border-[#dadce0] rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start transition-all duration-300 hover:bg-white hover:border-[#008080] hover:shadow-xl hover:-translate-y-1"
            >
              {/* Luxury Indicator Circle */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-[#dadce0] text-sm font-bold text-[#008080] flex items-center justify-center shadow-sm z-10 transition-colors group-hover:bg-[#008080] group-hover:text-white group-hover:border-[#008080]">
                {step.num}
              </div>

              {/* Step Copy */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1f1f1f] tracking-tight transition-colors group-hover:text-[#008080]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#5f6368] leading-relaxed max-w-xl">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}