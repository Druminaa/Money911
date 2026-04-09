import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, TrendingUp, Home, Utensils, Film, Car, Lightbulb, History, PieChart } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import AddBudgetForm from '@/src/components/forms/AddBudgetForm';
import { budgetsAPI } from '@/src/lib/api';
import { useToast } from '@/src/components/ToastProvider';

export default function Budget() {
  const { success, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetsAPI.getAll();
      setBudgets(res.data || []);
    } catch (err: any) {
      error('Failed to Load', err.message || 'Could not fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await budgetsAPI.create({ category: data.category, amount: parseFloat(data.amount), period: data.period });
      success('Budget Created', `${data.category} budget added`);
      setShowForm(false);
      fetchBudgets();
    } catch (err: any) {
      error('Failed to Create', err.message || 'Could not create budget');
    }
  };

  return (
    <>
    {showForm && <AddBudgetForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
    <div className="p-3 md:p-5 space-y-4 md:space-y-5 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Overview</span>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface mt-1">Monthly Budget</h1>
          <p className="text-on-surface-variant text-xs mt-1 max-w-lg">Review and optimize your financial flow for October.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="w-full md:w-auto bg-primary text-on-primary font-semibold px-5 py-2 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md text-sm">
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="md:col-span-2 bg-surface-container-low rounded-xl p-4 md:p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-on-surface-variant text-xs font-medium mb-1">Total Allocated</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter text-on-surface">$12,450.00</span>
              <span className="text-primary font-bold flex items-center text-xs"><TrendingUp className="w-3.5 h-3.5 mr-1" /> 2.4%</span>
            </div>
          </div>
          <div className="relative z-10 mt-5 flex gap-5">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">Actual Spent</p>
              <p className="text-lg md:text-xl font-headline font-bold text-on-surface">$8,122.45</p>
            </div>
            <div className="h-8 w-px bg-outline-variant/30"></div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">Remaining</p>
              <p className="text-lg md:text-xl font-headline font-bold text-primary">$4,327.55</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary-container rounded-xl p-4 md:p-5 flex flex-col justify-between text-on-secondary-container">
          <div>
            <TrendingUp className="w-6 h-6 mb-3" />
            <h3 className="text-base font-bold font-headline mb-1">Stability Score</h3>
            <p className="text-xs opacity-80">Your savings buffer is at an all-time high.</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter">8.4/10</p>
            <p className="text-[9px] mt-1 uppercase tracking-[0.2em] font-semibold">Excellent Health</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-lg md:text-xl font-headline font-bold text-on-surface flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Category Allocation
          </h2>
          {loading ? (
            <div className="text-center py-8 text-on-surface-variant">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">No budgets yet. Create your first budget!</div>
          ) : (
          <div className="space-y-4">
            {budgets.map((budget, i) => {
              const iconMap: any = { Housing: Home, 'Food & Dining': Utensils, Entertainment: Film, Transportation: Car };
              const Icon = iconMap[budget.category] || Home;
              const spent = budget.spent || 0;
              const progress = Math.min((spent / budget.amount) * 100, 100);
              const isOverBudget = progress > 100;
              return (
              <div key={budget.id} className="bg-surface-container-lowest p-5 md:p-6 rounded-xl transition-all hover:translate-x-1 group border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center", isOverBudget ? 'bg-tertiary-container text-tertiary' : 'bg-primary-container text-primary')}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-on-surface">{budget.category}</h4>
                      <p className="text-[10px] md:text-xs text-on-surface-variant">{budget.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm md:text-base font-bold", isOverBudget ? 'text-tertiary' : 'text-on-surface')}>${spent.toFixed(2)}</p>
                    <p className="text-[10px] md:text-xs text-on-surface-variant">of ${budget.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="h-1.5 md:h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn("h-full rounded-full", isOverBudget ? 'bg-tertiary' : 'bg-primary')} 
                  />
                </div>
                {isOverBudget && <p className="text-[10px] text-tertiary font-bold mt-2">⚠️ Over budget by ${(spent - budget.amount).toFixed(2)}</p>}
              </div>
            )})}
          </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-lg md:text-xl font-headline font-bold text-on-surface flex items-center gap-2">
            <History className="w-5 h-5 text-secondary" />
            Historical Performance
          </h2>
          <div className="bg-surface-container-low rounded-xl p-5 md:p-6 h-[350px] md:h-[400px] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">6 Month Trend</p>
                <p className="text-base md:text-lg font-headline font-bold">Spending Volatility</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  <span className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Budget</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                  <span className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Spent</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-1 md:px-2">
              {[60, 65, 70, 60, 80, 85].map((h, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-full flex justify-center items-end h-full gap-1">
                    <div className={cn("w-2 md:w-3 bg-primary/20 rounded-t-sm")} style={{ height: `${h}%` }}></div>
                    <div className={cn("w-2 md:w-3 bg-secondary rounded-t-sm")} style={{ height: `${h - 10}%` }}></div>
                  </div>
                  <span className="text-[8px] md:text-[10px] mt-2 font-medium text-on-surface-variant uppercase">{['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-container to-secondary-container rounded-xl p-5 md:p-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-on-primary-container fill-current" />
                <span className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider">Atelier Suggestion</span>
              </div>
              <p className="text-on-primary-container text-sm font-medium leading-relaxed">
                Based on your "Entertainment" trend, switching to an annual plan for Netflix could save you <span className="font-bold">$42.00</span> this year.
              </p>
              <button className="mt-4 text-[10px] font-bold text-on-primary-container flex items-center gap-1 hover:underline">
                View details <TrendingUp className="w-3 h-3 rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
