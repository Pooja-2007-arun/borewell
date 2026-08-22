import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  statusVariant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'orange';
  progressValue?: number;
  isHero?: boolean;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  subtext,
  trend,
  statusVariant = 'cyan',
  progressValue,
  isHero = false,
  onClick,
}) => {
  const variantStyles = {
    cyan: {
      card: isHero
        ? 'bg-gradient-to-b from-[#111e38] to-[#0d1629] border-cyan-500/40 shadow-[0_4px_25px_-5px_rgba(6,182,212,0.2)]'
        : 'bg-[#11192e]/85 border-slate-800/90 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_-5px_rgba(6,182,212,0.15)]',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      valueText: 'text-white group-hover:text-cyan-200 transition-colors',
      progress: 'bg-gradient-to-r from-cyan-600 to-cyan-400',
    },
    emerald: {
      card: 'bg-[#11192e]/85 border-slate-800/90 hover:border-emerald-500/40 hover:shadow-[0_4px_20px_-5px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      valueText: 'text-emerald-400',
      progress: 'bg-emerald-500',
    },
    amber: {
      card: 'bg-[#11192e]/85 border-slate-800/90 hover:border-amber-500/40 hover:shadow-[0_4px_20px_-5px_rgba(245,158,11,0.15)]',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      valueText: 'text-amber-400',
      progress: 'bg-amber-500',
    },
    orange: {
      card: 'bg-[#11192e]/85 border-slate-800/90 hover:border-orange-500/40 hover:shadow-[0_4px_20px_-5px_rgba(249,115,22,0.15)]',
      iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      valueText: 'text-orange-400',
      progress: 'bg-orange-500',
    },
    rose: {
      card: isHero
        ? 'bg-gradient-to-b from-[#2a131b] to-[#160c12] border-rose-500/50 shadow-[0_4px_25px_-5px_rgba(239,68,68,0.25)] ring-1 ring-rose-500/20'
        : 'bg-[#11192e]/85 border-slate-800/90 hover:border-rose-500/40 hover:shadow-[0_4px_20px_-5px_rgba(239,68,68,0.15)]',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse',
      valueText: 'text-rose-400 font-extrabold',
      progress: 'bg-gradient-to-r from-orange-500 to-rose-500',
    },
  };

  const style = variantStyles[statusVariant];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative rounded-xl border p-4 transition-all duration-300 group backdrop-blur-md',
        style.card,
        onClick && 'cursor-pointer hover:-translate-y-1 active:translate-y-0',
        isHero && 'relative overflow-hidden'
      )}
    >
      {/* Subtle top indicator bar for hero cards */}
      {isHero && (
        <div
          className={clsx(
            'absolute top-0 left-0 right-0 h-1',
            statusVariant === 'rose'
              ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500'
          )}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase font-mono">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className={clsx('text-2xl sm:text-3xl font-extrabold tracking-tight font-mono', style.valueText)}>
              {value}
            </span>
            {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>
        <div className={clsx('p-2.5 rounded-xl border transition-transform duration-300 group-hover:scale-110', style.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {progressValue !== undefined && (
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-3.5 overflow-hidden">
          <div
            className={clsx('h-1.5 rounded-full transition-all duration-700 ease-out', style.progress)}
            style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
          />
        </div>
      )}

      {(trend || subtext) && (
        <div className="flex items-center justify-between mt-3 text-xs">
          {subtext && <span className="text-slate-400 truncate text-[11px]">{subtext}</span>}
          {trend && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border',
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
