import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Wallet,
  Flag,
  Handshake,
  Settings,
  LogOut,
  Landmark,
  X,
  ChevronRight,
  Banknote
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ReceiptText, label: 'Transactions', path: '/transactions' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Wallet, label: 'Budget', path: '/budget' },
  { icon: Flag, label: 'Goals', path: '/goals' },
  { icon: Handshake, label: 'Borrow/Loan', path: '/borrow-loan' },
  { icon: Banknote, label: 'Cash', path: '/cash' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onMouseEnter, onMouseLeave }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "h-screen fixed left-0 top-0 z-50 bg-surface-container-low flex flex-col border-r border-outline-variant/10 font-headline text-sm transition-all duration-300 shadow-xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-20 lg:w-20 p-3" : "w-72 lg:w-72 p-6"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center mb-8 transition-all duration-300",
        isCollapsed ? "justify-center flex-col gap-1 px-2" : "justify-between px-2"
      )}>
        <div
          className={cn(
            "flex items-center gap-3 cursor-pointer group transition-all duration-300",
            isCollapsed && "flex-col gap-1"
          )}
          onClick={() => { navigate('/'); onClose(); }}
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Landmark className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-lg font-black text-primary leading-none tracking-tight">The Atelier</div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-on-surface-variant font-bold mt-0.5">Premium Ledger</div>
            </div>
          )}
        </div>

        {/* Close Button (Mobile Only) */}
        {!isCollapsed && (
          <button
            className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => cn(
              "group flex items-center rounded-xl transition-all duration-200 relative overflow-hidden",
              isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3.5",
              isActive
                ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "flex items-center gap-3 z-10",
                  isCollapsed && "justify-center"
                )}>
                  <item.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-all",
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={cn(
        "pt-6 space-y-1.5 border-t border-outline-variant/10 mt-4",
        isCollapsed && "pt-4"
      )}>
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) => cn(
            "group flex items-center rounded-xl transition-all duration-200",
            isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3.5",
            isActive
              ? "bg-secondary-container text-on-secondary-container font-bold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium"
          )}
          title={isCollapsed ? "Settings" : undefined}
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                {!isCollapsed && <span>Settings</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight className={cn(
                  "w-4 h-4 transition-all",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )} />
              )}
            </>
          )}
        </NavLink>
        <button
          onClick={() => { navigate('/auth'); onClose(); }}
          className={cn(
            "w-full group flex items-center text-on-surface-variant hover:bg-tertiary-container/20 hover:text-tertiary transition-all duration-200 rounded-xl font-medium",
            isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3.5"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </div>
          {!isCollapsed && (
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>


      {/* Collapsed User Avatar
      {isCollapsed && (
        <div className="mt-4 flex justify-center">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/30 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/settings')}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCYTBSzIurSY7GF8lo1kefDvQpRq7YRy-Yw0MwyrEivZmV0r29Y5YoPwnxJVY7e7wtWugAULdGAJf7pHYsztfFQ2LOE87WXg5sh3rkqAGM0LwPFhIuJInvnBlezILPQAKp2shk9gP1MdOsn5FN-qSyyLfpPzgIWCrjCXVC0nVE2EP1FqLwAagjjbOmSkeysZmWc25ANay6vU4dQpiLj8TwUlIUdnOUffVwipunVqMoDGdc65SijCSGisTvZApFnOZwS6t7I3Ls7w"
              alt="User"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )} */}
    </aside>
  );
}
