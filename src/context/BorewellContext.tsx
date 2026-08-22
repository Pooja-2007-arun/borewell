import React, { createContext, useContext, useState, useMemo } from 'react';
import { Borewell, BorewellAlert, DashboardKPIs } from '../types/borewell';
import { mockBorewells, mockZones } from '../data/mockBorewells';
import { mockAlerts } from '../data/mockAlerts';
import { calculateDashboardKPIs } from '../utils/calculations';

interface SimulationState {
  enabled: boolean;
  extractionChange: number; // -50% to +50%
  rechargeBoost: number;    // 0% to 100%
}

interface BorewellContextType {
  borewells: Borewell[];
  allBorewells: Borewell[];
  selectedBorewell: Borewell;
  setSelectedBorewell: (borewell: Borewell) => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  zones: string[];
  alerts: BorewellAlert[];
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  kpis: DashboardKPIs;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  lastUpdated: string;
  isSyncing: boolean;
  triggerRefresh: () => void;
  simulation: SimulationState;
  setSimulation: React.Dispatch<React.SetStateAction<SimulationState>>;
  detailModalBorewell: Borewell | null;
  setDetailModalBorewell: (borewell: Borewell | null) => void;
  activeView: 'overview' | 'map' | 'analytics' | 'warnings' | 'alerts';
  setActiveView: (view: 'overview' | 'map' | 'analytics' | 'warnings' | 'alerts') => void;
}

const BorewellContext = createContext<BorewellContextType | undefined>(undefined);

export const BorewellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allBorewells, setAllBorewells] = useState<Borewell[]>(mockBorewells);
  const [selectedBorewellId, setSelectedBorewellId] = useState<string>('BW-101');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [alerts, setAlerts] = useState<BorewellAlert[]>(mockAlerts);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [detailModalBorewell, setDetailModalBorewell] = useState<Borewell | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'map' | 'analytics' | 'warnings' | 'alerts'>('overview');

  const [simulation, setSimulation] = useState<SimulationState>({
    enabled: false,
    extractionChange: 0,
    rechargeBoost: 0,
  });

  // Filter borewells by selected zone
  const borewells = useMemo(() => {
    if (selectedZone === 'All Zones') {
      return allBorewells;
    }
    return allBorewells.filter((b) => b.zone === selectedZone);
  }, [allBorewells, selectedZone]);

  // Keep selected borewell object
  const selectedBorewell = useMemo(() => {
    const found = allBorewells.find((b) => b.id === selectedBorewellId);
    return found || allBorewells[0];
  }, [allBorewells, selectedBorewellId]);

  const setSelectedBorewell = (borewell: Borewell) => {
    setSelectedBorewellId(borewell.id);
  };

  const kpis = useMemo(() => calculateDashboardKPIs(borewells), [borewells]);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const triggerRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastUpdated('Just now');
      setIsSyncing(false);
    }, 800);
  };

  return (
    <BorewellContext.Provider
      value={{
        borewells,
        allBorewells,
        selectedBorewell,
        setSelectedBorewell,
        selectedZone,
        setSelectedZone,
        zones: mockZones,
        alerts,
        acknowledgeAlert,
        dismissAlert,
        kpis,
        isOnline,
        setIsOnline,
        lastUpdated,
        isSyncing,
        triggerRefresh,
        simulation,
        setSimulation,
        detailModalBorewell,
        setDetailModalBorewell,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </BorewellContext.Provider>
  );
};

export const useBorewell = () => {
  const context = useContext(BorewellContext);
  if (!context) {
    throw new Error('useBorewell must be used within a BorewellProvider');
  }
  return context;
};
