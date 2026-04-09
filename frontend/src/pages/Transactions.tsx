import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, LayoutGrid, Download, FileText, Utensils, Briefcase, Home, Smartphone, PiggyBank, ChevronLeft, ChevronRight, Plus, Landmark, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import AddTransactionForm from '@/src/components/forms/AddTransactionForm';
import { useToast } from '@/src/components/ToastProvider';
import { transactionsAPI } from '@/src/lib/api';

const CATEGORIES = ['All Categories', 'Food & Dining', 'Salary & Perks', 'Rent & Housing', 'Electronics', 'Investment'];
const PAGE_SIZE = 5;

const fmt = (n: number) => `${n < 0 ? '-' : '+'}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default function Transactions() {
  const { success, info, error } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_surplus: 0 });

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionsAPI.getAll();
      const data = res.data || [];
      const formatted = data.map((t: any) => ({
        id: t.id,
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date(t.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        name: t.description,
        icon: Briefcase,
        cat: t.category,
        status: t.status || 'COMPLETED',
        amount: t.type === 'expense' ? -Math.abs(t.amount) : Math.abs(t.amount),
        type: t.type,
        iconColor: t.type === 'income' ? 'bg-primary-container text-primary' : 'bg-secondary-container text-secondary',
      }));
      setTransactions(formatted);
    } catch (err: any) {
      error('Failed to Load', err.message || 'Could not fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await transactionsAPI.summary();
      setSummary(res);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await transactionsAPI.create(data);
      success('Transaction Added', `${data.description} recorded successfully`);
      fetchTransactions();
      fetchSummary();
      setPage(1);
    } catch (err: any) {
      error('Failed to Add', err.message || 'Could not create transaction');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await transactionsAPI.delete(id);
      info('Transaction Removed', `"${name}" has been deleted.`);
      fetchTransactions();
      fetchSummary();
    } catch (err: any) {
      error('Failed to Delete', err.message || 'Could not delete transaction');
    }
  };

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All Categories' || t.cat === category;
      return matchSearch && matchCat;
    });
  }, [transactions, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalIncome = summary.total_income;
  const totalExpense = summary.total_expense;
  const netSurplus = summary.net_surplus;

  const handleExportCSV = () => {
    const rows = [['Date', 'Name', 'Category', 'Status', 'Amount'], ...filtered.map(t => [t.date, t.name, t.cat, t.status, fmt(t.amount)])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    success('CSV Downloaded', 'Your transactions have been exported.');
  };

  const handleExportPDF = () => {
    const doc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Transactions Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #2c3436; }
    h1 { color: #0145f2; font-size: 28px; margin-bottom: 10px; }
    .meta { color: #596063; font-size: 12px; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f0f4f6; padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; font-weight: bold; color: #596063; }
    td { padding: 12px; border-bottom: 1px solid #eaeff0; font-size: 13px; }
    .income { color: #0145f2; font-weight: bold; }
    .expense { color: #2c3436; font-weight: bold; }
    .summary { margin-top: 30px; padding: 20px; background: #f8fafb; border-radius: 8px; }
    .summary-item { display: inline-block; margin-right: 40px; }
    .summary-label { font-size: 11px; color: #596063; text-transform: uppercase; }
    .summary-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
  </style>
</head>
<body>
  <h1>Transactions Report</h1>
  <div class="meta">Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | Total: ${filtered.length} transactions</div>
  
  <div class="summary">
    <div class="summary-item">
      <div class="summary-label">Total Income</div>
      <div class="summary-value" style="color: #0145f2;">${fmt(totalIncome)}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Total Expenses</div>
      <div class="summary-value" style="color: #9f403a;">-$${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Net Surplus</div>
      <div class="summary-value" style="color: #006499;">$${netSurplus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Status</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${filtered.map(t => `
        <tr>
          <td>${t.date}</td>
          <td>${t.name}</td>
          <td>${t.cat}</td>
          <td>${t.status}</td>
          <td style="text-align: right;" class="${t.type}">${fmt(t.amount)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
    `;
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => {
        win.print();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      };
    }
    success('PDF Ready', 'Print dialog opened for PDF export.');
  };

  return (
    <>
      {showForm && <AddTransactionForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
      <div className="p-3 md:p-5 space-y-4 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div>
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">Ledger</span>
            <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface mt-1">Transactions</h1>
            <p className="text-on-surface-variant mt-1 text-xs">Review and manage your financial flow.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="w-full md:w-auto py-2 px-5 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform text-sm">
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">Loading...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-on-surface-variant text-xs font-medium">Total Income</p>
            <h3 className="text-[24px] font-bold text-primary mt-1">{fmt(totalIncome)}</h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-primary font-semibold text-[10px]">
              <TrendingUp className="w-3.5 h-3.5" /><span>+14.2% from last month</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-on-surface-variant text-xs font-medium">Total Expenses</p>
            <h3 className="text-[24px] font-bold text-tertiary mt-1">-${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-tertiary font-semibold text-[10px]">
              <TrendingDown className="w-3.5 h-3.5" /><span>-2.4% from last month</span>
            </div>
          </div>
          <div className="bg-secondary-container p-4 rounded-xl">
            <p className="text-on-secondary-container text-xs font-medium">Net Surplus</p>
            <h3 className="text-[24px] font-bold text-on-secondary-container mt-1">${netSurplus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-on-secondary-container font-semibold text-[10px]">
              <Landmark className="w-3.5 h-3.5" /><span>92% Budget Efficiency</span>
            </div>
          </div>
        </div>
        )}

        {/* Filters */}
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5 w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
              <input
                className="bg-transparent border-none text-xs font-medium text-on-surface focus:ring-0 w-full outline-none placeholder:text-on-surface-variant"
                placeholder="Search transactions..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5 w-full sm:w-auto">
              <LayoutGrid className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
              <select
                className="bg-transparent border-none text-xs font-medium text-on-surface focus:ring-0 cursor-pointer outline-none"
                value={category}
                onChange={e => { setCategory(e.target.value); setPage(1); }}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={handleExportCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-on-surface text-surface text-xs font-semibold rounded-full hover:bg-on-surface-variant transition-colors">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button onClick={handleExportPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 border border-outline-variant/20 text-on-surface text-xs font-semibold rounded-full hover:bg-surface-container transition-colors">
              <FileText className="w-3.5 h-3.5" /><span>PDF</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-high">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Description</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Category</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-center">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Amount</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-xs text-on-surface-variant">No transactions found.</td></tr>
                  ) : paginated.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-surface-container-low transition-colors border-t border-outline-variant/5"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-on-surface text-xs">{t.date}</p>
                        <p className="text-[10px] text-on-surface-variant">{t.time}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0', t.iconColor)}>
                            <t.icon className="w-3.5 h-3.5" />
                          </div>
                          <p className="font-semibold text-on-surface text-xs">{t.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full">{t.cat}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full', t.status === 'COMPLETED' ? 'text-primary bg-primary/10' : 'text-amber-600 bg-amber-50')}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', t.status === 'COMPLETED' ? 'bg-primary' : 'bg-amber-500')}></span>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <p className={cn('font-bold text-xs', t.type === 'income' ? 'text-primary' : 'text-on-surface')}>{fmt(t.amount)}</p>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button onClick={() => handleDelete(t.id, t.name)} className="p-1.5 hover:bg-tertiary/10 rounded-full transition-colors text-on-surface-variant hover:text-tertiary">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-outline-variant/10">
            <AnimatePresence>
              {paginated.length === 0 ? (
                <p className="p-6 text-center text-xs text-on-surface-variant">No transactions found.</p>
              ) : paginated.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', t.iconColor)}>
                        <t.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-xs">{t.name}</p>
                        <p className="text-[9px] text-on-surface-variant font-medium">{t.cat}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className={cn('font-bold text-xs', t.type === 'income' ? 'text-primary' : 'text-on-surface')}>{fmt(t.amount)}</p>
                        <span className={cn('inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full', t.status === 'COMPLETED' ? 'text-primary bg-primary/10' : 'text-amber-600 bg-amber-50')}>
                          {t.status}
                        </span>
                      </div>
                      <button onClick={() => handleDelete(t.id, t.name)} className="p-1.5 hover:bg-tertiary/10 rounded-full text-on-surface-variant hover:text-tertiary transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-on-surface-variant font-medium">
                    <span>{t.date}</span><span>{t.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between bg-surface-container-lowest border-t border-outline-variant/10 gap-3">
            <p className="text-xs text-on-surface-variant">
              Showing <span className="font-bold">{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-bold">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={cn('w-7 h-7 rounded-lg text-xs font-bold transition-colors', p === page ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface')}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
