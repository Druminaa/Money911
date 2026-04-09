import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { useToast } from '../ToastProvider';
import { cn } from '@/src/lib/utils';

interface LoanFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: 'lend' | 'borrow';
}

const durations = ['3 Months', '6 Months', '12 Months', '24 Months', '36 Months'];

function Dropdown({ options, value, onChange, placeholder }: { options: string[]; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-outline-variant/10 overflow-hidden">
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

export default function LoanForm({ onClose, onSubmit, type }: LoanFormProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({ name: '', amount: '', interestRate: '', duration: '', purpose: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.duration) { error('Missing Duration', 'Please select a loan duration.'); return; }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-container-lowest rounded-xl p-4 md:p-5 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">{type === 'lend' ? 'Lend Capital' : 'Request Loan'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">{type === 'lend' ? 'Borrower Name' : 'Lender Name'}</label>
            <input type="text" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Amount</label>
              <input type="number" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="$0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Interest (APR %)</label>
              <input type="number" step="0.1" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="0.0" value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Duration</label>
            <Dropdown options={durations} value={formData.duration} onChange={v => setFormData({...formData, duration: v})} placeholder="Select duration" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Purpose</label>
            <textarea className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm resize-none" placeholder="Brief description..." rows={2} value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} required />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-on-primary rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
            {type === 'lend' ? 'Lend Capital' : 'Request Loan'}
          </button>
        </form>
      </div>
    </div>
  );
}
