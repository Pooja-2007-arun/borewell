import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useBorewell } from '../../context/BorewellContext';
import { Borewell, BorewellStatus } from '../../types/borewell';
import { Card } from '../common/Card';
import { getStatusColorClasses, formatWaterLevel, formatDelta } from '../../utils/formatters';
import {
  Map as MapIcon,
  Crosshair,
  Sparkles,
  ExternalLink,
  Layers,
  Flame,
  Radio,
  Clock,
  TrendingDown,
  Activity,
  Maximize2
} from 'lucide-react';

export const BorewellMap: React.FC = () => {
  const { borewells, selectedBorewell, setSelectedBorewell, setDetailModalBorewell, selectedZone } = useBorewell();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [statusFilter, setStatusFilter] = useState<'all' | BorewellStatus>('all');
  const [pulseGlow, setPulseGlow] = useState<boolean>(true);

  // Status count calculations for filter badges
  const counts = {
    all: borewells.length,
    critical: borewells.filter((b) => b.status === 'critical').length,
    highrisk: borewells.filter((b) => b.status === 'highrisk').length,
    warning: borewells.filter((b) => b.status === 'warning').length,
    normal: borewells.filter((b) => b.status === 'normal').length,
  };

  // Filter markers by selected status
  const visibleBorewells = borewells.filter((b) =>
    statusFilter === 'all' ? true : b.status === statusFilter
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.65],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark Matter CartoDB tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom top-right zoom control
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup handled gracefully
    };
  }, []);

  // Update Markers whenever visibleBorewells or pulseGlow or selectedBorewell changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    visibleBorewells.forEach((bw) => {
      const colors = getStatusColorClasses(bw.status);
      const isSelected = selectedBorewell?.id === bw.id;

      // Custom pulsating DivIcon
      const iconHtml = `
        <div class="custom-borewell-marker" style="width: 36px; height: 36px; position: relative;">
          ${
            pulseGlow
              ? `<div class="marker-ring" style="width: 36px; height: 36px; background-color: ${colors.hex}; opacity: ${
                  isSelected ? '0.6' : '0.35'
                };"></div>`
              : ''
          }
          <div class="marker-dot" style="width: ${isSelected ? '24px' : '16px'}; height: ${
            isSelected ? '24px' : '16px'
          }; background-color: ${colors.hex}; border: 2.5px solid ${
            isSelected ? '#ffffff' : '#0a0f1d'
          }; box-shadow: 0 0 ${isSelected ? '20px' : '10px'} ${colors.hex};">
            ${
              isSelected
                ? '<div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%;"></div>'
                : ''
            }
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(bw.coordinates, { icon: customIcon }).addTo(map);

      // Interactive Popup HTML
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3.5 min-w-[250px] font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <span class="font-mono font-bold text-xs text-cyan-400">${bw.id}</span>
            <h4 class="font-bold text-sm text-slate-100">${bw.name}</h4>
            <p class="text-[11px] text-slate-400">${bw.zone}</p>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-full" style="background-color: ${colors.hex}22; color: ${colors.hex}; border: 1px solid ${colors.hex}55;">
            ${bw.status}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-2 my-3 text-xs">
          <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-[10px] block">Current Level</span>
            <span class="font-mono font-bold text-slate-100">${bw.currentLevel} mbgl</span>
          </div>
          <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-[10px] block">7-day Change</span>
            <span class="font-mono font-bold ${bw.waterLevelChange7d < 0 ? 'text-rose-400' : 'text-emerald-400'}">
              ${bw.waterLevelChange7d > 0 ? '+' : ''}${bw.waterLevelChange7d} m
            </span>
          </div>
          <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-[10px] block">Pumping Load</span>
            <span class="font-mono font-bold text-slate-100">${bw.pumpingHoursPerDay} hrs/day</span>
          </div>
          <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-[10px] block">Risk Score</span>
            <span class="font-mono font-bold ${bw.aiPrediction.riskScore > 75 ? 'text-rose-400' : 'text-amber-400'}">
              ${bw.aiPrediction.riskScore}/100
            </span>
          </div>
        </div>

        <div class="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
          <span class="text-slate-400">Critical Breach Date:</span>
          <span class="font-mono font-semibold text-rose-400">${bw.aiPrediction.predictedDepletionDate}</span>
        </div>
        <button id="btn-select-${bw.id}" class="w-full mt-2.5 py-1.5 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md active:scale-98">
          Focus & Synchronize Dashboard
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedBorewell(bw);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${bw.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedBorewell(bw);
            setDetailModalBorewell(bw);
          };
        }
      });

      markersRef.current[bw.id] = marker;
    });

    // Auto-fit bounds on initial load
    if (visibleBorewells.length > 0) {
      const bounds = L.latLngBounds(visibleBorewells.map((b) => b.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [visibleBorewells, pulseGlow, selectedBorewell?.id]);

  // Center on selected borewell if changed externally (e.g. from table or alert)
  useEffect(() => {
    if (!selectedBorewell || !mapInstanceRef.current) return;
    mapInstanceRef.current.panTo(selectedBorewell.coordinates, {
      animate: true,
      duration: 0.8,
    });
    const marker = markersRef.current[selectedBorewell.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedBorewell?.id]);

  const handleResetView = () => {
    if (!mapInstanceRef.current || !borewells.length) return;
    const bounds = L.latLngBounds(borewells.map((b) => b.coordinates));
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  };

  return (
    <Card
      noPadding
      className="overflow-hidden flex flex-col h-[560px] sm:h-[620px] lg:h-[680px] border-slate-800 shadow-2xl relative"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <MapIcon className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <span className="text-white font-bold">Geospatial Aquifer Telemetry Centerpiece</span>
            <span className="hidden sm:inline text-slate-400 text-xs font-normal ml-2">
              • Interactive live borewell node matrix
            </span>
          </div>
        </div>
      }
      subtitle={`Displaying ${visibleBorewells.length} monitored borewells across ${selectedZone}`}
      headerAction={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Quick Filter Chips */}
          <div className="hidden sm:flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                statusFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter('critical')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                statusFilter === 'critical'
                  ? 'bg-rose-500/25 text-rose-300 font-bold border border-rose-500/50'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              Critical ({counts.critical})
            </button>
            <button
              onClick={() => setStatusFilter('highrisk')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                statusFilter === 'highrisk'
                  ? 'bg-orange-500/25 text-orange-300 font-bold border border-orange-500/50'
                  : 'text-slate-400 hover:text-orange-300'
              }`}
            >
              High Risk ({counts.highrisk})
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                statusFilter === 'warning'
                  ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/50'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              Warning ({counts.warning})
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                statusFilter === 'normal'
                  ? 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/50'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Safe ({counts.normal})
            </button>
          </div>

          {/* Glow Pulse Toggle */}
          <button
            onClick={() => setPulseGlow(!pulseGlow)}
            title="Toggle marker radar pulse"
            className={`p-2 rounded-lg border text-xs transition-all ${
              pulseGlow
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Fit View Button */}
          <button
            onClick={handleResetView}
            title="Fit all borewells in view"
            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs transition-all"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="relative w-full flex-1 h-full min-h-[440px]">
        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Top-Left Map Floating HUD Badge */}
        <div className="absolute top-4 left-4 z-[500] hidden sm:flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/90 text-xs text-slate-300 shadow-xl">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono font-semibold text-cyan-300">{visibleBorewells.length} Active Nodes</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 truncate max-w-[160px]">{selectedZone}</span>
        </div>

        {/* Bottom-Left Floating Map Legend HUD */}
        <div className="absolute bottom-4 left-4 z-[500] bg-slate-950/85 backdrop-blur-md rounded-xl p-3.5 border border-slate-800/90 shadow-2xl max-w-[270px] text-xs">
          <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Risk Tier Legend</span>
            <span className="font-mono text-cyan-400 text-[10px]">Piezometric Depletion</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <span className="text-slate-300">Normal / Safe</span>
              </div>
              <span className="font-mono text-slate-400">&lt; 50% Depth</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span className="text-slate-300">Warning</span>
              </div>
              <span className="font-mono text-slate-400">50 - 70%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                <span className="text-slate-300">High Risk</span>
              </div>
              <span className="font-mono text-slate-400">70 - 85%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
                <span className="text-slate-300 font-semibold text-rose-300">Critical Depletion</span>
              </div>
              <span className="font-mono text-rose-400 font-bold">&gt; 85% Depth</span>
            </div>
          </div>
        </div>

        {/* Bottom-Right Floating Selected-Borewell HUD Card */}
        {selectedBorewell && (
          <div className="absolute bottom-4 right-4 z-[500] hidden md:flex flex-col gap-2 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/40 shadow-2xl min-w-[300px] animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold text-white truncate max-w-[180px]">
                  {selectedBorewell.name}
                </span>
              </div>
              <span className="font-mono text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                {selectedBorewell.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] my-1">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Water Level</span>
                <span className="font-mono font-bold text-slate-100">{selectedBorewell.currentLevel} mbgl</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">7D Delta</span>
                <span className={`font-mono font-bold ${selectedBorewell.waterLevelChange7d < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedBorewell.waterLevelChange7d > 0 ? '+' : ''}{selectedBorewell.waterLevelChange7d} m
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">Risk Score: <strong className="text-rose-400 font-mono">{selectedBorewell.aiPrediction.riskScore}/100</strong></span>
              <button
                onClick={() => setDetailModalBorewell(selectedBorewell)}
                className="px-2.5 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-[11px] font-semibold transition-all shadow flex items-center gap-1"
              >
                <span>Deep Dive</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>
    </Card>
  );
};
