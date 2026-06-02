import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Share2, 
  Zap, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';
import {
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  TiktokIcon,
  PinterestIcon
} from './BrandIcons';


const integrations = [
  {
    id: 'twitter',
    name: 'Twitter / X',
    desc: 'Share immediate text updates, threads, and media posts.',
    sync: 'Instant Sync',
    status: 'Connected',
    color: 'hover:border-sky-500/50 hover:shadow-sky-500/10',
    glowColor: 'rgba(56, 189, 248, 0.15)',
    iconBg: 'bg-slate-900',
    iconColor: 'text-sky-400',
    stat: '99.9% uptime'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    desc: 'Schedule carousel reels, posts, and automate stories.',
    sync: 'Auto-Optimized',
    status: 'Connected',
    color: 'hover:border-pink-500/50 hover:shadow-pink-500/10',
    glowColor: 'rgba(236, 72, 153, 0.15)',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    stat: 'Direct publishing'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    desc: 'Engage your professional audience with articles and posts.',
    sync: 'Instant Sync',
    status: 'Ready to Connect',
    color: 'hover:border-blue-600/50 hover:shadow-blue-600/10',
    glowColor: 'rgba(37, 99, 235, 0.15)',
    iconBg: 'bg-blue-600/10',
    iconColor: 'text-blue-500',
    stat: 'Company & Personal pages'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    desc: 'Automate YouTube Shorts scheduling and description templates.',
    sync: 'Scheduled Upload',
    status: 'Connected',
    color: 'hover:border-red-500/50 hover:shadow-red-500/10',
    glowColor: 'rgba(239, 68, 68, 0.15)',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    stat: 'Supports 4K video uploads'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    desc: 'Cross-post viral short video trends to your profile seamlessly.',
    sync: 'Direct API',
    status: 'Ready to Connect',
    color: 'hover:border-teal-400/50 hover:shadow-teal-400/10',
    glowColor: 'rgba(45, 212, 191, 0.15)',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-400',
    stat: 'Sound matching enabled'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    desc: 'Schedule visual shopping pins, boards, and link clickbacks.',
    sync: 'Queue Scheduling',
    status: 'Ready to Connect',
    color: 'hover:border-rose-600/50 hover:shadow-rose-600/10',
    glowColor: 'rgba(225, 29, 72, 0.15)',
    iconBg: 'bg-rose-600/10',
    iconColor: 'text-rose-500',
    stat: 'Board automation support'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } }
};

const IntegrationsList = () => {
  return (
    <div className="w-full">
      {/* Small Feature Grid Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="flex gap-4 items-start p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Direct API Connection</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Officially verified application endpoints. No middle-man, no delays.</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
            <RefreshCw size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Smart Meta Syncing</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Auto-syncs images, hashtags, and tags optimized for every target platform.</p>
          </div>
        </div>

        <div className="flex gap-4 items-start p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Secure OAuth 2.0</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Your account access tokens are encrypted using bank-grade AES-256 protocols.</p>
          </div>
        </div>
      </div>

      {/* Main Integrations Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {integrations.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              boxShadow: `0 10px 30px ${item.glowColor}`,
              transition: { duration: 0.2 }
            }}
            className={`p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${item.color}`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${item.iconBg} ${item.iconColor} font-bold text-lg flex items-center justify-center w-12 h-12 shadow-inner`}>
                  {item.id === 'twitter' && <TwitterIcon size={22} />}
                  {item.id === 'instagram' && <InstagramIcon size={22} />}
                  {item.id === 'linkedin' && <LinkedinIcon size={22} />}
                  {item.id === 'youtube' && <YoutubeIcon size={22} />}
                  {item.id === 'tiktok' && <TiktokIcon size={22} />}
                  {item.id === 'pinterest' && <PinterestIcon size={22} />}
                </div>
                
                {/* Status indicator */}
                <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                  item.status === 'Connected' 
                    ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' 
                    : 'text-slate-400 bg-white/5 border-white/10'
                }`}>
                  {item.status === 'Connected' && <Check size={8} />}
                  {item.status}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white mb-2">{item.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.desc}</p>
            </div>

            {/* Bottom details */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                {item.sync}
              </span>
              <span>{item.stat}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default IntegrationsList;
