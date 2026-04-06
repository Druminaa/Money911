import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Bell, Globe, CreditCard, HelpCircle, ChevronRight, Camera, Landmark, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { userAPI } from '@/src/lib/api';
import { useToast } from '@/src/components/ToastProvider';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    currency: 'USD'
  });
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await userAPI.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        currency: userData.currency || 'USD'
      });
    } catch (err: any) {
      error('Failed to Load', err.message || 'Could not fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.update(formData);
      success('Profile Updated', 'Your information has been saved');
      setEditing(false);
      fetchUserData();
    } catch (err: any) {
      error('Update Failed', err.message || 'Could not update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    success('Logged Out', 'See you soon!');
    navigate('/auth');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="p-5 max-w-5xl mx-auto w-full">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-on-surface-variant">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-5 space-y-4 md:space-y-5 max-w-5xl mx-auto w-full">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Account</span>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface leading-none mb-1">Profile Settings</h1>
          <p className="text-on-surface-variant text-xs font-medium">Manage your account and preferences.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-tertiary/10 text-tertiary rounded-full font-bold text-xs hover:bg-tertiary/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <section className="bg-surface-container-lowest p-4 md:p-5 rounded-2xl shadow-sm border border-outline-variant/10">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left mb-6">
          <div className="relative group">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-primary-container shadow-lg bg-primary-container flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-on-surface">{user?.full_name || 'User'}</h3>
            <p className="text-xs text-on-surface-variant font-medium">{user?.email}</p>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-2.5 py-1 bg-primary-container text-on-primary-container text-[8px] font-bold uppercase tracking-widest rounded-full">Active Member</span>
              <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container text-[8px] font-bold uppercase tracking-widest rounded-full">Verified</span>
            </div>
          </div>
          <button 
            onClick={() => setEditing(!editing)} 
            className="w-full md:w-auto px-5 py-2 border-2 border-outline-variant/15 rounded-full font-bold text-xs hover:bg-surface-container transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-outline-variant/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Your address"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-on-primary rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 border border-outline-variant/20 rounded-full font-bold text-sm hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-container/20 text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">Personal Info</h4>
              <p className="text-[10px] text-on-surface-variant">Name, email, contact details</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Email:</span>
              <span className="font-medium text-on-surface">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Phone:</span>
              <span className="font-medium text-on-surface">{user?.phone || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Address:</span>
              <span className="font-medium text-on-surface">{user?.address || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Currency:</span>
              <span className="font-medium text-on-surface">{user?.currency || 'USD'}</span>
            </div>
          </div>
        </div>
        {[
          { icon: Shield, title: 'Security & Privacy', sub: 'Two-factor auth, biometric lock, encryption', color: 'text-primary', bg: 'bg-primary-container/20' },
          { icon: Bell, title: 'Notifications', sub: 'Alerts, weekly reports, budget warnings', color: 'text-secondary', bg: 'bg-secondary-container/20' },
          { icon: Globe, title: 'Regional & Currency', sub: 'USD ($), English (US), UTC+0', color: 'text-tertiary', bg: 'bg-tertiary-container/20' },
          { icon: CreditCard, title: 'Subscription Plan', sub: 'Atelier Gold - $29.99/mo', color: 'text-primary', bg: 'bg-primary-container/20' },
          { icon: Landmark, title: 'Connected Institutions', sub: 'Chase, Amex, Coinbase, Binance', color: 'text-secondary', bg: 'bg-secondary-container/20' },
          { icon: HelpCircle, title: 'Support & Concierge', sub: '24/7 Private desk access', color: 'text-tertiary', bg: 'bg-tertiary-container/20' },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ x: 4 }}
            className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={cn('w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0', item.bg, item.color)}>
                <item.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</h4>
                <p className="text-[9px] md:text-[10px] text-on-surface-variant font-medium">{item.sub}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
          </motion.div>
        ))}
      </div>

      <section className="pt-4 border-t border-outline-variant/20">
        <div className="bg-tertiary-container/10 p-4 md:p-5 rounded-2xl border border-tertiary/10">
          <h3 className="text-base font-bold text-tertiary mb-1">Danger Zone</h3>
          <p className="text-on-surface-variant text-xs mb-4">Irreversible actions regarding your atelier and data.</p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <button className="w-full sm:w-auto px-5 py-2 bg-tertiary text-on-tertiary rounded-full font-bold text-xs hover:opacity-90 transition-opacity">Deactivate Account</button>
            <button className="w-full sm:w-auto px-5 py-2 border border-tertiary text-tertiary rounded-full font-bold text-xs hover:bg-tertiary/5 transition-colors">Delete All Financial Data</button>
          </div>
        </div>
      </section>
    </div>
  );
}
