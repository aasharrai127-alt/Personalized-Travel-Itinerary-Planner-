import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"Starting Personalized Travel Itinerary Planner API on http://{settings.HOST}:{settings.PORT}")
    print(f"Swagger Documentation available at http://localhost:{settings.PORT}/docs")
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
