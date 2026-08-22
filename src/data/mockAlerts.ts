import { BorewellAlert } from '../types/borewell';

export const mockAlerts: BorewellAlert[] = [
  {
    id: "ALT-801",
    borewellId: "BW-109",
    borewellName: "Kolar Border Agricultural Cluster 3",
    zone: "Kolar Drought Sensitive Belt",
    type: "critical",
    title: "Critical Depletion Imminent (11 Days Remaining)",
    message: "Water level is at 298.5 mbgl, only 11.5m above well bottom. Pump cavitation and catastrophic dry-run risk within 11 days at current extraction rate.",
    timestamp: "10 mins ago",
    acknowledged: false,
    metric: "298.5 mbgl / 310m Depth"
  },
  {
    id: "ALT-802",
    borewellId: "BW-101",
    borewellName: "Whitefield Tech Park Sector 4",
    zone: "Whitefield Urban Aquifer",
    type: "critical",
    title: "Accelerated Drawdown Rate Exceeded",
    message: "Extraction velocity spiked to 40.0 cm/day. Water table reached 254.6 mbgl. AI predicts breach of safety threshold on Sep 8, 2026.",
    timestamp: "24 mins ago",
    acknowledged: false,
    metric: "-2.8m in 7 days"
  },
  {
    id: "ALT-803",
    borewellId: "BW-117",
    borewellName: "Marathahalli Multiplex & Mall Well",
    zone: "Whitefield Urban Aquifer",
    type: "critical",
    title: "High Pumping Stress Warning (11.0 hrs/day)",
    message: "Continuous commercial cooling draw without scheduled rest cycle. Aquifer cone of depression widening to 450m radius.",
    timestamp: "45 mins ago",
    acknowledged: false,
    metric: "Risk Score: 91/100"
  },
  {
    id: "ALT-804",
    borewellId: "BW-115",
    borewellName: "Attibele Border Agro-Hub",
    zone: "Sarjapur Agricultural Zone",
    type: "highrisk",
    title: "Aquifer Storage Capacity < 15%",
    message: "Dynamic water column reduced to 19.7m. Neighboring telemetry nodes indicate regional fracture pressure drop.",
    timestamp: "1 hour ago",
    acknowledged: false,
    metric: "215.3 mbgl (High Risk)"
  },
  {
    id: "ALT-805",
    borewellId: "BW-112",
    borewellName: "Jigani Industrial Corridor Well 2",
    zone: "Electronic City Tech Zone",
    type: "highrisk",
    title: "Drawdown Anomaly Detected",
    message: "Piezometric head dropping 27 cm/day despite reduced industrial shifts. Potential localized fracture dewatering.",
    timestamp: "2 hours ago",
    acknowledged: false,
    metric: "224.5 mbgl"
  },
  {
    id: "ALT-806",
    borewellId: "BW-121",
    borewellName: "Nandi Hills Foothills Springwell",
    zone: "Devanahalli Rural Belt",
    type: "recharge",
    title: "Aquifer Recovery: +1.2m Recharge Logged",
    message: "Natural vegetative catchment registered substantial groundwater recharge following 38mm localized cloudburst.",
    timestamp: "3 hours ago",
    acknowledged: true,
    metric: "+1.2m 7-day gain"
  },
  {
    id: "ALT-807",
    borewellId: "BW-105",
    borewellName: "Devanahalli Aerotropolis Green Well",
    zone: "Devanahalli Rural Belt",
    type: "recharge",
    title: "Sustainable Yield Equilibrium Reached",
    message: "Recharge lake infiltration matched daily extraction volume. Aquifer level stabilized at 88.5 mbgl.",
    timestamp: "5 hours ago",
    acknowledged: true,
    metric: "Recharge +0.6m"
  },
  {
    id: "ALT-808",
    borewellId: "BW-116",
    borewellName: "Bagalur Agricultural Borewell #4",
    zone: "Devanahalli Rural Belt",
    type: "recharge",
    title: "Farm Pond Bunding Positive Impact",
    message: "Water table elevated by +0.5m. Percolation velocity measured at 4.2 cm/hr in upper sandy-loam stratum.",
    timestamp: "6 hours ago",
    acknowledged: true,
    metric: "+0.5m gain"
  },
  {
    id: "ALT-809",
    borewellId: "BW-109",
    borewellName: "Kolar Border Agricultural Cluster 3",
    zone: "Kolar Drought Sensitive Belt",
    type: "maintenance",
    title: "Telemetry Sensor Battery Low (82%)",
    message: "Solar charging panel on transmitter mast experiencing dust accumulation. Maintenance inspection recommended.",
    timestamp: "7 hours ago",
    acknowledged: false,
    metric: "Battery 82%"
  }
];
