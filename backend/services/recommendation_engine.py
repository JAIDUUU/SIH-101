"""
Personalized Learning Recommendation Engine
Inputs:
- user competencies
- skill gaps
- role
- experience
- completed courses
- at-risk skills
Output:
- ranked courses with match score, reason, competency addressed, source, difficulty, duration.
"""

from typing import List, Dict, Any
from .external_adapters import MockIGOTService, MockNSSTAService

class RecommendationEngine:
    def __init__(self):
        self.igot_service = MockIGOTService()
        self.nssta_service = MockNSSTAService()

    def generate_recommendations(
        self,
        competencies: List[Dict[str, Any]],
        at_risk_skills: List[str],
        role: str = "officer",
        experience_years: int = 10,
        completed_course_ids: List[str] = None
    ) -> List[Dict[str, Any]]:
        completed = set(completed_course_ids or [])
        
        # Aggregate candidate courses from providers
        candidates = []
        candidates.extend(self.nssta_service.fetch_curriculum_catalog())
        candidates.extend(self.igot_service.search_courses(""))

        # Score and rank each candidate
        ranked = []
        for course in candidates:
            if course["id"] in completed:
                continue

            score = course.get("matchPercentage", 75)
            reason = course.get("recommendationReason", "Supports general professional development.")

            # Boost if addresses an at-risk skill
            for at_risk in at_risk_skills:
                if any(at_risk.lower() in g.lower() for g in course.get("competenciesGained", [])):
                    score = min(99, score + 10)
                    reason = f"URGENT DECAY REVERSAL: Directly addresses {at_risk} degradation."
                    break

            # Boost if matches largest competency gap
            for comp in competencies:
                gap = comp.get("skillGap", 0)
                if gap > 20 and any(comp["name"].lower() in g.lower() for g in course.get("competenciesGained", [])):
                    score = min(99, score + 8)

            ranked.append({
                **course,
                "matchPercentage": score,
                "recommendationReason": reason,
                "dataLabel": "ILLUSTRATIVE DEMO DATA"
            })

        # Sort descending by matchPercentage
        ranked.sort(key=lambda x: x["matchPercentage"], reverse=True)
        return ranked
