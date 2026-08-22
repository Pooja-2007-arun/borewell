import React from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { StatusPill } from '../common/StatusPill';
import {
  X,
  Radio,
  Battery,
  Layers,
  MapPin,
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingDown,
  Droplets,
  Activity,
  Lightbulb
} from 'lucide-react';
import { formatDelta } from '../../utils/formatters';

export const BorewellDetailModal: React.FC = () => {
  const { detailModalBorewell, setDetailModalBorewell } = useBorewell();

  if (!detailModalBorewell) return null;

  const bw = detailModalBorewell;
  const isCritical = bw.status === 'critical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#101828] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-200">
        
        {/* Close Button */}
        <button
          onClick={() => setDetailModalBorewell(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-800">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                {bw.id}
              </span>
              <h2 className="text-xl font-bold text-white">{bw.name}</h2>
              <StatusPill status={bw.status} size="sm" />
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {bw.location} ({bw.zone})
              </span>
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <Battery className="w-3.5 h-3.5" />
                Sensor: {bw.sensorBattery}%
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-mono block">Current Depth</span>
            <span className="text-xl font-extrabold text-cyan-300 font-mono mt-1 block">{bw.currentLevel} mbgl</span>
            <span className="text-[10px] text-slate-500 font-mono">Depth: {bw.totalDepth}m</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-mono block">7-Day Change</span>
            <span
              className={`text-xl font-extrabold font-mono mt-1 block ${
                bw.waterLevelChange7d < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {formatDelta(bw.waterLevelChange7d)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">30D: {formatDelta(bw.waterLevelChange30d)}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-mono block">Extraction Load</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono mt-1 block">{bw.pumpingHoursPerDay} hrs/d</span>
            <span className="text-[10px] text-slate-500 font-mono">{bw.extractionRateLpm} LPM flow</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-mono block">AI Risk Index</span>
            <span
              className={`text-xl font-extrabold font-mono mt-1 block ${
                bw.aiPrediction.riskScore > 75 ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {bw.aiPrediction.riskScore}/100
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{bw.aiPrediction.confidenceScore}% Confidence</span>
          </div>
        </div>

        {/* AI Forecast & Contributing Factors */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-slate-100">Predictive Depletion Analytics</h3>
            </div>
            <span className="text-xs font-mono text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-800/60">
              Critical Threshold Breach: {bw.aiPrediction.predictedDepletionDate} ({bw.aiPrediction.predictedDaysRemaining} Days)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-3">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">7-DAY FORECAST</span>
              <span className="text-sm font-bold font-mono text-slate-100">{bw.aiPrediction.sevenDayLevel} mbgl</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">14-DAY FORECAST</span>
              <span className="text-sm font-bold font-mono text-slate-100">{bw.aiPrediction.fourteenDayLevel} mbgl</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">30-DAY FORECAST</span>
              <span className="text-sm font-bold font-mono text-amber-400">{bw.aiPrediction.thirtyDayLevel} mbgl</span>
            </div>
          </div>

          {/* Contributing Factors */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Key Drivers & Hydrogeological Factors</h4>
            <div className="space-y-2">
              {bw.aiPrediction.contributingFactors.map((factor, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className={factor.category === 'negative' ? 'text-rose-300' : 'text-emerald-300'}>
                      {factor.name}
                    </span>
                    <span className="font-mono text-slate-400">{factor.value}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="mt-4 p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50 flex items-start gap-2.5 text-xs text-cyan-200">
            <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">Actionable AI Mitigation Advisory: </span>
              {bw.aiPrediction.recommendation}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => setDetailModalBorewell(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
