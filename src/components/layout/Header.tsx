import React, { useState, useEffect } from 'react';
import { useBorewell } from '../../context/BorewellContext';
import {
  Waves,
  MapPin,
  Clock,
  RefreshCw,
  Sliders,
  Download,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedZone,
    setSelectedZone,
    zones,
    isOnline,
    setIsOnline,
    lastUpdated,
    isSyncing,
    triggerRefresh,
    simulation,
    setSimulation,
    borewells
  } = useBorewell();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify(borewells, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `borewell-telemetry-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c1324]/90 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Left: Branding & Subtitle */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Waves className="w-6 h-6 animate-pulse-slow" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-300 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                  Hyperlocal Borewell Depletion Early Warning System
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  IoT AI Telemetry v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Deep aquifer dynamic monitoring, XGBoost groundwater trend forecasting & hyperlocal risk advisory
              </p>
            </div>
          </div>

          {/* Right: Controls & Status */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            
            {/* Zone Selector */}
            <div className="relative min-w-[210px] flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-900/90 text-xs sm:text-sm font-medium text-slate-200 rounded-lg border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none cursor-pointer transition-all hover:border-slate-600"
              >
                {zones.map((zone) => (
                  <option key={zone} value={zone} className="bg-slate-900 text-slate-200">
                    {zone}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Live Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime || 'Syncing...'}</span>
            </div>

            {/* Sync & Refresh Button */}
            <button
              onClick={triggerRefresh}
              title="Refresh telemetry"
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden md:inline text-[11px] text-slate-400">Sync: {lastUpdated}</span>
            </button>

            {/* What-If Simulator Toggle Button */}
            <button
              onClick={() => setSimulation((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                simulation.enabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scenario Sim</span>
            </button>

            {/* Export JSON / CSV */}
            <button
              onClick={handleExport}
              title="Export telemetry dataset"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline">Export</span>
            </button>

            {/* Online/Offline Status Indicator */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? 'System Online (Click to simulate offline)' : 'System Offline (Click to reconnect)'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
              </span>
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
