import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Wallet, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Trash2, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/components/ToastProvider';
import { cashAPI } from '@/src/lib/api';

const CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Refund', 'Food', 'Transport', 'Shopping', 'Bills', 'Medical', 'Other'];

interface CashEntry {
  id: string;
  type: 'in' | 'out';
  amount: number;
  category: string;
  note: string;
  date: string;
}

function Dropdown({ options, value, onChange, placeholder }: { options: string[]; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-surface-container rounded-lg text-sm text-left hover:bg-surface-container-high transition-colors">
        <span className={value ? 'text-on-surface' : 'text-on-surface-variant'}>{value || placeholder}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-on-surface-variant transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-outline-variant/10 overflow-hidden max-h-48 overflow-y-auto">
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-surface-container-low transition-colors text-left">
              <span className={cn('font-medium', value === opt ? 'text-primary' : 'text-on-surface')}>{opt}</span>
              {value === opt && <Check className="w-3 h-3 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddCashForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (d: any) => void }) {
  const [form, setForm] = useState({ type: 'in', amount: '', category: '', note: '' });
  const { error } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) { error('Missing Category', 'Please select a category.'); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { error('Invalid Amount', 'Please enter a valid amount.'); return; }
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-xl p-4 md:p-5 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">Add Cash Entry</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Type</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setForm({ ...form, type: 'in' })}
                className={cn('flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-colors', form.type === 'in' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high')}>
                <ArrowUpCircle className="w-4 h-4" /> Cash In
              </button>
              <button type="button" onClick={() => setForm({ ...form, type: 'out' })}
                className={cn('flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-colors', form.type === 'out' ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container hover:bg-surface-container-high')}>
                <ArrowDownCircle className="w-4 h-4" /> Cash Out
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Amount</label>
            <input type="number" min="0" step="0.01" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="$0.00"
              value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Category</label>
            <Dropdown options={CATEGORIES} value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="Select category" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Note <span className="text-on-surface-variant font-normal">(optional)</span></label>
            <input type="text" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="Brief description..."
              value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          </div>
          <button type="submit" className={cn('w-full py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity', form.type === 'in' ? 'bg-primary text-on-primary' : 'bg-tertiary text-on-tertiary')}>
            {form.type === 'in' ? 'Add Cash In' : 'Add Cash Out'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Cash() {
  const { success, info, error } = useToast();
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCash();
  }, []);

  const fetchCash = async () => {
    try {
      setLoading(true);
      const res = await cashAPI.getAll();
      const data = (res.data || []).map((c: any) => ({
        id: c.id,
        type: c.type,
        amount: c.amount,
        category: c.category,
        note: c.note || '—',
        date: new Date(c.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }));
      setEntries(data);
    } catch (err: any) {
      error('Failed to Load', err.message || 'Could not fetch cash entries');
    } finally {
      setLoading(false);
    }
  };

  const totalIn  = useMemo(() => entries.filter(e => e.type === 'in').reduce((s, e) => s + e.amount, 0), [entries]);
  const totalOut = useMemo(() => entries.filter(e => e.type === 'out').reduce((s, e) => s + e.amount, 0), [entries]);
  const balance  = totalIn - totalOut;

  const filtered = useMemo(() => filter === 'all' ? entries : entries.filter(e => e.type === filter), [entries, filter]);

  const handleSubmit = async (data: any) => {
    try {
      await cashAPI.create(data);
      success(data.type === 'in' ? 'Cash In Recorded' : 'Cash Out Recorded', `$${parseFloat(data.amount).toFixed(2)} — ${data.category}`);
      fetchCash();
    } catch (err: any) {
      error('Failed to Add', err.message || 'Could not create cash entry');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const entry = entries.find(e => e.id === id);
      await cashAPI.delete(id);
      info('Entry Removed', `${entry?.note} deleted.`);
      fetchCash();
    } catch (err: any) {
      error('Failed to Delete', err.message || 'Could not delete entry');
    }
  };

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <>
      <AnimatePresence>{showForm && <AddCashForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}</AnimatePresence>

      <div className="p-3 md:p-5 space-y-4 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div>
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">Wallet</span>
            <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface mt-1">Cash Flow</h1>
            <p className="text-on-surface-variant mt-1 text-xs">Track your physical cash in and out.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="w-full md:w-auto py-2 px-5 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform text-sm">
            <Plus className="w-4 h-4" /> Add Cash Entry
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-primary-container/20 p-4 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Cash Balance</p>
            </div>
            <h3 className="text-[24px] font-black text-on-primary-container tracking-tight">{fmt(balance)}</h3>
            <p className="text-[10px] text-on-surface-variant mt-1">{balance >= 0 ? 'Positive balance' : 'Negative balance'}</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Cash In</p>
            </div>
            <h3 className="text-[24px] font-bold text-primary">{fmt(totalIn)}</h3>
            <p className="text-[10px] text-on-surface-variant mt-1">{entries.filter(e => e.type === 'in').length} entries</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-tertiary" />
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Cash Out</p>
            </div>
            <h3 className="text-[24px] font-bold text-tertiary">{fmt(totalOut)}</h3>
            <p className="text-[10px] text-on-surface-variant mt-1">{entries.filter(e => e.type === 'out').length} entries</p>
          </div>
        </div>

        {/* Filter Tabs + History */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
            <h3 className="text-sm font-bold text-on-surface">Cash History</h3>
            <div className="flex gap-1 bg-surface-container rounded-full p-1">
              {(['all', 'in', 'out'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all', filter === f ? 'bg-white shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface')}>
                  {f === 'all' ? 'All' : f === 'in' ? 'Cash In' : 'Cash Out'}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-outline-variant/10">
            {loading ? (
              <p className="p-8 text-center text-xs text-on-surface-variant">Loading cash entries...</p>
            ) : (
            <AnimatePresence>
              {filtered.length === 0 ? (
                <p className="p-8 text-center text-xs text-on-surface-variant">No entries found.</p>
              ) : filtered.map(entry => (
                <motion.div key={entry.id}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', entry.type === 'in' ? 'bg-primary-container text-primary' : 'bg-tertiary-container/40 text-tertiary')}>
                      {entry.type === 'in' ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">{entry.note}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-surface-container rounded-full text-on-surface-variant">{entry.category}</span>
                        <span className="text-[9px] text-on-surface-variant">{entry.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={cn('text-sm font-bold', entry.type === 'in' ? 'text-primary' : 'text-tertiary')}>
                      {entry.type === 'in' ? '+' : '-'}{fmt(entry.amount)}
                    </p>
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-tertiary/10 rounded-full text-on-surface-variant hover:text-tertiary transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            )}
          </div>

          {/* Balance Bar */}
          <div className="px-4 py-3 bg-surface-container-low border-t border-outline-variant/10 flex justify-between items-center">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Net Balance</span>
            <span className={cn('text-sm font-black', balance >= 0 ? 'text-primary' : 'text-tertiary')}>{fmt(balance)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
