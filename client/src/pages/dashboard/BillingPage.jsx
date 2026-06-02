import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, DollarSign, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const BillingPage = () => {
  const navigate = useNavigate();

  const handleUpdatePayment = () => {
    // Handle updating payment method
    console.log('Update payment method');
  };

  const handleDownloadInvoice = () => {
    // Handle downloading invoice
    console.log('Download invoice');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold text-white">Billing & Subscriptions</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your subscription and payment details.</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Current Plan</h3>

        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Pro Plan</p>
              <p className="text-xs text-slate-400 mt-0.5">$9.99/month • Billed monthly</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-sm font-medium transition-all">
            Manage Plan
          </button>
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Payment Method</h3>
          <button onClick={handleUpdatePayment} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Update
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Visa •••• 4242</p>
              <p className="text-xs text-slate-400 mt-0.5">Expires 12/2025</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Billing History</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Receipt size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Pro Plan Subscription</p>
                <p className="text-xs text-slate-400 mt-0.5">June 1, 2023</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">$9.99</p>
              <button onClick={handleDownloadInvoice} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Download
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Receipt size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Pro Plan Subscription</p>
                <p className="text-xs text-slate-400 mt-0.5">May 1, 2023</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">$9.99</p>
              <button onClick={handleDownloadInvoice} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Download
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Receipt size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Pro Plan Subscription</p>
                <p className="text-xs text-slate-400 mt-0.5">April 1, 2023</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">$9.99</p>
              <button onClick={handleDownloadInvoice} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Download
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BillingPage;