import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import {
  Calendar, Clock, Plus, ChevronLeft, ChevronRight, CheckCircle2,
  Trash2, Edit3, MoreHorizontal, AlertCircle
} from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const platformColors = {
  twitter: 'from-sky-400 to-blue-500',
  instagram: 'from-pink-500 to-rose-500',
  linkedin: 'from-blue-600 to-indigo-600',
  youtube: 'from-red-500 to-red-600',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const SchedulePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('list');

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      // Fetch both scheduled and draft posts for this view
      const res = await api.get('/posts');
      const filtered = res.data.filter(p => p.status === 'scheduled' || p.status === 'draft');
      setPosts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await api.patch(`/posts/${id}`, { status: 'posted' });
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'posted' } : p));
    } catch (err) {
      console.error(err);
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

  // Group posts by a rough date string for the list view
  const groupedPosts = posts.reduce((acc, post) => {
    // If it has scheduledAt, use that, else use createdAt
    const dateObj = new Date(post.scheduledAt || post.createdAt);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dayLabel = dateObj.toLocaleDateString();
    if (dateObj.toDateString() === today.toDateString()) dayLabel = 'Today';
    else if (dateObj.toDateString() === tomorrow.toDateString()) dayLabel = 'Tomorrow';

    if (!acc[dayLabel]) acc[dayLabel] = [];
    acc[dayLabel].push(post);
    return acc;
  }, {});

  // Generate calendar days for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const monthName = now.toLocaleString('default', { month: 'long' });

  // Days with scheduled posts
  const scheduledDays = new Set(
    posts.map(p => new Date(p.scheduledAt || p.createdAt).getDate())
  );

  if (loading) return <div className="text-white p-8">Loading schedule...</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ margin: 0, fontSize: '24px' }}>
            Content Schedule
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and organize your upcoming posts across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-0.5">
            {['list', 'calendar'].map((v) => (
              <button
                key={v}
                id={`schedule-view-${v}`}
                onClick={() => setSelectedView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  selectedView === v
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            id="schedule-new-post"
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <Plus size={16} /> Schedule Post
          </button>
        </div>
      </motion.div>

      {selectedView === 'list' ? (
        /* List View */
        <div className="space-y-6">
          {Object.keys(groupedPosts).length === 0 ? (
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-12 text-center">
              <Calendar size={40} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">No scheduled posts</h3>
              <p className="text-slate-400 text-sm">You have no upcoming scheduled or draft posts.</p>
            </motion.div>
          ) : (
            Object.keys(groupedPosts).map((day) => {
              const dayPosts = groupedPosts[day];
              return (
                <motion.div key={day} variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-white">{day}</h3>
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-xs text-slate-500">{dayPosts.length} posts</span>
                  </div>
                  <div className="space-y-3">
                    {dayPosts.map((post) => {
                      const platform = post.platforms?.[0] || 'twitter';
                      const color = platformColors[platform] || platformColors.twitter;
                      const timeStr = new Date(post.scheduledAt || post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <motion.div
                          key={post._id}
                          layout
                          className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/20 transition-all"
                        >
                          <div className="flex gap-4 flex-1 min-w-0">
                            {/* Time & Platform */}
                            <div className="flex flex-col items-center justify-center shrink-0 w-20 text-center border-r border-white/5 pr-4">
                              <span className="text-sm font-bold text-white">{timeStr}</span>
                              <span className={`text-[10px] mt-1.5 font-semibold px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${color} capitalize`}>
                                {platform}
                              </span>
                            </div>
                            {/* Content */}
                            <div className="flex flex-col justify-center min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                                  post.status === 'draft'
                                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                    : post.status === 'posted'
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                    : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                                }`}>
                                  {post.status === 'posted' ? 'Published' : post.status === 'draft' ? 'Draft' : 'Queued'}
                                </span>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{post.content}</p>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {post.status === 'posted' ? (
                              <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                              >
                                <CheckCircle2 size={14} /> Published
                              </motion.span>
                            ) : (
                              <>
                                <button
                                  id={`publish-${post._id}`}
                                  onClick={() => handlePublish(post._id)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                                >
                                  Publish Now
                                </button>
                                <button
                                  id={`edit-${post._id}`}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  id={`delete-${post._id}`}
                                  onClick={() => handleDelete(post._id)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-white/5"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        /* Calendar View */
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white" style={{ margin: 0, fontSize: '18px' }}>
              {monthName} {year}
            </h3>
            <div className="flex gap-2">
              <button id="cal-prev" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all">
                <ChevronLeft size={16} />
              </button>
              <button id="cal-next" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-center text-xs text-slate-500 font-medium py-2">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const isToday = day === now.getDate();
              const hasPost = scheduledDays.has(day);
              return (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all cursor-pointer ${
                    day
                      ? isToday
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold'
                        : 'hover:bg-white/5 text-slate-300'
                      : ''
                  }`}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {hasPost && (
                        <div className="flex gap-0.5 mt-1">
                          <div className="w-1 h-1 rounded-full bg-indigo-400" />
                          <div className="w-1 h-1 rounded-full bg-pink-400" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Scheduling Tips */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-5 flex items-center gap-4 border-indigo-500/10"
      >
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Optimal Posting Times</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Based on your audience analytics, your best posting times are <span className="text-indigo-400 font-semibold">10:30 AM</span>,{' '}
            <span className="text-indigo-400 font-semibold">2:15 PM</span>, and <span className="text-indigo-400 font-semibold">6:00 PM</span> (UTC+5:45).
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SchedulePage;
