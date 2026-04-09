import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet, Utensils, Sparkles, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Target, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { analyticsAPI } from '@/src/lib/api';
import { useToast } from '@/src/components/ToastProvider';

const PERIODS = [
  { label: 'Month', date: 'Oct 1 - Oct 31, 2023' },
  { label: 'Quarter', date: 'Jul 1 - Sep 30, 2023' },
];

const MONTHS = [
  'Jan 2023','Feb 2023','Mar 2023','Apr 2023','May 2023','Jun 2023',
  'Jul 2023','Aug 2023','Sep 2023','Oct 2023','Nov 2023','Dec 2023',
];

const QUARTERS = [
  'Q1 2023 (Jan–Mar)',
  'Q2 2023 (Apr–Jun)',
  'Q3 2023 (Jul–Sep)',
  'Q4 2023 (Oct–Dec)',
];

function DatePicker({ period, value, onChange }: { period: number; value: number; onChange: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = period === 0 ? MONTHS : QUARTERS;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const prev = () => onChange(Math.max(0, value - 1));
  const next = () => onChange(Math.min(options.length - 1, value + 1));

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden">
        <button onClick={prev} disabled={value === 0}
          className="p-2 hover:bg-surface-container transition-colors disabled:opacity-30 text-on-surface-variant">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-2 py-2 text-[11px] font-semibold text-on-surface hover:bg-surface-container transition-colors min-w-[140px] justify-center">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{options[value]}</span>
          <ChevronDown className={cn('w-3 h-3 text-on-surface-variant transition-transform', open && 'rotate-180')} />
        </button>
        <button onClick={next} disabled={value === options.length - 1}
          className="p-2 hover:bg-surface-container transition-colors disabled:opacity-30 text-on-surface-variant">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden z-50 w-52"
          >
            <div className="px-3 py-2 border-b border-outline-variant/10">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                {period === 0 ? 'Select Month' : 'Select Quarter'}
              </p>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((opt, i) => (
                <button key={i} onClick={() => { onChange(i); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left',
                    value === i ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-container-low text-on-surface font-medium'
                  )}>
                  {opt}
                  {value === i && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MONTHLY_DATA = {
  Month: {
    income:   [65, 72, 68, 80, 75, 90, 85, 78, 92, 88, 76, 95],
    expense:  [45, 50, 42, 60, 55, 65, 58, 52, 70, 62, 48, 72],
    labels:   ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  },
  Quarter: {
    income:   [200, 220, 240, 260],
    expense:  [140, 160, 150, 180],
    labels:   ['Q1','Q2','Q3','Q4'],
  },
};

const CATEGORIES = [
  { label: 'Housing',       pct: 40, amount: '$3,372', color: '#0145f2', bg: 'bg-primary' },
  { label: 'Food',          pct: 25, amount: '$2,108', color: '#006499', bg: 'bg-secondary' },
  { label: 'Transport',     pct: 15, amount: '$1,264', color: '#9f403a', bg: 'bg-tertiary' },
  { label: 'Entertainment', pct: 20, amount: '$1,688', color: '#f8847b', bg: 'bg-tertiary-container' },
];

const WEEKLY = [30, 55, 40, 70, 60, 85, 50];
const WEEKLY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SAVINGS_MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const SAVINGS_DATA   = [18, 22, 19, 28, 25, 35];

// Build donut segments
function buildDonut(cats: typeof CATEGORIES) {
  let offset = 0;
  return cats.map(c => {
    const dash = c.pct;
    const seg = { ...c, offset, dash };
    offset += dash;
    return seg;
  });
}

export default function Analytics() {
  const { error } = useToast();
  const [period, setPeriod] = useState(0);
  const [dateIndex, setDateIndex] = useState(9);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [summaryData, categoriesData] = await Promise.all([
        analyticsAPI.summary(),
        analyticsAPI.categories()
      ]);
      setSummary(summaryData);
      setCategories(categoriesData);
    } catch (err: any) {
      error('Failed to Load', err.message || 'Could not fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const options = period === 0 ? MONTHS : QUARTERS;
  const selectedDate = options[dateIndex] ?? options[0];

  const key = PERIODS[period].label as 'Month' | 'Quarter';
  const data = MONTHLY_DATA[key];
  const maxVal = Math.max(...data.income, ...data.expense);
  const donutSegs = buildDonut(CATEGORIES);

  // Line chart points for income vs expense
  const pts = (arr: number[]) =>
    arr.map((v, i) => `${(i / (arr.length - 1)) * 100},${100 - (v / maxVal) * 85}`).join(' ');

  const pathD = (arr: number[]) => {
    const points = arr.map((v, i) => ({
      x: (i / (arr.length - 1)) * 100,
      y: 100 - (v / maxVal) * 85,
    }));
    return points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  };

  const areaD = (arr: number[]) =>
    `${pathD(arr)} L100,100 L0,100 Z`;

  return (
    <div className="p-3 md:p-5 max-w-7xl mx-auto w-full space-y-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Insights</span>
          <h2 className="text-[30px] font-extrabold text-on-surface tracking-tighter leading-none mb-1">Insights & Analytics</h2>
          <p className="text-on-surface-variant text-[12px] font-medium">Analyzing your financial gallery — <span className="text-primary font-semibold">{selectedDate}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden">
            {PERIODS.map((p, i) => (
              <button key={i} onClick={() => { setPeriod(i); setDateIndex(i === 0 ? 9 : 3); }}
                className={cn('px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors',
                  period === i ? 'text-primary bg-primary-container/20' : 'text-on-surface-variant hover:text-on-surface'
                )}>{p.label}</button>
            ))}
          </div>
          <DatePicker period={period} value={dateIndex} onChange={setDateIndex} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp,   label: 'Net Growth',    value: summary ? `+${summary.growth_pct}%` : '+0%',  sub: summary ? `+$${summary.net_surplus.toFixed(0)}` : '$0',  color: 'text-primary',   bg: 'bg-primary-container/20',   trend: true },
          { icon: Wallet,       label: 'Savings Rate',  value: summary ? `${summary.savings_rate}%` : '0%',     sub: 'This period',   color: 'text-secondary', bg: 'bg-secondary-container/20', trend: true },
          { icon: DollarSign,   label: 'Total Income',  value: summary ? `$${summary.total_income.toLocaleString()}` : '$0', sub: 'This period', color: 'text-primary', bg: 'bg-surface-container-low',  trend: true },
          { icon: TrendingDown, label: 'Total Expense', value: summary ? `$${summary.total_expense.toLocaleString()}` : '$0',  sub: summary ? `Top: ${summary.top_category}` : 'N/A', color: 'text-tertiary', bg: 'bg-surface-container-low',  trend: false },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={cn('p-4 rounded-2xl relative overflow-hidden group cursor-default', m.bg)}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{m.label}</p>
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', m.trend ? 'bg-primary/10' : 'bg-tertiary/10')}>
                <m.icon className={cn('w-3.5 h-3.5', m.color)} />
              </div>
            </div>
            <p className={cn('text-xl font-black tracking-tight', m.color)}>{m.value}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 font-medium">{m.sub}</p>
            <div className={cn('absolute bottom-0 left-0 h-0.5 w-full opacity-30', m.trend ? 'bg-primary' : 'bg-tertiary')} />
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Income vs Expense Line Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight">Income vs. Expenses</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{selectedDate}</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /><span className="text-[10px] font-semibold">Income</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" /><span className="text-[10px] font-semibold">Expense</span></div>
            </div>
          </div>
          <div className="relative h-48 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ig" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0145f2" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0145f2" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="eg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006499" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#006499" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[25, 50, 75].map(y => (
                <line key={y} x1="0" y1={100 - y} x2="100" y2={100 - y} stroke="#eaeff0" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              ))}
              {/* Area fills */}
              <path d={areaD(data.income)} fill="url(#ig)" />
              <path d={areaD(data.expense)} fill="url(#eg)" />
              {/* Lines */}
              <polyline points={pts(data.income)} fill="none" stroke="#0145f2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <polyline points={pts(data.expense)} fill="none" stroke="#006499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {/* Dots */}
              {data.income.map((v, i) => (
                <circle key={i} cx={(i / (data.income.length - 1)) * 100} cy={100 - (v / maxVal) * 85} r="1.2" fill="#0145f2" vectorEffect="non-scaling-stroke" />
              ))}
              {data.expense.map((v, i) => (
                <circle key={i} cx={(i / (data.expense.length - 1)) * 100} cy={100 - (v / maxVal) * 85} r="1.2" fill="#006499" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {/* X labels */}
            <div className="flex justify-between mt-1 px-0.5">
              {data.labels.map(l => <span key={l} className="text-[8px] font-bold text-on-surface-variant uppercase">{l}</span>)}
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/5">
          <h3 className="text-sm font-bold tracking-tight mb-1">Spending Breakdown</h3>
          <p className="text-[10px] text-on-surface-variant mb-4">By category this period</p>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#eaeff0" strokeWidth="3.5" />
                {donutSegs.map((s, i) => (
                  <circle key={i} cx="18" cy="18" r="15.915" fill="transparent"
                    stroke={s.color} strokeWidth="3.5"
                    strokeDasharray={`${s.dash} ${100 - s.dash}`}
                    strokeDashoffset={-s.offset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black">${summary ? summary.total_expense.toLocaleString() : '0'}</span>
                <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-wider">Spent</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {(categories.length > 0 ? categories.slice(0, 4).map((c: any) => ({
                label: c._id,
                amount: `$${c.total.toFixed(0)}`,
                pct: summary ? Math.round((c.total / summary.total_expense) * 100) : 0,
                color: ['#0145f2', '#006499', '#9f403a', '#f8847b'][categories.indexOf(c) % 4],
                bg: ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-tertiary-container'][categories.indexOf(c) % 4]
              })) : CATEGORIES).map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-xs font-medium flex-1">{c.label}</span>
                  <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn('h-full rounded-full', c.bg)} />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant w-12 text-right">{c.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Weekly Spending Bar Chart */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/5">
          <h3 className="text-sm font-bold tracking-tight mb-0.5">Weekly Spending</h3>
          <p className="text-[10px] text-on-surface-variant mb-4">Current week daily breakdown</p>
          <div className="flex items-end gap-1.5 h-32">
            {WEEKLY.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                onMouseEnter={() => setHoveredWeek(i)} onMouseLeave={() => setHoveredWeek(null)}>
                {hoveredWeek === i && (
                  <span className="text-[8px] font-bold text-primary mb-0.5">${v}</span>
                )}
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${v}%` }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={cn('w-full rounded-t-md transition-colors cursor-pointer',
                    hoveredWeek === i ? 'bg-primary' : i === 5 || i === 6 ? 'bg-primary/30' : 'bg-primary/20'
                  )}
                />
                <span className="text-[8px] font-bold text-on-surface-variant uppercase">{WEEKLY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Trend */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/5">
          <h3 className="text-sm font-bold tracking-tight mb-0.5">Savings Rate Trend</h3>
          <p className="text-[10px] text-on-surface-variant mb-4">6-month savings % of income</p>
          <div className="relative h-32 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006499" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#006499" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map(y => (
                <line key={y} x1="0" y1={100 - y} x2="100" y2={100 - y} stroke="#eaeff0" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              ))}
              <path d={`${SAVINGS_DATA.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (SAVINGS_DATA.length - 1)) * 100},${100 - (v / 40) * 90}`).join(' ')} L100,100 L0,100 Z`} fill="url(#sg)" />
              <polyline
                points={SAVINGS_DATA.map((v, i) => `${(i / (SAVINGS_DATA.length - 1)) * 100},${100 - (v / 40) * 90}`).join(' ')}
                fill="none" stroke="#006499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
              />
              {SAVINGS_DATA.map((v, i) => (
                <circle key={i} cx={(i / (SAVINGS_DATA.length - 1)) * 100} cy={100 - (v / 40) * 90} r="1.5" fill="#006499" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <div className="flex justify-between mt-1">
              {SAVINGS_MONTHS.map(m => <span key={m} className="text-[8px] font-bold text-on-surface-variant uppercase">{m}</span>)}
            </div>
          </div>
        </div>

        {/* Monthly Bar Comparison */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/5">
          <h3 className="text-sm font-bold tracking-tight mb-0.5">Monthly Comparison</h3>
          <p className="text-[10px] text-on-surface-variant mb-4">Budget vs actual spend</p>
          <div className="flex items-end gap-2 h-32">
            {[
              { month: 'Jul', budget: 70, spent: 60 },
              { month: 'Aug', budget: 75, spent: 65 },
              { month: 'Sep', budget: 65, spent: 70 },
              { month: 'Oct', budget: 90, spent: 80 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                {hoveredBar === i && (
                  <span className="text-[8px] font-bold text-on-surface mb-0.5 whitespace-nowrap">${d.spent * 100}</span>
                )}
                <div className="w-full flex gap-0.5 items-end" style={{ height: '90%' }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${d.budget}%` }} transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex-1 bg-primary/20 rounded-t-sm" />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${d.spent}%` }} transition={{ duration: 0.5, delay: i * 0.08 + 0.05 }}
                    className={cn('flex-1 rounded-t-sm', i === 2 ? 'bg-tertiary' : 'bg-primary')} />
                </div>
                <span className="text-[8px] font-bold text-on-surface-variant uppercase">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-3 justify-center">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary/20 inline-block" /><span className="text-[9px] text-on-surface-variant font-medium">Budget</span></div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary inline-block" /><span className="text-[9px] text-on-surface-variant font-medium">Actual</span></div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Spending Categories */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/5">
          <h3 className="text-sm font-bold tracking-tight mb-4">Top Spending</h3>
          <div className="space-y-3">
            {[
              { label: 'Housing',   amount: '$3,372', pct: 40, icon: '🏠' },
              { label: 'Food',      amount: '$2,108', pct: 25, icon: '🍽️' },
              { label: 'Entertain', amount: '$1,688', pct: 20, icon: '🎬' },
              { label: 'Transport', amount: '$1,264', pct: 15, icon: '🚗' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{c.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold">{c.label}</span>
                    <span className="text-xs font-bold text-on-surface">{c.amount}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-primary rounded-full" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant w-8 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atelier Insights */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Atelier Insights</h3>
              <p className="text-[10px] text-on-surface-variant">AI-powered recommendations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { icon: ArrowUpRight, label: 'Spending Alert', color: 'text-tertiary', bg: 'bg-tertiary/10', text: 'Dining expenses 15% higher than last month. Consider a budget cap.' },
              { icon: Target,       label: 'Growth Tip',     color: 'text-primary',  bg: 'bg-primary/10',  text: '+$200/mo contribution could accelerate your goals by 4 months.' },
              { icon: ArrowDownRight, label: 'Optimization', color: 'text-secondary', bg: 'bg-secondary/10', text: '$450 remaining in Transport. Reallocate to Savings for better yield.' },
            ].map((ins, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-default">
                <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center mb-2', ins.bg)}>
                  <ins.icon className={cn('w-3.5 h-3.5', ins.color)} />
                </div>
                <p className={cn('text-[10px] font-bold mb-1', ins.color)}>{ins.label}</p>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">{ins.text}</p>
              </motion.div>
            ))}
          </div>
          <button className="w-full py-2.5 bg-primary text-white font-bold rounded-full text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity">
            Request Deep Audit
          </button>
        </div>
      </div>
    </div>
  );
}
