import { Course, CompetencyItem, NextBestSkillRecommendation } from '../src/types';
import { OfficialCoursesService } from './officialCoursesService';

export interface RecommendationProfileContext {
  designation?: string;
  department?: string;
  cadre?: string;
  statisticalDomain?: string;
  competencies: CompetencyItem[];
  atRiskSkills: string[];
  experienceYears?: number;
  completedCourseIds?: string[];
  previousTraining?: string;
}

export class RecommendationEngine {
  /**
   * Evaluates all database-backed official courses (NSSTA, MoSPI, and iGOT Karmayogi)
   * against the officer's required competency gaps, skill decay risks, statistical domain,
   * cadre eligibility, and prior learning history.
   */
  public async getRankedRecommendations(
    contextOrCompetencies: RecommendationProfileContext | CompetencyItem[],
    legacyAtRiskSkills: string[] = [],
    legacyExperienceYears: number = 3,
    legacyCompletedCourseIds: string[] = []
  ): Promise<Course[]> {
    // Handle both new rich context and legacy signature
    let context: RecommendationProfileContext;
    if (Array.isArray(contextOrCompetencies)) {
      context = {
        competencies: contextOrCompetencies,
        atRiskSkills: legacyAtRiskSkills,
        experienceYears: legacyExperienceYears,
        completedCourseIds: legacyCompletedCourseIds,
      };
    } else {
      context = contextOrCompetencies;
    }

    const { courses: allCatalogueCourses } = await OfficialCoursesService.getOfficialCourses();
    const completedSet = new Set(context.completedCourseIds || []);

    const prevTrainingStr = (context.previousTraining || '').toLowerCase();
    const domainStr = (context.statisticalDomain || '').toLowerCase();
    const deptStr = (context.department || '').toLowerCase();
    const cadreStr = (context.cadre || '').toLowerCase();

    // Map competencies to fast lookup
    const compMap = new Map<string, CompetencyItem>();
    context.competencies.forEach((c) => {
      compMap.set(c.name.toLowerCase(), c);
    });

    const ranked = allCatalogueCourses
      .filter((course) => !completedSet.has(course.id))
      .map((course) => {
        let score = 50; // baseline score
        let reason = course.recommendationReason || 'Official government competency development module.';
        let matchedCompetencyName: string | null = null;
        let matchedGapSize = 0;
        let isDecayMatch = false;

        const courseTitleLower = course.title.toLowerCase();
        const tagsStr = (course.tags || []).join(' ').toLowerCase();
        const competenciesGainedStr = (course.competenciesGained || []).join(' ').toLowerCase();

        // 1. Check for At-Risk Skill Decay Mitigation (HIGHEST PRIORITY)
        for (const atRisk of context.atRiskSkills || []) {
          const atRiskLower = atRisk.toLowerCase();
          if (
            courseTitleLower.includes(atRiskLower) ||
            competenciesGainedStr.includes(atRiskLower) ||
            tagsStr.includes(atRiskLower)
          ) {
            score += 35;
            isDecayMatch = true;
            matchedCompetencyName = atRisk;
            reason = `URGENT SKILL RETENTION REFRESHER: Recommended next because an estimated decay risk was flagged in ${atRisk}. Completing this module will re-verify proficiency.`;
            break;
          }
        }

        // 2. Match with Required Competency Gaps
        for (const comp of context.competencies) {
          const gap = Math.max(0, comp.targetScore - comp.currentScore);
          const compNameLower = comp.name.toLowerCase();

          const matchesComp =
            courseTitleLower.includes(compNameLower) ||
            competenciesGainedStr.includes(compNameLower) ||
            comp.name.split(' ').some((word) => word.length > 4 && (courseTitleLower.includes(word.toLowerCase()) || competenciesGainedStr.includes(word.toLowerCase())));

          if (matchesComp && gap > 0) {
            // Give higher boost for larger gaps
            const gapBoost = Math.min(30, Math.round(gap * 0.75));
            score += gapBoost;

            if (comp.isRequired) {
              score += 10; // Extra priority for role-mandatory competencies
            }

            if (!isDecayMatch && gap > matchedGapSize) {
              matchedGapSize = gap;
              matchedCompetencyName = comp.name;
              reason = `CRITICAL COMPETENCY GAP: Recommended next because you have an identified ${gap}-point gap in ${comp.name} (${comp.currentScore}% vs ${comp.targetScore}% required benchmark).`;
            }
          }
        }

        // 3. Statistical Domain & Department Context Alignment
        if (domainStr) {
          if (
            courseTitleLower.includes(domainStr) ||
            tagsStr.includes(domainStr) ||
            competenciesGainedStr.includes(domainStr)
          ) {
            score += 15;
          }
        }

        if (deptStr) {
          const deptWords = deptStr.split(/[\s,()/-]+/).filter((w) => w.length > 3);
          for (const dw of deptWords) {
            if (courseTitleLower.includes(dw) || tagsStr.includes(dw) || (course.cadreEligibility && course.cadreEligibility.toLowerCase().includes(dw))) {
              score += 8;
              break;
            }
          }
        }

        // 4. Cadre Eligibility Alignment
        if (cadreStr && course.cadreEligibility) {
          const eligLower = course.cadreEligibility.toLowerCase();
          if (eligLower.includes('all') || (cadreStr.includes('sss') && eligLower.includes('sss')) || (cadreStr.includes('iss') && eligLower.includes('iss'))) {
            score += 6;
          }
        }

        // 5. Deduplication against previous training
        if (prevTrainingStr && prevTrainingStr.length > 5) {
          const titleWords = course.title.toLowerCase().split(' ').filter((w) => w.length > 4);
          const alreadyTaken = titleWords.filter((w) => prevTrainingStr.includes(w)).length >= 2;
          if (alreadyTaken) {
            score -= 25; // Lower priority if already covered in officer's recorded training history
          }
        }

        // Normalize match percentage between 60% and 99%
        const finalMatchPercentage = Math.min(99, Math.max(60, score));

        return {
          ...course,
          matchPercentage: finalMatchPercentage,
          recommendationReason: reason,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return ranked;
  }

  /**
   * Computes the single "Next Best Skill" for the officer.
   * Answers: "What should this officer learn NEXT?"
   * Formulates an explicit reason linking role, department, gap size, and decay risk.
   */
  public async getNextBestSkill(context: RecommendationProfileContext): Promise<NextBestSkillRecommendation | null> {
    const rankedCourses = await this.getRankedRecommendations(context);
    if (!rankedCourses || rankedCourses.length === 0) return null;

    const topCourse = rankedCourses[0];

    // Find the primary competency driving this top course
    let targetCompetency: CompetencyItem | undefined;
    for (const comp of context.competencies) {
      const compLower = comp.name.toLowerCase();
      const inGained = (topCourse.competenciesGained || []).some((g) => g.toLowerCase().includes(compLower) || compLower.includes(g.toLowerCase()));
      const inTitle = topCourse.title.toLowerCase().includes(compLower);
      if (inGained || inTitle) {
        targetCompetency = comp;
        break;
      }
    }

    if (!targetCompetency && context.competencies.length > 0) {
      // Fallback to highest gap competency
      targetCompetency = [...context.competencies].sort(
        (a, b) => (b.targetScore - b.currentScore) - (a.targetScore - a.currentScore)
      )[0];
    }

    if (!targetCompetency) return null;

    const gap = Math.max(0, targetCompetency.targetScore - targetCompetency.currentScore);
    const isAtRisk = (context.atRiskSkills || []).some(
      (s) => s.toLowerCase() === targetCompetency!.name.toLowerCase()
    );

    const priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' =
      isAtRisk || gap >= 25 ? 'CRITICAL' : gap >= 15 ? 'HIGH' : 'MEDIUM';

    const reason = isAtRisk
      ? `Recommended next because your verified proficiency in ${targetCompetency.name} is subject to an active retention decay estimate. Completing "${topCourse.title}" will reset your proficiency trajectory.`
      : `Recommended next because your role as ${context.designation || 'Statistical Officer'} in ${context.department || 'MoSPI'} requires a target score of ${targetCompetency.targetScore}% in ${targetCompetency.name} (currently ${targetCompetency.currentScore}%, gap of ${gap} points).`;

    const actionPathway = `Enroll in "${topCourse.title}" via ${topCourse.provider} (${topCourse.duration}), complete module exercises, and take the verified exit drill to update your Skill Passport.`;

    return {
      skillName: targetCompetency.name,
      competencyDomain: targetCompetency.domain,
      statisticalDomain: context.statisticalDomain || targetCompetency.statisticalDomain || 'Statistical',
      currentScore: targetCompetency.currentScore,
      targetScore: targetCompetency.targetScore,
      gapSize: gap,
      priority,
      isDecayRisk: isAtRisk,
      recommendedCourse: topCourse,
      recommendationReason: reason,
      actionPathway,
    };
  }
}
