import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { useBorewell } from '../../context/BorewellContext';
import { Card } from '../common/Card';
import { StatusPill } from '../common/StatusPill';
import { TrendingDown, Calendar, ShieldAlert, Sparkles } from 'lucide-react';
import { simulateDepletion } from '../../utils/calculations';

export const WaterLevelTrend: React.FC = () => {
  const { selectedBorewell, simulation } = useBorewell();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('30d');

  // Prepare chart dataset with simulation recalculation if enabled
  const chartData = useMemo(() => {
    if (!selectedBorewell) return [];

    let rawData = [...selectedBorewell.historicalReadings];

    if (timeframe === '7d') {
      // 7 days past + 7 days future
      const pastSlice = rawData.filter((d) => d.waterLevel !== undefined).slice(-7);
      const futureSlice = rawData.filter((d) => d.predictedLevel !== undefined).slice(0, 7);
      rawData = [...pastSlice, ...futureSlice];
    } else if (timeframe === '30d') {
      // 30 days past + 30 days future
      rawData = rawData;
    }

    if (!simulation.enabled) {
      return rawData.map((d) => ({
        ...d,
        displayDate: d.date.substring(5), // MM-DD
      }));
    }

    // Apply simulation to future predicted data points
    const simResult = simulateDepletion(
      selectedBorewell.dailyDepletionRate,
      selectedBorewell.currentLevel,
      selectedBorewell.criticalThreshold,
      simulation.extractionChange,
      simulation.rechargeBoost
    );

    let runningSimLevel = selectedBorewell.currentLevel;
    let dayCount = 0;

    return rawData.map((d) => {
      if (d.predictedLevel !== undefined) {
        dayCount++;
        runningSimLevel = Number((selectedBorewell.currentLevel + (dayCount * simResult.simulatedDailyDepletion * 0.012)).toFixed(2));
        return {
          ...d,
          displayDate: d.date.substring(5),
          predictedLevel: runningSimLevel,
          upperConfidence: runningSimLevel + (dayCount * 0.03),
          lowerConfidence: runningSimLevel - (dayCount * 0.03),
        };
      }
      return {
        ...d,
        displayDate: d.date.substring(5),
      };
    });
  }, [selectedBorewell, timeframe, simulation]);

  if (!selectedBorewell) return null;

  // Compute custom Y-axis domain based on well depth
  const minLevel = Math.max(0, Math.floor(selectedBorewell.currentLevel * 0.7));
  const maxLevel = Math.ceil(selectedBorewell.criticalThreshold * 1.08);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-cyan-400" />
          <span>Groundwater Level Trend & AI Forecast</span>
        </div>
      }
      subtitle={`Historical depth vs AI predicted trajectory for ${selectedBorewell.name} (${selectedBorewell.id})`}
      headerAction={
        <div className="flex items-center gap-2">
          {/* Timeframe Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
            {(['7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase transition-all ${
                  timeframe === tf
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf === 'all' ? '60-Day' : tf}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Top Details Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Current Depth:</span>
          <span className="font-mono font-bold text-cyan-300 text-sm">{selectedBorewell.currentLevel} mbgl</span>
          <span className="text-slate-500 font-mono">/ {selectedBorewell.totalDepth}m Total</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Status:</span>
          <StatusPill status={selectedBorewell.status} size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Critical Limit:</span>
          <span className="font-mono font-semibold text-rose-400">{selectedBorewell.criticalThreshold} mbgl</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Depletion Rate:</span>
          <span className="font-mono font-semibold text-amber-400">-{selectedBorewell.dailyDepletionRate} cm/day</span>
        </div>

        {simulation.enabled && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-[11px]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Scenario Active</span>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[320px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              {/* Cyan gradient for historical area */}
              <linearGradient id="waterLevelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>

              {/* Forecast confidence band gradient */}
              <linearGradient id="forecastConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />

            {/* Note: Higher mbgl means deeper/worse water level */}
            <YAxis
              domain={[minLevel, maxLevel]}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tickFormatter={(val) => `${val}m`}
              label={{
                value: 'Depth (mbgl - deeper is lower)',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 10,
                offset: 15,
              }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  const isPrediction = dataPoint.predictedLevel !== undefined;
                  return (
                    <div className="bg-[#0e162a]/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl text-xs min-w-[200px]">
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                        <span className="font-mono text-slate-400 font-semibold">{dataPoint.date}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                            isPrediction
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {isPrediction ? 'AI Forecast' : 'Historical Telemetry'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {dataPoint.waterLevel !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Groundwater Depth:</span>
                            <span className="font-mono font-bold text-cyan-300">{dataPoint.waterLevel} mbgl</span>
                          </div>
                        )}

                        {dataPoint.predictedLevel !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Predicted Depth:</span>
                            <span className="font-mono font-bold text-amber-400">{dataPoint.predictedLevel} mbgl</span>
                          </div>
                        )}

                        {dataPoint.rainfall > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Precipitation:</span>
                            <span className="font-mono font-semibold text-blue-400">{dataPoint.rainfall} mm</span>
                          </div>
                        )}

                        {dataPoint.pumpingHours > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Pumping Duration:</span>
                            <span className="font-mono text-slate-300">{dataPoint.pumpingHours} hrs/day</span>
                          </div>
                        )}

                        <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 flex justify-between text-[10px]">
                          <span className="text-slate-500">Critical Well Bottom:</span>
                          <span className="font-mono text-rose-400">{selectedBorewell.criticalThreshold} mbgl</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={selectedBorewell.criticalThreshold}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Critical Limit: ${selectedBorewell.criticalThreshold}m`,
                position: 'right',
                fill: '#ef4444',
                fontSize: 10,
              }}
            />

            <ReferenceLine
              y={selectedBorewell.warningThreshold}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: `Warning: ${selectedBorewell.warningThreshold}m`,
                position: 'right',
                fill: '#f59e0b',
                fontSize: 10,
              }}
            />

            {/* Historical Telemetry (Solid Cyan Line with Area Fill) */}
            <Area
              type="monotone"
              dataKey="waterLevel"
              name="Historical Water Level"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#waterLevelGradient)"
              connectNulls={false}
              dot={{ r: 2, fill: '#06b6d4' }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            />

            {/* AI Predicted Future Trend (Dashed Amber/Orange Line) */}
            <Line
              type="monotone"
              dataKey="predictedLevel"
              name="AI Predicted Trend"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              connectNulls={false}
              dot={{ r: 2, fill: '#f59e0b' }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2 pt-2 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-0.5 bg-cyan-400 inline-block" /> Solid Blue = Actual Telemetry (Past 30d)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-0.5 bg-amber-400 border-t border-dashed inline-block" /> Dashed Amber = AI Machine Learning Forecast (Next 30d)
        </span>
      </div>
    </Card>
  );
};
