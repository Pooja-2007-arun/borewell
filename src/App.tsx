import React from 'react';
import { BorewellProvider, useBorewell } from './context/BorewellContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { CriticalAlertBanner } from './components/layout/CriticalAlertBanner';
import { KpiGrid } from './components/kpi/KpiGrid';
import { BorewellMap } from './components/map/BorewellMap';
import { WaterLevelTrend } from './components/charts/WaterLevelTrend';
import { RainfallGroundwaterChart } from './components/charts/RainfallGroundwaterChart';
import { EarlyWarningTable } from './components/warning/EarlyWarningTable';
import { BorewellDetailModal } from './components/warning/BorewellDetailModal';
import { AiPredictionPanel } from './components/ai/AiPredictionPanel';
import { ScenarioSimulator } from './components/ai/ScenarioSimulator';
import { AlertsPanel } from './components/alerts/AlertsPanel';

const DashboardContent: React.FC = () => {
  const { activeView } = useBorewell();

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Navigation View Switcher */}
      <Navigation />

      {/* Main Container */}
      <main className="flex-1 max-w-[1740px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Prominent, Uncluttered Critical Alert Banner */}
        <CriticalAlertBanner />

        {/* Structured KPI Grid with Hero Visual Hierarchy */}
        <section aria-label="System Key Performance Indicators">
          <KpiGrid />
        </section>

        {/* View Conditionals */}
        {activeView === 'overview' && (
          <>
            {/* Row 1: The Visual Centerpiece Map (7 cols) + AI Prediction & What-If Sandbox (5 cols) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 xl:col-span-8">
                <BorewellMap />
              </div>
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                <AiPredictionPanel />
                <ScenarioSimulator />
              </div>
            </section>

            {/* Row 2: Groundwater Trend Recharts (7 cols) + Rainfall Correlation Dual Axis (5 cols) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 xl:col-span-7">
                <WaterLevelTrend />
              </div>
              <div className="lg:col-span-5 xl:col-span-5">
                <RainfallGroundwaterChart />
              </div>
            </section>

            {/* Row 3: Early Warning Prioritization Table (7 cols) + Real-Time Alert Center (5 cols) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 xl:col-span-7">
                <EarlyWarningTable />
              </div>
              <div className="lg:col-span-5 xl:col-span-5">
                <AlertsPanel />
              </div>
            </section>
          </>
        )}

        {activeView === 'map' && (
          <div className="space-y-6">
            <BorewellMap />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WaterLevelTrend />
              <AiPredictionPanel />
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WaterLevelTrend />
              <RainfallGroundwaterChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScenarioSimulator />
              <AiPredictionPanel />
            </div>
          </div>
        )}

        {activeView === 'warnings' && (
          <div className="space-y-6">
            <EarlyWarningTable />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AiPredictionPanel />
              <AlertsPanel />
            </div>
          </div>
        )}

        {activeView === 'alerts' && (
          <div className="space-y-6">
            <AlertsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarlyWarningTable />
              <AiPredictionPanel />
            </div>
          </div>
        )}
      </main>

      {/* Global Telemetry Inspection Modal */}
      <BorewellDetailModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BorewellProvider>
      <DashboardContent />
    </BorewellProvider>
  );
};

export default App;
