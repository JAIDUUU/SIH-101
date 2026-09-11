import { Course, CompetencyItem } from '../src/types';
import { MockIGOTService, MockNSSTAService } from './externalAdapters';

export class RecommendationEngine {
  private igotService = new MockIGOTService();
  private nsstaService = new MockNSSTAService();

  public async getRankedRecommendations(
    competencies: CompetencyItem[],
    atRiskSkills: string[],
    experienceYears: number,
    completedCourseIds: string[] = []
  ): Promise<Course[]> {
    const igotCourses = await this.igotService.searchCourses('');
    const nsstaCourses = await this.nsstaService.fetchCurriculum();

    const allCourses = [...nsstaCourses, ...igotCourses];
    const completedSet = new Set(completedCourseIds);

    return allCourses
      .filter((c) => !completedSet.has(c.id))
      .map((course) => {
        let match = course.matchPercentage || 75;
        let reason = course.recommendationReason;

        // At-risk skill match boost
        for (const atRisk of atRiskSkills) {
          if (
            course.competenciesGained.some(
              (g) => g.toLowerCase().includes(atRisk.toLowerCase()) || atRisk.toLowerCase().includes(g.toLowerCase())
            )
          ) {
            match = Math.min(99, match + 8);
            reason = `URGENT SKILL DECAY MITIGATION: Directly addresses flagged decay risk in ${atRisk}.`;
            break;
          }
        }

        // Competency gap match boost
        for (const comp of competencies) {
          const gap = comp.targetScore - comp.currentScore;
          if (gap > 20) {
            if (
              course.competenciesGained.some(
                (g) => g.toLowerCase().includes(comp.name.toLowerCase()) || comp.name.toLowerCase().includes(g.toLowerCase())
              )
            ) {
              match = Math.min(98, match + 6);
            }
          }
        }

        return {
          ...course,
          matchPercentage: match,
          recommendationReason: reason,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}
