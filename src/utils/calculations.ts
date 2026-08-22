import { Borewell, DashboardKPIs } from '../types/borewell';

export function calculateDashboardKPIs(borewells: Borewell[]): DashboardKPIs {
  if (!borewells.length) {
    return {
      totalBorewells: 0,
      normalCount: 0,
      warningCount: 0,
      criticalCount: 0,
      highRiskCount: 0,
      averageWaterLevel: 0,
      averageDailyDepletion: 0,
    };
  }

  const normalCount = borewells.filter((b) => b.status === 'normal').length;
  const warningCount = borewells.filter((b) => b.status === 'warning').length;
  const highRiskCount = borewells.filter((b) => b.status === 'highrisk').length;
  const criticalCount = borewells.filter((b) => b.status === 'critical').length;

  const totalWaterLevel = borewells.reduce((acc, b) => acc + b.currentLevel, 0);
  const totalDepletion = borewells.reduce((acc, b) => acc + b.dailyDepletionRate, 0);

  return {
    totalBorewells: borewells.length,
    normalCount,
    warningCount,
    highRiskCount,
    criticalCount,
    averageWaterLevel: Number((totalWaterLevel / borewells.length).toFixed(1)),
    averageDailyDepletion: Number((totalDepletion / borewells.length).toFixed(1)),
  };
}

/**
 * Calculates modified depletion trajectory based on "What-if" parameters
 * extractionChange: percentage (-50 to +50)
 * rechargeBoost: percentage (0 to 100)
 */
export function simulateDepletion(
  baseDepletionRate: number,
  currentLevel: number,
  criticalThreshold: number,
  extractionChangePercent: number,
  rechargeBoostPercent: number
): {
  simulatedDailyDepletion: number;
  simulatedDaysRemaining: number;
  simulatedStatus: 'normal' | 'warning' | 'highrisk' | 'critical';
  simulatedRiskScore: number;
} {
  // Extraction factor
  const extractionMultiplier = 1 + (extractionChangePercent / 100);
  // Recharge factor dampens depletion rate
  const rechargeDampener = (rechargeBoostPercent / 100) * 15; // up to 15 cm/day recharge benefit

  let simulatedDailyDepletion = (baseDepletionRate * extractionMultiplier) - rechargeDampener;
  if (simulatedDailyDepletion < -15) simulatedDailyDepletion = -15;

  const waterColumnToCritical = criticalThreshold - currentLevel; // in meters
  
  let simulatedDaysRemaining = 999;
  if (simulatedDailyDepletion > 0 && waterColumnToCritical > 0) {
    simulatedDaysRemaining = Math.max(1, Math.round((waterColumnToCritical * 100) / simulatedDailyDepletion));
  }

  let simulatedRiskScore = Math.min(100, Math.max(5, Math.round(
    (simulatedDailyDepletion > 0 ? (simulatedDailyDepletion / 50) * 60 : 10) +
    ((currentLevel / criticalThreshold) * 40)
  )));

  let simulatedStatus: 'normal' | 'warning' | 'highrisk' | 'critical' = 'normal';
  if (simulatedRiskScore >= 85 || simulatedDaysRemaining <= 21) {
    simulatedStatus = 'critical';
  } else if (simulatedRiskScore >= 66 || simulatedDaysRemaining <= 45) {
    simulatedStatus = 'highrisk';
  } else if (simulatedRiskScore >= 36 || simulatedDaysRemaining <= 120) {
    simulatedStatus = 'warning';
  }

  return {
    simulatedDailyDepletion: Number(simulatedDailyDepletion.toFixed(1)),
    simulatedDaysRemaining,
    simulatedStatus,
    simulatedRiskScore,
  };
}
