import { BorewellStatus } from '../types/borewell';

export function formatStatusLabel(status: BorewellStatus): string {
  switch (status) {
    case 'normal':
      return 'Safe / Normal';
    case 'warning':
      return 'Warning';
    case 'highrisk':
      return 'High Risk';
    case 'critical':
      return 'Critical Depletion';
  }
}

export function getStatusColorClasses(status: BorewellStatus): {
  bg: string;
  text: string;
  border: string;
  glow: string;
  hex: string;
} {
  switch (status) {
    case 'normal':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/20',
        hex: '#10b981'
      };
    case 'warning':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-500/20',
        hex: '#f59e0b'
      };
    case 'highrisk':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        glow: 'shadow-orange-500/20',
        hex: '#f97316'
      };
    case 'critical':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        glow: 'shadow-rose-500/20',
        hex: '#ef4444'
      };
  }
}

export function formatWaterLevel(mbgl: number): string {
  return `${mbgl.toFixed(1)} mbgl`;
}

export function formatDepletionRate(cmPerDay: number): string {
  if (cmPerDay < 0) {
    return `+${Math.abs(cmPerDay).toFixed(1)} cm/day (Recharge)`;
  }
  return `-${cmPerDay.toFixed(1)} cm/day`;
}

export function formatDelta(deltaMeters: number): string {
  if (deltaMeters > 0) {
    return `+${deltaMeters.toFixed(1)} m`;
  }
  return `${deltaMeters.toFixed(1)} m`;
}
