import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Handshake, ArrowUpRight, ArrowDownLeft, Plus, History, ShieldCheck, Info, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import LoanForm from '@/src/components/forms/LoanForm';
import { loansAPI } from '@/src/lib/api';
import { useToast } from '@/src/components/ToastProvider';

export default function BorrowLoan() {
  const { success, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'lend' | 'borrow'>('borrow');
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await loansAPI.getAll();
      setLoans(data || []);
    } catch (err: any) {
      error('Failed to Load', err.message || 'Could not fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await loansAPI.create(data);
      success('Loan Created', `${data.name} added successfully`);
      fetchLoans();
    } catch (err: any) {
      error('Failed to Create', err.message || 'Could not create loan');
    }
  };

  return (
    <>
    {showForm && <LoanForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} type={formType} />}
    <div className="p-3 md:p-5 space-y-4 md:space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Capital</span>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface leading-none mb-1">Capital Flow</h1>
          <p className="text-on-surface-variant text-xs font-medium">Managing your lending and borrowing ecosystem.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button onClick={() => { setFormType('lend'); setShowForm(true); }} className="flex-1 sm:flex-none px-5 py-2 bg-surface-container-low text-on-surface rounded-full font-bold shadow-sm hover:bg-surface-container transition-colors flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Lend Capital
          </button>
          <button onClick={() => { setFormType('borrow'); setShowForm(true); }} className="flex-1 sm:flex-none px-5 py-2 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm">
            <Handshake className="w-4 h-4" />Request Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-primary-container/20 p-4 md:p-5 rounded-2xl border border-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ArrowUpRight className="w-14 h-14 text-primary" />
          </div>
          <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Total Lent Out</p>
          <h3 className="text-2xl md:text-3xl font-headline font-black text-on-primary-container tracking-tighter">$42,500.00</h3>
          <div className="mt-4 flex items-center gap-4">
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Active Loans</p><p className="text-base font-bold text-on-surface">12</p></div>
            <div className="h-6 w-px bg-outline-variant/20"></div>
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Avg. Yield</p><p className="text-base font-bold text-primary">8.4%</p></div>
          </div>
        </div>
        <div className="bg-tertiary-container/20 p-4 md:p-5 rounded-2xl border border-tertiary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ArrowDownLeft className="w-14 h-14 text-tertiary" />
          </div>
          <p className="text-[9px] font-bold text-tertiary uppercase tracking-widest mb-1">Total Borrowed</p>
          <h3 className="text-2xl md:text-3xl font-headline font-black text-on-tertiary-container tracking-tighter">$18,200.00</h3>
          <div className="mt-4 flex items-center gap-4">
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Active Debts</p><p className="text-base font-bold text-on-surface">03</p></div>
            <div className="h-6 w-px bg-outline-variant/20"></div>
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Next Payment</p><p className="text-base font-bold text-tertiary">Oct 28</p></div>
          </div>
        </div>
      </div>

      {/* Active Agreements */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-headline font-bold tracking-tight">Active Agreements</h2>
          <button className="text-xs md:text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            <History className="w-4 h-4" />
            View Archive
          </button>
        </div>
        {loading ? (
          <div className="text-center py-12 text-on-surface-variant">Loading loans...</div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">No loans yet. Create your first agreement!</div>
        ) : (
        <div className="grid grid-cols-1 gap-4">
          {loans.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest p-5 md:p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-surface-container-low", item.type === 'lend' ? 'text-primary' : 'text-tertiary')}>
                  {item.type === 'lend' ? <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" /> : <ArrowDownLeft className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-on-surface">{item.name}</h4>
                  <p className="text-[10px] md:text-xs text-on-surface-variant font-medium">{item.type === 'lend' ? 'Lending' : 'Borrowing'} • {item.interest_rate}% APR • {item.duration}</p>
                </div>
              </div>
              
              <div className="flex-1 w-full md:max-w-xs">
                <div className="flex justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-on-surface-variant">Repayment Progress</span>
                  <span className={item.type === 'lend' ? 'text-primary' : 'text-tertiary'}>{item.progress || 0}%</span>
                </div>
                <div className="h-1 md:h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.type === 'lend' ? 'bg-primary' : 'bg-tertiary')} style={{ width: `${item.progress || 0}%` }}></div>
                </div>
              </div>

              <div className="flex justify-between md:block items-center">
                <div className="md:text-right">
                  <p className="text-lg md:text-xl font-black text-on-surface">${item.amount.toLocaleString()}</p>
                  <p className={cn("text-[8px] md:text-[10px] font-bold uppercase tracking-tighter", item.type === 'lend' ? 'text-primary' : 'text-tertiary')}>{item.status}</p>
                </div>
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors md:ml-4">
                  <Info className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </section>

      {/* Security Banner */}
      <div className="bg-on-surface text-surface p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold font-headline mb-2">Atelier Protection Program</h3>
          <p className="text-surface/70 text-xs md:text-sm leading-relaxed max-w-2xl">
            All lending agreements are backed by our smart-contract escrow system. We ensure total transparency and legal compliance for every capital flow within your atelier.
          </p>
        </div>
        <button className="w-full md:w-auto px-6 py-3 border border-surface/30 rounded-full font-bold text-xs md:text-sm hover:bg-white/10 transition-colors whitespace-nowrap">
          Learn About Escrow
        </button>
      </div>
    </div>
    </>
  );
}
