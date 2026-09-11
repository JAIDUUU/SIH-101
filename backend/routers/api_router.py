from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Dict, Any, Optional
import uuid
import datetime

from ..schemas import (
    LoginRequest, TokenResponse, ProfileUpdateInput,
    QuizGenerateRequest, QuizSubmitRequest, QuizSubmitResponse,
    CourseProgressUpdate
)
from ..services.competency_engine import CompetencyEngine
from ..services.decay_engine import SkillDecayEngine
from ..services.recommendation_engine import RecommendationEngine
from ..services.ai_service import AIService
from ..services.external_adapters import MockIGOTService, MockNSSTAService

router = APIRouter()

competency_engine = CompetencyEngine()
recommendation_engine = RecommendationEngine()
ai_service = AIService()
igot_service = MockIGOTService()
nssta_service = MockNSSTAService()

# In-Memory state store for rapid prototype execution & fallback
STATE = {
    "officer": {
        "id": "OFF-MOSPI-2024-8842",
        "name": "Rajesh Kumar",
        "designation": "Statistical Officer",
        "department": "National Statistical Office (NSO) — Field Operations Division (FOD)",
        "cadre": "Subordinate Statistical Service (SSS)",
        "employeeId": "EMP-992014-RK",
        "experienceYears": 12,
        "education": "M.Sc. in Statistics (University of Delhi)",
        "station": "Regional Office, Lucknow (Northern Zone)",
        "email": "rajesh.kumar@mospi.gov.in",
        "readinessScore": 68,
        "verifiedCredentialsCount": 8,
        "passportId": "SS-PASS-MOSPI-8842-IND",
        "passportIssuedDate": "15 Jan 2025",
        "atRiskSkills": ["Sampling Methodology & Design", "GIS Spatial Analytics"],
    },
    "competencies": [],
    "skill_events": [],
    "active_quiz": None,
    "courses": []
}

def init_default_state():
    STATE["competencies"] = competency_engine.evaluate_competencies(
        designation=STATE["officer"]["designation"],
        department=STATE["officer"]["department"],
        experience_years=STATE["officer"]["experienceYears"]
    )
    for comp in STATE["competencies"]:
        comp["decayRisk"] = SkillDecayEngine.calculate_decay(
            competency_name=comp["name"],
            current_score=comp["currentScore"]
        )
    STATE["courses"] = recommendation_engine.generate_recommendations(
        competencies=STATE["competencies"],
        at_risk_skills=STATE["officer"]["atRiskSkills"],
        experience_years=STATE["officer"]["experienceYears"]
    )

init_default_state()

# ----------------------------------------------------
# 1. /api/auth
# ----------------------------------------------------
@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    role = (payload.role or "officer").lower()
    return TokenResponse(
        access_token=f"demo-token-{uuid.uuid4().hex[:12]}",
        token_type="bearer",
        role=role,
        user_id="user-mospi-01",
        email=payload.email
    )

@router.get("/auth/igot-sso-callback")
def igot_sso_callback():
    return {
        "status": "SUCCESS",
        "provider": "iGOT Karmayogi Central SSO",
        "accredited": True,
        "message": "Production SSO handshake validated. Ready for Diksha/Karmayogi SAML endpoint."
    }

# ----------------------------------------------------
# 2. /api/profiles
# ----------------------------------------------------
@router.get("/profiles/me")
def get_profile():
    return {
        "officer": STATE["officer"],
        "competencies": STATE["competencies"],
        "activeCourses": STATE["courses"][:2],
        "passport": {
            "passportId": STATE["officer"]["passportId"],
            "issuedDate": STATE["officer"]["passportIssuedDate"],
            "verifiedCredentials": STATE["officer"]["verifiedCredentialsCount"]
        }
    }

@router.post("/profiles/update")
def update_profile(data: ProfileUpdateInput):
    if data.fullName: STATE["officer"]["name"] = data.fullName
    if data.designation: STATE["officer"]["designation"] = data.designation
    if data.department: STATE["officer"]["department"] = data.department
    if data.cadre: STATE["officer"]["cadre"] = data.cadre
    if data.station: STATE["officer"]["station"] = data.station
    if data.experienceYears: STATE["officer"]["experienceYears"] = data.experienceYears

    # Recalculate competencies via engine
    re_evaluated = competency_engine.evaluate_competencies(
        designation=STATE["officer"]["designation"],
        department=STATE["officer"]["department"],
        experience_years=STATE["officer"]["experienceYears"],
        responsibilities=data.responsibilities,
        self_assessed_skills=data.selfAssessedSkills
    )
    for comp in re_evaluated:
        comp["decayRisk"] = SkillDecayEngine.calculate_decay(
            competency_name=comp["name"],
            current_score=comp["currentScore"]
        )
    STATE["competencies"] = re_evaluated

    # Recalculate readiness
    avg_score = int(sum(c["currentScore"] for c in re_evaluated) / len(re_evaluated))
    STATE["officer"]["readinessScore"] = avg_score

    return {"status": "SUCCESS", "officer": STATE["officer"], "competencies": STATE["competencies"]}

# ----------------------------------------------------
# 3. /api/competencies & /api/skills
# ----------------------------------------------------
@router.get("/competencies")
def get_competencies():
    return STATE["competencies"]

@router.get("/skills/decay")
def get_skill_decay():
    predictions = []
    for c in STATE["competencies"]:
        decay = SkillDecayEngine.calculate_decay(
            competency_name=c["name"],
            current_score=c["currentScore"]
        )
        predictions.append({
            "competency": c["name"],
            "currentScore": c["currentScore"],
            **decay
        })
    return {
        "feature": "AI READINESS PROJECTION",
        "disclaimer": "Simulated trajectory based on elapsed days & curricular updates. Not a certified clinical assessment.",
        "projections": predictions
    }

# ----------------------------------------------------
# 4. /api/recommendations & /api/courses
# ----------------------------------------------------
@router.get("/recommendations")
def get_recommendations():
    return recommendation_engine.generate_recommendations(
        competencies=STATE["competencies"],
        at_risk_skills=STATE["officer"]["atRiskSkills"],
        experience_years=STATE["officer"]["experienceYears"]
    )

@router.get("/courses")
def list_courses():
    return STATE["courses"]

@router.post("/courses/progress")
def update_course_progress(payload: CourseProgressUpdate):
    for c in STATE["courses"]:
        if c["id"] == payload.courseId:
            c["progress"] = payload.progress
            c["status"] = payload.status
            if payload.status == "completed":
                # Create a SkillEvent
                STATE["skill_events"].append({
                    "id": f"event-{uuid.uuid4().hex[:6]}",
                    "type": "COURSE_COMPLETED",
                    "title": c["title"],
                    "timestamp": datetime.datetime.utcnow().isoformat()
                })
                # Boost technical competency
                for comp in STATE["competencies"]:
                    if "Python" in comp["name"] or "Technical" in comp["domain"]:
                        comp["currentScore"] = min(100, comp["currentScore"] + 12)
                        comp["verification"] = "SYSTEM-VERIFIED"
                        comp["evidence"] = f"Accredited completion of {c['title']} via {c['provider']}"
                STATE["officer"]["verifiedCredentialsCount"] += 1
            return {"status": "UPDATED", "course": c}
    return {"status": "NOT_FOUND"}

# ----------------------------------------------------
# 5. /api/materials & /api/quizzes (Document -> Grounded Quiz)
# ----------------------------------------------------
@router.post("/materials/upload")
def upload_material(file_name: str = Body(..., embed=True), file_type: str = Body("PDF", embed=True)):
    material_id = f"mat-{uuid.uuid4().hex[:8]}"
    return {
        "materialId": material_id,
        "fileName": file_name,
        "fileType": file_type,
        "extractedSectionsCount": 8,
        "status": "INGESTED"
    }

@router.post("/quizzes/generate")
def generate_quiz(req: QuizGenerateRequest):
    result = ai_service.generate_grounded_quiz(
        document_name=req.document_name,
        document_type=req.file_type,
        target_domain=req.target_domain,
        num_questions=req.num_questions,
        difficulty=req.difficulty,
        language=req.language
    )
    
    # Format as QuizSchema
    questions = []
    for idx, q in enumerate(result["questions"]):
        questions.append({
            "id": f"q-{uuid.uuid4().hex[:6]}",
            "questionNumber": idx + 1,
            "text": q["question"],
            "options": q["options"],
            "correctOptionIndex": q["correct_option_index"],
            "explanation": q["explanation"],
            "sourceDoc": q["source_doc"],
            "competencyDomain": req.target_domain
        })

    quiz_obj = {
        "id": f"quiz-{uuid.uuid4().hex[:6]}",
        "title": f"{req.document_name.replace('_', ' ').replace('.pdf', '')} Verification Drill",
        "sourceDocument": req.document_name,
        "sourceType": req.file_type,
        "documentPages": 42,
        "targetDomain": req.target_domain,
        "questionsCount": len(questions),
        "difficulty": req.difficulty,
        "language": req.language,
        "createdAt": datetime.date.today().strftime("%d %b %Y"),
        "status": "Published",
        "questions": questions
    }
    STATE["active_quiz"] = quiz_obj
    return quiz_obj

@router.get("/quizzes/current")
def get_current_quiz():
    return STATE.get("active_quiz")

# ----------------------------------------------------
# 6. /api/assessments (Take Quiz -> Grounded Feedback -> Competency Update)
# ----------------------------------------------------
@router.post("/assessments/submit", response_model=QuizSubmitResponse)
def submit_quiz(payload: QuizSubmitRequest):
    quiz = STATE.get("active_quiz")
    if not quiz:
        raise HTTPException(status_code=404, detail="No active quiz found")

    correct_count = 0
    weak_competencies = []
    
    for idx, q in enumerate(quiz["questions"]):
        chosen = payload.answers.get(idx)
        if chosen == q["correctOptionIndex"]:
            correct_count += 1
        else:
            weak_competencies.append(q["competencyDomain"])

    score_pct = int((correct_count / len(quiz["questions"])) * 100)
    passed = score_pct >= 60

    # Competency Update
    updated_comps = []
    for comp in STATE["competencies"]:
        if "Sampling" in comp["name"]:
            old_s = comp["currentScore"]
            new_s = min(100, old_s + (5 if passed else 1))
            comp["currentScore"] = new_s
            comp["verification"] = "SYSTEM-VERIFIED"
            comp["evidence"] = f"Validated in NSSTA Official Drill: {quiz['title']} ({score_pct}%)"
            updated_comps.append({"name": comp["name"], "oldScore": old_s, "newScore": new_s})

    # Record SkillEvent
    event_id = f"event-{uuid.uuid4().hex[:6]}"
    STATE["skill_events"].append({
        "id": event_id,
        "type": "ASSESSMENT_PASSED" if passed else "ASSESSMENT_ATTEMPTED",
        "quizTitle": quiz["title"],
        "score": score_pct,
        "timestamp": datetime.datetime.utcnow().isoformat()
    })

    # Update Passport and Readiness Score
    STATE["officer"]["verifiedCredentialsCount"] += 1
    new_readiness = min(100, STATE["officer"]["readinessScore"] + (3 if passed else 1))
    STATE["officer"]["readinessScore"] = new_readiness

    return QuizSubmitResponse(
        quizId=quiz["id"],
        score=correct_count,
        total=len(quiz["questions"]),
        percentage=score_pct,
        passed=passed,
        weakCompetencies=list(set(weak_competencies)),
        updatedCompetencies=updated_comps,
        newReadinessScore=new_readiness,
        skillEventId=event_id
    )

# ----------------------------------------------------
# 7. /api/peers
# ----------------------------------------------------
@router.get("/peers/match")
def get_peers():
    return [
        {
            "id": "peer-1",
            "name": "Dr. Ananya Sharma",
            "designation": "Deputy Director",
            "department": "National Accounts Division (NAD), New Delhi",
            "station": "Central Ministry HQ, New Delhi",
            "expertiseArea": "Advanced Econometrics & Macroeconomic Aggregates",
            "keySkills": ["R Programming", "Input-Output Tables", "SUT Modeling"],
            "complementaryReason": "High technical score (88%) matches your developmental priority in Python/R computing.",
            "matchScore": 94,
            "activeStatus": "Available for Mentorship",
            "avatarInitials": "AS"
        },
        {
            "id": "peer-2",
            "name": "Suresh Patel",
            "designation": "Senior Statistical Officer",
            "department": "FOD Regional Office, Ahmedabad",
            "station": "Western Zone, Ahmedabad",
            "expertiseArea": "CAPI Implementation & Enterprise Data Audits",
            "keySkills": ["ASI Schedule Processing", "Field Data Verification", "CSPro"],
            "complementaryReason": "Shares your FOD operational cadre; actively pursuing similar predictive decay refreshers.",
            "matchScore": 89,
            "activeStatus": "Peer Study Group",
            "avatarInitials": "SP"
        }
    ]

@router.post("/peers/connect")
def connect_peer(peer_id: str = Body(..., embed=True)):
    return {
        "status": "REQUEST_SENT",
        "peerId": peer_id,
        "message": "Mentorship connection invite dispatched through official MoSPI cadre network."
    }

# ----------------------------------------------------
# 8. /api/analytics
# ----------------------------------------------------
@router.get("/analytics/workforce")
def get_analytics():
    return {
        "label": "ILLUSTRATIVE DEMO DATA",
        "disclaimer": "Aggregated demonstration telemetry for administrative decision-support. Not actual confidential MoSPI personnel figures.",
        "kpis": {
            "totalCadreTracked": 1420,
            "systemVerifiedRatio": "62%",
            "criticalDecayAlerts": 142,
            "averageReadinessScore": 71
        },
        "departmentReadiness": [
            {"department": "Field Operations Division (FOD)", "readiness": 68, "headcount": 640},
            {"department": "National Accounts Division (NAD)", "readiness": 84, "headcount": 180},
            {"department": "Price Statistics Division (PSD)", "readiness": 74, "headcount": 210},
            {"department": "Economic Statistics Division (ESD)", "readiness": 79, "headcount": 230},
            {"department": "Coordination & Training (C&T)", "readiness": 88, "headcount": 160}
        ],
        "topSkillGaps": [
            {"competency": "Python for Statistical Computing", "gapScore": 34, "affectedOfficers": 380},
            {"competency": "GIS & Spatial Frame Delineation", "gapScore": 28, "affectedOfficers": 295},
            {"competency": "Sampling Variance Imputation", "gapScore": 22, "affectedOfficers": 180}
        ]
    }

# ----------------------------------------------------
# 9. /api/notifications
# ----------------------------------------------------
@router.get("/notifications")
def get_notifications():
    return [
        {
            "id": "notif-1",
            "title": "AI Skill Decay Alert: Sampling Methodology",
            "message": "Your elapsed drill interval has exceeded 180 days. Projected competency loss is 14 points without refresher certification.",
            "timestamp": "2 hours ago",
            "type": "risk",
            "read": False,
            "actionLabel": "Review Projection",
            "actionTarget": "skill-decay"
        },
        {
            "id": "notif-2",
            "title": "Recommended Course Matched: Python for NSSO Data",
            "message": "New NSSTA TPAC lab module opened addressing your primary Technical competency gap.",
            "timestamp": "Yesterday",
            "type": "course",
            "read": False,
            "actionLabel": "View Course",
            "actionTarget": "courses"
        }
    ]

# ----------------------------------------------------
# 10. /api/ai
# ----------------------------------------------------
@router.post("/ai/assistant")
def consult_assistant(query: str = Body(..., embed=True)):
    response_text = ai_service.consult_assistant(query, STATE["officer"])
    return {"reply": response_text}
