import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onUserJoined, onUserLeft, removeUserJoinedListener, removeUserLeftListener } from '../utils/socketManager';
import { UserPlus, UserMinus, Shield, BookOpen, Users } from 'lucide-react';

const getRoleColor = (role) => {
  switch(role?.toLowerCase()) {
    case 'admin':
      return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: 'text-red-600' };
    case 'teacher':
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-600' };
    case 'student':
      return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: 'text-emerald-600' };
    default:
      return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', icon: 'text-slate-600' };
  }
};

const getRoleIcon = (role) => {
  switch(role?.toLowerCase()) {
    case 'admin':
      return <Shield className="w-5 h-5" />;
    case 'teacher':
      return <BookOpen className="w-5 h-5" />;
    case 'student':
      return <Users className="w-5 h-5" />;
    default:
      return <UserPlus className="w-5 h-5" />;
  }
};

const getRoleMessage = (username, role) => {
  const roleLabel = role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase() || 'User';
  switch(role?.toLowerCase()) {
    case 'admin':
      return `👨‍💼 Admin ${username} joined the class`;
    case 'teacher':
      return `👨‍🏫 Teacher ${username} joined the class`;
    case 'student':
      return `👨‍🎓 Student ${username} joined the class`;
    default:
      return `${username} joined the class`;
  }
};

export default function RealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleUserJoined = (data) => {
      const id = `${Date.now()}-joined`;
      const colors = getRoleColor(data.user?.role);
      setNotifications(prev => [...prev, {
        id,
        type: 'joined',
        message: getRoleMessage(data.user?.username, data.user?.role),
        user: data.user?.username,
        role: data.user?.role,
        totalUsers: data.totalUsers,
        colors
      }]);
      // Auto-remove after 6 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 6000);
    };

    const handleUserLeft = (data) => {
      const id = `${Date.now()}-left`;
      setNotifications(prev => [...prev, {
        id,
        type: 'left',
        message: 'A user left the class',
        totalUsers: data.totalUsers
      }]);
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    onUserJoined(handleUserJoined);
    onUserLeft(handleUserLeft);

    return () => {
      removeUserJoinedListener();
      removeUserLeftListener();
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-2xl shadow-2xl border pointer-events-auto flex items-center gap-3 max-w-sm ${
              notif.type === 'joined'
                ? `${notif.colors.bg} ${notif.colors.border} ${notif.colors.text}`
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            {notif.type === 'joined' ? (
              <div className={notif.colors.icon}>
                {getRoleIcon(notif.role)}
              </div>
            ) : (
              <UserMinus className="w-5 h-5 text-slate-400 flex-shrink-0" />
            )}
            <div className="text-sm font-bold flex-1">
              <div>{notif.message}</div>
              {notif.totalUsers && (
                <div className="text-xs opacity-75 mt-1 font-medium">
                  {notif.totalUsers} {notif.totalUsers === 1 ? 'user' : 'users'} in class
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
