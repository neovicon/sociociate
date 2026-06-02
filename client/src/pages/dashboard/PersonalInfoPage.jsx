import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Building, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const PersonalInfoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Personal info saved');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold text-white">Personal Information</h1>
        <p className="text-slate-400 text-sm mt-1">Update your personal details and contact information.</p>
      </motion.div>

      {/* Personal Info Form */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <form onSubmit={handleSaveChanges} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || ''}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Building size={16} /> Company (Optional)
              </label>
              <input
                type="text"
                placeholder="Acme Corp"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Globe size={16} /> Timezone
              </label>
              <select className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
                <option selected>NPT (Nepal Time)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfoPage;