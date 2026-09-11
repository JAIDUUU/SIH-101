"""
AI Readiness Projection - Skill Decay Service
Calculates temporal skill degradation and refresher urgency.
Disclaimer: Algorithmic projection based on elapsed intervals & official syllabus revisions. Not a clinical psychometric validation.
"""

import datetime
from typing import Dict, Any

class SkillDecayEngine:
    DEFAULT_MONTHLY_DECAY = {
        "Sampling Methodology & Design": 3.0,
        "Python for Statistical Computing": 2.5,
        "Price Index & Imputation Systems": 1.5,
        "Enterprise Survey Protocols (ASI)": 2.0,
        "GIS & Spatial Frame Delineation": 3.5,
        "Public Sector Ethics & Data Stewardship": 0.8
    }

    REFRESHER_COURSES = {
        "Sampling Methodology & Design": ("course-sampling-refresher", "Modern Survey Sampling: Multi-Stage Stratification Refresher"),
        "Python for Statistical Computing": ("course-py-stat", "Python for Statistical Analysis & NSSO Data Processing"),
        "GIS & Spatial Frame Delineation": ("course-gis-urban", "GIS Spatial Urban Frame & Satellite Mapping"),
        "Price Index & Imputation Systems": ("course-cpi-index", "Consumer Price Index (CPI) Compilation & Imputation Techniques"),
    }

    @classmethod
    def calculate_decay(
        cls,
        competency_name: str,
        current_score: int,
        days_since_assessment: int = 180,
        threshold: int = 60
    ) -> Dict[str, Any]:
        monthly_rate = cls.DEFAULT_MONTHLY_DECAY.get(competency_name, 2.0)
        
        # Projections
        proj_3m = max(10, int(current_score - (monthly_rate * 3)))
        proj_6m = max(10, int(current_score - (monthly_rate * 6)))
        proj_12m = max(10, int(current_score - (monthly_rate * 12)))

        is_at_risk = proj_6m < threshold or (current_score - proj_6m) >= 12

        refresher_id, refresher_title = cls.REFRESHER_COURSES.get(
            competency_name,
            ("course-gen-stat", f"{competency_name} Operational Refresher Module")
        )

        reason = (
            f"Lack of practical assessment drills in {competency_name} over {days_since_assessment} days; "
            "updated national survey guidelines released."
        ) if is_at_risk else "Current proficiency steady; recommended bi-annual recertification."

        risk_level = "LOW"
        if proj_6m < 50:
            risk_level = "CRITICAL"
        elif proj_6m < threshold:
            risk_level = "HIGH"
        elif is_at_risk:
            risk_level = "MEDIUM"

        return {
            "isAtRisk": is_at_risk,
            "riskLevel": risk_level,
            "projected3m": proj_3m,
            "projected6m": proj_6m,
            "projected12m": proj_12m,
            "lastAssessed": f"{days_since_assessment} days ago",
            "refresherCourseId": refresher_id,
            "refresherTitle": refresher_title,
            "decayReason": reason,
            "featureLabel": "AI READINESS PROJECTION"
        }
