import React from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { AlertOctagon, Flame, ArrowRight, ShieldAlert, X } from 'lucide-react';

export const CriticalAlertBanner: React.FC = () => {
  const { borewells, setSelectedBorewell, setDetailModalBorewell, setActiveView } = useBorewell();
  const [dismissed, setDismissed] = React.useState(false);

  // Find the single highest-risk critical borewell
  const criticalBorewells = borewells.filter((b) => b.status === 'critical');
  if (criticalBorewells.length === 0 || dismissed) return null;

  const topCritical = [...criticalBorewells].sort(
    (a, b) => b.aiPrediction.riskScore - a.aiPrediction.riskScore
  )[0];

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-950/90 via-red-900/60 to-slate-900/90 border border-rose-500/50 shadow-[0_0_25px_-5px_rgba(239,68,68,0.3)] backdrop-blur-md px-4 py-3 transition-all duration-300 animate-fadeIn">
      {/* Subtle pulsing background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-full bg-rose-500/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* Left: Icon & Alert Summary */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex-shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400/40">
                CRITICAL WARNING • {criticalBorewells.length} BOREWELLS AT RISK
              </span>
              <span className="text-xs font-bold text-white">
                {topCritical.name} ({topCritical.id})
              </span>
            </div>
            <p className="text-xs text-rose-200/80 mt-0.5">
              Depletion velocity: <strong className="text-rose-100 font-mono">-{topCritical.dailyDepletionRate} cm/day</strong> • Water level at <strong className="text-rose-100 font-mono">{topCritical.currentLevel} mbgl</strong> (breach in <span className="font-bold text-rose-300 underline font-mono">{topCritical.aiPrediction.predictedDaysRemaining} days</span>).
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            onClick={() => {
              setSelectedBorewell(topCritical);
              setDetailModalBorewell(topCritical);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md hover:shadow-rose-600/30 active:scale-95"
          >
            <span>Inspect Critical Node</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            title="Dismiss notification"
            className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
