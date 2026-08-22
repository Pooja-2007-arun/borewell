import React from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { Card } from '../common/Card';
import { Sliders, RotateCcw, Sparkles, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { simulateDepletion } from '../../utils/calculations';
import { StatusPill } from '../common/StatusPill';

export const ScenarioSimulator: React.FC = () => {
  const { selectedBorewell, simulation, setSimulation } = useBorewell();

  if (!selectedBorewell) return null;

  const simResult = simulateDepletion(
    selectedBorewell.dailyDepletionRate,
    selectedBorewell.currentLevel,
    selectedBorewell.criticalThreshold,
    simulation.extractionChange,
    simulation.rechargeBoost
  );

  const isSimActive = simulation.enabled;

  const handleReset = () => {
    setSimulation({
      enabled: false,
      extractionChange: 0,
      rechargeBoost: 0,
    });
  };

  return (
    <Card
      glow={isSimActive}
      glowColor="cyan"
      title={
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span>Interactive "What-If" Mitigation Simulator</span>
        </div>
      }
      subtitle="Simulate pump curtailment & artificial recharge to evaluate aquifer life extension"
      headerAction={
        <div className="flex items-center gap-2">
          {isSimActive && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={() => setSimulation((prev) => ({ ...prev, enabled: !prev.enabled }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSimActive
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isSimActive ? 'Sandbox Active' : 'Enable Sandbox'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Slider 1: Extraction Curtailment */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-200">Daily Pumping Load Adjustment</span>
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded ${
                simulation.extractionChange > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : simulation.extractionChange < 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {simulation.extractionChange > 0 ? `+${simulation.extractionChange}% Draw` : `${simulation.extractionChange}% Draw`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            disabled={!isSimActive}
            value={simulation.extractionChange}
            onChange={(e) =>
              setSimulation((prev) => ({
                ...prev,
                enabled: true,
                extractionChange: Number(e.target.value),
              }))
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>-50% (Heavy Throttling)</span>
            <span>0% Baseline</span>
            <span>+50% (High Demand)</span>
          </div>
        </div>

        {/* Slider 2: Artificial Recharge / Rainwater Injection */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-200">Artificial Recharge & Check-Dam Boost</span>
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded ${
                simulation.rechargeBoost > 0
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              +{simulation.rechargeBoost}% Inflow
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            disabled={!isSimActive}
            value={simulation.rechargeBoost}
            onChange={(e) =>
              setSimulation((prev) => ({
                ...prev,
                enabled: true,
                rechargeBoost: Number(e.target.value),
              }))
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>0% (Natural Only)</span>
            <span>+50% Rooftop RWH</span>
            <span>+100% Lake Inflow</span>
          </div>
        </div>

        {/* Simulation Output Comparison Grid */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
          <div className="text-xs font-bold text-cyan-300 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Simulated Aquifer Impact for {selectedBorewell.id}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">DEPLETION VELOCITY</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono font-bold text-slate-100 text-sm">
                  {simResult.simulatedDailyDepletion}
                </span>
                <span className="text-[10px] text-slate-500">cm/day</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Base: -{selectedBorewell.dailyDepletionRate} cm/d
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">DAYS UNTIL CRITICAL</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span
                  className={`font-mono font-bold text-sm ${
                    simResult.simulatedDaysRemaining > selectedBorewell.aiPrediction.predictedDaysRemaining
                      ? 'text-emerald-400'
                      : simResult.simulatedDaysRemaining < selectedBorewell.aiPrediction.predictedDaysRemaining
                      ? 'text-rose-400'
                      : 'text-slate-100'
                  }`}
                >
                  {simResult.simulatedDaysRemaining > 365 ? '> 1 Year' : `${simResult.simulatedDaysRemaining} Days`}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Base: {selectedBorewell.aiPrediction.predictedDaysRemaining} Days
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-mono">SIMULATED STATUS</span>
              <div className="mt-1">
                <StatusPill status={simResult.simulatedStatus} size="sm" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Score: {simResult.simulatedRiskScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
