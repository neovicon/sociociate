import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import appLogo from '../assets/app_logo.png';
import { 
  BarChart3, 
  Calendar, 
  Share2, 
  TrendingUp, 
  ArrowUpRight, 
  MessageSquare, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  Link,
  ChevronRight,
  Eye
} from 'lucide-react';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [publishedPosts, setPublishedPosts] = useState({});
  const [connections, setConnections] = useState({
    twitter: true,
    instagram: true,
    linkedin: false,
    youtube: true,
    tiktok: false
  });
  const [loadingConnection, setLoadingConnection] = useState(null);

  const toggleConnection = (platform) => {
    if (loadingConnection) return;
    setLoadingConnection(platform);
    setTimeout(() => {
      setConnections(prev => ({
        ...prev,
        [platform]: !prev[platform]
      }));
      setLoadingConnection(null);
    }, 800);
  };

  const handlePublishNow = (postId) => {
    setPublishedPosts(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  // Mock schedule posts
  const initialPosts = [
    {
      id: 1,
      time: '10:30 AM',
      platform: 'Twitter',
      content: '🚀 SocioCiate is launching next week! We are changing the way creators manage content forever.',
      tag: 'Launch',
      color: 'from-sky-400 to-blue-500'
    },
    {
      id: 2,
      time: '02:15 PM',
      platform: 'Instagram',
      content: 'A sneak peek into our workspace design systems. Minimal, functional, and lightning fast. ⚡️ #uidesign #product',
      tag: 'Design',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 3,
      time: '06:00 PM',
      platform: 'LinkedIn',
      content: 'Thrilled to share how unified analytics helped our beta users increase engagement by 142% average.',
      tag: 'Analytics',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col md:flex-row h-[520px]">
      {/* Sidebar Mockup */}
      <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/30 p-4 flex flex-row md:flex-col justify-between md:justify-start gap-1 md:gap-4 flex-wrap md:flex-nowrap">
        <div className="hidden md:flex items-center gap-2 px-2 py-3 mb-4">
          <img src={appLogo} alt="Logo" className="w-6 h-6" />
          <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SocioCiate</span>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex md:flex-col gap-1 w-full overflow-x-auto md:overflow-x-visible no-scrollbar">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'scheduler', label: 'Scheduler', icon: Calendar },
            { id: 'channels', label: 'Channels', icon: Share2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative shrink-0 ${
                  isActive 
                    ? 'text-indigo-400 bg-indigo-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full hidden md:block"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mock user profile (only desktop) */}
        <div className="mt-auto hidden md:flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold">JD</div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold truncate leading-tight">Jane Doe</span>
            <span className="text-[9px] text-slate-500 truncate leading-none mt-0.5">Creator Pro</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 md:p-6 overflow-y-auto no-scrollbar flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-white">Platform Performance</h4>
                  <p className="text-[11px] text-slate-400">Aggregated views and engagement across 3 channels</p>
                </div>
                <div className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-medium flex items-center gap-1">
                  <TrendingUp size={10} /> Live updating
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-white/5 bg-white/5/20 backdrop-blur">
                  <div className="text-[10px] text-slate-400 font-medium">Total Impressions</div>
                  <div className="text-base font-bold mt-1 flex items-baseline gap-1.5 text-white">
                    124.8k
                    <span className="text-[9px] font-medium text-emerald-400 flex items-center">+18% <ArrowUpRight size={8} /></span>
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/5 bg-white/5/20 backdrop-blur">
                  <div className="text-[10px] text-slate-400 font-medium">Engagement Rate</div>
                  <div className="text-base font-bold mt-1 flex items-baseline gap-1.5 text-white">
                    5.2%
                    <span className="text-[9px] font-medium text-emerald-400 flex items-center">+4.1% <ArrowUpRight size={8} /></span>
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/5 bg-white/5/20 backdrop-blur">
                  <div className="text-[10px] text-slate-400 font-medium">Link Clicks</div>
                  <div className="text-base font-bold mt-1 flex items-baseline gap-1.5 text-white">
                    1,420
                    <span className="text-[9px] font-medium text-emerald-400 flex items-center">+32% <ArrowUpRight size={8} /></span>
                  </div>
                </div>
              </div>

              {/* Chart simulation */}
              <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/30 flex-1 flex flex-col justify-between min-h-[160px]">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-semibold">Engagement Timeline</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>Twitter</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>Instagram</span>
                  </div>
                </div>
                
                {/* SVG Chart Animation */}
                <div className="relative flex-1 w-full mt-3 h-28">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 35" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                    {/* Instagram Path */}
                    <motion.path
                      d="M0,32 Q15,22 30,28 T60,10 T85,15 T100,8"
                      fill="none"
                      stroke="url(#instaGlow)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Twitter Path */}
                    <motion.path
                      d="M0,28 Q15,18 35,12 T65,22 T85,8 T100,4"
                      fill="none"
                      stroke="url(#indigoGlow)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                    />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="indigoGlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                      <linearGradient id="instaGlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Floating tooltip simulation */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute top-2 left-[58%] -translate-x-1/2 p-2 bg-slate-900 border border-white/10 rounded-lg shadow-xl text-center flex flex-col"
                  >
                    <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">Engagement Peak</span>
                    <span className="text-[10px] font-bold text-white mt-0.5">8.4k Action Steps</span>
                  </motion.div>
                </div>
                
                <div className="flex justify-between text-[8px] text-slate-500 font-medium mt-2 px-1">
                  <span>Monday</span>
                  <span>Wednesday</span>
                  <span>Friday</span>
                  <span>Sunday</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'scheduler' && (
            <motion.div
              key="scheduler"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-white">Smart Content Queue</h4>
                  <p className="text-[11px] text-slate-400">Interactive: click "Publish Now" to trigger instant execution</p>
                </div>
                <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition text-[10px] font-semibold">
                  <Plus size={10} /> Create Post
                </button>
              </div>

              {/* Schedule List */}
              <div className="flex-1 flex flex-col gap-3">
                {initialPosts.map((post) => {
                  const isPublished = publishedPosts[post.id];
                  return (
                    <div 
                      key={post.id}
                      className="p-3.5 rounded-xl border border-white/5 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-white/10 transition"
                    >
                      <div className="flex gap-3">
                        {/* Time slot and platform */}
                        <div className="flex flex-col items-center justify-center shrink-0 w-16 text-center border-r border-white/5 pr-3">
                          <span className="text-[10px] font-bold text-slate-200">{post.time}</span>
                          <span className={`text-[8px] mt-1 font-semibold px-1.5 py-0.5 rounded text-white bg-gradient-to-r ${post.color}`}>
                            {post.platform}
                          </span>
                        </div>
                        {/* Content text */}
                        <div className="flex flex-col justify-center max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-medium bg-white/5 border border-white/5 text-slate-400 px-1.5 py-0.2 rounded-md">
                              #{post.tag}
                            </span>
                            <span className="text-[8px] text-slate-500 flex items-center gap-1">
                              <Clock size={8} /> Auto-Optimize active
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </div>

                      {/* CTA to Publish */}
                      <div className="shrink-0 flex items-center justify-end">
                        {isPublished ? (
                          <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20"
                          >
                            <CheckCircle2 size={12} /> Published
                          </motion.span>
                        ) : (
                          <button
                            onClick={() => handlePublishNow(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-indigo-600 hover:border-indigo-500 transition text-[10px] text-slate-300 hover:text-white font-semibold flex items-center gap-1 group-hover:border-white/20 shadow-sm"
                          >
                            <span>Publish Now</span>
                            <ChevronRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col gap-4"
            >
              {/* Header */}
              <div>
                <h4 className="text-sm font-semibold text-white">Social Integrations</h4>
                <p className="text-[11px] text-slate-400">Interactive: toggle switches to simulate OAuth token syncs</p>
              </div>

              {/* Connections list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {[
                  { id: 'twitter', name: 'Twitter / X', handle: '@sociociate_app', color: 'from-sky-400 to-indigo-500' },
                  { id: 'instagram', name: 'Instagram', handle: '@sociociate', color: 'from-pink-500 to-rose-500' },
                  { id: 'linkedin', name: 'LinkedIn', handle: 'SocioCiate Business', color: 'from-blue-600 to-sky-700' },
                  { id: 'youtube', name: 'YouTube', handle: 'SocioCiate HQ', color: 'from-red-600 to-red-500' },
                  { id: 'tiktok', name: 'TikTok Creator', handle: '@sociociate_trends', color: 'from-teal-400 to-emerald-500' }
                ].map((channel) => {
                  const isConnected = connections[channel.id];
                  const isLoading = loadingConnection === channel.id;
                  
                  return (
                    <div 
                      key={channel.id} 
                      className={`p-3 rounded-xl border transition flex items-center justify-between ${
                        isConnected 
                          ? 'border-indigo-500/20 bg-indigo-500/5' 
                          : 'border-white/5 bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${channel.color} flex items-center justify-center font-bold text-white text-xs shadow-md`}>
                          {channel.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-white leading-tight">{channel.name}</span>
                          <span className="text-[9px] text-slate-400 truncate max-w-[120px] mt-0.5">
                            {isConnected ? channel.handle : 'Not integrated'}
                          </span>
                        </div>
                      </div>

                      {/* Connection Toggle */}
                      <button
                        onClick={() => toggleConnection(channel.id)}
                        disabled={isLoading}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-300 relative flex items-center ${
                          isConnected ? 'bg-indigo-600' : 'bg-slate-800'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {isLoading ? (
                          <div className={`w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin absolute ${
                            isConnected ? 'right-1' : 'left-1'
                          }`} />
                        ) : (
                          <motion.div 
                            layout
                            className="w-4.5 h-4.5 rounded-full bg-white shadow-md"
                            animate={{
                              x: isConnected ? 16 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action / Banner footer inside preview */}
        <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span>Auto-scheduling configured for optimal peak user hours (UTC+5:45)</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300">
            <span>Explore automation settings</span>
            <ChevronRight size={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
