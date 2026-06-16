import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, Users, BookOpen, Award, Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { adminService } from '../services/adminService';
import { dashboardService } from '../services/dashboardService';

export default function Insights({ user }) {
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const [stats, summaryRes] = await Promise.all([
        adminService.getDetailedStats(),
        dashboardService.getSummaryStats()
      ]);
      setPerformanceData(stats.chartData.map(d => ({ name: d.name, score: d.users, avg: d.users - 5 })));
      setSubjectData(stats.roles.map(r => ({ name: r.name, value: r.value })));
      setSummary(summaryRes);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600/30" />
      </div>
    );
  }

  const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#f43f5e'];

  const stats = user.role === 'teacher' ? [
    { title: 'Global Sphere Rank', value: '#1', icon: Award, color: 'bg-teal-600' },
    { title: 'Total Students', value: summary?.totalStudents || 0, icon: TrendingUp, color: 'bg-indigo-600' },
    { title: 'Attendance Rate', value: summary?.attendanceRate || '0%', icon: BookOpen, color: 'bg-orange-500' },
  ] : [
    { title: 'Academic Rank', value: '#12', icon: Award, color: 'bg-teal-600' },
    { title: 'Average Grade', value: summary?.avgGrade || '0%', icon: TrendingUp, color: 'bg-indigo-600' },
    { title: 'Attendance', value: summary?.attendanceRate || '0%', icon: BookOpen, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-xl hover:translate-y-[-4px] transition-all">
            <div className={cn("p-4 rounded-2xl text-white shadow-lg", stat.color)}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Performance Trend</h2>
              <p className="text-slate-500 text-sm font-medium">Your score vs class average</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0d9488" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#cbd5e1" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Course Engagement</h2>
              <p className="text-slate-500 text-sm font-medium">Time distribution across spheres</p>
            </div>
          </div>
          <div className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
