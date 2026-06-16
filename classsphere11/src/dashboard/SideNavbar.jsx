import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Plus, Grid, Home, Calendar, Archive, Settings, LogOut, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SideNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Calendar', icon: Calendar },
    { name: 'Archived classes', icon: Archive },
    { name: 'Settings', icon: Settings },
  ];

  const getInitial = () => {
    if (user && user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col selection:bg-teal-100 antialiased overflow-hidden">
      
      {/* 1. THE TOP NAVBAR (Google Classroom Style) */}
      <header className="h-16 bg-white border-b border-gray-200 w-full px-4 md:px-6 flex items-center justify-between select-none relative z-[60]">
        {/* Left Group: Hamburger + Brand Element */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
              CS
            </div>
            <span className="text-gray-700 font-normal text-2xl tracking-tight hidden sm:block">
              Class<span className="text-teal-600 font-semibold">Sphere</span>
            </span>
          </div>
        </div>

        {/* Center Group: Main Navigation (Moved from bottom/sidebar) */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? 'text-teal-700 bg-teal-50' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Right Group: Action Menu Items */}
        <div className="flex items-center gap-2 text-gray-600 relative">
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors hidden xs:flex">
            <Plus className="w-6 h-6" />
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors hidden xs:flex">
            <Grid className="w-5 h-5" />
          </button>
          
          {/* User Profile Trigger */}
          <div className="relative ml-2">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-teal-700 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-sm cursor-pointer select-none hover:ring-4 hover:ring-teal-50 transition-all border-2 border-white"
            >
              {getInitial()}
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-[28px] shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-6 text-center border-b border-gray-50">
                      <div className="w-20 h-20 bg-teal-700 text-white font-black rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg border-4 border-teal-50">
                        {getInitial()}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 capitalize">{user?.username || 'User'}</h3>
                      <p className="text-sm text-slate-500 mb-4">{user?.email || 'user@classsphere.com'}</p>
                      <button className="px-6 py-2 border border-gray-200 rounded-full text-sm font-bold text-slate-700 hover:bg-gray-50 transition-colors">
                        Manage your account
                      </button>
                    </div>
                    
                    <div className="p-2">
                      <button className="w-full flex items-center gap-4 px-6 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors font-medium text-sm">
                        <User className="w-5 h-5 text-slate-400" /> My Profile
                      </button>
                      <button className="w-full flex items-center gap-4 px-6 py-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors font-medium text-sm">
                        <HelpCircle className="w-5 h-5 text-slate-400" /> Help & Feedback
                      </button>
                      <hr className="my-2 border-gray-50" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-bold text-sm"
                      >
                        <LogOut className="w-5 h-5" /> Sign Out
                      </button>
                    </div>
                    <div className="p-4 bg-gray-50 text-[10px] text-gray-400 text-center flex justify-center gap-4">
                      <span>Privacy Policy</span>
                      <span>•</span>
                      <span>Terms of Service</span>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 2. THE SIDEBAR & CONTENT AREA */}
      <div className="flex flex-1 relative bg-[#f8f9fa]">
        <motion.aside 
          animate={{ 
            width: isSidebarOpen ? (window.innerWidth < 640 ? '100%' : 280) : 0, 
            opacity: isSidebarOpen ? 1 : 0,
            x: isSidebarOpen ? 0 : -280
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`fixed sm:relative z-30 h-full bg-white border-r border-gray-200 flex flex-col pr-3 py-4 select-none overflow-hidden`}
        >
          {/* Classes Section in Sidebar */}
          <div className="px-6 mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Enrolled Classes</h3>
            <div className="space-y-2">
              {[
                { name: 'Advanced Web Design', color: 'bg-teal-600', initial: 'W' },
                { name: 'UI/UX Masterclass', color: 'bg-indigo-600', initial: 'U' },
                { name: 'Fullstack Systems', color: 'bg-amber-600', initial: 'F' }
              ].map((cls) => (
                <button 
                  key={cls.name}
                  className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all group text-left border border-transparent hover:border-gray-100"
                >
                  <div className={`w-8 h-8 ${cls.color} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                    {cls.initial}
                  </div>
                  <span className="text-sm font-bold text-gray-700 truncate">{cls.name}</span>
                </button>
              ))}
            </div>
            
            <button className="w-full mt-6 flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-gray-500 transition-colors border border-dashed border-gray-200">
              <Plus className="w-4 h-4" /> Join New Class
            </button>
          </div>

          <div className="mt-auto px-6 border-t border-gray-100 pt-4 pb-2">
            <button className="w-full flex items-center gap-4 p-3 text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors font-medium text-sm">
              <Archive className="w-5 h-5" /> Archived
            </button>
            <button className="w-full flex items-center gap-4 p-3 text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors font-medium text-sm">
              <Settings className="w-5 h-5" /> Settings
            </button>
          </div>
        </motion.aside>

        {/* 3. MAIN DASHBOARD CONTENT (The "Canvas") */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Welcome back, {user?.username?.split(' ')[0] || 'Scholar'}!
              </h1>
              <p className="text-slate-500 mt-2 font-medium">Here's what's happening in your classes.</p>
            </header>

            {/* Placeholder for Classes / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[28px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1">
                  <div className="h-32 bg-teal-600 p-6 relative">
                    <div className="absolute top-0 right-0 p-4">
                      <button className="text-white/80 hover:text-white"><Settings className="w-5 h-5" /></button>
                    </div>
                    <h2 className="text-white text-xl font-bold">Advanced Web Design</h2>
                    <p className="text-teal-100 text-sm opacity-80 mt-1">Section {i} • Semester 1</p>
                  </div>
                  <div className="p-6 min-h-[120px] flex items-end justify-between border-b border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-full border-2 border-white -mt-14 shadow-md flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="teacher" />
                    </div>
                  </div>
                  <div className="p-4 flex justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><Calendar className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><Archive className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}