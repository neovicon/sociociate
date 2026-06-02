import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import {
  FileText, Plus, Search, Filter, Grid, List, Edit3, Trash2,
  Copy, MoreHorizontal, Eye, Heart, MessageSquare, Clock,
  Image, Video, Type, Sparkles
} from 'lucide-react';
import { TwitterIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from '../../components/BrandIcons';

const typeIcons = {
  text: Type,
  image: Image,
  video: Video,
};

const statusStyles = {
  posted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  scheduled: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const platformNames = {
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
};

const platformColors = {
  twitter: 'bg-sky-400/10 text-sky-400 border-sky-400/20',
  instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  linkedin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  youtube: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const ContentPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (status) => {
    if (!newPostContent || selectedPlatforms.length === 0) return;
    try {
      const res = await api.post('/posts', {
        content: newPostContent,
        platforms: selectedPlatforms,
        status: status,
      });
      setPosts([res.data, ...posts]);
      setShowCreateModal(false);
      setNewPostContent('');
      setSelectedPlatforms([]);
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  const togglePlatform = (p) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const filtered = posts.filter((item) => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const itemStatus = item.status === 'posted' ? 'published' : item.status;
    const matchesFilter = filterStatus === 'all' || itemStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="text-white p-8">Loading content...</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ margin: 0, fontSize: '24px' }}>
            Content Library
          </h1>
          <p className="text-slate-400 text-sm mt-1">{posts.length} pieces of content across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="content-ai-generate"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/20 text-purple-300 text-sm font-semibold transition-all"
            onClick={() => alert("AI Generation coming soon!")}
          >
            <Sparkles size={16} /> AI Generate
          </button>
          <button
            id="content-create-new"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="content-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'scheduled', 'draft'].map((status) => (
            <button
              key={status}
              id={`filter-${status}`}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize border ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-0.5 ml-1">
            <button
              id="view-grid"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid size={14} />
            </button>
            <button
              id="view-list"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const TypeIcon = item.media?.length ? (item.media[0].type === 'video' ? Video : Image) : Type;
            return (
              <motion.div
                key={item._id}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all"
              >
                {/* Preview Area */}
                <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                  <TypeIcon size={28} className="text-slate-600" />
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {item.platforms?.map((p) => (
                      <span key={p} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-black/40 text-slate-300 backdrop-blur">
                        {platformNames[p] || p}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[item.status]} capitalize`}>
                      {item.status === 'posted' ? 'published' : item.status}
                    </span>
                  </div>
                </div>
                {/* Details */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{item.content.substring(0, 30) || 'New Post'}...</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">{item.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock size={11} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      {item.status === 'posted' && (
                        <>
                          <span className="flex items-center gap-1"><Eye size={11} /> 0</span>
                          <span className="flex items-center gap-1"><Heart size={11} /> 0</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Hover Actions */}
                <div className="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-medium hover:bg-indigo-600/30 transition-all">
                    <Edit3 size={12} className="inline mr-1" /> Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                    className="py-1.5 px-2 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-red-500/20 hover:text-red-400 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-2">
          {filtered.map((item) => {
            const TypeIcon = item.media?.length ? (item.media[0].type === 'video' ? Video : Image) : Type;
            return (
              <div
                key={item._id}
                className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="shrink-0 p-2 rounded-lg bg-white/5">
                  <TypeIcon size={18} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">{item.content.substring(0, 30) || 'New Post'}...</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[item.status]} capitalize`}>
                      {item.status === 'posted' ? 'published' : item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{item.content}</p>
                </div>
                <div className="shrink-0 flex items-center gap-4 text-xs text-slate-500">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.platforms?.map((p) => (
                    <span key={p} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/5">
                      {platformNames[p] || p}
                    </span>
                  ))}
                </div>
                <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {filtered.length === 0 && (
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-12 text-center">
          <FileText size={40} className="text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">No content found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

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
            <div className="flex items-center gap-2 mt-3 mb-4">
              <span className="text-xs text-slate-400">Post to:</span>
              {['twitter', 'instagram', 'linkedin'].map((p) => (
                <button
                  key={p}
                  id={`select-platform-${p}`}
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                    selectedPlatforms.includes(p) ? platformColors[p] : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                id="modal-publish-btn"
                onClick={() => handleCreatePost('posted')}
                disabled={!newPostContent || selectedPlatforms.length === 0}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-semibold transition-all"
              >
                Publish Now
              </button>
              <button
                id="modal-schedule-btn"
                onClick={() => handleCreatePost('scheduled')}
                disabled={!newPostContent || selectedPlatforms.length === 0}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 text-slate-300 text-sm font-semibold transition-all"
              >
                Schedule
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

export default ContentPage;
