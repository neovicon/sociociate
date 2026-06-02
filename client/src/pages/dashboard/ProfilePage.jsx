import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, CreditCard, Bell, LogOut, CheckCircle2, AlertCircle, Camera, Smartphone, Key, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Changes saved');
  };

  const handleEnable2FA = () => {
    // Handle enabling 2FA
    console.log('Enable 2FA');
  };

  const handleUpdatePassword = () => {
    // Handle updating password
    console.log('Update password');
  };

  const handleRevokeDevice = () => {
    // Handle revoking device
    console.log('Device revoked');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white" style={{ margin: 0, fontSize: '24px' }}>
          Profile Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Navigation/Overview */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-white/10 hover:bg-slate-700 transition-colors text-slate-300">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'User Name'}</h2>
            <p className="text-slate-400 text-sm">{user?.email || 'user@example.com'}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Shield size={12} /> Pro Plan
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-4 rounded-2xl space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Account</div>
            <button onClick={() => handleNavigation('/dashboard/profile/personal-info')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-medium transition-colors">
              <User size={18} /> Personal Info
            </button>
            <button onClick={() => handleNavigation('/dashboard/profile/security')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
              <Shield size={18} /> Security
            </button>
            <button onClick={() => handleNavigation('/dashboard/profile/billing')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
              <CreditCard size={18} /> Billing
            </button>
            <button onClick={() => handleNavigation('/dashboard/profile/notifications')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
              <Bell size={18} /> Notifications
            </button>
            <div className="pt-4 mt-2 border-t border-white/5">
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Main Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
            <form onSubmit={handleSaveChanges} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name || ''} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || ''} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Company (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Acme Corp" 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Timezone</label>
                  <select className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                    <option selected>NPT (Nepal Time)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          {/* Security & Authentication */}
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Security</h3>
            <p className="text-sm text-slate-400 mb-6">Manage your password and security preferences.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/30">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400 mt-0.5">Secure your account with 2FA.</p>
                  </div>
                </div>
                <button onClick={handleEnable2FA} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm font-medium transition-all">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/30">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Key size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Password</p>
                    <p className="text-xs text-slate-400 mt-0.5">Last changed 3 months ago.</p>
                  </div>
                </div>
                <button onClick={handleUpdatePassword} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm font-medium transition-all">
                  Update
                </button>
              </div>
            </div>
          </motion.div>

          {/* Connected Devices */}
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-full bg-indigo-500/10 text-indigo-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      MacBook Pro - Chrome <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">Current Session</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Kathmandu, Nepal • Active now</p>
                  </div>
                </div>
              </div>
              <div className="h-px w-full bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-full bg-slate-800 text-slate-400">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300">iPhone 13 - Safari</p>
                    <p className="text-xs text-slate-400 mt-0.5">Kathmandu, Nepal • Last active 2h ago</p>
                  </div>
                </div>
                <button onClick={handleRevokeDevice} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
                  Revoke
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
