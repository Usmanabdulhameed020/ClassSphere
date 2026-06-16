import React, { useState, useEffect } from 'react';
import { Clock, User, CheckCircle, FileText, MessageSquare, ArrowUpRight, Bell, Loader2, Info } from 'lucide-react';
import { cn } from '../utils';
import { notificationService } from '../services/notificationService';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await notificationService.getNotifications();
      setActivities(data.notifications);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'assignment': return { icon: FileText, color: 'text-indigo-500' };
      case 'grade': return { icon: CheckCircle, color: 'text-teal-500' };
      case 'attendance': return { icon: Info, color: 'text-amber-500' };
      default: return { icon: Bell, color: 'text-slate-500' };
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
            <p className="text-slate-500 font-medium text-lg">Keep track of everything happening in your universe</p>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
             <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-teal-600/30" />
             </div>
          ) : activities.length === 0 ? (
             <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">No activity recorded yet.</p>
             </div>
          ) : activities.map((item, i) => {
            const { icon: Icon, color } = getIcon(item.type);
            return (
              <div key={item._id} className="flex items-center gap-6 p-6 hover:bg-slate-50 rounded-[2rem] transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                <div className={cn("w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-bold text-lg">
                    {item.title}
                  </p>
                  <p className="text-slate-500 font-medium">{item.message}</p>
                  <p className="text-slate-400 text-xs font-black mt-2 uppercase tracking-widest">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-slate-200 group-hover:text-teal-600 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
