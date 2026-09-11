"""
External Data Service Adapters
Provides abstraction over iGOT Karmayogi and NSSTA Training Portal APIs.
Production-ready interface pattern: if official APIs are unavailable, use MockIGOTService & MockNSSTAService.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class IGOTService(ABC):
    @abstractmethod
    def search_courses(self, query: str, competency_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_course_details(self, course_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def sync_completion_credential(self, user_id: str, course_id: str) -> Dict[str, Any]:
        pass

class NSSTAService(ABC):
    @abstractmethod
    def fetch_curriculum_catalog(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def verify_assessment_credential(self, certificate_id: str) -> Dict[str, Any]:
        pass

# ==========================================
# MOCK ADAPTER IMPLEMENTATIONS
# Marked as ILLUSTRATIVE DEMO DATA
# ==========================================

class MockIGOTService(IGOTService):
    MOCK_COURSES = [
        {
            "id": "course-cpi-index",
            "title": "Consumer Price Index (CPI) Compilation & Imputation Techniques",
            "provider": "iGOT Karmayogi",
            "duration": "8 Hours",
            "difficulty": "Foundational",
            "competenciesGained": ["Item Basket Weighting", "Geometric Mean Formulae", "Price Outlier Detection"],
            "matchPercentage": 88,
            "recommendationReason": "Aligned with upcoming FOD quarterly retail price survey cycles.",
            "language": "English",
            "rating": 4.7,
            "enrolledCount": 2890,
            "tags": ["Price Statistics", "Macro Indicators"],
            "status": "in-progress",
            "progress": 70,
            "isDemoData": True
        },
        {
            "id": "course-data-ethics",
            "title": "DPDP Act 2023 & Statistical Confidentiality for Public Officers",
            "provider": "iGOT Karmayogi",
            "duration": "6 Hours",
            "difficulty": "Foundational",
            "competenciesGained": ["Data Privacy Law", "Microdata Anonymization", "Official Secrets Act Compliance"],
            "matchPercentage": 84,
            "recommendationReason": "Mandatory bi-annual statutory refresher for all FOD / NSO enumerators and supervisors.",
            "language": "Hindi",
            "rating": 4.9,
            "enrolledCount": 5400,
            "tags": ["Governance", "Compliance", "Ethics"],
            "status": "not-started",
            "progress": 0,
            "isDemoData": True
        }
    ]

    def search_courses(self, query: str, competency_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        return self.MOCK_COURSES

    def get_course_details(self, course_id: str) -> Optional[Dict[str, Any]]:
        for c in self.MOCK_COURSES:
            if c["id"] == course_id:
                return c
        return None

    def sync_completion_credential(self, user_id: str, course_id: str) -> Dict[str, Any]:
        return {
            "status": "SYNCED",
            "provider": "iGOT Karmayogi",
            "credential_id": f"IGOT-CERT-{course_id[-6:]}",
            "verified": True
        }

class MockNSSTAService(NSSTAService):
    MOCK_MODULES = [
        {
            "id": "course-py-stat",
            "title": "Python for Statistical Analysis & NSSO Data Processing",
            "provider": "NSSTA TPAC",
            "duration": "18 Hours (Self-paced + 2 Labs)",
            "difficulty": "Intermediate",
            "competenciesGained": ["Python Data Extraction", "Pandas for Microdata", "Sampling Variance Calc"],
            "matchPercentage": 96,
            "recommendationReason": "Directly addresses your primary competency gap (Technical: 46%) and recurring microdata validation requirements.",
            "language": "Bilingual",
            "rating": 4.8,
            "enrolledCount": 1420,
            "tags": ["Python", "NSSO Datasets", "Automation"],
            "status": "in-progress",
            "progress": 42,
            "isDemoData": True
        },
        {
            "id": "course-sampling-refresher",
            "title": "Modern Survey Sampling: Multi-Stage Stratification Refresher",
            "provider": "NSSTA TPAC",
            "duration": "12 Hours",
            "difficulty": "Advanced",
            "competenciesGained": ["Probability Proportional to Size (PPS)", "Post-Stratification Weighting", "Non-Response Imputation"],
            "matchPercentage": 94,
            "recommendationReason": "Critical skill decay mitigation: Your sampling design drill interval exceeds 180 days.",
            "language": "English",
            "rating": 4.9,
            "enrolledCount": 890,
            "tags": ["Survey Sampling", "Methodology", "PLFS"],
            "status": "not-started",
            "progress": 0,
            "isDemoData": True
        }
    ]

    def fetch_curriculum_catalog(self) -> List[Dict[str, Any]]:
        return self.MOCK_MODULES

    def verify_assessment_credential(self, certificate_id: str) -> Dict[str, Any]:
        return {
            "status": "VERIFIED",
            "institution": "National Statistical Systems Training Academy (NSSTA)",
            "accreditation_level": "Level 4 Statistical Specialist",
            "valid_until": "2027-12-31"
        }
