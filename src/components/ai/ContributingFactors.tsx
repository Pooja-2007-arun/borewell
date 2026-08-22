import React from 'react';
import { AIFactor } from '../../types/borewell';
import { ShieldAlert, TrendingDown, CloudRain, RotateCcw, Activity } from 'lucide-react';

interface ContributingFactorsProps {
  factors: AIFactor[];
}

export const ContributingFactors: React.FC<ContributingFactorsProps> = ({ factors }) => {
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('pump') || lower.includes('extract')) return Activity;
    if (lower.includes('rain') || lower.includes('monsoon')) return CloudRain;
    if (lower.includes('recharge') || lower.includes('lake')) return RotateCcw;
    return TrendingDown;
  };

  return (
    <div className="space-y-3">
      {factors.map((factor, idx) => {
        const Icon = getIcon(factor.name);
        const isNegative = factor.category === 'negative';
        const absImpact = Math.abs(factor.impact);

        return (
          <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isNegative ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200">{factor.name}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{factor.value}</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-bold text-xs ${
                    isNegative ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {isNegative ? `+${absImpact}% Stress` : `-${absImpact}% Relief`}
                </span>
              </div>
            </div>

            {/* Impact Visual Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
              <div
                className={`h-1.5 rounded-full ${
                  isNegative ? 'bg-gradient-to-r from-orange-500 to-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, absImpact * 2)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{factor.description}</p>
          </div>
        );
      })}
    </div>
  );
};
