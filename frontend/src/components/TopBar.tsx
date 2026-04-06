import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Download, Settings as SettingsIcon, Menu, Landmark, User, LogOut, ChevronDown, CreditCard, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface TopBarProps {
  title?: string;
  onMenuClick: () => void;
}

export default function TopBar({ title, onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItems = [
    { icon: User, label: 'My Profile', action: () => { navigate('/settings'); setDropdownOpen(false); } },
    { icon: CreditCard, label: 'Subscription', action: () => { navigate('/settings'); setDropdownOpen(false); } },
    { icon: SettingsIcon, label: 'Settings', action: () => { navigate('/settings'); setDropdownOpen(false); } },
    { icon: HelpCircle, label: 'Support', action: () => setDropdownOpen(false) },
  ];

  const notifications = [
    { title: 'Budget Alert', desc: 'Entertainment budget exceeded by $20', time: '2m ago', dot: 'bg-tertiary' },
    { title: 'Goal Milestone', desc: 'Swiss Alps Retreat is 75% complete!', time: '1h ago', dot: 'bg-primary' },
    { title: 'New Dividend', desc: 'ETF payout of $412.30 received', time: '3h ago', dot: 'bg-secondary' },
  ];

  return (
    <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-40 shadow-sm flex justify-between items-center px-4 lg:px-8 h-14 w-full font-headline">
      <div className="flex items-center gap-3 lg:gap-6 flex-1">
        <button className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/10">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        {title && <h2 className="text-base font-bold text-primary hidden lg:block">{title}</h2>}
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-3.5 h-3.5" />
          <input className="pl-9 pr-4 py-1.5 bg-surface-container-low border-none rounded-full text-xs focus:ring-2 focus:ring-primary/20 w-44 lg:w-56 transition-all" placeholder="Search entries..." type="text" />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setNotifOpen(v => !v); setDropdownOpen(false); }} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-tertiary rounded-full"></span>
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-outline-variant/10 flex justify-between items-center">
                  <span className="text-sm font-bold text-on-surface">Notifications</span>
                  <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  {notifications.map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3">
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`}></span>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{n.title}</p>
                        <p className="text-[10px] text-on-surface-variant">{n.desc}</p>
                        <p className="text-[9px] text-outline mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">View all notifications</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="hidden sm:block p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <Download className="w-4 h-4" />
        </button>

        {/* User Dropdown */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <div className="hidden lg:block text-right">
              <p className="font-bold text-xs text-on-surface leading-tight">Julianne V.</p>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter">Gold Member</p>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container shadow-sm">
              <img alt="User profile" className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCYTBSzIurSY7GF8lo1kefDvQpRq7YRy-Yw0MwyrEivZmV0r29Y5YoPwnxJVY7e7wtWugAULdGAJf7pHYsztfFQ2LOE87WXg5sh3rkqAGM0LwPFhIuJInvnBlezILPQAKp2shk9gP1MdOsn5FN-qSyyLfpPzgIWCrjCXVC0nVE2EP1FqLwAagjjbOmSkeysZmWc25ANay6vU4dQpiLj8TwUlIUdnOUffVwipunVqMoDGdc65SijCSGisTvZApFnOZwS6t7I3Ls7w"
                referrerPolicy="no-referrer" />
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden z-50"
              >
                {/* Profile Header */}
                <div className="px-4 py-3 bg-gradient-to-br from-primary-container/30 to-secondary-container/20 border-b border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20">
                      <img alt="User" className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCYTBSzIurSY7GF8lo1kefDvQpRq7YRy-Yw0MwyrEivZmV0r29Y5YoPwnxJVY7e7wtWugAULdGAJf7pHYsztfFQ2LOE87WXg5sh3rkqAGM0LwPFhIuJInvnBlezILPQAKp2shk9gP1MdOsn5FN-qSyyLfpPzgIWCrjCXVC0nVE2EP1FqLwAagjjbOmSkeysZmWc25ANay6vU4dQpiLj8TwUlIUdnOUffVwipunVqMoDGdc65SijCSGisTvZApFnOZwS6t7I3Ls7w"
                        referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Julianne V. Thorne</p>
                      <p className="text-[9px] text-on-surface-variant">julianne.thorne@atelier.com</p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-primary-container text-on-primary-container text-[8px] font-bold uppercase tracking-wider rounded-full">Gold Member</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex justify-between text-[10px]">
                    <span className="text-on-surface-variant">Portfolio</span>
                    <span className="font-bold text-primary">$142,450</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  {menuItems.map((item, i) => (
                    <button key={i} onClick={item.action}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors text-left"
                    >
                      <item.icon className="w-3.5 h-3.5 text-on-surface-variant" />
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div className="border-t border-outline-variant/10 py-1.5">
                  <button
                    onClick={() => { navigate('/auth'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-tertiary hover:bg-tertiary/5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
