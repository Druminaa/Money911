import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Zap, Shield, TrendingUp, Users, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/components/ToastProvider';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with personal finance',
    icon: Sparkles,
    color: 'text-secondary',
    bg: 'bg-secondary-container/20',
    features: [
      'Up to 50 transactions per month',
      '3 budget categories',
      '2 financial goals',
      'Basic analytics',
      'CSV export',
      'Email support',
    ],
    limitations: [
      'No PDF export',
      'No advanced analytics',
      'No priority support',
    ]
  },
  {
    name: 'Pro',
    price: 9.99,
    period: 'month',
    description: 'For serious financial management and growth',
    icon: Crown,
    color: 'text-primary',
    bg: 'bg-primary-container/20',
    popular: true,
    features: [
      'Unlimited transactions',
      'Unlimited budgets',
      'Unlimited goals',
      'Advanced analytics & insights',
      'CSV & PDF export',
      'Loan management',
      'Priority email support',
      'Custom categories',
      'Data backup',
      'Mobile app access',
    ],
    limitations: []
  },
];

export default function Subscription() {
  const { success, info } = useToast();
  const [currentPlan] = useState('Free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = (planName: string) => {
    if (planName === currentPlan) {
      info('Current Plan', 'You are already on this plan');
      return;
    }
    success('Upgrade Initiated', `Redirecting to payment for ${planName} plan...`);
    // In production, redirect to payment gateway
  };

  return (
    <div className="p-3 md:p-5 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-primary tracking-widest uppercase">Pricing</span>
        <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter text-on-surface mt-2 mb-3">
          Choose Your Plan
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          Start free and upgrade as you grow. All plans include core features.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center bg-surface-container-low rounded-full p-1 shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-bold transition-all',
              billingCycle === 'monthly'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-bold transition-all relative',
              billingCycle === 'yearly'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-tertiary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan, i) => {
          const yearlyPrice = plan.price > 0 ? (plan.price * 12 * 0.8).toFixed(2) : 0;
          const displayPrice = billingCycle === 'yearly' && plan.price > 0 ? yearlyPrice : plan.price;
          const isCurrentPlan = plan.name === currentPlan;

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'relative bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border transition-all',
                plan.popular
                  ? 'border-primary/30 shadow-lg shadow-primary/10'
                  : 'border-outline-variant/10 hover:shadow-md'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute top-6 right-6">
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Current
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', plan.bg)}>
                  <plan.icon className={cn('w-6 h-6', plan.color)} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-on-surface">{plan.name}</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-black text-on-surface">
                    ${displayPrice}
                  </span>
                  <span className="text-on-surface-variant text-base md:text-lg">
                    /{billingCycle === 'yearly' ? 'year' : plan.period}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.price > 0 && (
                  <p className="text-xs text-secondary font-semibold mt-1">
                    Save ${(plan.price * 12 * 0.2).toFixed(2)} per year
                  </p>
                )}
              </div>

              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={isCurrentPlan}
                className={cn(
                  'w-full py-3 rounded-full font-bold text-base transition-all mb-6',
                  plan.popular
                    ? 'bg-primary text-on-primary hover:scale-105 shadow-lg shadow-primary/20'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container',
                  isCurrentPlan && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
              </button>

              <div className="space-y-3">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  What's Included
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm md:text-base text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/10">
        <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-6 text-center">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="text-left py-3 px-4 text-sm md:text-base font-bold text-on-surface">Feature</th>
                <th className="text-center py-3 px-4 text-sm md:text-base font-bold text-on-surface">Free</th>
                <th className="text-center py-3 px-4 text-sm md:text-base font-bold text-primary">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                { feature: 'Transactions per month', free: '50', pro: 'Unlimited' },
                { feature: 'Budget categories', free: '3', pro: 'Unlimited' },
                { feature: 'Financial goals', free: '2', pro: 'Unlimited' },
                { feature: 'Analytics', free: 'Basic', pro: 'Advanced' },
                { feature: 'CSV Export', free: true, pro: true },
                { feature: 'PDF Export', free: false, pro: true },
                { feature: 'Loan Management', free: false, pro: true },
                { feature: 'Priority Support', free: false, pro: true },
                { feature: 'Custom Categories', free: false, pro: true },
                { feature: 'Mobile App', free: false, pro: true },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 text-sm md:text-base text-on-surface">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-sm md:text-base">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="w-4 h-4 text-secondary mx-auto" />
                      ) : (
                        <span className="text-on-surface-variant">—</span>
                      )
                    ) : (
                      <span className="text-on-surface-variant">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-sm md:text-base">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="w-4 h-4 text-primary mx-auto" />
                      ) : (
                        <span className="text-on-surface-variant">—</span>
                      )
                    ) : (
                      <span className="font-semibold text-primary">{row.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gradient-to-br from-primary-container/20 to-secondary-container/20 rounded-3xl p-6 md:p-8 border border-primary/10">
        <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: 'Can I switch plans anytime?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
            },
            {
              q: 'Is there a free trial for Pro?',
              a: 'Yes! All new users get a 14-day free trial of Pro features. No credit card required.',
            },
            {
              q: 'What happens to my data if I downgrade?',
              a: 'Your data is never deleted. You will retain access to all historical data, but new entries will be limited to Free tier limits.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5">
              <h4 className="text-sm md:text-base font-bold text-on-surface mb-2">{faq.q}</h4>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-primary text-on-primary rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <Crown className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to take control?</h2>
          <p className="text-on-primary/80 text-sm md:text-base mb-6 max-w-2xl mx-auto">
            Join thousands of users managing their finances with The Financial Atelier.
          </p>
          <button
            onClick={() => handleUpgrade('Pro')}
            className="bg-white text-primary px-8 py-3 rounded-full font-bold text-base hover:scale-105 transition-transform shadow-lg"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
