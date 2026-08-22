import React from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { KpiCard } from './KpiCard';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Gauge,
  TrendingDown
} from 'lucide-react';

export const KpiGrid: React.FC = () => {
  const { kpis, setActiveView } = useBorewell();

  const normalPct = kpis.totalBorewells ? Math.round((kpis.normalCount / kpis.totalBorewells) * 100) : 0;
  const warningPct = kpis.totalBorewells ? Math.round((kpis.warningCount / kpis.totalBorewells) * 100) : 0;
  const criticalCountTotal = kpis.criticalCount + kpis.highRiskCount;
  const criticalPct = kpis.totalBorewells ? Math.round((criticalCountTotal / kpis.totalBorewells) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
      
      {/* 1. HERO KPI: Critical & High Risk Borewells (Highest Visual Priority) */}
      <KpiCard
        title="Critical & High Risk"
        value={criticalCountTotal}
        unit={`(${criticalPct}%)`}
        icon={Flame}
        statusVariant="rose"
        isHero={true}
        progressValue={criticalPct}
        subtext={`${kpis.criticalCount} Immediate Breaches`}
        trend={{ value: 'Action Required', isPositive: false }}
        onClick={() => setActiveView('warnings')}
      />

      {/* 2. HERO KPI: Total Borewells Monitored */}
      <KpiCard
        title="Total Borewells"
        value={kpis.totalBorewells}
        unit="Nodes"
        icon={Activity}
        statusVariant="cyan"
        isHero={true}
        progressValue={100}
        subtext="100% telemetry online"
        trend={{ value: 'Live Mesh', isPositive: true }}
        onClick={() => setActiveView('map')}
      />

      {/* 3. Normal / Safe Status */}
      <KpiCard
        title="Safe / Normal"
        value={kpis.normalCount}
        unit={`(${normalPct}%)`}
        icon={CheckCircle2}
        statusVariant="emerald"
        progressValue={normalPct}
        subtext="Adequate recharge column"
        trend={{ value: 'Stable', isPositive: true }}
      />

      {/* 4. Warning State */}
      <KpiCard
        title="Warning State"
        value={kpis.warningCount}
        unit={`(${warningPct}%)`}
        icon={AlertTriangle}
        statusVariant="amber"
        progressValue={warningPct}
        subtext="Moderate seasonal drop"
        trend={{ value: 'Elevated', isPositive: false }}
        onClick={() => setActiveView('warnings')}
      />

      {/* 5. Average Groundwater Depth */}
      <KpiCard
        title="Avg Water Level"
        value={kpis.averageWaterLevel}
        unit="mbgl"
        icon={Gauge}
        statusVariant="cyan"
        progressValue={Math.min(100, (kpis.averageWaterLevel / 300) * 100)}
        subtext="Basin piezometric mean"
        trend={{ value: '-1.4m / 30d', isPositive: false }}
      />

      {/* 6. Average Daily Depletion Rate */}
      <KpiCard
        title="Depletion Velocity"
        value={kpis.averageDailyDepletion}
        unit="cm/day"
        icon={TrendingDown}
        statusVariant={kpis.averageDailyDepletion > 20 ? 'rose' : kpis.averageDailyDepletion > 10 ? 'amber' : 'emerald'}
        progressValue={Math.min(100, (kpis.averageDailyDepletion / 40) * 100)}
        subtext="Dynamic drawdown velocity"
        trend={{ value: 'Stress Alert', isPositive: false }}
      />

    </div>
  );
};
