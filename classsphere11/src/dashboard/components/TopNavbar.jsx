import React, { useState, useEffect } from 'react';
import { Menu, Plus, Grid, LogOut, User, HelpCircle, Shield, Settings, Bell, Search, X, Loader2, CheckCircle2, AlertCircle, Info, Users, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils';
import { notificationService } from '../services/notificationService';
import { getSocket } from '../utils/socketManager';
import { useTheme } from '../context/ThemeContext';

export default function TopNavbar({ onToggleSidebar, user, classes = [], onSelectClass, onJoinClass, onCreateClass, onLogoClick, onSettingsClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isSpheresMenuOpen, setIsSpheresMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { t } = useTheme();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      const socket = getSocket();
      const handleRealtimeNotification = (notif) => {
        setNotifications(prev => {
          if (prev.some(n => n._id === notif._id)) return prev;
          return [notif, ...prev];
        });
        setUnreadCount(prev => prev + 1);
      };
      
      socket.on('receiveNotification', handleRealtimeNotification);

      // Poll for new notifications every 30 seconds as fallback
      const interval = setInterval(fetchNotifications, 30000);
      
      return () => {
        clearInterval(interval);
        socket.off('receiveNotification', handleRealtimeNotification);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const performLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitial = () => {
    if (user && user.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 w-full px-4 flex items-center justify-between select-none z-[60]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-all active:scale-95"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { onLogoClick(); navigate('/dashboard'); }}>
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
            CS
          </div>
          <div className="flex flex-col sm:block">
            <span className="text-slate-700 font-bold text-lg sm:text-xl tracking-tight leading-none">
              ClassSphere
            </span>
            <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest sm:hidden leading-none mt-0.5">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Plus Menu */}
        <div className="relative">
          <button 
            onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
            className={cn(
              "p-2 rounded-full transition-all active:scale-95 flex items-center justify-center",
              isPlusMenuOpen ? "bg-slate-100 text-teal-600" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Plus className={cn("w-6 h-6 transition-transform duration-300", isPlusMenuOpen && "rotate-90")} />
          </button>

          <AnimatePresence>
            {isPlusMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsPlusMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1"
                >
                  <button 
                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-3"
                    onClick={() => { setIsPlusMenuOpen(false); onJoinClass(); }}
                  >
                    {t('joinClass')}
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-3"
                    onClick={() => { setIsPlusMenuOpen(false); onCreateClass(); }}
                  >
                    {t('createClass')}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              "p-2 rounded-full transition-all active:scale-95 flex items-center justify-center relative",
              isNotificationsOpen ? "bg-slate-100 text-teal-600" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-900 text-sm">{t('notifications')}</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                      >
                        {t('markAllAsRead')}
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                           <Bell className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-xs text-slate-400 font-bold italic">{t('noNotificationsYet')}</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id}
                          onClick={() => {
                            handleMarkRead(notif._id);
                            if (notif.link) navigate(notif.link);
                            setIsNotificationsOpen(false);
                          }}
                          className={cn(
                            "p-4 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                            !notif.isRead && "bg-teal-50/20"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            notif.type === 'assignment' ? "bg-indigo-50 text-indigo-600" :
                            notif.type === 'grade' ? "bg-teal-50 text-teal-600" :
                            notif.type === 'attendance' ? "bg-amber-50 text-amber-600" :
                            "bg-slate-50 text-slate-600"
                          )}>
                             {notif.type === 'assignment' ? <CheckCircle2 className="w-5 h-5" /> :
                              notif.type === 'grade' ? <Shield className="w-5 h-5" /> :
                              notif.type === 'attendance' ? <Info className="w-5 h-5" /> :
                              <Bell className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 leading-tight mb-1">{notif.title}</p>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-2">{notif.message}</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">{new Date(notif.createdAt).toLocaleDateString()}</p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-teal-500 rounded-full absolute right-4 top-1/2 -translate-y-1/2" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  <button className="w-full py-3 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-colors border-t border-slate-100">
                    {t('viewAllActivity')}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Spheres Switcher (Grid) */}
        <div className="relative">
          <button 
            onClick={() => setIsSpheresMenuOpen(!isSpheresMenuOpen)}
            className={cn(
              "p-2 rounded-full transition-all active:scale-95 flex items-center justify-center",
              isSpheresMenuOpen ? "bg-slate-100 text-teal-600" : "text-slate-600 hover:bg-slate-100"
            )}
            title="My Spheres"
          >
            <Grid className="w-6 h-6" />
          </button>

          <AnimatePresence>
            {isSpheresMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSpheresMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">{t('mySpheres')}</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-1">
                    {classes.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-xs text-slate-400 font-bold italic">{t('noSpheresYet')}</p>
                      </div>
                    ) : (
                      classes.map((cls) => (
                        <button
                          key={cls._id}
                          onClick={() => {
                            setIsSpheresMenuOpen(false);
                            onSelectClass(cls);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group text-left"
                        >
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                            style={{ background: cls.color || '#0ea5a4' }}
                          >
                            {cls.name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate group-hover:text-teal-600 transition-colors">{cls.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase truncate">{cls.section || 'General'}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  <button 
                    onClick={() => { setIsSpheresMenuOpen(false); onJoinClass(); }}
                    className="w-full py-3 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors"
                  >
                    {t('joinNewSphere')}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* User Profile */}
        <div className="relative ml-1">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 bg-slate-200 text-slate-700 font-bold rounded-full flex items-center justify-center text-sm hover:ring-4 hover:ring-teal-500/20 transition-all overflow-hidden cursor-pointer shadow-inner"
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitial()
            )}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                >
                  <div className="p-4 text-center border-b border-slate-100">
                    <div className="w-16 h-16 bg-slate-200 text-slate-700 font-bold rounded-full flex items-center justify-center text-2xl mx-auto mb-2 overflow-hidden shadow-inner border border-slate-100">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        getInitial()
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{user?.username || 'User'}</h3>
                    <p className="text-xs text-slate-500">{user?.email || 'user@classsphere.com'}</p>
                  </div>
                  
                  <div className="p-1">
                    <button 
                      onClick={() => { setIsProfileOpen(false); onSettingsClick && onSettingsClick(); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-all text-sm font-bold animate-fade-in"
                    >
                      <Settings className="w-4 h-4 text-slate-400" /> {t('accountSettings')}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-bold"
                    >
                      <LogOut className="w-4 h-4" /> {t('signOut')}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm relative z-10 overflow-hidden border border-slate-100 p-8 text-center space-y-6 text-slate-800"
            >
              <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">Sign Out</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Are you sure you want to log out of ClassSphere?</p>
              </div>
              <div className="flex gap-4 font-sans">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={performLogout}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-100"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

const UserPlus = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
