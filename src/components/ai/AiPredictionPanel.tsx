import React from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { Card } from '../common/Card';
import { ContributingFactors } from './ContributingFactors';
import {
  BrainCircuit,
  Calendar,
  AlertTriangle,
  Clock,
  Lightbulb,
  ShieldCheck,
  TrendingDown,
  Gauge,
  Flame
} from 'lucide-react';
import { StatusPill } from '../common/StatusPill';

export const AiPredictionPanel: React.FC = () => {
  const { selectedBorewell } = useBorewell();

  if (!selectedBorewell) return null;

  const pred = selectedBorewell.aiPrediction;
  const isCritical = pred.riskScore > 85;

  return (
    <div className="space-y-4">
      {/* Primary AI Risk Score & Predicted Critical Date Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <span>AI Depletion Risk & Predictive Horizons</span>
          </div>
        }
        subtitle={`Hydrogeological model analytics for ${selectedBorewell.name} (${selectedBorewell.id})`}
        headerAction={
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{pred.confidenceScore}% Confidence</span>
          </div>
        }
      >
        {/* Top Hero: Radial/Score Gauge + Predicted Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800/80">
          
          {/* Left Score Box */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="relative flex items-center justify-center w-20 h-20 flex-shrink-0">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-slate-800"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className={`${
                    isCritical
                      ? 'stroke-rose-500'
                      : pred.riskScore > 65
                      ? 'stroke-orange-500'
                      : pred.riskScore > 35
                      ? 'stroke-amber-400'
                      : 'stroke-emerald-400'
                  } transition-all duration-1000 ease-out`}
                  strokeWidth="7"
                  strokeDasharray={213.6}
                  strokeDashoffset={213.6 - (213.6 * pred.riskScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-extrabold text-white">{pred.riskScore}</span>
                <span className="text-[9px] text-slate-400 uppercase font-mono">Risk</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">Depletion Vulnerability:</span>
                <StatusPill status={selectedBorewell.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 mt-1.5 leading-tight">
                {isCritical
                  ? 'Severe aquifer exhaustion risk. Urgent extraction controls needed.'
                  : pred.riskScore > 65
                  ? 'High risk of drying out during upcoming dry spell.'
                  : 'Aquifer replenishment within acceptable seasonal range.'}
              </p>
            </div>
          </div>

          {/* Right Countdown Box */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Predicted Critical Threshold</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="my-2">
              <div className="text-xl font-extrabold font-mono text-rose-400">
                {pred.predictedDepletionDate}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {pred.predictedDaysRemaining <= 30
                    ? `⚠️ ${pred.predictedDaysRemaining} Days Remaining`
                    : `${pred.predictedDaysRemaining} Days Remaining`}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Limit: {selectedBorewell.criticalThreshold} mbgl (Pump bottom clearance: 15m)
            </div>
          </div>

        </div>

        {/* 3-Horizon Forecast Cards (7D, 14D, 30D) */}
        <div className="my-4">
          <span className="text-xs font-semibold text-slate-300 uppercase font-mono block mb-2">
            Multi-Horizon Projected Depletion Levels
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            
            {/* 7-Day */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">7-Day Horizon</span>
              <span className="text-base sm:text-lg font-extrabold font-mono text-cyan-300 mt-1 block">
                {pred.sevenDayLevel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">mbgl</span>
              <div className="text-[10px] text-rose-400 mt-1 font-mono">
                -{(pred.sevenDayLevel - selectedBorewell.currentLevel).toFixed(1)}m drop
              </div>
            </div>

            {/* 14-Day */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/30 transition-all text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">14-Day Horizon</span>
              <span className="text-base sm:text-lg font-extrabold font-mono text-amber-400 mt-1 block">
                {pred.fourteenDayLevel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">mbgl</span>
              <div className="text-[10px] text-rose-400 mt-1 font-mono">
                -{(pred.fourteenDayLevel - selectedBorewell.currentLevel).toFixed(1)}m drop
              </div>
            </div>

            {/* 30-Day */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-rose-500/30 transition-all text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">30-Day Horizon</span>
              <span className="text-base sm:text-lg font-extrabold font-mono text-rose-400 mt-1 block">
                {pred.thirtyDayLevel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">mbgl</span>
              <div className="text-[10px] text-rose-400 mt-1 font-mono">
                -{(pred.thirtyDayLevel - selectedBorewell.currentLevel).toFixed(1)}m drop
              </div>
            </div>

          </div>
        </div>

        {/* Contributing Factors Section */}
        <div className="my-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-200 uppercase font-mono">
              Hydrogeological Contributing Factors (Explainable AI)
            </span>
            <span className="text-[10px] text-slate-500">Feature Importance Weights</span>
          </div>
          <ContributingFactors factors={pred.contributingFactors} />
        </div>

        {/* Actionable AI Mitigation Recommendation */}
        <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-3 text-xs">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-cyan-300 block">AI Recommended Early Action:</span>
            <p className="text-slate-300 mt-0.5 leading-relaxed">{pred.recommendation}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
