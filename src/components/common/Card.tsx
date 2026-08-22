import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'orange';
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = false,
  glowColor = 'cyan',
  title,
  subtitle,
  headerAction,
  noPadding = false,
}) => {
  const glowClasses = {
    cyan: 'border-cyan-500/30 shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]',
    emerald: 'border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]',
    amber: 'border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]',
    orange: 'border-orange-500/30 shadow-[0_0_20px_-5px_rgba(249,115,22,0.15)]',
    rose: 'border-rose-500/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)]',
  };

  return (
    <div
      className={clsx(
        'relative bg-[#11192e]/85 backdrop-blur-md rounded-xl border border-slate-800/80 transition-all duration-200',
        glow ? glowClasses[glowColor] : 'hover:border-slate-700/80 hover:shadow-lg',
        className
      )}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div>
            {title && <div className="text-base font-semibold text-slate-100 flex items-center gap-2">{title}</div>}
            {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={clsx(!noPadding && 'p-5')}>{children}</div>
    </div>
  );
};
