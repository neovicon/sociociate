import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Fingerprint, ArrowLeft, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const SecurityPage = () => {
  const navigate = useNavigate();

  const handleEnable2FA = () => {
    alert('2FA Setup instructions sent to your email.');
  };

  const handleUpdatePassword = () => {
    const newPass = window.prompt("Enter new password:");
    if (newPass) {
      alert('Password updated successfully!');
    }
  };

  const handleRevokeDevice = (device) => {
    if (window.confirm(`Are you sure you want to revoke access for ${device}?`)) {
      alert(`${device} session revoked successfully.`);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold text-white">Security Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account security and authentication methods.</p>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
            <p className="text-sm text-slate-400">Add an extra layer of security to your account.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <AlertCircle size={12} /> Disabled
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/30">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-1">
              <Fingerprint size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Authenticator App</p>
              <p className="text-xs text-slate-400 mt-0.5">Use apps like Google Authenticator or Authy to generate verification codes.</p>
            </div>
            <button onClick={handleEnable2FA} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm font-medium transition-all">
              Enable
            </button>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/30">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-1">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Email Verification</p>
              <p className="text-xs text-slate-400 mt-0.5">Receive verification codes via email.</p>
            </div>
            <button onClick={handleEnable2FA} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm font-medium transition-all">
              Enable
            </button>
          </div>
        </div>
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Password</h3>
            <p className="text-sm text-slate-400">Update your account password.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={12} /> Secure
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/30">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-1">
            <Key size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Current Password</p>
            <p className="text-xs text-slate-400 mt-0.5">Last changed 3 months ago.</p>
          </div>
          <button onClick={handleUpdatePassword} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm font-medium transition-all">
            Update Password
          </button>
        </div>
      </motion.div>

      {/* Active Sessions */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
        <p className="text-sm text-slate-400 mb-6">Manage devices that have access to your account.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-indigo-500/10 text-indigo-400">
                <Shield size={20} />
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
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">iPhone 13 - Safari</p>
                <p className="text-xs text-slate-400 mt-0.5">Kathmandu, Nepal • Last active 2h ago</p>
              </div>
            </div>
            <button onClick={() => handleRevokeDevice('iPhone 13 - Safari')} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
              Revoke
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SecurityPage;