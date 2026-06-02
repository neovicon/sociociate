import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Notification preferences saved');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold text-white">Notification Preferences</h1>
        <p className="text-slate-400 text-sm mt-1">Customize how you receive notifications.</p>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <form onSubmit={handleSaveChanges} className="space-y-6">
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Email Notifications</p>
                  <p className="text-xs text-slate-400 mt-0.5">Receive notifications via email.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Push Notifications</p>
                  <p className="text-xs text-slate-400 mt-0.5">Receive real-time notifications on your devices.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">SMS Notifications</p>
                  <p className="text-xs text-slate-400 mt-0.5">Receive notifications via text message.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={() => setSmsNotifications(!smsNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>

      {/* Notification Types */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Notification Types</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Account Activity</p>
                <p className="text-xs text-slate-400 mt-0.5">Login attempts, password changes</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Bell size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Product Updates</p>
                <p className="text-xs text-slate-400 mt-0.5">New features and improvements</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Promotional Offers</p>
                <p className="text-xs text-slate-400 mt-0.5">Special deals and discounts</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationsPage;