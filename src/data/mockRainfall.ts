import { RainfallCorrelationPoint } from '../types/borewell';

// 60-day historical time-series of precipitation vs aggregate groundwater response
export const mockRainfallCorrelation: RainfallCorrelationPoint[] = [
  { date: 'Jun 24', rainfall: 4.2, avgWaterLevel: 184.2, rechargeEfficiency: 22 },
  { date: 'Jun 28', rainfall: 0.0, avgWaterLevel: 185.0, rechargeEfficiency: 18 },
  { date: 'Jul 02', rainfall: 12.5, avgWaterLevel: 185.6, rechargeEfficiency: 35 },
  { date: 'Jul 06', rainfall: 38.4, avgWaterLevel: 184.1, rechargeEfficiency: 68 },
  { date: 'Jul 10', rainfall: 45.0, avgWaterLevel: 181.8, rechargeEfficiency: 82 },
  { date: 'Jul 14', rainfall: 22.1, avgWaterLevel: 179.6, rechargeEfficiency: 75 },
  { date: 'Jul 18', rainfall: 5.4, avgWaterLevel: 178.9, rechargeEfficiency: 60 },
  { date: 'Jul 22', rainfall: 0.0, avgWaterLevel: 179.8, rechargeEfficiency: 45 },
  { date: 'Jul 26', rainfall: 2.1, avgWaterLevel: 181.2, rechargeEfficiency: 30 },
  { date: 'Jul 30', rainfall: 0.0, avgWaterLevel: 182.7, rechargeEfficiency: 20 },
  { date: 'Aug 03', rainfall: 18.2, avgWaterLevel: 183.1, rechargeEfficiency: 48 },
  { date: 'Aug 07', rainfall: 28.6, avgWaterLevel: 181.4, rechargeEfficiency: 62 },
  { date: 'Aug 11', rainfall: 8.0, avgWaterLevel: 180.9, rechargeEfficiency: 52 },
  { date: 'Aug 15', rainfall: 0.0, avgWaterLevel: 182.3, rechargeEfficiency: 38 },
  { date: 'Aug 19', rainfall: 1.5, avgWaterLevel: 183.8, rechargeEfficiency: 25 },
  { date: 'Aug 22', rainfall: 0.0, avgWaterLevel: 185.4, rechargeEfficiency: 18 }
];
