import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Settings, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Layout,
  MessageSquare
} from 'lucide-react';
import { cn } from '../utils';

import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ isOpen, activeTab, onTabChange, classes = [], onSelectClass, user: propUser, unreadMessagesCount = 0 }) {
  const [localUser, setLocalUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setLocalUser(JSON.parse(storedUser));
      }
    };

    if (!propUser) {
      loadUser();
    }

    const handleProfileUpdate = (e) => {
      if (e.detail && !propUser) {
        setLocalUser(e.detail);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [propUser]);

  const user = propUser || localUser;
  const role = user?.role || 'student';

  const menuGroups = [
    {
      label: t('main'),
      items: [
        { name: t('home'), icon: Home, id: 'Home' },
        { name: t('messages'), icon: MessageSquare, id: 'Messages' },
        { name: t('assignments'), icon: CheckSquare, id: 'Assignments' },
        { name: t('calendar'), icon: Calendar, id: 'Calendar' },
        { name: t('settings'), icon: Settings, id: 'Settings' },
      ]
    }
  ];

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={cn(
          "transition-all duration-200 group mb-1 relative overflow-hidden flex items-center",
          isOpen 
            ? "w-full rounded-r-full text-sm font-black px-6 py-3 gap-4 justify-start" 
            : "w-12 h-12 rounded-2xl justify-center mx-auto text-center p-0",
          isActive 
            ? "bg-teal-50 text-teal-600" 
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 transition-colors duration-200",
          isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
        )} />
        <span className={cn(
          "whitespace-nowrap transition-all duration-200",
          !isOpen && "opacity-0 invisible translate-x-[-10px] w-0 overflow-hidden",
          isOpen && "opacity-100 visible translate-x-0 ml-0"
        )}>
          {item.name}
        </span>
        {item.id === 'Messages' && unreadMessagesCount > 0 && (
          <span className={cn(
            "bg-rose-500 text-white rounded-full font-black text-[9px] flex items-center justify-center shrink-0 shadow-sm shadow-rose-100",
            isOpen ? "ml-auto px-2.5 py-0.5" : "absolute top-1 right-1 w-4 h-4 text-[7px]"
          )}>
            {unreadMessagesCount}
          </span>
        )}
      </button>
    );
  };

  const renderClassItem = (cls) => {
    const isActive = activeTab === 'Classroom' && cls._id === (cls.id || cls._id);
    return (
      <button
        key={cls._id}
        onClick={() => onSelectClass && onSelectClass(cls)}
        className={cn(
          "transition-all duration-200 group mb-1 relative overflow-hidden flex items-center",
          isOpen 
            ? "w-full rounded-r-full text-sm font-bold px-6 py-2 gap-3 justify-start" 
            : "w-12 h-12 rounded-2xl justify-center mx-auto text-center p-0",
          isActive ? "bg-teal-50 text-teal-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: cls.color || '#0ea5a4' }}>
          {cls.name?.charAt(0)}
        </div>
        <span className={cn(
          "whitespace-nowrap transition-all duration-200",
          !isOpen && "opacity-0 invisible translate-x-[-10px] w-0 overflow-hidden",
          isOpen && "opacity-100 visible translate-x-0 ml-0"
        )}>
          {cls.name}
        </span>
      </button>
    );
  };

  return (
    <motion.aside 
      animate={{ 
        width: isMobile ? (isOpen ? 280 : 0) : (isOpen ? 280 : 88),
        x: isMobile ? (isOpen ? 0 : -280) : 0,
        opacity: isMobile ? (isOpen ? 1 : 0) : 1
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col bg-white border-r border-slate-100 h-full py-6 select-none z-40 overflow-hidden shrink-0",
        isMobile ? "fixed top-16 left-0 h-[calc(100vh-64px)] shadow-2xl" : "relative",
        isOpen ? "pr-4" : "pr-0"
      )}
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8">
        {/* Navigation Tabs First (Top) */}
        {menuGroups.map((group) => (
          <div key={group.label}>
            {isOpen && (
              <p className="px-6 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map(renderMenuItem)}
            </div>
          </div>
        ))}

        {/* Classes Section Second (Below) */}
        <div>
          {isOpen && (
            <p className="px-6 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              {t('myClasses')}
            </p>
          )}
          <div className="space-y-1 px-2">
            {classes && classes.length > 0 ? (
              classes.map(renderClassItem)
            ) : (
              isOpen && <p className="px-6 text-xs text-slate-400 italic">{t('noClassesYet')}</p>
            )}
          </div>
        </div>
      </div>

      {/* User Info / Role Card at the bottom */}
      {user && (
        <div className={cn(
          "mt-auto border-t border-slate-100 pt-6",
          isOpen ? "pl-6 pr-2" : "px-0"
        )}>
          <div className={cn(
            "flex items-center transition-all duration-200 rounded-2xl",
            isOpen 
              ? "bg-slate-50 border border-slate-100 p-3 gap-3 justify-start" 
              : "w-12 h-12 justify-center mx-auto bg-transparent border-transparent p-0"
          )}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Avatar" className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-md border border-slate-100/50" />
            ) : (
              <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            )}
            
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.username}</p>
                <span className={cn(
                  "inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-1",
                  user.role === 'teacher' ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                  user.role === 'admin' ? "bg-rose-50 text-rose-600 border border-rose-100" :
                  "bg-emerald-50 text-emerald-600 border border-emerald-100"
                )}>
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
