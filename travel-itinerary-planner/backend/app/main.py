from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import itinerary_router, recommendations_router, trips_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack AI-Powered Travel Itinerary Planner with Google Gemini and Supabase integration.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount feature routers
app.include_router(itinerary_router)
app.include_router(recommendations_router)
app.include_router(trips_router)

@app.get("/api/health", tags=["Health"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "features": {
            "gemini_generative_ai": bool(settings.GEMINI_API_KEY),
            "supabase_database": bool(settings.SUPABASE_URL and settings.SUPABASE_KEY),
            "recommendation_engine": True
        }
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Personalized Travel Itinerary Planner API",
        "documentation": "/docs",
        "health_check": "/api/health"
    }
