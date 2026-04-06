import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Landmark, Utensils, Smartphone, Wallet, Car, ShieldCheck, Plus, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { transactionsAPI, userAPI } from '@/src/lib/api';

const TRENDS = {
  '6M': [40, 55, 45, 80, 60, 70],
  '1Y': [40, 55, 45, 80, 60, 70, 50, 65, 75, 55, 40, 85],
};
const MONTHS = {
  '6M': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  '1Y': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export default function Dashboard() {
  const [trendPeriod, setTrendPeriod] = useState<'6M' | '1Y'>('6M');
  const [savings, setSavings] = useState(15000);
  const target = 20000;
  const progress = Math.min(Math.round((savings / target) * 100), 100);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_surplus: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [userName, setUserName] = useState('Julian');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, transRes, userRes] = await Promise.all([
        transactionsAPI.summary(),
        transactionsAPI.getAll({ page: 1 }),
        userAPI.me().catch(() => null)
      ]);
      setSummary(summaryRes);
      setRecentTransactions((transRes.data || []).slice(0, 5));
      if (userRes) setUserName(userRes.full_name?.split(' ')[0] || 'Julian');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  const handleAddFunds = () => {
    const amt = parseFloat(addAmount);
    if (!isNaN(amt) && amt > 0) {
      setSavings(prev => Math.min(prev + amt, target));
      setAddAmount('');
      setShowAddFunds(false);
    }
  };

  return (
    <div className="p-3 md:p-5 space-y-4 md:space-y-5 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-on-surface-variant font-medium tracking-wide text-xs md:text-sm">Good morning, {userName}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mt-1">Portfolio Canvas</h1>
        </motion.div>
        <div className="flex gap-2">
          <button className="flex-1 md:flex-none px-3 md:px-4 py-2 rounded-full bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors">View Report</button>
          <button className="flex-1 md:flex-none px-3 md:px-4 py-2 rounded-full bg-secondary text-on-secondary font-semibold text-xs hover:opacity-90 transition-opacity">Set Budget</button>
        </div>
      </section>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-primary-container/20 rounded-2xl p-4 md:p-5 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4">
            <Landmark className="text-primary w-8 h-8 opacity-20 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Available Wealth</span>
            <div className="text-2xl md:text-3xl font-black text-on-primary-container tracking-tight mt-1">${summary.net_surplus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-primary font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2.4% from last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container-low rounded-2xl p-4 md:p-5 flex flex-col justify-between"
        >
          <span className="text-on-surface-variant font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Monthly Income</span>
          <div>
            <div className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">${summary.total_income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="h-1 w-full bg-slate-200 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-primary w-[85%] rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low rounded-2xl p-4 md:p-5 flex flex-col justify-between"
        >
          <span className="text-on-surface-variant font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Monthly Expenses</span>
          <div>
            <div className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">${summary.total_expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="h-1 w-full bg-slate-200 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-tertiary w-[35%] rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Visualization & Savings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Spending Trends */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-4 md:p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm md:text-base font-bold tracking-tight">Spending Trends</h3>
            <div className="flex gap-2">
              {(['6M', '1Y'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setTrendPeriod(p)}
                  className={cn(
                    'px-3 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all',
                    trendPeriod === p ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant'
                  )}
                >{p}</button>
              ))}
            </div>
          </div>
          <div className="relative h-36 md:h-48 w-full flex items-end gap-1 px-1">
            {TRENDS[trendPeriod].map((height, i) => (
              <motion.div
                key={`${trendPeriod}-${i}`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={cn('flex-1 rounded-t-md transition-all hover:opacity-80', i === 3 ? 'bg-primary' : 'bg-primary/20')}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[8px] uppercase font-bold text-on-surface-variant px-1 tracking-widest">
            {MONTHS[trendPeriod].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Swiss Alps Retreat */}
        <div className="bg-secondary-container/30 rounded-2xl p-4 md:p-5 flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-sm md:text-base font-bold tracking-tight mb-1">Swiss Alps Retreat</h3>
            <p className="text-[10px] md:text-xs text-on-secondary-container/80 leading-relaxed">Savings for the summer 2024 expedition.</p>
            <div className="mt-4 flex justify-center">
              <div className="relative w-28 h-28 md:w-32 md:h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" fill="transparent" r="68" stroke="currentColor" strokeWidth="10" className="text-white/40" />
                  <motion.circle
                    animate={{ strokeDashoffset: 427 - (427 * progress) / 100 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    cx="80" cy="80" fill="transparent" r="68"
                    stroke="currentColor" strokeDasharray="427" strokeWidth="10"
                    strokeLinecap="round"
                    className="text-secondary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl md:text-2xl font-black">{progress}%</span>
                  <span className="text-[8px] uppercase font-bold text-on-surface-variant">Completed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center z-10">
            <span className="text-[10px] md:text-xs font-bold text-on-surface-variant">${savings.toLocaleString()} / ${target.toLocaleString()}</span>
            <button onClick={() => setShowAddFunds(true)} className="p-1.5 bg-white rounded-full text-secondary shadow-md hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {showAddFunds && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] p-6 flex flex-col justify-center gap-4 z-20"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-on-surface">Add Funds</h4>
                  <button onClick={() => setShowAddFunds(false)}><X className="w-5 h-5 text-on-surface-variant" /></button>
                </div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={e => setAddAmount(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddFunds()}
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleAddFunds}
                  className="w-full py-3 bg-secondary text-on-secondary rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
                >Add to Savings</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 md:p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm md:text-base font-bold tracking-tight">Recent Activity</h3>
          <a className="text-xs font-bold text-primary hover:underline underline-offset-4" href="#">View All</a>
        </div>
        <div className="space-y-1">
          {recentTransactions.length === 0 ? (
            <p className="text-center py-8 text-on-surface-variant text-xs">No recent activity</p>
          ) : recentTransactions.map((t, i) => {
            const IconComp = t.type === 'income' ? Wallet : Utensils;
            return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-2 md:p-3 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={cn('w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center', t.type === 'income' ? 'bg-primary-container/40 text-primary' : 'bg-orange-100 text-orange-600')}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-on-surface text-xs md:text-sm">{t.description}</div>
                  <div className="text-[9px] md:text-[10px] text-on-surface-variant font-medium">{t.category} • {new Date(t.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn('font-bold text-xs md:text-sm', t.type === 'income' ? 'text-primary' : 'text-on-surface')}>
                  {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                </div>
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{t.status || 'COMPLETED'}</div>
              </div>
            </motion.div>
          )})}
        </div>
      </section>
    </div>
  );
}
