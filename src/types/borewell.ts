export type BorewellStatus = 'normal' | 'warning' | 'highrisk' | 'critical';

export interface TelemetryReading {
  date: string;
  waterLevel: number; // in meters below ground level (mbgl)
  predictedLevel?: number; // for future forecast points
  upperConfidence?: number;
  lowerConfidence?: number;
  rainfall?: number; // in mm
  pumpingHours?: number; // hours/day
}

export interface AIFactor {
  name: string;
  impact: number; // percentage / weight (-100 to +100)
  description: string;
  category: 'negative' | 'positive';
  value: string;
}

export interface AIPrediction {
  riskScore: number; // 0 to 100
  predictedDepletionDate: string;
  predictedDaysRemaining: number;
  confidenceScore: number; // 0 to 100
  sevenDayLevel: number;
  fourteenDayLevel: number;
  thirtyDayLevel: number;
  contributingFactors: AIFactor[];
  recommendation: string;
}

export interface Borewell {
  id: string;
  name: string;
  location: string;
  zone: string;
  coordinates: [number, number]; // [lat, lng]
  totalDepth: number; // in meters
  currentLevel: number; // in meters below ground level (mbgl)
  criticalThreshold: number; // mbgl where well goes dry / pump cavitation occurs
  warningThreshold: number; // mbgl warning mark
  status: BorewellStatus;
  waterLevelChange7d: number; // delta in meters (+ is recharge, - is depletion)
  waterLevelChange30d: number;
  dailyDepletionRate: number; // cm/day
  pumpingHoursPerDay: number;
  extractionRateLpm: number; // Liters per minute
  aquiferType: 'Fractured Granite' | 'Unconfined Alluvial' | 'Semi-confined Hard Rock' | 'Deep Karstic Aquifer';
  sensorBattery: number; // 0 - 100%
  lastUpdated: string;
  aiPrediction: AIPrediction;
  historicalReadings: TelemetryReading[];
}

export interface BorewellAlert {
  id: string;
  borewellId: string;
  borewellName: string;
  zone: string;
  type: 'critical' | 'highrisk' | 'recharge' | 'maintenance';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  metric?: string;
}

export interface RainfallCorrelationPoint {
  date: string;
  rainfall: number; // mm
  avgWaterLevel: number; // mbgl
  rechargeEfficiency: number; // %
}

export interface DashboardKPIs {
  totalBorewells: number;
  normalCount: number;
  warningCount: number;
  criticalCount: number;
  highRiskCount: number;
  averageWaterLevel: number;
  averageDailyDepletion: number;
}
