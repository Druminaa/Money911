import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<ToastType, { icon: React.ElementType; bg: string; icon_color: string; border: string }> = {
  success: { icon: CheckCircle, bg: 'bg-white', icon_color: 'text-green-500', border: 'border-l-4 border-green-500' },
  error:   { icon: XCircle,     bg: 'bg-white', icon_color: 'text-tertiary',   border: 'border-l-4 border-tertiary' },
  warning: { icon: AlertTriangle, bg: 'bg-white', icon_color: 'text-amber-500', border: 'border-l-4 border-amber-500' },
  info:    { icon: Info,         bg: 'bg-white', icon_color: 'text-primary',    border: 'border-l-4 border-primary' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now() + counter++;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const success = useCallback((title: string, message?: string) => toast('success', title, message), [toast]);
  const error   = useCallback((title: string, message?: string) => toast('error', title, message), [toast]);
  const warning = useCallback((title: string, message?: string) => toast('warning', title, message), [toast]);
  const info    = useCallback((title: string, message?: string) => toast('info', title, message), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {toasts.map(t => {
            const s = STYLES[t.type];
            const Icon = s.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 p-3.5 rounded-xl shadow-lg ${s.bg} ${s.border}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${s.icon_color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface">{t.title}</p>
                  {t.message && <p className="text-[10px] text-on-surface-variant mt-0.5">{t.message}</p>}
                </div>
                <button onClick={() => dismiss(t.id)} className="p-0.5 hover:bg-surface-container rounded-full transition-colors shrink-0">
                  <X className="w-3.5 h-3.5 text-on-surface-variant" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
