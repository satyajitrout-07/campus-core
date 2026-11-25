import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isOpen,
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-600 text-white', shadow: 'shadow-emerald-500/20' },
    error: { icon: AlertCircle, bg: 'bg-rose-600 text-white', shadow: 'shadow-rose-500/20' },
    info: { icon: Info, bg: 'bg-brand-600 text-white', shadow: 'shadow-brand-500/20' },
  }[type];

  const Icon = typeConfig.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-200">
      <div className={`flex items-center gap-2.5 ${typeConfig.bg} px-4 py-3 rounded-xl shadow-lg`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
