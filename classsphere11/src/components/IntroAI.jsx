import React from 'react';
import { Link } from 'react-router-dom';

// --- Reusable Mockup Window Component ---
const MockupWindow = ({ children }) => {
  return (
    <div className="bg-[#008080] rounded-t-[24px] p-4 pb-0 h-[340px] flex flex-col shadow-sm overflow-hidden">
      {/* Top Browser/App Bar */}
      <div className="bg-white rounded-t-2xl h-12 flex justify-between items-center px-4 border-b border-[#f1f3f4]">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Icon */}
          <svg className="w-5 h-5 text-[#5f6368] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className="flex items-center gap-2">
            {/* Teal Theme App Logo */}
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00a699] to-[#004d4d]"></div>
            <span className="font-semibold text-[#5f6368] text-[0.95rem]">ClassSphere</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Plus Icon */}
          <svg className="w-5 h-5 text-[#5f6368] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {/* Grid/App Launcher Icon */}
          <svg className="w-5 h-5 text-[#5f6368] cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
          </svg>
          {/* Profile Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#80cbd2]"></div>
        </div>
      </div>
      
      {/* Internal App Layout */}
      <div className="bg-white flex-grow flex">
        {/* Sidebar */}
        <aside className="w-12 border-r border-[#f1f3f4] flex flex-col items-center pt-3 gap-4">
          {/* Home Icon */}
          <svg className="w-5 h-5 text-[#008080] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {/* Calendar Icon */}
          <svg className="w-5 h-5 text-[#5f6368] opacity-70 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {/* Book/Classroom Icon */}
          <svg className="w-5 h-5 text-[#5f6368] opacity-70 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {/* AI Spark Icon */}
          <div className="bg-[#e0f2f1] p-1 rounded-full cursor-pointer">
            <svg className="w-4 h-4 text-[#008080]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
            </svg>
          </div>
          {/* Settings Icon */}
          <svg className="w-5 h-5 text-[#5f6368] opacity-70 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0x" />
          </svg>
        </aside>
        
        {/* Dynamic Content Area */}
        <main className="flex-grow overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- Reusable Card Footer Component ---
const CardFooter = ({ title, description }) => {
  return (
    <div className="text-center p-[30px] px-5 bg-white flex-grow">
      <h2 className="text-2xl font-semibold text-[#1f1f1f] mb-3.5">{title}</h2>
      <div className="text-[0.95rem] text-[#5f6368] leading-relaxed max-w-[440px] mx-auto">
        {description}
      </div>
    </div>
  );
};

// --- Main Section Component ---
export default function ClassSpherePromo() {
  return (
    <section className="max-w-[1200px] w-full mx-auto px-5 py-10 font-sans text-[#1f1f1f]">
      {/* Header Section */}
      <header className="text-center max-w-[800px] mx-auto mb-[50px]">
        <h1 className="text-4xl md:text-[2.5rem] font-bold text-[#1f1f1f] mb-5 leading-tight">
          Introducing no-cost AI tools in ClassSphere
        </h1>
        <p className="text-base text-[#5f6368] leading-relaxed">
          Amplify learning impact with{' '}
          <Link to="/ai" className="text-[#008080] underline font-semibold transition-colors hover:text-[#004d4d]">ClassSphere AI</Link>
          , a suite of AI tools for teaching and learning. Advanced capabilities available with{' '}
          <Link to="/plus" className="text-[#008080] underline font-semibold transition-colors hover:text-[#004d4d]">ClassSphere Plus</Link>{' '}
          and <Link to="/addons" className="text-[#008080] underline font-semibold transition-colors hover:text-[#004d4d]">select add-ons</Link>.
        </p>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
        
        {/* Card 1: Educators Dashboard */}
        <div className="flex flex-col bg-transparent">
          <MockupWindow>
            <div className="bg-[#f8f9fa] p-5 h-full grid grid-cols-3 gap-3 content-start">
              
              {/* Tile 1: Outline lesson */}
              <div className="bg-white border border-[#dadce0] rounded-xl p-3 flex flex-col justify-between h-[100px] shadow-sm">
                <span className="w-7 h-7 rounded-full bg-[#e0f2f1] text-[#008080] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </span>
                <span className="text-[0.75rem] font-semibold text-[#3c4043] tracking-tight leading-tight">Outline a lesson plan</span>
              </div>

              {/* Tile 2: Translate */}
              <div className="bg-white border border-[#dadce0] rounded-xl p-3 flex flex-col justify-between h-[100px] shadow-sm">
                <span className="w-7 h-7 rounded-full bg-[#e0f2f1] text-[#008080] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0c-.811 1.577-2.114 3.033-3.6 4.35M7 1H1M5 5a18.024 18.024 0 005.412 8.5M19 11a4 4 0 11-8 0 4 4 0 018 0zm-2 2v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2" />
                  </svg>
                </span>
                <span className="text-[0.75rem] font-semibold text-[#3c4043] tracking-tight leading-tight">Translate text</span>
              </div>

              {/* Tile 3: Hook */}
              <div className="bg-white border border-[#dadce0] rounded-xl p-3 flex flex-col justify-between h-[100px] shadow-sm">
                <span className="w-7 h-7 rounded-full bg-[#e0f2f1] text-[#008080] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </span>
                <span className="text-[0.75rem] font-semibold text-[#3c4043] tracking-tight leading-tight">Craft a hook</span>
              </div>

              {/* Tile 4: Quiz */}
              <div className="bg-white border border-[#dadce0] rounded-xl p-3 flex flex-col justify-between h-[100px] shadow-sm">
                <span className="w-7 h-7 rounded-full bg-[#e0f2f1] text-[#008080] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-[0.75rem] font-semibold text-[#3c4043] tracking-tight leading-tight">Generate a quiz</span>
              </div>

              {/* Tile 5: Brainstorm */}
              <div className="bg-white border border-[#dadce0] rounded-xl p-3 flex flex-col justify-between h-[100px] shadow-sm">
                <span className="w-7 h-7 rounded-full bg-[#e0f2f1] text-[#008080] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <span className="text-[0.75rem] font-semibold text-[#3c4043] tracking-tight leading-tight">Brainstorm project ideas</span>
              </div>

              {/* Tile 6: Misconceptions */}
              <div className="bg-white border border-[#dadce0] rounded-xl p-3 flex flex-col justify-between h-[100px] shadow-sm">
                <span className="w-7 h-7 rounded-full bg-[#e0f2f1] text-[#008080] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                <span className="text-[0.75rem] font-semibold text-[#3c4043] tracking-tight leading-tight">Tackle common misconceptions</span>
              </div>
            </div>
          </MockupWindow>
          
          <CardFooter 
            title="AI tools built for educators" 
            description={<>Go from idea to instruction faster with <Link to="/ai" className="text-[#008080] underline font-semibold transition-colors hover:text-[#004d4d]">ClassSphere AI</Link>, a set of AI tools to help educators get started on common tasks.</>}
          />
        </div>

        {/* Card 2: Student Layout */}
        <div className="flex flex-col bg-transparent">
          <MockupWindow>
            <div className="bg-white p-5 h-full flex flex-col">
              <div className="flex items-center mb-5">
                <h3 className="text-[0.95rem] font-semibold text-[#202124]">Class learning tools</h3>
                {/* Info Tooltip Icon */}
                <span className="w-3.5 h-3.5 border border-[#5f6368] rounded-full text-[0.65rem] inline-flex items-center justify-center text-[#5f6368] ml-1.5 cursor-help">i</span>
                {/* Collapse Arrow Icon */}
                <svg className="ml-auto w-4 h-4 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </div>
              
              {/* Learning Item 1: NotebookLM */}
              <div className="flex items-center py-3 border-b border-[#f1f3f4]">
                <div className="w-8 h-8 rounded-full bg-[#004d4d] text-white flex items-center justify-center mr-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[0.85rem] font-semibold text-[#202124]">NotebookLM</h4>
                  <p className="text-[0.75rem] text-[#5f6368]">Unit 1 study guide</p>
                </div>
                <div className="ml-auto flex flex-col gap-1.5 items-end">
                  <div className="h-[2px] bg-[#b2dfdb] rounded-[2px] w-10"></div>
                  <div className="h-[2px] bg-[#b2dfdb] rounded-[2px] w-[60px]"></div>
                </div>
              </div>
              
              {/* Learning Item 2: Gem */}
              <div className="flex items-center py-3 border-b border-[#f1f3f4]">
                <div className="w-8 h-8 rounded-full bg-[#e0f2f1] text-[#008080] flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[0.85rem] font-semibold text-[#202124]">Gem</h4>
                  <p className="text-[0.75rem] text-[#5f6368]">Chemistry tutor</p>
                </div>
                <div className="ml-auto flex flex-col gap-1.5 items-end">
                  <div className="h-[2px] bg-[#b2dfdb] rounded-[2px] w-10"></div>
                  <div className="h-[2px] bg-[#b2dfdb] rounded-[2px] w-[60px]"></div>
                </div>
              </div>
            </div>
          </MockupWindow>
          
          <CardFooter 
            title="Teacher-led AI experiences for students" 
            description={<>Enable interactive learning tools using <Link to="/notebooklm" className="text-[#008080] underline font-semibold transition-colors hover:text-[#004d4d]">NotebookLM</Link> and <Link to="/gems" className="text-[#008080] underline font-semibold transition-colors hover:text-[#004d4d]">Gems</Link>, grounded on class materials.</>}
          />
        </div>

      </div>
    </section>
  );
}