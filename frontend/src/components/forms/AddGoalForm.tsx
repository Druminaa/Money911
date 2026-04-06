import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { useToast } from '../ToastProvider';
import { cn } from '@/src/lib/utils';

interface AddGoalFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const categories = ['Travel & Leisure', 'Real Estate', 'Long Term', 'Emergency Fund', 'Education'];

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

export default function AddGoalForm({ onClose, onSubmit }: AddGoalFormProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({ title: '', category: '', targetAmount: '', currentAmount: '', deadline: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) { error('Missing Category', 'Please select a goal category.'); return; }
    onSubmit(formData);
    success('Goal Created', `"${formData.title}" has been added to your aspirations.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-container-lowest rounded-xl p-4 md:p-5 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">New Aspiration</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Goal Title</label>
            <input type="text" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="e.g., Swiss Alps Retreat" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Category</label>
            <Dropdown options={categories} value={formData.category} onChange={v => setFormData({...formData, category: v})} placeholder="Select category" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Target Amount</label>
              <input type="number" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="$0.00" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Current Amount</label>
              <input type="number" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="$0.00" value={formData.currentAmount} onChange={e => setFormData({...formData, currentAmount: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Target Date</label>
            <input type="date" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-on-primary rounded-full font-bold text-sm hover:opacity-90 transition-opacity">Create Goal</button>
        </form>
      </div>
    </div>
  );
}
