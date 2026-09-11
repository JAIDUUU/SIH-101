from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers.api_router import router as api_router
from .database import engine, Base

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Skill Sutra - AI-enabled Skill Intelligence & Learning Platform for India's Official Statistical System.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    return {
        "service": "Skill Sutra Backend",
        "status": "OPERATIONAL",
        "framework": "FastAPI",
        "ai_engine": "Groq Llama-3.3-70b / Local Grounded Synthesis",
        "standards": ["iGOT Karmayogi", "NSSTA TPAC V4", "MoSPI Cadre Guidelines"]
    }
