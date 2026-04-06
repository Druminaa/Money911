import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flag, Target, TrendingUp, Plus, ChevronRight, Star, Trophy, MapPin } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import AddGoalForm from '@/src/components/forms/AddGoalForm';
import { goalsAPI } from '@/src/lib/api';
import { useToast } from '@/src/components/ToastProvider';

export default function Goals() {
  const { success, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalsAPI.getAll();
      setGoals(res.data || []);
    } catch (err: any) {
      error('Failed to Load', err.message || 'Could not fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await goalsAPI.create(data);
      success('Goal Created', `${data.title} added to your aspirations`);
      fetchGoals();
    } catch (err: any) {
      error('Failed to Create', err.message || 'Could not create goal');
    }
  };

  return (
    <>
    {showForm && <AddGoalForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
    <div className="p-3 md:p-5 space-y-4 md:space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Goals</span>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface leading-none mb-1">Financial Aspirations</h1>
          <p className="text-on-surface-variant text-xs font-medium">Mapping the path to your future milestones.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="w-full md:w-auto px-5 py-2 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          New Aspiration
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col justify-between">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Active Goals</p>
          <div className="mt-1 text-xl md:text-2xl font-black text-on-surface">08</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col justify-between">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Total Progress</p>
          <div className="mt-1 text-xl md:text-2xl font-black text-primary">64%</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col justify-between">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Est. Completion</p>
          <div className="mt-1 text-xl md:text-2xl font-black text-secondary">2.4 Yrs</div>
        </div>
        <div className="bg-primary-container/20 p-4 rounded-2xl flex flex-col justify-between border border-primary/10 col-span-2 md:col-span-1">
          <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Next Milestone</p>
          <div className="mt-1 text-base md:text-lg font-bold text-on-primary-container">Swiss Alps Retreat</div>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">No goals yet. Create your first aspiration!</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {goals.map((goal, i) => {
          const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
          const defaultImg = 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80';
          return (
          <motion.div 
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-outline-variant/10"
          >
            <div className="relative h-40 md:h-48 overflow-hidden">
              <img src={defaultImg} alt={goal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{goal.category}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{goal.title}</h3>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6 space-y-5 md:space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Current Balance</p>
                  <p className="text-xl md:text-2xl font-black text-on-surface">${goal.current_amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Target</p>
                  <p className="text-xs md:text-sm font-bold text-on-surface-variant">${goal.target_amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-primary">{progress.toFixed(0)}% Completed</span>
                  <span className="text-on-surface-variant">{goal.deadline || 'No deadline'}</span>
                </div>
                <div className="h-1.5 md:h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full rounded-full bg-secondary" 
                  />
                </div>
              </div>
              <button className="w-full py-3 border-2 border-outline-variant/15 rounded-xl font-bold text-xs md:text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
                View Roadmap
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )})}
      </div>
      )}

      {/* Achievement Section */}
      <section className="bg-surface-container-low rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Trophy className="text-secondary w-5 h-5 md:w-6 md:h-6" />
          <h2 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Recent Achievements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 shadow-sm text-center sm:text-left">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-container rounded-full flex items-center justify-center text-primary shrink-0">
              <Target className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div>
              <h4 className="text-sm md:text-base font-bold text-on-surface">Emergency Fund Secured</h4>
              <p className="text-xs md:text-sm text-on-surface-variant">You've reached your 6-month buffer goal. Stability achieved.</p>
              <p className="text-[10px] font-bold text-primary uppercase mt-2">Unlocked on Oct 12, 2023</p>
            </div>
          </div>
          <div className="bg-white p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 shadow-sm text-center sm:text-left">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-secondary-container rounded-full flex items-center justify-center text-secondary shrink-0">
              <MapPin className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div>
              <h4 className="text-sm md:text-base font-bold text-on-surface">Global Citizen</h4>
              <p className="text-xs md:text-sm text-on-surface-variant">First international transaction processed in Zurich. Welcome to the world.</p>
              <p className="text-[10px] font-bold text-secondary uppercase mt-2">Unlocked on Oct 05, 2023</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
