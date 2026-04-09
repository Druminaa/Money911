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
      await loansAPI.create({
        type: formType,
        name: data.name,
        amount: parseFloat(data.amount),
        interest_rate: parseFloat(data.interestRate),
        duration: data.duration,
        purpose: data.purpose
      });
      success('Loan Created', `${data.name} added successfully`);
      setShowForm(false);
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
          <h3 className="text-2xl md:text-3xl font-headline font-black text-on-primary-container tracking-tighter">
            ${loans.filter(l => l.type === 'lend').reduce((sum, l) => sum + l.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-4">
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Active Loans</p><p className="text-base font-bold text-on-surface">{loans.filter(l => l.type === 'lend').length}</p></div>
            <div className="h-6 w-px bg-outline-variant/20"></div>
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Avg. Yield</p><p className="text-base font-bold text-primary">{loans.filter(l => l.type === 'lend').length > 0 ? (loans.filter(l => l.type === 'lend').reduce((sum, l) => sum + l.interest_rate, 0) / loans.filter(l => l.type === 'lend').length).toFixed(1) : '0.0'}%</p></div>
          </div>
        </div>
        <div className="bg-tertiary-container/20 p-4 md:p-5 rounded-2xl border border-tertiary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ArrowDownLeft className="w-14 h-14 text-tertiary" />
          </div>
          <p className="text-[9px] font-bold text-tertiary uppercase tracking-widest mb-1">Total Borrowed</p>
          <h3 className="text-2xl md:text-3xl font-headline font-black text-on-tertiary-container tracking-tighter">
            ${loans.filter(l => l.type === 'borrow').reduce((sum, l) => sum + l.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-4">
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Active Debts</p><p className="text-base font-bold text-on-surface">{loans.filter(l => l.type === 'borrow').length}</p></div>
            <div className="h-6 w-px bg-outline-variant/20"></div>
            <div><p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Avg. Rate</p><p className="text-base font-bold text-tertiary">{loans.filter(l => l.type === 'borrow').length > 0 ? (loans.filter(l => l.type === 'borrow').reduce((sum, l) => sum + l.interest_rate, 0) / loans.filter(l => l.type === 'borrow').length).toFixed(1) : '0.0'}%</p></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loans.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "bg-surface-container-lowest p-5 rounded-2xl shadow-sm border hover:shadow-md transition-all",
                item.type === 'lend' ? 'border-primary/20' : 'border-tertiary/20'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  item.type === 'lend' ? 'bg-primary-container text-primary' : 'bg-tertiary-container text-tertiary'
                )}>
                  {item.type === 'lend' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                  item.type === 'lend' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'
                )}>
                  {item.status}
                </span>
              </div>
              
              <h4 className="text-base font-bold text-on-surface mb-1">{item.name}</h4>
              <p className="text-xs text-on-surface-variant mb-4">
                {item.type === 'lend' ? 'Lending' : 'Borrowing'} • {item.interest_rate}% APR • {item.duration}
              </p>
              
              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-on-surface-variant">Repayment</span>
                  <span className={item.type === 'lend' ? 'text-primary' : 'text-tertiary'}>{item.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", item.type === 'lend' ? 'bg-primary' : 'bg-tertiary')} 
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Amount</p>
                  <p className="text-xl font-black text-on-surface">${item.amount.toLocaleString()}</p>
                </div>
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
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
