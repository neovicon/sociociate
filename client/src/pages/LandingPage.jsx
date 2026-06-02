import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import appLogo from '../assets/app_logo.png';
import { 
  ChevronRight, 
  Clock, 
  BarChart3, 
  Share2, 
  Check, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck, 
  Layers, 
  Bot, 
  Zap, 
  TrendingUp,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  Play
} from 'lucide-react';
import DashboardPreview from '../components/DashboardPreview';
import IntegrationsList from '../components/IntegrationsList';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ Data
  const faqs = [
    {
      q: "Can I schedule to multiple accounts at once?",
      a: "Yes! SocioCiate allows you to compose a single post, customize it for each specific network, and automatically sync it across Twitter/X, Instagram, LinkedIn, YouTube, and TikTok with one single click."
    },
    {
      q: "Does it support video scheduling for Reels or Shorts?",
      a: "Absolutely. You can schedule Reels, YouTube Shorts, and TikTok videos directly through our officially verified direct API connections. You can even configure auto-sound matching."
    },
    {
      q: "How does the AI Assistant work?",
      a: "Our built-in AI assistant is fine-tuned specifically for social copywriting. Describe your topic, choose your target platform, adjust your tone (e.g. professional, casual, hype), and it will automatically generate optimized variations with relevant hashtags."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes. There are no long-term contracts. You can change plans, downgrade to our Free plan, or cancel your subscription directly from your billing dashboard with immediate effect."
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: "Alex Rivera",
      handle: "@alexcreates",
      role: "Digital Creator",
      avatar: "AR",
      quote: "SocioCiate cut my content publishing time in half. The unified inbox and cross-posting scheduling makes it feel like I have a full marketing assistant on my team.",
      rating: 5,
      followers: "124k followers"
    },
    {
      name: "Sarah Chen",
      handle: "@growth_sarah",
      role: "SaaS Marketing Lead",
      avatar: "SC",
      quote: "The analytics dashboards are gorgeous. It's the first time I can see aggregated metrics from YouTube Shorts and Twitter threads side-by-side with clear conversion attributions.",
      rating: 5,
      followers: "50k+ reach"
    },
    {
      name: "Marcus K.",
      handle: "@mk_agencies",
      role: "Agency Founder",
      avatar: "MK",
      quote: "Handling 12 clients used to be absolute chaos. With SocioCiate's workspace organization, my team schedules months of content ahead with separate client approval flows.",
      rating: 5,
      followers: "12 Client Accounts"
    }
  ];

  // Features Data
  const features = [
    {
      title: "Smart Queue Automation",
      desc: "Plan and schedule content for weeks ahead. Our scheduler analyzes your target timezone to queue posts during peak hours.",
      icon: Clock,
      stat: "Save 12+ hrs / week",
      color: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20",
      iconColor: "text-indigo-400"
    },
    {
      title: "Unified Social Analytics",
      desc: "View audience growth, click-through rates, and post performance metrics across all networks in a single visual reporting view.",
      icon: BarChart3,
      stat: "142% avg engagement boost",
      color: "from-blue-500/10 to-sky-500/10 border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "AI Writing Partner",
      desc: "Instant copy generations tailored for platform-specific character limits, voice tones, and hashtags in under 5 seconds.",
      icon: Bot,
      stat: "5x faster content output",
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Multi-Platform Sync",
      desc: "Seamlessly format and publish threads, carousels, videos, and articles to all connected networks in a single click.",
      icon: Share2,
      stat: "Zero API sync delays",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#030712]/75 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img src={appLogo} alt="Logo" className="w-8 h-8 transition group-hover:scale-105" />
            <div className="text-xl font-bold tracking-tight text-white">Socio<span className="text-indigo-500">Ciate</span></div>
          </a>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#integrations" className="hover:text-white transition-colors duration-200">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          </div>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200">Login</a>
            <a href="/register" className="relative group overflow-hidden px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-indigo-600 transition shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-102">
              <span className="relative z-10">Start Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#030712] border-b border-white/5 px-6 py-5 flex flex-col gap-4 text-sm font-medium"
            >
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white py-1 transition"
              >
                Features
              </a>
              <a 
                href="#integrations" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white py-1 transition"
              >
                Integrations
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white py-1 transition"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white py-1 transition"
              >
                FAQ
              </a>
              <div className="h-px bg-white/5 my-2" />
              <div className="flex flex-col gap-3">
                <a href="/login" className="text-center py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold">Login</a>
                <a href="/register" className="text-center py-2.5 rounded-xl bg-indigo-600 font-semibold text-white">Start Free Trial</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[500px] bg-gradient-to-r from-indigo-500/20 via-purple-600/10 to-pink-500/20 blur-[130px] rounded-full -z-10" />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-8"
          >
            <Sparkles size={12} />
            <span>The AI-Powered Content Suite v2.0 is live</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight text-white max-w-4xl leading-[1.1]"
          >
            Manage Every Social Platform <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              From One Beautiful Place.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Schedule posts, automate with copy AI, aggregate analytics, and connect with your audience across all platforms with a lightning-fast visual engine.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <a href="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-102">
              Start Free Trial <ChevronRight size={18} />
            </a>
            
            <a href="#sandbox" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2 hover:bg-white/10">
              Try Interactive Sandbox <ArrowRight size={18} />
            </a>
          </motion.div>
          
          {/* Main Visual: Interactive Sandbox Preview */}
          <motion.div 
            id="sandbox"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="mt-20 w-full max-w-5xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition duration-1000" />
            <div className="relative">
              <DashboardPreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof: Client Logos wall */}
      <section className="py-12 border-y border-white/5 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-8">Loved by founders, designers, and creators at fast-growing brands</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 grayscale contrast-200">
            {['Vercel', 'Supabase', 'Linear', 'Stripe', 'Retool', 'Framer'].map((logo, idx) => (
              <span key={idx} className="text-lg sm:text-xl font-extrabold tracking-tight text-white">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 relative">
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/10 blur-[130px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Core Engine</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Everything you need to grow your social footprint</p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Streamline your entire content workspace. Stop juggling browser extensions, passwords, and separate subscription plans.</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, border: "rgba(255, 255, 255, 0.15) 1px solid" }}
                className={`p-8 rounded-2xl bg-gradient-to-b border border-white/5 bg-slate-900/30 flex flex-col justify-between h-[280px] transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${feature.iconColor}`}>
                      <feature.icon size={24} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{feature.stat}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold cursor-pointer group hover:text-indigo-300">
                  <span>Learn how it works</span>
                  <ChevronRight size={14} className="transform transition group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 bg-slate-950/40 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Simple Process</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">How SocioCiate helps you scale</p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Three simple steps to build and orchestrate automated publishing funnels.</p>
          </div>

          {/* Timeline Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Authenticate Channels",
                desc: "Securely link your Twitter/X, Instagram, and professional LinkedIn accounts in a click via official verification portals.",
                icon: ShieldCheck
              },
              {
                step: "02",
                title: "Orchestrate Content Flow",
                desc: "Write templates, draft copy variants using our AI, select target dates, and review formatting in our live feed simulator.",
                icon: Layers
              },
              {
                step: "03",
                title: "Accelerate Growth",
                desc: "Review weekly custom analytics summaries, observe follower conversion rates, and repeat winning content patterns.",
                icon: TrendingUp
              }
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur flex flex-col justify-between h-[260px] relative">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-extrabold text-white/10 font-mono tracking-widest">{step.step}</span>
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <step.icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
                
                {idx < 2 && (
                  <div className="hidden md:block absolute top-[50%] right-[-16px] -translate-y-1/2 text-slate-800 font-bold z-10 select-none">
                    <ChevronRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-24 px-6 relative">
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 w-[700px] h-[400px] bg-pink-500/10 blur-[130px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Integrations</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Connect with all social networks</p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Push content directly to your target profiles with official endpoints. No browser macros, zero threat of account bans.</p>
          </div>

          {/* Integrations Grid component */}
          <IntegrationsList />
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-24 px-6 bg-slate-950/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Creator Voice</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Built for modern social teams</p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Here is what social managers and brand builders say about using SocioCiate daily.</p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">{item.role}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="text-[9px] text-indigo-400 font-semibold">{item.followers}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Pricing Plans</h2>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Flexible tiers for every growth level</p>
            <p className="text-slate-400 text-sm leading-relaxed">Choose a path that matches your volume. Start for free, upgrade as you expand.</p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex items-center gap-3 mb-16 p-1 rounded-full bg-white/5 border border-white/10">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${!isYearly ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${isYearly ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <span>Yearly</span>
              <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-bold">Save 20%</span>
            </button>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {/* Starter Plan */}
            <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur flex flex-col justify-between min-h-[480px]">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starter</span>
                <div className="text-4xl font-extrabold text-white mt-4 flex items-baseline gap-1">
                  $0
                  <span className="text-xs text-slate-500 font-medium">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">Perfect for test driving workflows and managing personal socials.</p>
                <div className="h-px bg-white/5 my-6" />
                
                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>3 connected profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>30 scheduled posts / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>Basic metrics reports</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <X size={14} />
                    <span>No AI assistant credits</span>
                  </li>
                </ul>
              </div>

              <a href="/register" className="mt-8 w-full text-center py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition">
                Start for Free
              </a>
            </div>

            {/* Creator Plan (Highlighted) */}
            <div className="p-8 rounded-2xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur flex flex-col justify-between min-h-[480px] relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg shadow-indigo-600/30">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Creator Pro</span>
                <div className="text-4xl font-extrabold text-white mt-4 flex items-baseline gap-1">
                  ${isYearly ? '19' : '29'}
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                {isYearly && <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Billed yearly ($228 total)</span>}
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">Built for creators, freelancers, and businesses looking to automate growth.</p>
                <div className="h-px bg-white/5 my-6" />

                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span className="font-semibold text-white">8 connected profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>Unlimited posting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span className="text-white">AI Assistant (100 credits/mo)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>Unified detailed analytics views</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>Auto peak-hour optimizations</span>
                  </li>
                </ul>
              </div>

              <a href="/register" className="mt-8 w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-600/20 hover:scale-102">
                Get Creator Pro (14d Trial)
              </a>
            </div>

            {/* Business Plan */}
            <div className="p-8 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur flex flex-col justify-between min-h-[480px]">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Business</span>
                <div className="text-4xl font-extrabold text-white mt-4 flex items-baseline gap-1">
                  ${isYearly ? '49' : '69'}
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                {isYearly && <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Billed yearly ($588 total)</span>}
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">For professional social teams and marketing agencies running multiple grids.</p>
                <div className="h-px bg-white/5 my-6" />

                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span className="font-semibold text-white">25 connected profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>Unlimited posting & scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span className="text-white">AI Assistant (Unlimited credits)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>Team permissions & Client dashboards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    <span>CSV upload & priority support</span>
                  </li>
                </ul>
              </div>

              <a href="/register" className="mt-8 w-full text-center py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition">
                Start Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 px-6 bg-[#030712] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Information</h2>
            <p className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</p>
          </div>

          {/* Accordion container */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-white/5 bg-slate-900/20 backdrop-blur overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 flex items-center justify-between text-left font-semibold text-slate-200 hover:text-white transition"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <span className={`transition duration-300 shrink-0 text-slate-400 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}>
                      <ChevronRight size={18} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="p-5 pt-0 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky CTA Banner Section */}
      <section className="py-20 px-6 bg-slate-950 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 via-transparent to-purple-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-indigo-500/10 blur-[130px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">Scale your social presence today</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">Create your account in seconds, connect your platforms, and try all premium features free for 14 days. No credit card required.</p>
          <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-102">
            Get Started For Free <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-16 px-6 bg-[#020617] border-t border-white/5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Logo & description */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src={appLogo} alt="Logo" className="w-7 h-7" />
              <span className="text-base font-bold text-white tracking-tight">SocioCiate</span>
            </a>
            <p className="max-w-sm leading-relaxed text-slate-500 mb-6">
              The automated social media workspace designed for designers, builders, and growth hackers. Publish smart, scale organic.
            </p>
            <div className="flex items-center gap-3 text-slate-500">
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social, i) => (
                <span key={i} className="hover:text-white cursor-pointer transition">{social}</span>
              ))}
            </div>
          </div>

          {/* Links grids */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#integrations" className="hover:text-white transition">Integrations</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><span className="text-slate-600 cursor-not-allowed">API Docs (soon)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Company</h4>
            <ul className="space-y-2.5">
              <li><span className="hover:text-white cursor-pointer transition">About Us</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Blog</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Careers</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Security Center</span></li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Newsletter</h4>
            <p className="leading-relaxed text-slate-500 mb-4">Weekly guides on growing your social audience organic.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-2 font-bold transition">Join</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600">
          <span>&copy; {new Date().getFullYear()} SocioCiate Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer transition">Cookie Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
