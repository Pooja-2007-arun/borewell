<<<<<<< HEAD
# borewell
=======
# Hyperlocal Borewell Depletion Early Warning System

A modern, responsive, environmental IoT web dashboard designed to monitor groundwater levels across multiple borewells, detect depletion trends, predict critical threshold breaches using AI explainability models, and provide actionable early warnings.

---

## 🚀 Features

- **Interactive Geospatial Centerpiece Map**: Powered by Leaflet & CartoDB Dark Matter tiles, featuring color-coded pulsating status markers (Safe, Warning, High Risk, Critical), on-map quick filter chips, and floating telemetry HUD cards.
- **Hierarchical Environmental KPIs**: Instant visibility into critical/high-risk count, active mesh nodes, safe/warning status breakdown, average groundwater depth (mbgl), and daily depletion velocity (cm/day).
- **Critical Warning Banner**: High-priority alert banner highlighting immediate wellhead bottom breaches with one-click deep-dive inspection.
- **Groundwater Level Trend & AI Forecast**: Recharts visualization rendering 30-day historical actuals alongside 30-day AI predictive trajectory, with danger threshold guide lines.
- **Hydrological Correlation**: Dual-axis rainfall precipitation (mm) vs groundwater table response (mbgl) chart analyzing recharge latency.
- **Early Warning Prioritization Table**: Priority-ranked table with search, sorting, multi-horizon countdown timers (`11 Days Remaining`), and telemetry inspection.
- **Explainable AI (XAI) & "What-If" Scenario Simulator**: Radial risk score gauge, multi-horizon forecast cards (7D, 14D, 30D), feature importance breakdown (Pumping, Monsoon Deficit, Transmissivity, Recharge), and live interactive sliders for pump curtailment and artificial recharge.
- **Real-Time Alert Feed & Deep Dive Modal**: Priority notification management with acknowledge/dismiss actions.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Glassmorphism UI
- **Mapping**: Leaflet, OpenStreetMap / CartoDB Dark Matter
- **Data Visualization**: Recharts
- **Icons**: Lucide React

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Pooja-2007-arun/borewell.git
cd borewell
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📄 License
MIT License.
>>>>>>> e91e43f (feat: initial commit of Hyperlocal Borewell Depletion Early Warning System dashboard)
