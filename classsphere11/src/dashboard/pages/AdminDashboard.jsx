import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { 
  Users, 
  BookOpen, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentClasses, setRecentClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', message: '' });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, logsRes, usersRes, classesRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAuditLogs(),
        adminService.getUsers('all', ''),
        adminService.getClasses()
      ]);
      setStats(statsRes);
      setLogs(logsRes);
      setRecentUsers(usersRes.slice(0, 5));
      setRecentClasses(classesRes.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setIsBroadcasting(true);
    try {
      await adminService.broadcast(broadcastData);
      setShowBroadcastModal(false);
      setBroadcastData({ title: '', message: '' });
      alert('Broadcast sent successfully to all citizens.');
    } catch (error) {
      console.error('Broadcast failed:', error);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleAuditReport = async () => {
    setShowAuditModal(true);
  };

  const handleMaintenanceToggle = () => {
    setMaintenanceEnabled(!maintenanceEnabled);
    setShowMaintenanceModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600/30" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-teal-600', sub: `${stats?.teachers} Teachers, ${stats?.students} Students`, tab: 'Users' },
    { title: 'Active Spheres', value: stats?.totalClasses, icon: BookOpen, color: 'bg-indigo-600', sub: 'Global classroom count', tab: 'Classes' },
    { title: 'System Status', value: stats?.systemHealth, icon: ShieldCheck, color: 'bg-emerald-500', sub: 'Last ping: Healthy' },
    { title: 'Server Load', value: 'Low', icon: Activity, color: 'bg-amber-500', sub: 'Optimized for Scale' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Command Center</h1>
        <p className="text-slate-500 mt-2 font-medium">Platform-wide overview and administrative controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => stat.tab && onNavigate(stat.tab)}
            className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between transition-all ${stat.tab ? 'cursor-pointer hover:border-teal-500 hover:shadow-xl hover:shadow-teal-100/20' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Citizens */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Users className="w-5 h-5 text-teal-600" /> Recent Citizens
               </h2>
               <button onClick={() => onNavigate('Users')} className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">View All</button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-slate-50">
                     <th className="text-left py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Member</th>
                     <th className="text-left py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Role</th>
                     <th className="text-right py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {recentUsers.map((user) => (
                     <tr key={user._id} className="border-b border-slate-50 last:border-0">
                       <td className="py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                             {user.username.charAt(0)}
                           </div>
                           <span className="text-sm font-bold text-slate-700">{user.username}</span>
                         </div>
                       </td>
                       <td className="py-4">
                         <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'}`}>
                           {user.role}
                         </span>
                       </td>
                       <td className="py-4 text-right">
                         <div className={`w-2 h-2 rounded-full inline-block ${user.isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Active Spheres Grid */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <BookOpen className="w-5 h-5 text-teal-600" /> Active Spheres
               </h2>
               <button onClick={() => onNavigate('Classes')} className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">Manage All</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentClasses.map((cls) => (
                  <div key={cls?._id || Math.random()} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${cls?.color || 'bg-teal-600'} flex items-center justify-center text-white font-black`}>
                      {cls?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{cls?.name || 'Unnamed Sphere'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{cls?.subject || 'General'}</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-lg font-black mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400" /> Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('Users')}
                className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-sm font-black transition-all text-left px-6"
              >
                Manage Citizens
              </button>
              <button 
                onClick={() => onNavigate('Classes')}
                className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-sm font-black transition-all text-left px-6"
              >
                Audit All Spheres
              </button>
              <button 
                onClick={() => setShowBroadcastModal(true)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-sm font-black transition-all text-left px-6"
              >
                Broadcast Announcement
              </button>
              <button 
                onClick={handleAuditReport}
                className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-sm font-black transition-all text-left px-6"
              >
                System Audit Report
              </button>
              <button 
                onClick={handleMaintenanceToggle}
                className="w-full py-4 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 backdrop-blur-md rounded-2xl text-sm font-black transition-all text-left px-6 border border-rose-500/30"
              >
                Maintenance Mode
              </button>
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
               <Activity className="w-5 h-5 text-teal-600" /> System Logs
             </h2>
             <div className="space-y-4">
                {logs.length === 0 ? (
                  <p className="text-center py-10 text-slate-400 font-medium italic">No recent system activity logs.</p>
                ) : logs.map((log, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-teal-500'}`} />
                    <span className="text-sm font-bold text-slate-700 flex-1">{log.msg}</span>
                    <span className="text-xs font-medium text-slate-400">{new Date(log.time).toLocaleTimeString()}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              onClick={() => setShowBroadcastModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50">
                <h3 className="text-3xl font-black text-slate-900">Broadcast</h3>
                <p className="text-slate-500 font-medium mt-1">Send a priority alert to all citizens.</p>
              </div>

              <form onSubmit={handleBroadcast} className="p-10 space-y-6">
                <div className="space-y-4">
                  <input 
                    type="text" required placeholder="Subject"
                    value={broadcastData.title}
                    onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                  />
                  <textarea 
                    required placeholder="Message content..."
                    value={broadcastData.message}
                    onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl py-4 px-6 font-bold outline-none transition-all min-h-[150px] resize-none"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button" onClick={() => setShowBroadcastModal(false)}
                    className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" disabled={isBroadcasting}
                    className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isBroadcasting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deploy Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audit Report Modal */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              onClick={() => setShowAuditModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50">
                <h3 className="text-3xl font-black text-slate-900">System Audit Report</h3>
                <p className="text-slate-500 font-medium mt-1">Recent system activity and events.</p>
              </div>
              <div className="p-10">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-center text-slate-400 py-8">No audit logs available.</p>
                  ) : logs.slice(0, 10).map((log, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">{log.msg}</span>
                        <span className="text-xs font-medium text-slate-400">{new Date(log.time).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowAuditModal(false)}
                  className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Maintenance Mode Modal */}
      <AnimatePresence>
        {showMaintenanceModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
              onClick={() => setShowMaintenanceModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-rose-100">
                <h3 className="text-3xl font-black text-slate-900">Maintenance Mode</h3>
                <p className="text-slate-500 font-medium mt-1">System maintenance configuration.</p>
              </div>
              <div className="p-10 space-y-6">
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-slate-900">Status</h4>
                      <p className="text-sm text-slate-600 mt-1">Maintenance mode is currently <span className={`font-black ${maintenanceEnabled ? 'text-rose-600' : 'text-emerald-600'}`}>{maintenanceEnabled ? 'ENABLED' : 'DISABLED'}</span></p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${maintenanceEnabled ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setMaintenanceEnabled(!maintenanceEnabled)}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${maintenanceEnabled ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                >
                  {maintenanceEnabled ? 'Disable Maintenance' : 'Enable Maintenance'}
                </button>
                <button 
                  onClick={() => setShowMaintenanceModal(false)}
                  className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
