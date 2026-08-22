import React, { useState } from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { BorewellAlert } from '../../types/borewell';
import { Card } from '../common/Card';
import {
  Bell,
  AlertOctagon,
  Flame,
  Droplets,
  RotateCcw,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Wrench,
  Sparkles,
  Filter
} from 'lucide-react';

export const AlertsPanel: React.FC = () => {
  const { alerts, acknowledgeAlert, dismissAlert, allBorewells, setSelectedBorewell, setDetailModalBorewell, setActiveView } = useBorewell();
  const [filter, setFilter] = useState<'all' | 'critical' | 'highrisk' | 'recharge' | 'maintenance'>('all');

  const filteredAlerts = alerts.filter((a) => (filter === 'all' ? true : a.type === filter));

  const unreadCount = alerts.filter((a) => !a.acknowledged).length;

  const handleInspectBorewell = (borewellId: string) => {
    const found = allBorewells.find((b) => b.id === borewellId);
    if (found) {
      setSelectedBorewell(found);
      setDetailModalBorewell(found);
    }
  };

  const getAlertIcon = (type: BorewellAlert['type']) => {
    switch (type) {
      case 'critical':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'highrisk':
        return <AlertOctagon className="w-4 h-4 text-orange-400" />;
      case 'recharge':
        return <Droplets className="w-4 h-4 text-emerald-400" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-400" />;
    }
  };

  const getAlertBorder = (type: BorewellAlert['type'], acknowledged: boolean) => {
    if (acknowledged) return 'border-slate-800/80 bg-slate-900/40 opacity-75';
    switch (type) {
      case 'critical':
        return 'border-rose-500/40 bg-rose-950/20 shadow-sm shadow-rose-500/10';
      case 'highrisk':
        return 'border-orange-500/40 bg-orange-950/20';
      case 'recharge':
        return 'border-emerald-500/40 bg-emerald-950/20';
      case 'maintenance':
        return 'border-amber-500/40 bg-amber-950/20';
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <span>Real-Time Hydro-Alert Center</span>
        </div>
      }
      subtitle="Prioritized feed of critical threshold breaches, acute drawdowns & natural recharge events"
      headerAction={
        <div className="flex items-center gap-2">
          {/* Category Filter Tabs */}
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
            {(['all', 'critical', 'highrisk', 'recharge', 'maintenance'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono capitalize transition-all ${
                  filter === t
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'highrisk' ? 'High Risk' : t}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs">No active alerts in this category.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${getAlertBorder(
                alert.type,
                alert.acknowledged
              )}`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Icon & Title */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {alert.id}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100">{alert.title}</h4>
                      {alert.metric && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-900/90 text-cyan-300 border border-slate-800">
                          {alert.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                      <span>{alert.borewellName} ({alert.borewellId})</span>
                      <span>•</span>
                      <span>{alert.zone}</span>
                      <span>•</span>
                      <span className="text-slate-500">{alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleInspectBorewell(alert.borewellId)}
                    title="Focus Borewell"
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white transition-all text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      title="Acknowledge Alert"
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => dismissAlert(alert.id)}
                    title="Dismiss"
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600 text-slate-400 hover:text-white transition-all text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono">{unreadCount} unacknowledged notifications</span>
        <span className="text-slate-500 text-[11px]">Telemetry automatically escalates on threshold breach</span>
      </div>
    </Card>
  );
};
