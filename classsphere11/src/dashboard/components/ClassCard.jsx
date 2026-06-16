import React, { useEffect, useState } from 'react';
import { MoreVertical, Folder, UserCheck, Calendar, BookOpen, Key, ArrowRight, User, Clock } from 'lucide-react';
import { cn } from '../utils';

export default function ClassCard({ cls, onSelectClass }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getGradient = (color) => {
    const gradients = {
      'bg-teal-600': 'bg-teal-600',
      'bg-indigo-600': 'bg-indigo-600',
      'bg-orange-500': 'bg-orange-500',
      'bg-emerald-600': 'bg-emerald-600',
      'bg-rose-600': 'bg-rose-600',
      'bg-slate-700': 'bg-slate-700',
    };
    return gradients[color] || 'bg-teal-600';
  };

  return (
    <div 
      onClick={() => onSelectClass && onSelectClass(cls)}
      className="group bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-xl hover:shadow-teal-100/20 transition-all duration-500 overflow-hidden flex flex-col h-[320px] relative cursor-pointer"
    >
      {/* Card Header/Banner */}
      <div className={cn(
        "h-32 p-8 relative overflow-hidden shrink-0 transition-all duration-500 group-hover:h-36",
        cls.color || 'bg-teal-600'
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-2xl font-black text-white leading-tight line-clamp-1">
              {cls.name}
            </h3>
            <p className="text-white/80 text-xs font-black uppercase tracking-widest mt-1">
              {cls.section || 'General'}
            </p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        {/* Teacher Avatar - Overlapping */}
        <div className="absolute right-8 -bottom-10 w-20 h-20 rounded-[2rem] border-8 border-white bg-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden z-20 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-3">
          {cls.teachers?.[0] ? (
            <img src={`https://i.pravatar.cc/150?u=${cls.teachers[0]._id || cls.teachers[0].id}`} alt="teacher" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-8 flex-1 flex flex-col pt-12">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             Lead Instructor
           </p>
        </div>
        <h4 className="text-lg font-black text-slate-800">
          {cls.teachers?.[0]?.username || 'ClassSphere Admin'}
        </h4>
        
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
           <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Enrolled</span>
           </div>
           <div className="flex gap-2">
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-2xl transition-all">
                <Folder className="w-5 h-5" />
             </button>
             <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                <UserCheck className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
