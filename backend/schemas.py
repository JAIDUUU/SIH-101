from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth schemas
class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "officer"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    email: str

# Competency Schemas
class CompetencyBase(BaseModel):
    id: str
    name: str
    domain: str
    currentScore: int
    targetScore: int
    verification: str
    evidence: str
    decayRisk: Optional[Dict[str, Any]] = None

class ProfileUpdateInput(BaseModel):
    fullName: Optional[str] = None
    designation: Optional[str] = None
    cadre: Optional[str] = None
    department: Optional[str] = None
    station: Optional[str] = None
    experienceYears: Optional[int] = None
    responsibilities: Optional[List[str]] = None
    previousTraining: Optional[List[str]] = None
    selfAssessedSkills: Optional[Dict[str, int]] = None

# Quiz Generation Schemas
class QuizGenerateRequest(BaseModel):
    document_name: str
    file_type: str = "PDF" # PDF, PPT, DOCX
    target_domain: str = "Statistical"
    num_questions: int = 5
    difficulty: str = "Intermediate"
    language: str = "English"
    question_type: str = "Scenario-Based MCQ"
    content_override: Optional[str] = None

class SourceDocCite(BaseModel):
    title: str
    page: int
    section: str
    excerpt: str

class QuestionSchema(BaseModel):
    id: str
    questionNumber: int
    text: str
    options: List[str]
    correctOptionIndex: int
    explanation: str
    sourceDoc: SourceDocCite
    competencyDomain: str

class QuizSchema(BaseModel):
    id: str
    title: str
    sourceDocument: str
    sourceType: str
    documentPages: int
    targetDomain: str
    questionsCount: int
    difficulty: str
    language: str
    createdAt: str
    status: str
    questions: List[QuestionSchema]

class QuizSubmitRequest(BaseModel):
    quizId: str
    answers: Dict[int, int] # questionIndex -> selectedOptionIndex

class QuizSubmitResponse(BaseModel):
    quizId: str
    score: int
    total: int
    percentage: int
    passed: bool
    weakCompetencies: List[str]
    updatedCompetencies: List[Dict[str, Any]]
    newReadinessScore: int
    skillEventId: str

class CourseProgressUpdate(BaseModel):
    courseId: str
    progress: int
    status: str
