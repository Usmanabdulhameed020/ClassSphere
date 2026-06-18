import React, { useEffect, useState } from 'react';
import { MoreVertical, Users, Key, LogOut, Trash2, Loader2, ArrowUpRight } from 'lucide-react';
import { cn } from '../utils';
import { dashboardService } from '../services/dashboardService';

const ACCENT_COLORS = {
  'bg-teal-600':    { solid: '#0d9488', light: '#f0fdfa' },
  'bg-indigo-600':  { solid: '#4f46e5', light: '#eef2ff' },
  'bg-orange-500':  { solid: '#f97316', light: '#fff7ed' },
  'bg-emerald-600': { solid: '#059669', light: '#ecfdf5' },
  'bg-rose-600':    { solid: '#e11d48', light: '#fff1f2' },
  'bg-slate-700':   { solid: '#475569', light: '#f8fafc' },
};

export default function ClassCard({ cls, onSelectClass, onClassRemoved }) {
  const [user, setUser]               = useState(null);
  const [showMenu, setShowMenu]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [isLoading, setIsLoading]     = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    const close = () => setShowMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const userId = user?.id || user?._id;
  const isCreator = user && cls.creator && (
    cls.creator === userId || cls.creator?._id === userId
  );
  // Any logged-in user who is NOT the creator is treated as a member who can only leave
  const isMember = user && !isCreator;

  const accent      = ACCENT_COLORS[cls.color] || ACCENT_COLORS['bg-teal-600'];
  const teacherName = cls.teachers?.[0]?.username || 'ClassSphere Admin';
  const initials    = teacherName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const studentCount = cls.students?.length ?? 0;

  const handleLeave = async () => {
    setIsLoading(true);
    try {
      await dashboardService.leaveClass(cls._id);
      setShowConfirm(null);
      if (onClassRemoved) onClassRemoved(cls._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave class');
    } finally { setIsLoading(false); }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dashboardService.deleteClass(cls._id);
      setShowConfirm(null);
      if (onClassRemoved) onClassRemoved(cls._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete class');
    } finally { setIsLoading(false); }
  };

  return (
    <>
      <div
        onClick={() => onSelectClass?.(cls)}
        className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
                   border border-slate-200 hover:border-slate-300
                   bg-white hover:shadow-lg
                   transition-all duration-200 hover:-translate-y-0.5"
      >
        {/* ── Header (light tinted) ─────────────────────────────────── */}
        <div
          className="relative px-5 pt-5 pb-10"
          style={{ backgroundColor: accent.light }}
        >
          {/* Section label + menu */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ color: accent.solid, backgroundColor: `${accent.solid}18` }}
            >
              {cls.section || 'General'}
            </span>

            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowMenu(v => !v)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/70 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 z-50 min-w-[150px]
                                bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1">
                  {isCreator && (
                    <button
                      onClick={() => { setShowMenu(false); setShowConfirm('delete'); }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-rose-500
                                 hover:bg-slate-50 transition-colors text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Class
                    </button>
                  )}
                  {isMember && (
                    <button
                      onClick={() => { setShowMenu(false); setShowConfirm('leave'); }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-amber-500
                                 hover:bg-slate-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Leave Class
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Class name */}
          <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
            {cls.name}
          </h3>
        </div>

        {/* ── Body (white) ─────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-4 bg-white">

          {/* Instructor */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 overflow-hidden"
              style={{ backgroundColor: accent.solid }}
            >
              {cls.teachers?.[0]?.profilePicture
                ? <img src={cls.teachers[0].profilePicture} alt="teacher" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Instructor</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{teacherName}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Footer — stats + open */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1 text-xs">
                <Users className="w-3.5 h-3.5" />
                {studentCount} student{studentCount !== 1 ? 's' : ''}
              </span>
              {cls.classCode && (
                <span className="flex items-center gap-1 text-xs font-mono">
                  <Key className="w-3.5 h-3.5" />
                  {cls.classCode}
                </span>
              )}
            </div>

            <button
              onClick={e => { e.stopPropagation(); onSelectClass?.(cls); }}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent.solid }}
            >
              Open <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm Modal ──────────────────────────────────────────── */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setShowConfirm(null)}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div
            className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-sm p-7 border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900">
              {showConfirm === 'delete' ? 'Delete class?' : 'Leave class?'}
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {showConfirm === 'delete'
                ? `"${cls.name}" will be permanently deleted for all members.`
                : `You'll be removed from "${cls.name}". Rejoin anytime with the class code.`
              }
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showConfirm === 'delete' ? handleDelete : handleLeave}
                disabled={isLoading}
                className={cn(
                  'flex-1 py-2.5 text-sm font-semibold rounded-xl text-white transition-colors flex items-center justify-center gap-2',
                  showConfirm === 'delete' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'
                )}
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : showConfirm === 'delete' ? 'Delete' : 'Leave'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
