import React from 'react';
import { useBorewell } from '../../context/BorewellContext';
import {
  LayoutDashboard,
  Map,
  TrendingDown,
  AlertOctagon,
  Bell,
  SlidersHorizontal
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeView, setActiveView, alerts, kpis, simulation, setSimulation } = useBorewell();

  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Borewell Geospatial Map', icon: Map, badge: `${kpis.totalBorewells} Nodes` },
    { id: 'analytics', label: 'Hydrological Trends', icon: TrendingDown },
    { id: 'warnings', label: 'Early Warnings', icon: AlertOctagon, badge: kpis.criticalCount > 0 ? `${kpis.criticalCount} Critical` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'alerts', label: 'Alert Center', icon: Bell, badge: unreadAlerts > 0 ? `${unreadAlerts} New` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  ];

  return (
    <nav className="bg-[#0e162a]/95 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Simulator Sandbox Status Pill */}
        {simulation.enabled && (
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-700/50 rounded-lg text-xs text-cyan-300 animate-pulse">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">What-If Sim: {simulation.extractionChange > 0 ? `+${simulation.extractionChange}% Draw` : `${simulation.extractionChange}% Draw`}</span>
            <button
              onClick={() => setSimulation({ enabled: false, extractionChange: 0, rechargeBoost: 0 })}
              className="text-[10px] underline ml-1 hover:text-white"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
