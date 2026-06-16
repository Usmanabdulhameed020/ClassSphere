import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, MoreVertical, FileText, Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { dashboardService } from '../services/dashboardService';
import { useTheme } from '../context/ThemeContext';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
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

  const filteredAssignments = filter === 'All' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

  const stats = {
    inProgress: assignments.filter(a => a.status === 'Pending').length,
    completed: assignments.filter(a => a.status === 'Submitted' || a.status === 'Graded').length
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('assignmentsHub')}</h2>
            <p className="text-slate-500 font-medium text-lg">{t('manageWorkload')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('pending')}</p>
            <p className="text-xl font-black text-slate-900">{stats.inProgress} {t('tasks')}</p>
          </div>
          <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{t('completed')}</p>
            <p className="text-xl font-black text-emerald-700">{stats.completed} {t('tasks')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-900 text-lg">{t('currentAssignments')}</h3>
          <div className="flex items-center gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer"
            >
              <option value="All">{t('allStatus')}</option>
              <option value="Pending">{t('pending')}</option>
              <option value="Submitted">{t('submitted')}</option>
              <option value="Graded">{t('graded')}</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('assignment')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('sphere')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('deadline')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('status')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-teal-600/30 mx-auto" />
                  </td>
                </tr>
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-slate-400 font-medium italic">
                    {t('noAssignments')}
                  </td>
                </tr>
              ) : filteredAssignments.map((task) => (
                <tr key={task._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                        <p className="text-xs text-slate-400 font-medium">{task.points} {t('pointsAvailable')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white",
                      task.classId?.color || 'bg-teal-600'
                    )}>
                      {task.classId?.name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Clock className="w-4 h-4 text-slate-300" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : t('noDeadline')}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full w-fit",
                      task.status === 'Graded' ? "bg-teal-50 text-teal-600" :
                      task.status === 'Submitted' ? "bg-emerald-50 text-emerald-600" :
                      task.status === 'Late' ? "bg-rose-50 text-rose-600" :
                      "bg-orange-50 text-orange-600"
                    )}>
                      {task.status === 'Graded' ? <CheckCircle2 className="w-4 h-4" /> : 
                       task.status === 'Submitted' ? <CheckCircle2 className="w-4 h-4" /> : 
                       <AlertCircle className="w-4 h-4" />}
                      {task.status}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => {
                        if (task.status === 'Pending') {
                          alert('Submit assignment feature coming soon!');
                        } else if (task.status === 'Submitted') {
                          alert('Waiting for teacher to grade...');
                        } else {
                          alert(`Grade: ${task.grade || 'N/A'}`);
                        }
                      }}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-slate-300" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
