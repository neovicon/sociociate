import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, FileText, BarChart3, Settings, LogOut, Plus, Bell, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import appLogo from '../assets/app_logo.png';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard", end: true },
    { icon: <Calendar size={20} />, label: "Schedule", path: "/dashboard/schedule" },
    { icon: <FileText size={20} />, label: "Content", path: "/dashboard/content" },
    { icon: <BarChart3 size={20} />, label: "Analytics", path: "/dashboard/analytics" },
  ];

  const bottomNavItems = [
    { icon: <Settings size={20} />, label: "Settings", path: "/dashboard/settings" },
    { icon: <User size={20} />, label: "Profile", path: "/dashboard/profile" },
  ];

  const NavItem = ({ icon, label, path, end = false, onClick }) => (
    <NavLink 
      to={path} 
      end={end}
      onClick={onClick}
      className={({ isActive }) => 
        `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`
      }
    >
      {icon} <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">


      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`w-64 border-r border-white/10 bg-slate-950 flex flex-col fixed md:relative z-40 h-full ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}`}
          >
            <div className="p-6">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-2 mb-8">
                <img src={appLogo} alt="Logo" className="w-8 h-8 object-contain" />
                SocioCiate
              </div>
              <nav className="space-y-1.5">
                {navItems.map((item) => (
                  <NavItem key={item.path} {...item} onClick={() => setIsMobileMenuOpen(false)} />
                ))}
              </nav>
            </div>
            
            <div className="mt-auto p-6 space-y-1.5 border-t border-white/5">
              {bottomNavItems.map((item) => (
                <NavItem key={item.path} {...item} onClick={() => setIsMobileMenuOpen(false)} />
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={20} /> <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 border-b border-white/10 flex items-center justify-between md:justify-end px-6 md:px-8 bg-slate-900/30 backdrop-blur-md shrink-0 z-10">
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.dispatchEvent(new Event('openCreatePostModal'))}
              className="hidden sm:flex bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-medium items-center gap-2 text-white transition-all shadow-lg shadow-indigo-500/25"
            >
              <Plus size={16} /> Create Post
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border border-slate-950"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      <div className="p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                        <p className="text-sm text-slate-300">Your post was successfully published to Twitter!</p>
                        <p className="text-xs text-slate-500 mt-1">2 mins ago</p>
                      </div>
                      <div className="p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                        <p className="text-sm text-slate-300">Your scheduled post is going out in 15 minutes.</p>
                        <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-white/10 text-center">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Mark all as read</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div 
              onClick={() => navigate('/dashboard/profile')}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md hover:opacity-90 transition-opacity"
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
