import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { useToast } from '../ToastProvider';
import { cn } from '@/src/lib/utils';

interface EditProfileFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const currencies = ['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'INR (₹)'];

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

export default function EditProfileForm({ onClose, onSubmit }: EditProfileFormProps) {
  const { success } = useToast();
  const [formData, setFormData] = useState({ fullName: 'Julianne V. Thorne', email: 'julianne.thorne@atelier.com', phone: '', address: '', currency: 'USD ($)' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    success('Profile Updated', 'Your profile changes have been saved.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-container-lowest rounded-xl p-4 md:p-5 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Full Name</label>
            <input type="text" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Phone</label>
              <input type="tel" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Currency</label>
              <Dropdown options={currencies} value={formData.currency} onChange={v => setFormData({...formData, currency: v})} placeholder="Select currency" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Address</label>
            <input type="text" className="w-full px-3 py-2 bg-surface-container rounded-lg text-sm" placeholder="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-2 bg-primary text-on-primary rounded-full font-bold text-sm hover:opacity-90 transition-opacity">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
