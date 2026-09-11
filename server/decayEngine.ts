export interface DecayPrediction {
  competencyName: string;
  currentScore: number;
  projected3m: number;
  projected6m: number;
  projected12m: number;
  riskStatus: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decayRateMonthly: number;
  refresherCourseId: string;
  refresherTitle: string;
  decayReason: string;
}

export class SkillDecayEngine {
  public static calculate(
    competencyName: string,
    currentScore: number,
    daysElapsed: number = 180,
    threshold: number = 60
  ): DecayPrediction {
    let monthlyRate = 2.0;
    if (competencyName.includes('Sampling')) monthlyRate = 3.0;
    else if (competencyName.includes('GIS') || competencyName.includes('Spatial')) monthlyRate = 3.5;
    else if (competencyName.includes('Python')) monthlyRate = 2.5;

    const proj3m = Math.max(10, Math.round(currentScore - monthlyRate * 3));
    const proj6m = Math.max(10, Math.round(currentScore - monthlyRate * 6));
    const proj12m = Math.max(10, Math.round(currentScore - monthlyRate * 12));

    let riskStatus: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (proj6m < 45) {
      riskStatus = 'CRITICAL';
    } else if (proj6m < threshold) {
      riskStatus = 'HIGH';
    } else if (currentScore - proj6m >= 12) {
      riskStatus = 'MEDIUM';
    }

    return {
      competencyName,
      currentScore,
      projected3m: proj3m,
      projected6m: proj6m,
      projected12m: proj12m,
      riskStatus,
      decayRateMonthly: monthlyRate,
      refresherCourseId: 'course-sampling-refresher',
      refresherTitle: `${competencyName} Refresher Drill`,
      decayReason: `Operational interval of ${daysElapsed} days elapsed without accredited drill testing.`
    };
  }
}
