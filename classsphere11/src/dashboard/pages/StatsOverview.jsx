import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Clock, 
  MoreVertical,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { cn } from '../utils';

const data = [
  { name: 'Mon', engagement: 4000 },
  { name: 'Tue', engagement: 3000 },
  { name: 'Wed', engagement: 2000 },
  { name: 'Thu', engagement: 2780 },
  { name: 'Fri', engagement: 1890 },
  { name: 'Sat', engagement: 2390 },
  { name: 'Sun', engagement: 3490 },
];

const COLORS = ['#0d9488', '#0f766e', '#115e59', '#134e4a'];

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  </div>
);

export default function StatsOverview({ user, onSelectClass, onCreateClass }) {
  const [classes, setClasses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [engagementData, setEngagementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, summaryRes, engagementRes] = await Promise.all([
          dashboardService.getClasses(),
          dashboardService.getSummaryStats(),
          dashboardService.getEngagementStats()
        ]);
        setClasses(classesRes);
        setSummary(summaryRes);
        setEngagementData(engagementRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStats = () => {
    if (!user) {
      return [
        { title: 'Loading...', value: '-', icon: BookOpen, trend: '', color: 'bg-slate-300' },
        { title: 'Loading...', value: '-', icon: Users, trend: '', color: 'bg-slate-300' },
        { title: 'Loading...', value: '-', icon: Clock, trend: '', color: 'bg-slate-300' },
        { title: 'Loading...', value: '-', icon: TrendingUp, trend: '', color: 'bg-slate-300' },
      ];
    }

    if (summary && summary.totalStudents !== undefined) {
      return [
        { title: 'Total Spheres', value: summary?.totalClasses || 0, icon: BookOpen, trend: summary?.trend || '+0%', color: 'bg-teal-600' },
        { title: 'Active Students', value: summary?.totalStudents || 0, icon: Users, trend: summary?.trend || '+0%', color: 'bg-indigo-600' },
        { title: 'Submissions', value: summary?.pendingSubmissions || 0, icon: Clock, trend: 'Pending', color: 'bg-orange-500' },
        { title: 'Attendance Rate', value: summary?.attendanceRate || '0%', icon: TrendingUp, trend: '+0%', color: 'bg-emerald-600' },
      ];
    }

    return [
      { title: 'Enrolled Spheres', value: summary?.enrolledClasses || 0, icon: BookOpen, trend: summary?.trend || '+0%', color: 'bg-teal-600' },
      { title: 'Upcoming Tasks', value: summary?.upcomingTasks || 0, icon: Clock, trend: 'Due soon', color: 'bg-orange-500' },
      { title: 'Average Grade', value: summary?.avgGrade || '0%', icon: TrendingUp, trend: summary?.trend || '+0%', color: 'bg-indigo-600' },
      { title: 'Attendance', value: summary?.attendanceRate || '0%', icon: Users, trend: 'Overall', color: 'bg-emerald-600' },
    ];
  };

  const stats = getStats();

  return (
    <div className="space-y-8 pb-20">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="h-32 bg-white animate-pulse rounded-3xl border border-slate-100" />)
        ) : stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Platform Engagement</h2>
              <p className="text-slate-500 text-sm">Real-time interaction analytics</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
               <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#0d9488" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorEngage)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Activity / Classes Preview */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900">Your Spheres</h2>
          </div>
          <div className="space-y-4 flex-1">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />)
            ) : classes.slice(0, 4).map((cls) => (
              <div 
                key={cls._id} 
                onClick={() => onSelectClass && onSelectClass(cls)}
                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg", cls.color || 'bg-teal-600')}>
                  {cls.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">{cls.name}</h4>
                  <p className="text-xs text-slate-500">{cls.section || 'General'}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>
            ))}
            {!loading && classes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm italic">No spheres found</p>
              </div>
            )}
          </div>
            <button 
              onClick={onCreateClass}
              className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Plus className="w-5 h-5" />
              Create New Sphere
            </button>
        </div>
      </div>

      {/* Schedule Preview Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Schedule Overview</h2>
              <p className="text-slate-500 text-sm font-medium">Don't miss your upcoming events</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
              <button className="px-4 py-2 bg-white shadow-sm rounded-xl text-xs font-bold text-teal-600">Upcoming</button>
              <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:shadow-sm transition-all">Past</button>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { time: '09:00 AM', title: 'Advanced React Design', type: 'Lecture', room: 'Virtual 01', color: 'border-teal-500' },
              { time: '11:30 AM', title: 'UX Research Workshop', type: 'Lab', room: 'Hall B', color: 'border-indigo-500' },
              { time: '02:00 PM', title: 'Team Sync - Project Sphere', type: 'Meeting', room: 'Zoom', color: 'border-orange-500' },
            ].map((item, i) => (
              <div key={i} className={cn("p-5 rounded-2xl bg-slate-50 border-l-4", item.color)}>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.time}</span>
                <h4 className="font-bold text-slate-900 mt-1">{item.title}</h4>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {item.type}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {item.room}
                  </span>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
