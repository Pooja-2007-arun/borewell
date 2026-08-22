import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { mockRainfallCorrelation } from '../../data/mockRainfall';
import { Card } from '../common/Card';
import { CloudRain, Droplets, Info } from 'lucide-react';

export const RainfallGroundwaterChart: React.FC = () => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-cyan-400" />
          <span>Hydrological Correlation: Rainfall vs. Groundwater</span>
        </div>
      }
      subtitle="Dynamic aquifer recharge latency & precipitation response curves across monitored zones"
      headerAction={
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-800/40 rounded-lg text-xs text-cyan-300">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">Recharge Lag: ~4.5 Days</span>
        </div>
      }
    >
      <div className="w-full h-[280px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mockRainfallCorrelation} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="rainfallBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0284c7" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />

            {/* Left Axis: Groundwater Level (mbgl) */}
            <YAxis
              yAxisId="left"
              domain={[175, 190]}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tickFormatter={(val) => `${val}m`}
              label={{
                value: 'Avg Water Level (mbgl)',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 10,
                offset: 15,
              }}
            />

            {/* Right Axis: Rainfall (mm) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 60]}
              stroke="#38bdf8"
              tick={{ fill: '#38bdf8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tickFormatter={(val) => `${val}mm`}
              label={{
                value: 'Rainfall (mm)',
                angle: 90,
                position: 'insideRight',
                fill: '#38bdf8',
                fontSize: 10,
                offset: 15,
              }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0e162a]/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl text-xs min-w-[200px]">
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                        <span className="font-mono text-slate-300 font-semibold">{data.date}</span>
                        <span className="text-[10px] font-mono text-cyan-400">Recharge: {data.rechargeEfficiency}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Precipitation:</span>
                          <span className="font-mono font-bold text-sky-400">{data.rainfall} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Groundwater Depth:</span>
                          <span className="font-mono font-bold text-emerald-400">{data.avgWaterLevel} mbgl</span>
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
              height={32}
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            />

            {/* Rainfall Bar */}
            <Bar
              yAxisId="right"
              dataKey="rainfall"
              name="Precipitation (mm)"
              fill="url(#rainfallBarGradient)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />

            {/* Groundwater Level Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgWaterLevel"
              name="Regional Water Table (mbgl)"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981' }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          <strong>Hydrogeological Insight:</strong> Heavy rainfall events (&gt;35mm) produce measurable groundwater recovery within 4 to 6 days in unconfined aquifers, but show restricted infiltration in fractured granite urban zones.
        </span>
      </div>
    </Card>
  );
};
