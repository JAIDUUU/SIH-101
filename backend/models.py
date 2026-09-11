import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Enum,
    JSON,
)
from sqlalchemy.orm import relationship
import enum
from .database import Base

class UserRole(str, enum.Enum):
    OFFICER = "OFFICER"
    TRAINER = "TRAINER"
    ADMIN = "ADMIN"

class VerificationType(str, enum.Enum):
    SELF_ASSESSED = "SELF_ASSESSED"
    SYSTEM_VERIFIED = "SYSTEM_VERIFIED"

class RiskStatus(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.OFFICER.value, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    profile = relationship("OfficerProfile", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    skill_events = relationship("SkillEvent", back_populates="user")

class OfficerProfile(Base):
    __tablename__ = "officer_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    department = Column(String, nullable=False)
    cadre = Column(String, nullable=False)
    station = Column(String, nullable=False)
    experience_years = Column(Integer, default=5)
    education = Column(String, nullable=True)
    readiness_score = Column(Integer, default=65)
    passport_id = Column(String, unique=True, nullable=False)
    passport_issued_date = Column(DateTime, default=datetime.datetime.utcnow)
    verified_credentials_count = Column(Integer, default=0)

    # Relationships
    user = relationship("User", back_populates="profile")
    competencies = relationship("UserCompetency", back_populates="profile")
    recommendations = relationship("Recommendation", back_populates="profile")
    learning_progress = relationship("LearningProgress", back_populates="profile")
    decay_predictions = relationship("SkillDecayPrediction", back_populates="profile")

class Competency(Base):
    __tablename__ = "competencies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    domain = Column(String, nullable=False) # Statistical, Technical, Digital Governance, Behavioural
    description = Column(Text, nullable=True)
    standard_target = Column(Integer, default=80)
    decay_rate_monthly = Column(Float, default=2.5) # Percentage points lost per month without drill
    threshold = Column(Integer, default=60)

    user_competencies = relationship("UserCompetency", back_populates="competency")
    questions = relationship("Question", back_populates="competency")

class UserCompetency(Base):
    __tablename__ = "user_competencies"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("officer_profiles.id"), nullable=False)
    competency_id = Column(String, ForeignKey("competencies.id"), nullable=False)
    current_score = Column(Integer, default=50)
    target_score = Column(Integer, default=85)
    verification_type = Column(String, default=VerificationType.SELF_ASSESSED.value)
    evidence = Column(Text, nullable=True)
    last_assessed_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("OfficerProfile", back_populates="competencies")
    competency = relationship("Competency", back_populates="user_competencies")

class LearningMaterial(Base):
    __tablename__ = "learning_materials"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # PDF, PPT, DOCX
    file_path = Column(String, nullable=False)
    page_count = Column(Integer, default=1)
    extracted_sections = Column(JSON, nullable=True) # list of {page, title, excerpt}
    uploaded_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessments = relationship("Assessment", back_populates="material")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    target_domain = Column(String, nullable=False)
    difficulty = Column(String, default="Intermediate") # Foundational, Intermediate, Advanced
    language = Column(String, default="English")
    status = Column(String, default="Draft") # Draft, Published, Under Review
    material_id = Column(String, ForeignKey("learning_materials.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    material = relationship("LearningMaterial", back_populates="assessments")
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    answers = relationship("Answer", back_populates="assessment")

class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, index=True)
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    competency_id = Column(String, ForeignKey("competencies.id"), nullable=True)
    question_number = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False) # list of 4 options
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)
    
    # Grounding metadata
    source_document = Column(String, nullable=False)
    page_number = Column(Integer, nullable=False)
    source_section = Column(String, nullable=False)
    source_excerpt = Column(Text, nullable=False)
    is_grounding_validated = Column(Boolean, default=True)

    assessment = relationship("Assessment", back_populates="questions")
    competency = relationship("Competency", back_populates="questions")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(String, primary_key=True, index=True)
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    question_id = Column(String, ForeignKey("questions.id"), nullable=False)
    selected_option = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessment = relationship("Assessment", back_populates="answers")

class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    provider = Column(String, nullable=False) # iGOT Karmayogi, NSSTA TPAC
    duration = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    language = Column(String, default="English")
    rating = Column(Float, default=4.5)
    enrolled_count = Column(Integer, default=100)
    competencies_gained = Column(JSON, default=list) # List of strings
    tags = Column(JSON, default=list)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("officer_profiles.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    match_score = Column(Integer, default=85)
    reason = Column(Text, nullable=False)
    competency_addressed = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    profile = relationship("OfficerProfile", back_populates="recommendations")

class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("officer_profiles.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    status = Column(String, default="not-started") # not-started, in-progress, completed
    progress_percentage = Column(Integer, default=0)
    last_accessed = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("OfficerProfile", back_populates="learning_progress")

class SkillEvent(Base):
    __tablename__ = "skill_events"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False) # ASSESSMENT_PASSED, COURSE_COMPLETED, PROFILE_UPDATED
    competency_name = Column(String, nullable=False)
    delta_score = Column(Integer, default=0)
    new_score = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="skill_events")

class SkillDecayPrediction(Base):
    __tablename__ = "skill_decay_predictions"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("officer_profiles.id"), nullable=False)
    competency_id = Column(String, ForeignKey("competencies.id"), nullable=False)
    current_score = Column(Integer, nullable=False)
    projected_3m = Column(Integer, nullable=False)
    projected_6m = Column(Integer, nullable=False)
    projected_12m = Column(Integer, nullable=False)
    risk_status = Column(String, default=RiskStatus.LOW.value)
    decay_reason = Column(Text, nullable=True)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("OfficerProfile", back_populates="decay_predictions")

class PeerMatch(Base):
    __tablename__ = "peer_matches"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    matched_peer_id = Column(String, nullable=False)
    peer_name = Column(String, nullable=False)
    peer_station = Column(String, nullable=False)
    peer_department = Column(String, nullable=False)
    match_score = Column(Integer, default=90)
    complementary_reason = Column(Text, nullable=False)
    connection_status = Column(String, default="Available") # Available, Connected, Pending

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="system") # risk, course, assessment, system
    is_read = Column(Boolean, default=False)
    action_label = Column(String, nullable=True)
    action_target = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
