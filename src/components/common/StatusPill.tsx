import React from 'react';
import clsx from 'clsx';
import { BorewellStatus } from '../../types/borewell';
import { getStatusColorClasses, formatStatusLabel } from '../../utils/formatters';

interface StatusPillProps {
  status: BorewellStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  customLabel?: string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  showPulse = true,
  customLabel,
  className,
}) => {
  const colors = getStatusColorClasses(status);
  const label = customLabel || formatStatusLabel(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono',
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        className
      )}
    >
      <span className="relative flex items-center justify-center">
        {showPulse && (
          <span
            className={clsx(
              'absolute rounded-full opacity-75 animate-ping',
              dotSizeClasses[size]
            )}
            style={{ backgroundColor: colors.hex }}
          />
        )}
        <span
          className={clsx('rounded-full', dotSizeClasses[size])}
          style={{ backgroundColor: colors.hex }}
        />
      </span>
      <span>{label}</span>
    </span>
  );
};
