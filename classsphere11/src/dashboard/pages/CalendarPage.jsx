import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { dashboardService } from '../services/dashboardService';
import { useTheme } from '../context/ThemeContext';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTheme();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await dashboardService.getMyAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(year, currentDate.getMonth());
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const getEventsForDay = (day) => {
    if (!day) return [];
    return assignments.filter(a => {
      if (!a.dueDate) return false;
      const d = new Date(a.dueDate);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === year;
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const upcomingEvents = assignments
    .filter(a => a.dueDate && new Date(a.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{monthName} {year}</h2>
            <p className="text-slate-500 font-medium text-sm">
              {loading ? t('syncingSchedule') : `You have ${assignments.length} ${t('assignmentsTracked')}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
          <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-6 py-2 bg-white rounded-xl text-sm font-black text-slate-900 shadow-sm">{t('today')}</button>
          <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-7 gap-4 mb-6">
            {days.map(day => (
              <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {loading ? (
               Array.from({ length: 35 }).map((_, i) => (
                 <div key={i} className="aspect-square rounded-2xl bg-slate-50 animate-pulse" />
               ))
            ) : calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div key={i} className={cn(
                  "aspect-square rounded-2xl border p-2 relative group transition-all duration-300",
                  day ? "border-slate-50 hover:border-teal-200 hover:bg-teal-50/30 cursor-pointer" : "border-transparent bg-slate-50/30 opacity-20",
                  isToday && "bg-teal-50/50 border-teal-200 shadow-inner"
                )}>
                  {day && (
                    <>
                      <span className={cn(
                        "text-sm font-black transition-colors",
                        isToday ? "text-teal-600" : "text-slate-400 group-hover:text-slate-900"
                      )}>{day}</span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((ev, idx) => (
                          <div key={idx} className={cn("h-1.5 rounded-full", ev.classId?.color || 'bg-teal-500')} title={ev.title} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-lg font-black mb-6">{t('upcomingAgenda')}</h3>
            <div className="space-y-6">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
              ) : upcomingEvents.length === 0 ? (
                <p className="text-slate-500 text-xs italic">{t('noDeadlines')}</p>
              ) : upcomingEvents.map((event, i) => (
                <div key={i} className="flex gap-4 group/item cursor-pointer">
                  <div className={cn("w-1 h-12 rounded-full shrink-0", event.classId?.color || 'bg-teal-500')} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {new Date(event.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    <h4 className="font-bold text-sm mt-1 group-hover/item:text-teal-400 transition-colors line-clamp-1">{event.title}</h4>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{event.classId?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t('legend')}</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-teal-600" />
                   <span className="text-xs font-bold text-slate-600">{t('coreAcademics')}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-indigo-600" />
                   <span className="text-xs font-bold text-slate-600">{t('specialProjects')}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-rose-500" />
                   <span className="text-xs font-bold text-slate-600">{t('deadlines')}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
