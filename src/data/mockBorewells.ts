import { Borewell, BorewellStatus } from '../types/borewell';

// Helper to generate realistic historical + future forecast telemetry
function generateTelemetry(
  baseLevel: number,
  criticalThreshold: number,
  depletionTrend: number, // cm/day (positive means falling deeper mbgl)
  volatility: number
) {
  const readings = [];
  const today = new Date('2026-08-22');
  
  // 30 days historical data
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Past water level with small noise and seasonal depletion curve
    const noise = (Math.sin(i * 0.8) + (Math.random() - 0.5)) * volatility;
    const historicLevel = Number((baseLevel - (i * depletionTrend * 0.01) + noise).toFixed(2));
    
    // Occasional rainfall event 15-20 days ago
    const rainfall = (i === 18 || i === 19 || i === 8) ? Number((15 + Math.random() * 25).toFixed(1)) : (Math.random() > 0.8 ? Number((2 + Math.random() * 5).toFixed(1)) : 0);
    const pumpingHours = Number((6 + Math.random() * 4).toFixed(1));

    readings.push({
      date: dateStr,
      waterLevel: Math.max(5, historicLevel),
      rainfall,
      pumpingHours
    });
  }

  // 30 days future predicted data
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Predicted level accelerating if dry or flattening if stable
    const predictedLevel = Number((baseLevel + (i * depletionTrend * 0.012)).toFixed(2));
    const uncertainty = (i * 0.04);

    readings.push({
      date: dateStr,
      waterLevel: undefined as unknown as number, // not actual
      predictedLevel: Math.min(criticalThreshold + 15, predictedLevel),
      upperConfidence: Number((predictedLevel + uncertainty).toFixed(2)),
      lowerConfidence: Number((predictedLevel - uncertainty).toFixed(2)),
      rainfall: i === 12 || i === 13 ? 8.5 : 0,
      pumpingHours: 7.5
    });
  }

  return readings;
}

export const mockBorewells: Borewell[] = [
  {
    id: "BW-101",
    name: "Whitefield Tech Park Sector 4",
    location: "IT Corridor, Whitefield",
    zone: "Whitefield Urban Aquifer",
    coordinates: [12.9698, 77.7499],
    totalDepth: 280,
    currentLevel: 254.6,
    criticalThreshold: 265.0,
    warningThreshold: 230.0,
    status: "critical",
    waterLevelChange7d: -2.8,
    waterLevelChange30d: -8.4,
    dailyDepletionRate: 40.0,
    pumpingHoursPerDay: 11.5,
    extractionRateLpm: 180,
    aquiferType: "Fractured Granite",
    sensorBattery: 92,
    lastUpdated: "4 mins ago",
    aiPrediction: {
      riskScore: 94,
      predictedDepletionDate: "2026-09-08",
      predictedDaysRemaining: 17,
      confidenceScore: 96,
      sevenDayLevel: 257.4,
      fourteenDayLevel: 260.2,
      thirtyDayLevel: 267.1,
      contributingFactors: [
        { name: "Heavy Commercial Pumping", impact: 42, category: "negative", value: "11.5 hrs/day extraction stress", description: "Excessive draw during daily tech campus peak consumption." },
        { name: "Monsoon Deficit", impact: 28, category: "negative", value: "-46% vs 10-yr seasonal norm", description: "Minimal surface recharge due to asphalt and concrete saturation." },
        { name: "Aquifer Fracturing Limit", impact: 18, category: "negative", value: "Low transmissivity (12 m²/day)", description: "Granite hard-rock formation has restricted lateral recharge." },
        { name: "Rainwater Harvesting Inflow", impact: -8, category: "positive", value: "12% rooftop capture", description: "Partial mitigation from campus recharge shafts." }
      ],
      recommendation: "Immediate 40% pump throttling required. Divert treated greywater to deep recharge bore."
    },
    historicalReadings: generateTelemetry(254.6, 265.0, 40.0, 0.4)
  },
  {
    id: "BW-102",
    name: "Mahadevapura Commercial Hub",
    location: "Outer Ring Road, Mahadevapura",
    zone: "Whitefield Urban Aquifer",
    coordinates: [12.9912, 77.6978],
    totalDepth: 260,
    currentLevel: 238.2,
    criticalThreshold: 248.0,
    warningThreshold: 215.0,
    status: "critical",
    waterLevelChange7d: -2.3,
    waterLevelChange30d: -7.1,
    dailyDepletionRate: 33.0,
    pumpingHoursPerDay: 10.0,
    extractionRateLpm: 160,
    aquiferType: "Fractured Granite",
    sensorBattery: 88,
    lastUpdated: "8 mins ago",
    aiPrediction: {
      riskScore: 89,
      predictedDepletionDate: "2026-09-14",
      predictedDaysRemaining: 23,
      confidenceScore: 94,
      sevenDayLevel: 240.5,
      fourteenDayLevel: 243.1,
      thirtyDayLevel: 249.5,
      contributingFactors: [
        { name: "Intense Extraction", impact: 38, category: "negative", value: "10.0 hrs/day", description: "Continuous pumping for residential high-rises." },
        { name: "Impervious Surface Runoff", impact: 31, category: "negative", value: "88% paved catchment", description: "Zero natural percolation into shallow soil layers." },
        { name: "Historical Cone of Depression", impact: 22, category: "negative", value: "-0.9m/month 3-yr drop", description: "Depleted regional water table." }
      ],
      recommendation: "Schedule alternating pump operation; enforce 5-hour daytime rest cycle."
    },
    historicalReadings: generateTelemetry(238.2, 248.0, 33.0, 0.5)
  },
  {
    id: "BW-103",
    name: "Peenya Industrial Zone Node 7",
    location: "Phase 3, Peenya Industrial Area",
    zone: "Peenya Industrial Aquifer",
    coordinates: [13.0321, 77.5189],
    totalDepth: 240,
    currentLevel: 205.4,
    criticalThreshold: 220.0,
    warningThreshold: 185.0,
    status: "highrisk",
    waterLevelChange7d: -1.7,
    waterLevelChange30d: -5.2,
    dailyDepletionRate: 24.5,
    pumpingHoursPerDay: 9.0,
    extractionRateLpm: 150,
    aquiferType: "Semi-confined Hard Rock",
    sensorBattery: 95,
    lastUpdated: "12 mins ago",
    aiPrediction: {
      riskScore: 78,
      predictedDepletionDate: "2026-10-02",
      predictedDaysRemaining: 41,
      confidenceScore: 91,
      sevenDayLevel: 207.1,
      fourteenDayLevel: 209.0,
      thirtyDayLevel: 213.5,
      contributingFactors: [
        { name: "Manufacturing Demand", impact: 35, category: "negative", value: "9.0 hrs/day", description: "Cooling towers and electroplating plants continuous draw." },
        { name: "Declining Transmissivity", impact: 25, category: "negative", value: "Fracture clogging", description: "Siltation in deeper fractures reducing dynamic yield." },
        { name: "Upstream Check-Dam", impact: -12, category: "positive", value: "+0.4m seasonal buffering", description: "Recent monsoon runoff caught in storm catchment." }
      ],
      recommendation: "Activate secondary recycling units to bring daily extraction below 6 hours."
    },
    historicalReadings: generateTelemetry(205.4, 220.0, 24.5, 0.3)
  },
  {
    id: "BW-104",
    name: "Sarjapur Agricultural Farm #12",
    location: "Sarjapur-Attibele Road",
    zone: "Sarjapur Agricultural Zone",
    coordinates: [12.8598, 77.7854],
    totalDepth: 210,
    currentLevel: 172.8,
    criticalThreshold: 190.0,
    warningThreshold: 160.0,
    status: "highrisk",
    waterLevelChange7d: -1.4,
    waterLevelChange30d: -4.8,
    dailyDepletionRate: 20.0,
    pumpingHoursPerDay: 8.5,
    extractionRateLpm: 120,
    aquiferType: "Unconfined Alluvial",
    sensorBattery: 84,
    lastUpdated: "2 mins ago",
    aiPrediction: {
      riskScore: 72,
      predictedDepletionDate: "2026-10-18",
      predictedDaysRemaining: 57,
      confidenceScore: 89,
      sevenDayLevel: 174.2,
      fourteenDayLevel: 175.9,
      thirtyDayLevel: 180.2,
      contributingFactors: [
        { name: "Agricultural Irrigation", impact: 40, category: "negative", value: "8.5 hrs/day", description: "Flood irrigation for vegetable crop rotation." },
        { name: "Soil Permeability", impact: -18, category: "positive", value: "High sandy-loam percolation", description: "Quick response to localized monsoon showers." }
      ],
      recommendation: "Transition to micro-drip irrigation systems to reduce water usage by 45%."
    },
    historicalReadings: generateTelemetry(172.8, 190.0, 20.0, 0.6)
  },
  {
    id: "BW-105",
    name: "Devanahalli Aerotropolis Green Well",
    location: "Near Airport North Gate, Devanahalli",
    zone: "Devanahalli Rural Belt",
    coordinates: [13.2412, 77.7121],
    totalDepth: 180,
    currentLevel: 88.5,
    criticalThreshold: 155.0,
    warningThreshold: 120.0,
    status: "normal",
    waterLevelChange7d: +0.6,
    waterLevelChange30d: +1.8,
    dailyDepletionRate: -8.0, // recharge
    pumpingHoursPerDay: 3.5,
    extractionRateLpm: 90,
    aquiferType: "Semi-confined Hard Rock",
    sensorBattery: 99,
    lastUpdated: "15 mins ago",
    aiPrediction: {
      riskScore: 18,
      predictedDepletionDate: "2028-04-10",
      predictedDaysRemaining: 580,
      confidenceScore: 98,
      sevenDayLevel: 87.9,
      fourteenDayLevel: 87.4,
      thirtyDayLevel: 86.8,
      contributingFactors: [
        { name: "Active Recharge Lake", impact: -45, category: "positive", value: "+2.4m recharge buffer", description: "Connected to newly revitalized percolation lake." },
        { name: "Controlled Solar Extraction", impact: -25, category: "positive", value: "Regulated 3.5 hrs/day", description: "Strict community water budgeting applied." }
      ],
      recommendation: "Optimal operating conditions. Maintain current sustainable extraction schedule."
    },
    historicalReadings: generateTelemetry(88.5, 155.0, -8.0, 0.2)
  },
  {
    id: "BW-106",
    name: "Bellandur Wetland Perimeter Well",
    location: "Bellandur South Bank",
    zone: "Bellandur Urban Basin",
    coordinates: [12.9265, 77.6741],
    totalDepth: 220,
    currentLevel: 156.4,
    criticalThreshold: 195.0,
    warningThreshold: 165.0,
    status: "warning",
    waterLevelChange7d: -0.9,
    waterLevelChange30d: -3.2,
    dailyDepletionRate: 13.0,
    pumpingHoursPerDay: 7.0,
    extractionRateLpm: 135,
    aquiferType: "Fractured Granite",
    sensorBattery: 91,
    lastUpdated: "6 mins ago",
    aiPrediction: {
      riskScore: 56,
      predictedDepletionDate: "2026-12-10",
      predictedDaysRemaining: 110,
      confidenceScore: 92,
      sevenDayLevel: 157.3,
      fourteenDayLevel: 158.4,
      thirtyDayLevel: 161.2,
      contributingFactors: [
        { name: "Apartment Cluster Demand", impact: 32, category: "negative", value: "7.0 hrs/day", description: "High residential density without localized STP reuse." },
        { name: "Lake Seepage Barrier", impact: 15, category: "negative", value: "Silt layer choking recharge", description: "Sedimentation in lakebed impedes groundwater influx." }
      ],
      recommendation: "De-silt percolation trench and mandate residential STP water for landscaping."
    },
    historicalReadings: generateTelemetry(156.4, 195.0, 13.0, 0.4)
  },
  {
    id: "BW-107",
    name: "Electronic City Phase 1 Main Reservoir",
    location: "Hosur Road, Electronic City",
    zone: "Electronic City Tech Zone",
    coordinates: [12.8452, 77.6602],
    totalDepth: 250,
    currentLevel: 182.1,
    criticalThreshold: 230.0,
    warningThreshold: 190.0,
    status: "warning",
    waterLevelChange7d: -1.1,
    waterLevelChange30d: -3.9,
    dailyDepletionRate: 15.5,
    pumpingHoursPerDay: 7.5,
    extractionRateLpm: 140,
    aquiferType: "Fractured Granite",
    sensorBattery: 89,
    lastUpdated: "10 mins ago",
    aiPrediction: {
      riskScore: 61,
      predictedDepletionDate: "2026-11-25",
      predictedDaysRemaining: 95,
      confidenceScore: 93,
      sevenDayLevel: 183.2,
      fourteenDayLevel: 184.5,
      thirtyDayLevel: 187.8,
      contributingFactors: [
        { name: "Campus Cooling Extraction", impact: 29, category: "negative", value: "7.5 hrs/day", description: "Cooling tower operational demand." },
        { name: "Recharge Well Network", impact: -14, category: "positive", value: "8 injection wells online", description: "Helps buffer against acute dry spells." }
      ],
      recommendation: "Activate dual plumbing and adjust pumping times to off-peak hours."
    },
    historicalReadings: generateTelemetry(182.1, 230.0, 15.5, 0.3)
  },
  {
    id: "BW-108",
    name: "Hennur-Banaswadi Outer Belt",
    location: "Kalyan Nagar, Hennur Main Rd",
    zone: "Hennur Sub-basin",
    coordinates: [13.0245, 77.6432],
    totalDepth: 200,
    currentLevel: 95.3,
    criticalThreshold: 170.0,
    warningThreshold: 135.0,
    status: "normal",
    waterLevelChange7d: +0.4,
    waterLevelChange30d: +0.8,
    dailyDepletionRate: -5.0,
    pumpingHoursPerDay: 4.0,
    extractionRateLpm: 100,
    aquiferType: "Unconfined Alluvial",
    sensorBattery: 97,
    lastUpdated: "18 mins ago",
    aiPrediction: {
      riskScore: 22,
      predictedDepletionDate: "2028-02-14",
      predictedDaysRemaining: 540,
      confidenceScore: 95,
      sevenDayLevel: 95.0,
      fourteenDayLevel: 94.7,
      thirtyDayLevel: 94.2,
      contributingFactors: [
        { name: "Stormwater Swale Infiltration", impact: -35, category: "positive", value: "+1.2m recharge", description: "Green corridor stormwater retention channels active." }
      ],
      recommendation: "Maintain seasonal recharge flow channels clean of plastic debris."
    },
    historicalReadings: generateTelemetry(95.3, 170.0, -5.0, 0.3)
  },
  {
    id: "BW-109",
    name: "Kolar Border Agricultural Cluster 3",
    location: "Hoskote-Kolar Highway",
    zone: "Kolar Drought Sensitive Belt",
    coordinates: [13.1287, 77.8923],
    totalDepth: 320,
    currentLevel: 298.5,
    criticalThreshold: 310.0,
    warningThreshold: 275.0,
    status: "critical",
    waterLevelChange7d: -3.5,
    waterLevelChange30d: -11.2,
    dailyDepletionRate: 50.0,
    pumpingHoursPerDay: 13.0,
    extractionRateLpm: 210,
    aquiferType: "Deep Karstic Aquifer",
    sensorBattery: 82,
    lastUpdated: "Just now",
    aiPrediction: {
      riskScore: 98,
      predictedDepletionDate: "2026-09-02",
      predictedDaysRemaining: 11,
      confidenceScore: 97,
      sevenDayLevel: 302.0,
      fourteenDayLevel: 305.8,
      thirtyDayLevel: 313.2,
      contributingFactors: [
        { name: "Excessive Bore Overdraft", impact: 52, category: "negative", value: "13 hrs/day nonstop", description: "Overdrafting from deep fracture zone (>300m)." },
        { name: "Severe Rain Deficit", impact: 33, category: "negative", value: "-62% rainfall deficit", description: "Semi-arid drought region with minimal replenishment." },
        { name: "Deep Bedrock Collapse Risk", impact: 20, category: "negative", value: "Aquifer compaction", description: "Irreversible loss of pore storage in deep granite." }
      ],
      recommendation: "CRITICAL: Enact immediate emergency moratorium on extraction. Risk of permanent pump burnout."
    },
    historicalReadings: generateTelemetry(298.5, 310.0, 50.0, 0.7)
  },
  {
    id: "BW-110",
    name: "Yelahanka Airbase Buffer Borewell",
    location: "BBMP Ward 4, Yelahanka",
    zone: "Devanahalli Rural Belt",
    coordinates: [13.1007, 77.5963],
    totalDepth: 210,
    currentLevel: 112.4,
    criticalThreshold: 180.0,
    warningThreshold: 145.0,
    status: "normal",
    waterLevelChange7d: +0.2,
    waterLevelChange30d: -0.4,
    dailyDepletionRate: 2.0,
    pumpingHoursPerDay: 5.0,
    extractionRateLpm: 110,
    aquiferType: "Semi-confined Hard Rock",
    sensorBattery: 94,
    lastUpdated: "5 mins ago",
    aiPrediction: {
      riskScore: 28,
      predictedDepletionDate: "2027-11-20",
      predictedDaysRemaining: 450,
      confidenceScore: 90,
      sevenDayLevel: 112.6,
      fourteenDayLevel: 112.9,
      thirtyDayLevel: 113.8,
      contributingFactors: [
        { name: "Lake Rejuvenation Impact", impact: -28, category: "positive", value: "Allalasandra Lake recharge", description: "Percolation zone within 400m radius." }
      ],
      recommendation: "Safe operational zone. Regular quarterly water quality testing advised."
    },
    historicalReadings: generateTelemetry(112.4, 180.0, 2.0, 0.2)
  },
  {
    id: "BW-111",
    name: "Koramangala 4th Block Community Well",
    location: "80 Feet Road, Koramangala",
    zone: "Bellandur Urban Basin",
    coordinates: [12.9352, 77.6245],
    totalDepth: 230,
    currentLevel: 168.9,
    criticalThreshold: 205.0,
    warningThreshold: 175.0,
    status: "warning",
    waterLevelChange7d: -1.0,
    waterLevelChange30d: -3.5,
    dailyDepletionRate: 14.2,
    pumpingHoursPerDay: 7.2,
    extractionRateLpm: 125,
    aquiferType: "Fractured Granite",
    sensorBattery: 90,
    lastUpdated: "14 mins ago",
    aiPrediction: {
      riskScore: 59,
      predictedDepletionDate: "2026-12-04",
      predictedDaysRemaining: 104,
      confidenceScore: 91,
      sevenDayLevel: 170.0,
      fourteenDayLevel: 171.3,
      thirtyDayLevel: 174.5,
      contributingFactors: [
        { name: "Commercial Cafes & Kitchens", impact: 31, category: "negative", value: "7.2 hrs/day", description: "Concentrated retail water requirements." }
      ],
      recommendation: "Promote community rainwater harvesting trenches in neighborhood parks."
    },
    historicalReadings: generateTelemetry(168.9, 205.0, 14.2, 0.4)
  },
  {
    id: "BW-112",
    name: "Jigani Industrial Corridor Well 2",
    location: "Jigani Industrial Area Phase 1",
    zone: "Electronic City Tech Zone",
    coordinates: [12.7823, 77.6391],
    totalDepth: 270,
    currentLevel: 224.5,
    criticalThreshold: 250.0,
    warningThreshold: 210.0,
    status: "highrisk",
    waterLevelChange7d: -1.9,
    waterLevelChange30d: -6.0,
    dailyDepletionRate: 27.0,
    pumpingHoursPerDay: 9.5,
    extractionRateLpm: 170,
    aquiferType: "Semi-confined Hard Rock",
    sensorBattery: 86,
    lastUpdated: "11 mins ago",
    aiPrediction: {
      riskScore: 82,
      predictedDepletionDate: "2026-09-24",
      predictedDaysRemaining: 33,
      confidenceScore: 93,
      sevenDayLevel: 226.4,
      fourteenDayLevel: 228.7,
      thirtyDayLevel: 234.1,
      contributingFactors: [
        { name: "Granite Quarry Drawdown", impact: 37, category: "negative", value: "Deep dewatering nearby", description: "Quarrying operations depressing localized piezometric head." },
        { name: "High Extraction Rate", impact: 32, category: "negative", value: "170 LPM sustained", description: "Heavy industrial processing." }
      ],
      recommendation: "Implement water recycling loop to reduce intake by 30 LPM."
    },
    historicalReadings: generateTelemetry(224.5, 250.0, 27.0, 0.4)
  },
  {
    id: "BW-113",
    name: "Varthur Lake Inflow Perimeter",
    location: "Varthur Main Road",
    zone: "Whitefield Urban Aquifer",
    coordinates: [12.9412, 77.7189],
    totalDepth: 240,
    currentLevel: 189.4,
    criticalThreshold: 225.0,
    warningThreshold: 180.0,
    status: "warning",
    waterLevelChange7d: -1.2,
    waterLevelChange30d: -4.1,
    dailyDepletionRate: 17.0,
    pumpingHoursPerDay: 8.0,
    extractionRateLpm: 140,
    aquiferType: "Unconfined Alluvial",
    sensorBattery: 93,
    lastUpdated: "7 mins ago",
    aiPrediction: {
      riskScore: 64,
      predictedDepletionDate: "2026-11-12",
      predictedDaysRemaining: 82,
      confidenceScore: 88,
      sevenDayLevel: 190.6,
      fourteenDayLevel: 192.1,
      thirtyDayLevel: 195.8,
      contributingFactors: [
        { name: "Rapid Construction Dewatering", impact: 33, category: "negative", value: "8.0 hrs/day", description: "Excavation and foundation work in adjacent plots." }
      ],
      recommendation: "Regulate construction water extraction and mandate non-potable supply."
    },
    historicalReadings: generateTelemetry(189.4, 225.0, 17.0, 0.5)
  },
  {
    id: "BW-114",
    name: "Rajajinagar Industrial Estate Node 4",
    location: "Rajajinagar 1st Block",
    zone: "Peenya Industrial Aquifer",
    coordinates: [12.9984, 77.5532],
    totalDepth: 220,
    currentLevel: 142.1,
    criticalThreshold: 190.0,
    warningThreshold: 155.0,
    status: "normal",
    waterLevelChange7d: -0.3,
    waterLevelChange30d: -1.2,
    dailyDepletionRate: 4.5,
    pumpingHoursPerDay: 5.5,
    extractionRateLpm: 105,
    aquiferType: "Fractured Granite",
    sensorBattery: 96,
    lastUpdated: "21 mins ago",
    aiPrediction: {
      riskScore: 34,
      predictedDepletionDate: "2027-08-30",
      predictedDaysRemaining: 373,
      confidenceScore: 92,
      sevenDayLevel: 142.4,
      fourteenDayLevel: 142.8,
      thirtyDayLevel: 143.9,
      contributingFactors: [
        { name: "BWSSB Piped Supply Synergy", impact: -22, category: "positive", value: "Reduced bore reliance", description: "Municipal piped water network active in daytime." }
      ],
      recommendation: "System stable. Continue telemetry monitoring."
    },
    historicalReadings: generateTelemetry(142.1, 190.0, 4.5, 0.2)
  },
  {
    id: "BW-115",
    name: "Attibele Border Agro-Hub",
    location: "Attibele Industrial Road",
    zone: "Sarjapur Agricultural Zone",
    coordinates: [12.7789, 77.7712],
    totalDepth: 250,
    currentLevel: 215.3,
    criticalThreshold: 235.0,
    warningThreshold: 200.0,
    status: "highrisk",
    waterLevelChange7d: -2.1,
    waterLevelChange30d: -6.8,
    dailyDepletionRate: 30.0,
    pumpingHoursPerDay: 9.8,
    extractionRateLpm: 165,
    aquiferType: "Semi-confined Hard Rock",
    sensorBattery: 87,
    lastUpdated: "3 mins ago",
    aiPrediction: {
      riskScore: 84,
      predictedDepletionDate: "2026-09-20",
      predictedDaysRemaining: 29,
      confidenceScore: 95,
      sevenDayLevel: 217.4,
      fourteenDayLevel: 219.8,
      thirtyDayLevel: 225.5,
      contributingFactors: [
        { name: "Dual Farm-Factory Extraction", impact: 41, category: "negative", value: "9.8 hrs/day", description: "Overlapping agriculture and packaging plant draw." }
      ],
      recommendation: "Shift farming schedule to night hours and install auto-cutoff flow meters."
    },
    historicalReadings: generateTelemetry(215.3, 235.0, 30.0, 0.4)
  },
  {
    id: "BW-116",
    name: "Bagalur Agricultural Borewell #4",
    location: "Bagalur Main Road",
    zone: "Devanahalli Rural Belt",
    coordinates: [13.1345, 77.6789],
    totalDepth: 190,
    currentLevel: 104.2,
    criticalThreshold: 165.0,
    warningThreshold: 130.0,
    status: "normal",
    waterLevelChange7d: +0.5,
    waterLevelChange30d: +1.1,
    dailyDepletionRate: -7.0,
    pumpingHoursPerDay: 4.2,
    extractionRateLpm: 95,
    aquiferType: "Unconfined Alluvial",
    sensorBattery: 98,
    lastUpdated: "9 mins ago",
    aiPrediction: {
      riskScore: 20,
      predictedDepletionDate: "2028-01-19",
      predictedDaysRemaining: 515,
      confidenceScore: 96,
      sevenDayLevel: 103.7,
      fourteenDayLevel: 103.2,
      thirtyDayLevel: 102.5,
      contributingFactors: [
        { name: "Watershed Bunding Program", impact: -38, category: "positive", value: "+1.9m water table rise", description: "Farm pond saturation enhancing recharge zone." }
      ],
      recommendation: "Exemplary recharge basin. Expand model to adjacent farm plots."
    },
    historicalReadings: generateTelemetry(104.2, 165.0, -7.0, 0.3)
  },
  {
    id: "BW-117",
    name: "Marathahalli Multiplex & Mall Well",
    location: "HAL Airport Road, Marathahalli",
    zone: "Whitefield Urban Aquifer",
    coordinates: [12.9567, 77.7011],
    totalDepth: 260,
    currentLevel: 228.6,
    criticalThreshold: 245.0,
    warningThreshold: 210.0,
    status: "critical",
    waterLevelChange7d: -2.5,
    waterLevelChange30d: -7.9,
    dailyDepletionRate: 35.7,
    pumpingHoursPerDay: 11.0,
    extractionRateLpm: 175,
    aquiferType: "Fractured Granite",
    sensorBattery: 85,
    lastUpdated: "1 min ago",
    aiPrediction: {
      riskScore: 91,
      predictedDepletionDate: "2026-09-12",
      predictedDaysRemaining: 21,
      confidenceScore: 96,
      sevenDayLevel: 231.1,
      fourteenDayLevel: 234.0,
      thirtyDayLevel: 240.5,
      contributingFactors: [
        { name: "Commercial Air Conditioning Draw", impact: 44, category: "negative", value: "11.0 hrs/day", description: "Continuous central chiller feed." },
        { name: "High Runoff Pavement", impact: 28, category: "negative", value: "95% impervious", description: "No infiltration zone within 1.2km." }
      ],
      recommendation: "Switch HVAC cooling towers to closed-loop condenser water recycling immediately."
    },
    historicalReadings: generateTelemetry(228.6, 245.0, 35.7, 0.5)
  },
  {
    id: "BW-118",
    name: "Channasandra Rural Borewell",
    location: "Channasandra, Kadugodi Rd",
    zone: "Whitefield Urban Aquifer",
    coordinates: [12.9889, 77.7654],
    totalDepth: 220,
    currentLevel: 162.3,
    criticalThreshold: 195.0,
    warningThreshold: 160.0,
    status: "warning",
    waterLevelChange7d: -1.3,
    waterLevelChange30d: -4.2,
    dailyDepletionRate: 18.5,
    pumpingHoursPerDay: 7.8,
    extractionRateLpm: 130,
    aquiferType: "Semi-confined Hard Rock",
    sensorBattery: 92,
    lastUpdated: "16 mins ago",
    aiPrediction: {
      riskScore: 67,
      predictedDepletionDate: "2026-10-29",
      predictedDaysRemaining: 68,
      confidenceScore: 89,
      sevenDayLevel: 163.6,
      fourteenDayLevel: 165.2,
      thirtyDayLevel: 168.9,
      contributingFactors: [
        { name: "Rapid Urban Sprawl", impact: 36, category: "negative", value: "7.8 hrs/day", description: "Transition from agricultural to tanker commercial extraction." }
      ],
      recommendation: "Cap tanker extraction volume to 5 trips per day."
    },
    historicalReadings: generateTelemetry(162.3, 195.0, 18.5, 0.4)
  },
  {
    id: "BW-119",
    name: "Yeshwanthpur Railway Yard Well",
    location: "Yeshwanthpur West",
    zone: "Peenya Industrial Aquifer",
    coordinates: [13.0212, 77.5498],
    totalDepth: 210,
    currentLevel: 135.0,
    criticalThreshold: 185.0,
    warningThreshold: 150.0,
    status: "normal",
    waterLevelChange7d: -0.4,
    waterLevelChange30d: -1.5,
    dailyDepletionRate: 5.7,
    pumpingHoursPerDay: 6.0,
    extractionRateLpm: 115,
    aquiferType: "Fractured Granite",
    sensorBattery: 94,
    lastUpdated: "19 mins ago",
    aiPrediction: {
      riskScore: 31,
      predictedDepletionDate: "2027-09-15",
      predictedDaysRemaining: 389,
      confidenceScore: 91,
      sevenDayLevel: 135.4,
      fourteenDayLevel: 135.9,
      thirtyDayLevel: 137.2,
      contributingFactors: [
        { name: "Railway Yard Rain Harvesting", impact: -24, category: "positive", value: "+0.8m recharge", description: "Large catchment roof feeding groundwater percolation pits." }
      ],
      recommendation: "Telemetry stable. Clean pre-filters prior to next monsoon cycle."
    },
    historicalReadings: generateTelemetry(135.0, 185.0, 5.7, 0.2)
  },
  {
    id: "BW-120",
    name: "Harlur Road Lake Basin Well",
    location: "Harlur Road, Off Sarjapur Rd",
    zone: "Bellandur Urban Basin",
    coordinates: [12.9012, 77.6623],
    totalDepth: 240,
    currentLevel: 194.2,
    criticalThreshold: 220.0,
    warningThreshold: 185.0,
    status: "highrisk",
    waterLevelChange7d: -1.8,
    waterLevelChange30d: -5.7,
    dailyDepletionRate: 25.7,
    pumpingHoursPerDay: 9.0,
    extractionRateLpm: 155,
    aquiferType: "Fractured Granite",
    sensorBattery: 89,
    lastUpdated: "13 mins ago",
    aiPrediction: {
      riskScore: 79,
      predictedDepletionDate: "2026-09-29",
      predictedDaysRemaining: 38,
      confidenceScore: 93,
      sevenDayLevel: 196.0,
      fourteenDayLevel: 198.1,
      thirtyDayLevel: 203.2,
      contributingFactors: [
        { name: "Gated Community Extraction", impact: 38, category: "negative", value: "9.0 hrs/day", description: "Heavy household consumption with multiple high-pressure pumps." },
        { name: "Encroached Wetland Margin", impact: 26, category: "negative", value: "Recharge cutoff", description: "Natural drainage stream channeled into concrete storm drain." }
      ],
      recommendation: "Construct community percolation pits along outer boundary wall."
    },
    historicalReadings: generateTelemetry(194.2, 220.0, 25.7, 0.4)
  },
  {
    id: "BW-121",
    name: "Nandi Hills Foothills Springwell",
    location: "Nandi Hills Road, Chikkaballapur Belt",
    zone: "Devanahalli Rural Belt",
    coordinates: [13.3702, 77.6834],
    totalDepth: 170,
    currentLevel: 62.4,
    criticalThreshold: 140.0,
    warningThreshold: 105.0,
    status: "normal",
    waterLevelChange7d: +1.2,
    waterLevelChange30d: +3.8,
    dailyDepletionRate: -15.0,
    pumpingHoursPerDay: 2.8,
    extractionRateLpm: 80,
    aquiferType: "Semi-confined Hard Rock",
    sensorBattery: 99,
    lastUpdated: "25 mins ago",
    aiPrediction: {
      riskScore: 12,
      predictedDepletionDate: "2029-06-15",
      predictedDaysRemaining: 1028,
      confidenceScore: 99,
      sevenDayLevel: 61.2,
      fourteenDayLevel: 60.1,
      thirtyDayLevel: 58.4,
      contributingFactors: [
        { name: "Forested Hill Slope Recharge", impact: -62, category: "positive", value: "+4.5m natural inflow", description: "Vegetative cover provides high natural subterranean percolation." }
      ],
      recommendation: "Excellent aquifer resilience. Recommended as regional baseline monitoring control well."
    },
    historicalReadings: generateTelemetry(62.4, 140.0, -15.0, 0.2)
  },
  {
    id: "BW-122",
    name: "Malur Semi-Arid Agricultural Node",
    location: "Malur Border Highway",
    zone: "Kolar Drought Sensitive Belt",
    coordinates: [13.0012, 77.9401],
    totalDepth: 310,
    currentLevel: 282.4,
    criticalThreshold: 298.0,
    warningThreshold: 260.0,
    status: "highrisk",
    waterLevelChange7d: -2.4,
    waterLevelChange30d: -7.5,
    dailyDepletionRate: 34.0,
    pumpingHoursPerDay: 10.5,
    extractionRateLpm: 185,
    aquiferType: "Deep Karstic Aquifer",
    sensorBattery: 83,
    lastUpdated: "17 mins ago",
    aiPrediction: {
      riskScore: 86,
      predictedDepletionDate: "2026-09-18",
      predictedDaysRemaining: 27,
      confidenceScore: 94,
      sevenDayLevel: 284.8,
      fourteenDayLevel: 287.5,
      thirtyDayLevel: 294.0,
      contributingFactors: [
        { name: "Paddy & Sugar Irrigation", impact: 45, category: "negative", value: "10.5 hrs/day", description: "High-water crop cultivation in drought-prone basin." },
        { name: "Clay Hardpan Layer", impact: 29, category: "negative", value: "Low infiltration rate", description: "Topsoil prevents fast rainwater soakage into bedrock." }
      ],
      recommendation: "Shift to millet cultivation and construct contour trenches along slope."
    },
    historicalReadings: generateTelemetry(282.4, 298.0, 34.0, 0.5)
  }
];

export const mockZones = [
  "All Zones",
  "Whitefield Urban Aquifer",
  "Peenya Industrial Aquifer",
  "Bellandur Urban Basin",
  "Sarjapur Agricultural Zone",
  "Devanahalli Rural Belt",
  "Electronic City Tech Zone",
  "Kolar Drought Sensitive Belt"
];
