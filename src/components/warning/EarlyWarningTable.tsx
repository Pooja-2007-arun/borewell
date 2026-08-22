import React, { useState, useMemo } from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { Borewell, BorewellStatus } from '../../types/borewell';
import { Card } from '../common/Card';
import { StatusPill } from '../common/StatusPill';
import {
  AlertOctagon,
  Search,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
  Clock,
  Crosshair
} from 'lucide-react';
import { formatDelta } from '../../utils/formatters';

export const EarlyWarningTable: React.FC = () => {
  const { borewells, selectedBorewell, setSelectedBorewell, setDetailModalBorewell, setActiveView } = useBorewell();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | BorewellStatus>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'days' | 'level' | 'delta'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort borewells by priority risk
  const sortedBorewells = useMemo(() => {
    return borewells
      .filter((b) => {
        const matchesSearch =
          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.zone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ? true : b.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (sortBy === 'risk') {
          valA = a.aiPrediction.riskScore;
          valB = b.aiPrediction.riskScore;
        } else if (sortBy === 'days') {
          valA = a.aiPrediction.predictedDaysRemaining;
          valB = b.aiPrediction.predictedDaysRemaining;
        } else if (sortBy === 'level') {
          valA = a.currentLevel;
          valB = b.currentLevel;
        } else if (sortBy === 'delta') {
          valA = a.waterLevelChange7d;
          valB = b.waterLevelChange7d;
        }

        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [borewells, searchTerm, filterStatus, sortBy, sortOrder]);

  const handleSort = (field: 'risk' | 'days' | 'level' | 'delta') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'days' ? 'asc' : 'desc'); // For days, ascending (fewer days) is higher urgency
    }
  };

  return (
    <Card
      noPadding
      title={
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
          <span>Borewell Depletion Early Warning Prioritization</span>
        </div>
      }
      subtitle="Ranked real-time risk assessment for proactive water crisis intervention"
      headerAction={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search borewell, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 rounded-lg border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-44 sm:w-56"
            />
          </div>

          {/* Status Tabs */}
          <div className="hidden lg:flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
            {(['all', 'critical', 'highrisk', 'warning', 'normal'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'highrisk' ? 'High Risk' : st}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3.5 font-semibold">Borewell Node</th>
              <th className="px-4 py-3.5 font-semibold">Aquifer Zone</th>
              <th
                onClick={() => handleSort('level')}
                className="px-4 py-3.5 font-semibold cursor-pointer hover:text-cyan-300 transition-all"
              >
                <div className="flex items-center gap-1">
                  <span>Depth (mbgl)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('delta')}
                className="px-4 py-3.5 font-semibold cursor-pointer hover:text-cyan-300 transition-all"
              >
                <div className="flex items-center gap-1">
                  <span>7D Delta</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('risk')}
                className="px-4 py-3.5 font-semibold cursor-pointer hover:text-cyan-300 transition-all"
              >
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('days')}
                className="px-4 py-3.5 font-semibold cursor-pointer hover:text-cyan-300 transition-all"
              >
                <div className="flex items-center gap-1">
                  <span>Days to Critical</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {sortedBorewells.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No borewells match the current filters.
                </td>
              </tr>
            ) : (
              sortedBorewells.map((bw) => {
                const isSelected = selectedBorewell?.id === bw.id;
                const isCritical = bw.status === 'critical';
                const isHighRisk = bw.status === 'highrisk';

                return (
                  <tr
                    key={bw.id}
                    onClick={() => setSelectedBorewell(bw)}
                    className={`cursor-pointer transition-all duration-150 group ${
                      isSelected
                        ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400'
                        : isCritical
                        ? 'hover:bg-rose-950/20'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* ID & Name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isCritical
                              ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]'
                              : isHighRisk
                              ? 'bg-orange-500 shadow-[0_0_8px_#f97316]'
                              : bw.status === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {bw.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">{bw.id} • {bw.location}</div>
                        </div>
                      </div>
                    </td>

                    {/* Zone & Aquifer */}
                    <td className="px-4 py-3.5 text-slate-300">
                      <div>{bw.zone}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{bw.aquiferType}</div>
                    </td>

                    {/* Current Level */}
                    <td className="px-4 py-3.5 font-mono font-semibold text-slate-100">
                      <span>{bw.currentLevel}</span>
                      <span className="text-slate-500 text-[10px] ml-1">/ {bw.totalDepth}m</span>
                    </td>

                    {/* 7-day change */}
                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={`font-semibold ${
                          bw.waterLevelChange7d < 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {formatDelta(bw.waterLevelChange7d)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">-{bw.dailyDepletionRate} cm/d</span>
                    </td>

                    {/* Risk Score Progress */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              bw.aiPrediction.riskScore > 85
                                ? 'bg-rose-500'
                                : bw.aiPrediction.riskScore > 65
                                ? 'bg-orange-500'
                                : bw.aiPrediction.riskScore > 35
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${bw.aiPrediction.riskScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-200">
                          {bw.aiPrediction.riskScore}
                        </span>
                      </div>
                    </td>

                    {/* Days Until Critical */}
                    <td className="px-4 py-3.5 font-mono">
                      {bw.aiPrediction.predictedDaysRemaining <= 30 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold animate-pulse">
                          <Flame className="w-3 h-3 text-rose-400" />
                          {bw.aiPrediction.predictedDaysRemaining} Days
                        </span>
                      ) : bw.aiPrediction.predictedDaysRemaining <= 90 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {bw.aiPrediction.predictedDaysRemaining} Days
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {bw.aiPrediction.predictedDaysRemaining > 365
                            ? '> 1 Year'
                            : `${bw.aiPrediction.predictedDaysRemaining} Days`}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 block">
                        {bw.aiPrediction.predictedDepletionDate}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="px-4 py-3.5">
                      <StatusPill status={bw.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedBorewell(bw);
                            setActiveView('map');
                          }}
                          title="Focus on Map"
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white transition-all"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBorewell(bw);
                            setDetailModalBorewell(bw);
                          }}
                          title="Inspect Telemetry & AI Diagnostic"
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Showing {sortedBorewells.length} of {borewells.length} borewells</span>
        <span className="text-slate-500">Sorted by highest depletion risk</span>
      </div>
    </Card>
  );
};
