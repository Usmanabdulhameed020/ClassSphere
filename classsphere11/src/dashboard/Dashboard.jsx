import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import DashboardRenderer from './components/DashboardRenderer';
import { dashboardService } from './services/dashboardService';
import axios from 'axios';
import API_BASE_URL from '../config';
import { ThemeProvider } from './context/ThemeContext';
import AIAssistant from './components/AIAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2, Home, MessageSquare, CheckSquare, Calendar, Sparkles, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from './utils/socketManager';
import { cn } from './utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || 'Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [stats, setStats] = useState({ activeSpheres: 0, citizens: 0, insights: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [newClassData, setNewClassData] = useState({ name: '', section: '', subject: '' });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isAIOpen, setIsAIOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (selectedClass) {
      sessionStorage.setItem('selectedClassId', (selectedClass._id || selectedClass.id).toString());
    } else {
      sessionStorage.removeItem('selectedClassId');
    }
  }, [selectedClass]);

  useEffect(() => {
    if (classes && classes.length > 0) {
      const storedClassId = sessionStorage.getItem('selectedClassId');
      if (storedClassId) {
        const found = classes.find(c => (c._id || c.id)?.toString() === storedClassId);
        if (found) {
          setSelectedClass(found);
        } else {
          sessionStorage.removeItem('selectedClassId');
        }
      }
    }
  }, [classes]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {
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
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser) {

      setUser(parsedUser);
      fetchDashboardData(parsedUser);
      fetchUnreadCount();
      setIsLoading(false); // Enable progressive rendering of dashboard
      
      // Initialize socket to trigger auto-registration
      const socket = getSocket();
      const handleNewMessage = () => {
        fetchUnreadCount();
      };
      
      if (socket) {
        socket.on('receivePrivateMessage', handleNewMessage);
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
      // Normalize code: trim whitespace and convert to lowercase
      const normalizedCode = classCode.trim().toLowerCase();
      await dashboardService.joinClass(normalizedCode);
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
    <div className="flex flex-col h-dvh bg-[#fcfdfe] overflow-hidden font-sans selection:bg-teal-100 selection:text-teal-900">
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
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden top-16"
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
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          classes={classes}
          onSelectClass={(cls) => {
            setSelectedClass(cls);
            setActiveTab('Classroom');
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          user={user}
          unreadMessagesCount={unreadMessagesCount}
        />
        
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:pb-8 lg:p-8 custom-scrollbar relative">
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
                    placeholder="Enter class code"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none font-bold text-center tracking-widest text-xl"
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


      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-100/80 px-5 flex items-center justify-center lg:hidden z-20 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {/* AI Assistant Button */}
        <button
          onClick={() => setIsAIOpen(!isAIOpen)}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all duration-300 font-black text-xs active:scale-95 relative overflow-hidden shadow-lg w-full max-w-[220px] justify-center",
            isAIOpen 
              ? "bg-slate-900 text-white shadow-slate-900/20" 
              : "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-teal-500/20 hover:shadow-teal-500/30"
          )}
        >
          {isAIOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Close AI</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
              <span>Ask AI</span>
            </>
          )}
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-300 rounded-full border border-white" />
        </button>
      </div>

      <AIAssistant classId={selectedClass?._id} isOpen={isAIOpen} setIsOpen={setIsAIOpen} />
    </div>
    </ThemeProvider>
  );
}
