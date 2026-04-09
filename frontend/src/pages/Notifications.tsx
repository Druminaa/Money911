import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Trash2, Filter, TrendingUp, Target, CreditCard, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/components/ToastProvider';

const NOTIFICATION_TYPES = ['All', 'Budget', 'Goals', 'Payments', 'System'];

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'budget',
    title: 'Budget Alert',
    message: 'Your Entertainment budget has exceeded by $45. Consider adjusting your spending.',
    read: false,
    created_at: '2024-01-20T10:30:00',
    icon: AlertTriangle,
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
  },
  {
    id: '2',
    type: 'goal',
    title: 'Goal Milestone Reached',
    message: 'Congratulations! Your "Swiss Alps Retreat" goal is now 75% complete. Keep it up!',
    read: false,
    created_at: '2024-01-20T09:15:00',
    icon: Target,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Reminder',
    message: 'Loan payment of $500 to John Doe is due in 3 days (Jan 23, 2024).',
    read: true,
    created_at: '2024-01-19T14:00:00',
    icon: CreditCard,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    id: '4',
    type: 'system',
    title: 'New Feature Available',
    message: 'PDF export is now available for all Pro users. Try it out in the Transactions page!',
    read: true,
    created_at: '2024-01-18T08:00:00',
    icon: Info,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    id: '5',
    type: 'budget',
    title: 'Monthly Budget Summary',
    message: 'You\'ve spent 68% of your total budget this month. $2,450 remaining.',
    read: true,
    created_at: '2024-01-17T12:00:00',
    icon: TrendingUp,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];

export default function Notifications() {
  const { success, info } = useToast();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = notifications.filter(n => {
    const matchesType = filter === 'All' || n.type === filter.toLowerCase();
    const matchesRead = !showUnreadOnly || !n.read;
    return matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    info('Marked as Read', 'Notification updated');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    success('All Read', 'All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    success('Deleted', 'Notification removed');
  };

  const handleClearAll = () => {
    setNotifications([]);
    success('Cleared', 'All notifications cleared');
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="p-3 md:p-5 space-y-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">Alerts</span>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface leading-none mb-1">
            Notifications
          </h1>
          <p className="text-on-surface-variant text-xs font-medium">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex-1 md:flex-none px-4 py-2 bg-surface-container-low text-on-surface rounded-full font-bold text-xs hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex-1 md:flex-none px-4 py-2 bg-tertiary/10 text-tertiary rounded-full font-bold text-xs hover:bg-tertiary/20 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: notifications.length, color: 'text-on-surface', bg: 'bg-surface-container-low' },
          { label: 'Unread', value: unreadCount, color: 'text-primary', bg: 'bg-primary-container/20' },
          { label: 'Budget Alerts', value: notifications.filter(n => n.type === 'budget').length, color: 'text-tertiary', bg: 'bg-tertiary-container/20' },
          { label: 'Goal Updates', value: notifications.filter(n => n.type === 'goal').length, color: 'text-secondary', bg: 'bg-secondary-container/20' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn('p-4 rounded-xl', stat.bg)}
          >
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={cn('text-2xl font-black', stat.color)}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-on-surface-variant" />
          {NOTIFICATION_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                filter === type
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={e => setShowUnreadOnly(e.target.checked)}
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span className="text-xs font-medium text-on-surface">Unread only</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-surface-container-lowest rounded-2xl"
            >
              <Bell className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-50" />
              <p className="text-on-surface-variant font-medium">No notifications to display</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {showUnreadOnly ? 'All caught up!' : 'Notifications will appear here'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'bg-surface-container-lowest p-4 md:p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md',
                  notification.read ? 'border-outline-variant/10' : 'border-primary/20 bg-primary/5'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0', notification.bg)}>
                    <notification.icon className={cn('w-5 h-5 md:w-6 md:h-6', notification.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm md:text-base font-bold text-on-surface">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-outline font-medium">
                        {getTimeAgo(notification.created_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1.5 hover:bg-tertiary/10 rounded-full transition-colors text-on-surface-variant hover:text-tertiary"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Notification Preferences */}
      <div className="bg-gradient-to-br from-primary-container/20 to-secondary-container/20 rounded-3xl p-6 md:p-8 border border-primary/10">
        <h2 className="text-lg md:text-xl font-bold text-on-surface mb-4">Notification Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Budget Alerts', desc: 'Get notified when you exceed budget limits', checked: true },
            { label: 'Goal Milestones', desc: 'Celebrate progress on your financial goals', checked: true },
            { label: 'Payment Reminders', desc: 'Never miss a loan payment deadline', checked: true },
            { label: 'Weekly Summary', desc: 'Receive weekly financial reports', checked: false },
            { label: 'System Updates', desc: 'Stay informed about new features', checked: true },
            { label: 'Marketing Emails', desc: 'Tips and offers from our team', checked: false },
          ].map((pref, idx) => (
            <label key={idx} className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white transition-colors">
              <input
                type="checkbox"
                defaultChecked={pref.checked}
                className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <div>
                <p className="text-sm md:text-base font-bold text-on-surface">{pref.label}</p>
                <p className="text-xs md:text-sm text-on-surface-variant">{pref.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <button className="mt-6 w-full md:w-auto px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold text-base hover:scale-[0.98] transition-transform">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
