import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, GraduationCap, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const QuickRoleSwitcher: React.FC = () => {
  const { role, switchRole } = useAuth();

  const roles: { name: UserRole; icon: any; color: string }[] = [
    { name: 'Admin', icon: Shield, color: 'text-purple-600 dark:text-purple-400' },
    { name: 'Teacher', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400' },
    { name: 'Student', icon: UserCheck, color: 'text-blue-600 dark:text-blue-400' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
      <span className="text-[11px] font-semibold text-slate-400 px-2 hidden lg:inline-block uppercase tracking-wider">
        Demo Mode:
      </span>
      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = role === r.name;
        return (
          <button
            key={r.name}
            onClick={() => switchRole(r.name)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all duration-150 ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-soft-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
            title={`Switch to ${r.name} Role`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? r.color : 'text-slate-400'}`} />
            <span>{r.name}</span>
          </button>
        );
      })}
    </div>
  );
};
