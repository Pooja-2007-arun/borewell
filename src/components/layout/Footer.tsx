import React from 'react';
import { useBorewell } from '../../context/BorewellContext';
import { Cpu, ShieldCheck, BatteryCharging, Wifi, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  const { borewells, isOnline } = useBorewell();

  const avgBattery = borewells.length
    ? Math.round(borewells.reduce((acc, b) => acc + b.sensorBattery, 0) / borewells.length)
    : 0;

  return (
    <footer className="mt-12 bg-[#090e1a] border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Metadata */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>HydroPredict AI Neural Engine v3.8</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>22 Telemetry Piezo-Sensors Connected</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>Avg Sensor Battery: {avgBattery}%</span>
          </div>
        </div>

        {/* Right: Security & Network */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Wifi className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span>Mesh Telemetry: {isOnline ? 'Active (LoRaWAN + 4G)' : 'Simulated Disconnect'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hydro-Security Grade TLS</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
