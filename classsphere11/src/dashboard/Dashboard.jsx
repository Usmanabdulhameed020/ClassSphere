import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import DashboardRenderer from './components/DashboardRenderer';
import { dashboardService } from './services/dashboardService';
import { adminService } from './services/adminService';
import axios from 'axios';
import { ThemeProvider } from './context/ThemeContext';
import AIAssistant from './components/AIAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from './utils/socketManager';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [stats, setStats] = useState({ activeSpheres: 0, citizens: 0, insights: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [newClassData, setNewClassData] = useState({ name: '', section: '', subject: '' });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const totalUnread = res.data.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
      setUnreadMessagesCount(totalUnread);
    } catch (err) {
      console.error('Error fetching unread messages count:', err);
    }
  };

  // Listen to profile updates in real-time from settings
  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setUser(e.detail);
      }
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('messagesRead', fetchUnreadCount);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('messagesRead', fetchUnreadCount);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser) {
      if (parsedUser.role === 'pending') {
        navigate('/select-role');
        return;
      }
      setUser(parsedUser);
      fetchDashboardData(parsedUser);
      fetchUnreadCount();
      
      // Initialize socket to trigger auto-registration
      const socket = getSocket();
      const handleNewMessage = () => {
        fetchUnreadCount();
      };
      
      if (socket) {
        socket.on('receivePrivateMessage', handleNewMessage);
      }
      
      // Check if it's the first login from Google
      if (localStorage.getItem('isFirstLogin') === 'true') {
        setShowRoleModal(true);
      }

      return () => {
        if (socket) {
          socket.off('receivePrivateMessage', handleNewMessage);
        }
      };
    } else {
      setIsLoading(false); // No user found
    }
  }, []);

  const handleUpdateRole = async (role) => {
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/select-role', { role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.removeItem('isFirstLogin');
      setUser(updatedUser);
      setShowRoleModal(false);
      fetchDashboardData(updatedUser);
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setIsActionLoading(false);
    }
  };

  const fetchDashboardData = async (currentUser) => {
    // We don't necessarily need to block the whole UI with a giant spinner 
    // if we can load components progressively.
    const activeUser = currentUser || user;
    const isAdmin = activeUser?.role === 'admin';
    
    // Fetch classes
    const fetchClasses = async () => {
      try {
        const res = await dashboardService.getClasses();
        setClasses(res || []);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        setClasses([]);
      } finally {
        // Once classes are loaded, we can show the main dashboard
        setIsLoading(false);
      }
    };

    // Fetch stats in background
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res || { activeSpheres: 0, citizens: 0, insights: 0 });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };

    // Trigger both, but classes will hide the initial loader
    fetchClasses();
    fetchStats();
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      await dashboardService.joinClass(classCode);
      setShowJoinModal(false);
      setClassCode('');
      fetchDashboardData(user);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to join class');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      await dashboardService.createClass(newClassData);
      setShowCreateModal(false);
      setNewClassData({ name: '', section: '', subject: '' });
      fetchDashboardData(user);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create class');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Initializing Ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
    <div className="flex flex-col h-screen bg-[#fcfdfe] overflow-hidden font-sans selection:bg-teal-100 selection:text-teal-900">
      <TopNavbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        user={user} 
        classes={classes}
        onSelectClass={(cls) => {
          setSelectedClass(cls);
          setActiveTab('Classroom');
        }}
        onJoinClass={() => setShowJoinModal(true)}
        onCreateClass={() => setShowCreateModal(true)}
        onAdminClick={() => {
          setSelectedClass(null);
          setActiveTab('Admin');
        }}
        onLogoClick={() => {
          setSelectedClass(null);
          setActiveTab('Home');
        }}
        onSettingsClick={() => {
          setSelectedClass(null);
          setActiveTab('Settings');
        }}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden top-16"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedClass(null);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          classes={classes}
          onSelectClass={(cls) => {
            setSelectedClass(cls);
            setActiveTab('Classroom');
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          user={user}
          unreadMessagesCount={unreadMessagesCount}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          <DashboardRenderer 
            activeTab={activeTab}
            selectedClass={selectedClass}
            user={user}
            classes={classes}
            stats={stats}
            onSelectClass={(cls) => {
              setSelectedClass(cls);
              setActiveTab('Classroom');
            }}
            onBackToDashboard={() => {
              setSelectedClass(null);
              setActiveTab('Home');
            }}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSelectedClass(null);
            }}
          />
        </main>
      </div>

      {/* Modals and Overlays */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowJoinModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Join Sphere</h3>
                <button onClick={() => setShowJoinModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleJoinClass} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Code</label>
                  <input 
                    type="text" required
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="Enter 7-digit code"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold text-center tracking-widest text-xl uppercase"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isActionLoading || classCode.length < 5}
                  className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Sphere'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Create Sphere</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateClass} className="p-8 space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sphere Name</label>
                    <input 
                      type="text" required
                      value={newClassData.name}
                      onChange={(e) => setNewClassData({ ...newClassData, name: e.target.value })}
                      placeholder="e.g. Advanced Quantum Physics"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
                      <input 
                        type="text"
                        value={newClassData.section}
                        onChange={(e) => setNewClassData({ ...newClassData, section: e.target.value })}
                        placeholder="e.g. 2026-B"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <input 
                        type="text"
                        value={newClassData.subject}
                        onChange={(e) => setNewClassData({ ...newClassData, subject: e.target.value })}
                        placeholder="e.g. Science"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isActionLoading || !newClassData.name}
                  className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Establish Sphere'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showRoleModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-white/20 p-10 text-center space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900">Welcome to ClassSphere!</h3>
                <p className="text-slate-500 text-lg">To personalize your experience, please select your primary role in the ecosystem.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Student', 'Teacher', 'Admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleUpdateRole(role.toLowerCase())}
                    disabled={isActionLoading}
                    className="p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent hover:border-teal-500 hover:bg-white transition-all group"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 transition-colors">
                      <Plus className="text-teal-600 group-hover:text-white" />
                    </div>
                    <span className="font-black text-slate-900 uppercase tracking-widest text-xs">{role}</span>
                  </button>
                ))}
              </div>

              {isActionLoading && (
                <div className="flex items-center justify-center gap-2 text-teal-600 font-bold">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Configuring your profile...</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AIAssistant classId={selectedClass?._id} />
    </div>
    </ThemeProvider>
  );
}
