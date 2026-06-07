import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  TrendingUp, TrendingDown, ArrowUpRight, Eye, Heart, MessageSquare,
  Share2, Plus, Calendar, Clock, CheckCircle2, Zap, BarChart3,
  Bell, ChevronRight, Sparkles, AlertCircle, Image as ImageIcon, Video, X
} from 'lucide-react';
import { TwitterIcon, InstagramIcon, LinkedinIcon, YoutubeIcon, FacebookIcon, TiktokIcon } from '../../components/BrandIcons';

const platformColors = {
  twitter: 'bg-sky-400/10 text-sky-400 border-sky-400/20',
  instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  linkedin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  youtube: 'bg-red-500/10 text-red-400 border-red-500/20',
  facebook: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
  tiktok: 'bg-slate-800/10 text-white border-slate-800/20',
};

const PlatformIcon = ({ platform, size = 14 }) => {
  const icons = {
    twitter: <TwitterIcon size={size} />,
    instagram: <InstagramIcon size={size} />,
    linkedin: <LinkedinIcon size={size} />,
    youtube: <YoutubeIcon size={size} />,
    facebook: <FacebookIcon size={size} />,
    tiktok: <TiktokIcon size={size} />,
  };
  return icons[platform] || null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  // Modal State
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setShowCreateModal(true);
    window.addEventListener('openCreatePostModal', handleOpenModal);
    return () => window.removeEventListener('openCreatePostModal', handleOpenModal);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, postsRes, platformsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/posts/recent'),
          api.get('/social-accounts')
        ]);
        setStats(statsRes.data);
        setRecentPosts(postsRes.data);
        setPlatforms(platformsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLinkAccount = async (platform = 'twitter') => {
    try {
      const res = await api.get(`/oauth/${platform}/connect`);
      window.location.href = res.data.url;
    } catch (err) {
      console.error(`OAuth initiation failed for ${platform}`, err);
      alert(`Oops! The backend route (/oauth/${platform}/connect) is not implemented yet.`);
    }
  };

  const handleDisconnectAccount = async (id) => {
    if (!window.confirm('Are you sure you want to disconnect this platform?')) return;
    try {
      await api.delete(`/social-accounts/${id}`);
      setPlatforms(platforms.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to disconnect account', err);
      setErrorBanner('Failed to disconnect account. Please try again.');
      setTimeout(() => setErrorBanner(''), 5000);
    }
  };

  const handleCreatePost = async (status) => {
    if (!newPostContent || selectedPlatforms.length === 0) return;
    
    if (status === 'scheduled' && !scheduledAt) {
      setErrorBanner('Please select a schedule time.');
      setTimeout(() => setErrorBanner(''), 5000);
      return;
    }

    try {
      setIsUploading(true);
      let mediaUrls = [];
      if (mediaFile) {
        const formData = new FormData();
        formData.append('file', mediaFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        mediaUrls.push({ url: uploadRes.data.url, type: mediaFile.type.startsWith('video') ? 'video' : 'image' });
      }

      const res = await api.post('/posts', {
        content: newPostContent,
        platforms: selectedPlatforms,
        status: status,
        media: mediaUrls,
        scheduledAt: status === 'scheduled' ? scheduledAt : undefined
      });
      setRecentPosts([res.data, ...recentPosts].slice(0, 5));
      setShowCreateModal(false);
      setNewPostContent('');
      setSelectedPlatforms([]);
      setMediaFile(null);
      setScheduledAt('');

      // Update stats if scheduled
      if (status === 'scheduled') {
        setStats(prev => ({ ...prev, scheduledPosts: prev.scheduledPosts + 1 }));
      }
    } catch (err) {
      console.error('Failed to create post', err.response?.data || err);
      setErrorBanner(err.response?.data?.error || err.response?.data?.message || 'Failed to create post. Please try again.');
      setTimeout(() => setErrorBanner(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlatform = (p) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  if (loading) return <div className="text-white p-8">Loading dashboard...</div>;

  const firstName = user?.name?.split(' ')[0] || 'Creator';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    {
      label: 'Total Impressions',
      value: stats?.impressions > 0 ? stats.impressions.toLocaleString() : '0 impressions',
      change: stats?.impressions > 0 ? '+12%' : '0%',
      up: true,
      icon: Eye,
      color: 'from-indigo-500 to-purple-600',
      glow: 'shadow-indigo-500/20',
    },
    {
      label: 'Engagement Rate',
      value: stats?.engagementRate > 0 ? `${stats.engagementRate}%` : '0%',
      change: stats?.engagementRate > 0 ? '+2.1%' : '0%',
      up: true,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      glow: 'shadow-pink-500/20',
    },
    {
      label: 'Scheduled Posts',
      value: stats?.scheduledPosts || '0',
      change: 'Active',
      up: true,
      icon: Calendar,
      color: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/20',
    },
    {
      label: 'Link Clicks',
      value: stats?.linkClicks > 0 ? stats.linkClicks.toLocaleString() : '0',
      change: stats?.linkClicks > 0 ? '+5%' : '0%',
      up: true,
      icon: ArrowUpRight,
      color: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {errorBanner && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {errorBanner}
        </motion.div>
      )}

      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-slate-900/0 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm font-medium">{greeting} 👋</p>
            <h1 className="text-2xl font-bold text-white mt-1" style={{ margin: '4px 0 8px', fontSize: '24px' }}>
              Welcome back, {firstName}!
            </h1>
            <p className="text-slate-400 text-sm">
              You have <span className="text-indigo-400 font-semibold">{stats?.scheduledPosts || 0} posts</span> scheduled today.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              id="create-post-btn"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <Plus size={16} />
              Create Post
            </button>
            <button
              id="view-schedule-btn"
              onClick={() => navigate('/dashboard/schedule')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition-all"
            >
              <Calendar size={16} />
              Schedule
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`glass-card rounded-2xl p-5 relative overflow-hidden group cursor-default hover:shadow-xl ${stat.glow} transition-all duration-300`}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${stat.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.color} mb-3 shadow-lg`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
              <div className={`text-xs mt-2 flex items-center gap-1 font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Post', icon: Plus, color: 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20', id: 'qa-new-post', action: () => setShowCreateModal(true) },
            { label: 'Schedule', icon: Calendar, color: 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20', id: 'qa-schedule', action: () => navigate('/dashboard/schedule') },
            { label: 'Analytics', icon: BarChart3, color: 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20', id: 'qa-analytics', action: () => navigate('/dashboard/analytics') },
            { label: 'Content', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20', id: 'qa-ai', action: () => navigate('/dashboard/content') },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                id={action.id}
                onClick={action.action}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 ${action.color} transition-all duration-200 hover:border-white/10 hover:-translate-y-0.5 text-sm font-medium w-full`}
              >
                <Icon size={18} />
                {action.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Posts + Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Posts */}
        <motion.div variants={itemVariants} className="lg:col-span-3 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Recent Posts</h3>
            <button id="view-all-posts" onClick={() => navigate('/dashboard/content')} className="text-indigo-400 text-xs hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {recentPosts.length === 0 ? (
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 border-dashed">
                <AlertCircle size={24} className="text-slate-400 mx-auto mb-2" />
                <p className="text-slate-300 text-sm">No post</p>
                <p className="text-slate-500 text-xs mt-1">Create your first post to see it here.</p>
              </div>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex gap-4 p-4 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                >
                  <div className={`shrink-0 px-2 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 h-fit mt-0.5 ${platformColors[post.platforms?.[0] || 'twitter']}`}>
                    <PlatformIcon platform={post.platforms?.[0] || 'twitter'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={11} /> {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.status === 'posted' ? (
                        <>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Heart size={11} /> 0
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MessageSquare size={11} /> 0
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                          <Clock size={11} /> {post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`shrink-0 self-start mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${post.status === 'posted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                    {post.status === 'posted' ? 'Live' : post.status === 'scheduled' ? 'Queued' : 'Draft'}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Platform Overview */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-5">Connected Platforms</h3>
          <div className="space-y-3">
            {platforms.length === 0 ? (
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 border-dashed">
                <AlertCircle size={24} className="text-slate-400 mx-auto mb-2" />
                <p className="text-slate-300 text-sm">No platforms connected</p>
                <p className="text-slate-500 text-xs mt-1 mb-4">Link a social account to start publishing.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mt-2">
                  <button
                    onClick={() => handleLinkAccount('twitter')}
                    className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <TwitterIcon size={14} /> Twitter / X
                  </button>
                  <button
                    onClick={() => handleLinkAccount('instagram')}
                    className="px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <InstagramIcon size={14} /> Instagram
                  </button>
                  <button
                    onClick={() => handleLinkAccount('facebook')}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <FacebookIcon size={14} /> Facebook
                  </button>
                  <button
                    onClick={() => handleLinkAccount('tiktok')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <TiktokIcon size={14} /> TikTok
                  </button>
                  <button
                    onClick={() => handleLinkAccount('linkedin')}
                    className="px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <LinkedinIcon size={14} /> LinkedIn
                  </button>
                  <button
                    onClick={() => handleLinkAccount('youtube')}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <YoutubeIcon size={14} /> YouTube
                  </button>
                </div>
              </div>
            ) : (
              platforms.map((p) => {
                const colorConfig = p.platform === 'twitter' ? 'from-sky-400 to-blue-500' : 'from-indigo-500 to-purple-500';
                return (
                  <div key={p._id} className="p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                        <PlatformIcon platform={p.platform} /> {p.profileName || p.platform}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">Active</span>
                        <button
                          onClick={() => handleDisconnectAccount(p._id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-2 py-1 rounded-lg"
                          title="Disconnect"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${colorConfig}`}
                        initial={{ width: 0 }}
                        animate={{ width: `100%` }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })
            )}

            {platforms.length > 0 && (
              showAddPlatform ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mt-2">
                  <button
                    onClick={() => handleLinkAccount('twitter')}
                    className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <TwitterIcon size={14} /> Twitter / X
                  </button>
                  <button
                    onClick={() => handleLinkAccount('instagram')}
                    className="px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <InstagramIcon size={14} /> Instagram
                  </button>
                  <button
                    onClick={() => handleLinkAccount('facebook')}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <FacebookIcon size={14} /> Facebook
                  </button>
                  <button
                    onClick={() => handleLinkAccount('tiktok')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <TiktokIcon size={14} /> TikTok
                  </button>
                  <button
                    onClick={() => handleLinkAccount('linkedin')}
                    className="px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <LinkedinIcon size={14} /> LinkedIn
                  </button>
                  <button
                    onClick={() => handleLinkAccount('youtube')}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all flex justify-center items-center gap-2"
                  >
                    <YoutubeIcon size={14} /> YouTube
                  </button>
                </div>
              ) : (
                <button
                  id="add-platform-btn"
                  onClick={() => setShowAddPlatform(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20 text-xs font-medium transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Plus size={14} /> Add Platform
                </button>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative glass-card rounded-2xl p-6 w-full max-w-lg"
          >
            <h3 className="font-bold text-lg text-white mb-4">Create New Post</h3>
            <textarea
              id="new-post-content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind? Write your post here..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-500 transition-colors"
            />
            <div className="flex items-center gap-2 mt-3 mb-4 flex-wrap">
              <span className="text-xs text-slate-400">Post to:</span>
              {platforms.length === 0 ? (
                <span className="text-xs text-amber-400">No platforms connected</span>
              ) : (
                platforms.map((p) => (
                  <button
                    key={p.platform}
                    id={`select-platform-${p.platform}`}
                    onClick={() => togglePlatform(p.platform)}
                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${selectedPlatforms.includes(p.platform) ? platformColors[p.platform] : 'bg-white/5 border-white/10 text-slate-500'
                      }`}
                  >
                    {p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}
                  </button>
                ))
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-white transition-colors">
                <ImageIcon size={16} /> Add Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setMediaFile(e.target.files[0])} />
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-white transition-colors">
                <Video size={16} /> Add Video
                <input type="file" accept="video/*" className="hidden" onChange={(e) => setMediaFile(e.target.files[0])} />
              </label>
              {mediaFile && (
                <span className="text-xs text-indigo-400 flex items-center gap-1">
                  {mediaFile.name}
                  <button onClick={() => setMediaFile(null)}><X size={12} /></button>
                </span>
              )}
            </div>

            {selectedPlatforms.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs text-slate-400 mb-1">Schedule Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                id="modal-publish-btn"
                onClick={() => handleCreatePost('posted')}
                disabled={!newPostContent || selectedPlatforms.length === 0 || isUploading}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-semibold transition-all"
              >
                {isUploading ? 'Uploading...' : 'Publish Now'}
              </button>
              <button
                id="modal-schedule-btn"
                onClick={() => handleCreatePost('scheduled')}
                disabled={!newPostContent || selectedPlatforms.length === 0 || isUploading}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 text-slate-300 text-sm font-semibold transition-all"
              >
                {isUploading ? 'Uploading...' : 'Schedule'}
              </button>
              <button
                id="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardHome;
