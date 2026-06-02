import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { BarChart3, TrendingUp, TrendingDown, Users, Eye, Heart, Share2, MessageSquare, ArrowUpRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading analytics...</div>;

  const statCards = [
    { 
      label: 'Total Audience', 
      value: stats?.totalAudience > 0 ? stats.totalAudience.toLocaleString() : '0', 
      change: stats?.totalAudience > 0 ? '+12.5%' : '0%', 
      isUp: true, 
      icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Impressions', 
      value: stats?.impressions > 0 ? stats.impressions.toLocaleString() : '0', 
      change: stats?.impressions > 0 ? '+24.8%' : '0%', 
      isUp: true, 
      icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-500/10' 
    },
    { 
      label: 'Engagement Rate', 
      value: stats?.engagementRate > 0 ? `${stats.engagementRate}%` : '0%', 
      change: stats?.engagementRate > 0 ? '+1.2%' : '0%', 
      isUp: true, 
      icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' 
    },
    { 
      label: 'Link Clicks', 
      value: stats?.linkClicks > 0 ? stats.linkClicks.toLocaleString() : '0', 
      change: stats?.linkClicks > 0 ? '+5.0%' : '0%', 
      isUp: true, 
      icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10' 
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ margin: 0, fontSize: '24px' }}>
            Performance Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track your growth and engagement metrics across channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 appearance-none">
            <option>Last 7 Days</option>
            <option defaultValue>Last 30 Days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition-all">
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 blur-2xl ${stat.bg}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${stat.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Audience Growth</h3>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Twitter</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500" /> Instagram</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> LinkedIn</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-white/10 pb-2 pl-2 relative">
            {/* Mock Chart Bars */}
            {[40, 55, 45, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
              <div key={i} className="w-full relative group h-full flex items-end">
                <div 
                  className="w-full bg-indigo-500/50 hover:bg-indigo-400 transition-all rounded-t-sm" 
                  style={{ height: `${stats?.impressions > 0 ? h : 0}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-slate-500">
            <span>May 1</span>
            <span>May 15</span>
            <span>May 30</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Top Performing Content</h3>
          <div className="space-y-4">
            {stats?.impressions === 0 ? (
              <div className="text-slate-400 text-sm text-center py-4">No content performance data available yet.</div>
            ) : (
              [
                { text: "Launch strategy breakdown...", platform: "Twitter", views: "45K", icon: MessageSquare, color: "text-sky-400" },
                { text: "Behind the scenes reel", platform: "Instagram", views: "38K", icon: Heart, color: "text-pink-400" },
                { text: "Why we chose React...", platform: "LinkedIn", views: "22K", icon: Share2, color: "text-blue-400" },
                { text: "10 tools for creators", platform: "Twitter", views: "18K", icon: Heart, color: "text-sky-400" },
              ].map((post, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                  <div className={`p-2 rounded-lg bg-slate-900 border border-white/5 ${post.color}`}>
                    <post.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 font-medium truncate">{post.text}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{post.platform}</p>
                  </div>
                  <div className="text-sm font-bold text-white shrink-0">{post.views}</div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
