import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, MessageCircle, HelpCircle, CheckCircle, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/components/ToastProvider';

const CATEGORIES = ['Account & Billing', 'Technical Issues', 'Feature Requests', 'General Inquiry'];

const FAQS = [
  {
    q: 'How do I reset my password?',
    a: 'Go to Settings > Security, then click "Change Password". You\'ll receive a verification email.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes! Go to Transactions page and click the CSV or PDF export buttons. Pro users get unlimited exports.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Navigate to Settings > Danger Zone. Note that this action is irreversible and will delete all your data.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We accept all major credit cards, PayPal, and bank transfers for annual subscriptions.',
  },
  {
    q: 'Is my financial data secure?',
    a: 'Absolutely. We use bank-level encryption (AES-256) and never store sensitive banking credentials.',
  },
  {
    q: 'Can I use this on mobile?',
    a: 'Yes! Our web app is fully responsive. Pro users also get access to our native iOS and Android apps.',
  },
];

export default function Support() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
  });
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    // Mock tickets - in production, fetch from API
    setTickets([
      {
        id: '1',
        subject: 'Cannot export PDF',
        category: 'Technical Issues',
        status: 'resolved',
        created_at: '2024-01-15',
        response: 'Issue resolved. PDF export is now working.',
      },
      {
        id: '2',
        subject: 'Upgrade to Pro plan',
        category: 'Account & Billing',
        status: 'open',
        created_at: '2024-01-20',
      },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      error('Missing Category', 'Please select a support category');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      success('Ticket Submitted', 'We\'ll respond within 24 hours');
      setFormData({ name: '', email: '', category: '', subject: '', message: '' });
      setLoading(false);
      
      // Add to tickets list
      setTickets(prev => [{
        id: Date.now().toString(),
        subject: formData.subject,
        category: formData.category,
        status: 'open',
        created_at: new Date().toISOString().split('T')[0],
      }, ...prev]);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-secondary bg-secondary/10';
      case 'in_progress': return 'text-primary bg-primary/10';
      default: return 'text-tertiary bg-tertiary/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return CheckCircle;
      case 'in_progress': return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <div className="p-3 md:p-5 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-primary tracking-widest uppercase">Help Center</span>
        <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter text-on-surface mt-2 mb-3">
          Support & Concierge
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          We're here to help. Get answers instantly or submit a ticket for personalized support.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MessageCircle, label: 'Avg Response Time', value: '< 2 hours', color: 'text-primary', bg: 'bg-primary-container/20' },
          { icon: CheckCircle, label: 'Tickets Resolved', value: '98.5%', color: 'text-secondary', bg: 'bg-secondary-container/20' },
          { icon: HelpCircle, label: 'Active Tickets', value: tickets.filter(t => t.status === 'open').length.toString(), color: 'text-tertiary', bg: 'bg-tertiary-container/20' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-2xl font-black text-on-surface">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-on-surface">Submit a Ticket</h2>
              <p className="text-xs md:text-sm text-on-surface-variant">We'll get back to you within 24 hours</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-container rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                rows={5}
                placeholder="Please provide as much detail as possible..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary rounded-full font-bold text-base hover:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </form>
        </div>

        {/* My Tickets */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10">
          <h3 className="text-lg font-bold text-on-surface mb-4">My Tickets</h3>
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <p className="text-center py-8 text-on-surface-variant text-sm">No tickets yet</p>
            ) : (
              tickets.map((ticket, i) => {
                const StatusIcon = getStatusIcon(ticket.status);
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-surface-container-low rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-bold text-on-surface flex-1">{ticket.subject}</h4>
                      <span className={cn('text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1', getStatusColor(ticket.status))}>
                        <StatusIcon className="w-3 h-3" />
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-2">{ticket.category}</p>
                    <p className="text-[10px] text-outline">{ticket.created_at}</p>
                    {ticket.response && (
                      <div className="mt-3 p-2 bg-secondary-container/20 rounded-lg">
                        <p className="text-xs text-on-surface">{ticket.response}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/10">
        <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-6 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-outline-variant/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors text-left"
              >
                <span className="text-sm font-bold text-on-surface">{faq.q}</span>
                <ChevronDown className={cn('w-4 h-4 text-on-surface-variant transition-transform', expandedFaq === idx && 'rotate-180')} />
              </button>
              {expandedFaq === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary-container/20 to-primary/5 rounded-2xl p-6 border border-primary/10">
          <Mail className="w-8 h-8 text-primary mb-3" />
          <h3 className="text-lg font-bold text-on-surface mb-2">Email Support</h3>
          <p className="text-sm text-on-surface-variant mb-4">Get help via email. We respond within 24 hours.</p>
          <a href="mailto:support@financialatelier.com" className="text-sm font-bold text-primary hover:underline">
            support@financialatelier.com
          </a>
        </div>
        <div className="bg-gradient-to-br from-secondary-container/20 to-secondary/5 rounded-2xl p-6 border border-secondary/10">
          <MessageCircle className="w-8 h-8 text-secondary mb-3" />
          <h3 className="text-lg font-bold text-on-surface mb-2">Live Chat</h3>
          <p className="text-sm text-on-surface-variant mb-4">Chat with our team in real-time. Available 9 AM - 6 PM EST.</p>
          <button className="text-sm font-bold text-secondary hover:underline">
            Start Chat →
          </button>
        </div>
      </div>
    </div>
  );
}
