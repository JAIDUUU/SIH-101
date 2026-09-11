"""
Competency Evaluation Engine
Evaluates official statistical cadres based on:
- designation
- department
- experience
- responsibilities
- previous training
- self-assessed skills
- assessment performance
"""

from typing import Dict, List, Any

# Benchmark standard target competencies by Cadre
CADRE_STANDARDS = {
    "Subordinate Statistical Service (SSS)": {
        "Sampling Methodology & Design": 90,
        "Python for Statistical Computing": 75,
        "Price Index & Imputation Systems": 85,
        "Enterprise Survey Protocols (ASI)": 80,
        "GIS & Spatial Frame Delineation": 75,
        "Public Sector Ethics & Data Stewardship": 90
    },
    "Indian Statistical Service (ISS)": {
        "Sampling Methodology & Design": 95,
        "Python for Statistical Computing": 85,
        "National Accounts & Macro Modeling": 95,
        "Advanced Econometrics & Causal Inference": 90,
        "Public Sector Ethics & Data Stewardship": 95
    }
}

class CompetencyEngine:
    def __init__(self):
        pass

    def evaluate_competencies(
        self,
        designation: str,
        department: str,
        experience_years: int,
        responsibilities: List[str] = None,
        previous_training: List[str] = None,
        self_assessed_skills: Dict[str, int] = None,
        assessment_history: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        cadre_type = "Indian Statistical Service (ISS)" if "Director" in designation or "ISS" in designation else "Subordinate Statistical Service (SSS)"
        standards = CADRE_STANDARDS.get(cadre_type, CADRE_STANDARDS["Subordinate Statistical Service (SSS)"])

        evaluated = []

        # Baseline competencies
        base_names = [
            ("Sampling Methodology & Design", "Statistical", 82),
            ("Python for Statistical Computing", "Technical", 24),
            ("Price Index & Imputation Systems", "Statistical", 78),
            ("Enterprise Survey Protocols (ASI)", "Statistical", 70),
            ("GIS & Spatial Frame Delineation", "Digital Governance", 44),
            ("Public Sector Ethics & Data Stewardship", "Behavioural & Managerial", 88)
        ]

        for name, domain, default_base in base_names:
            target = standards.get(name, 85)
            
            # Start with self assessed or default base
            score = default_base
            evidence_type = "SELF-ASSESSED"
            evidence_text = "Self-reported profile baseline"

            if self_assessed_skills and name in self_assessed_skills:
                score = self_assessed_skills[name]
                evidence_text = f"Self-appraised at level {score}/100"

            # Check assessment performance
            if assessment_history:
                for past in assessment_history:
                    if past.get("competency_name") == name:
                        score = max(score, past.get("score", score))
                        evidence_type = "SYSTEM-VERIFIED"
                        evidence_text = f"Validated in NSSTA Official Drill on {past.get('date', 'recent')}"

            # Experience factor
            if experience_years > 8 and domain == "Statistical":
                score = min(100, score + 4)

            gap = max(0, target - score)
            
            evaluated.append({
                "id": f"comp-{name.lower()[:5]}",
                "name": name,
                "domain": domain,
                "currentScore": score,
                "targetScore": target,
                "skillGap": gap,
                "verification": evidence_type,
                "evidence": evidence_text,
            })

        return evaluated
