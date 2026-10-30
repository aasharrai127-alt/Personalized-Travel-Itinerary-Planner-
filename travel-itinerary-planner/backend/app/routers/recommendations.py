from fastapi import APIRouter
from ..models.schemas import TripPreferences, RecommendationResponse
from ..services.recommendation_engine import generate_smart_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("", response_model=RecommendationResponse)
async def get_travel_recommendations(preferences: TripPreferences):
    """
    Returns AI-scored attraction, dining, and activity recommendations
    tailored to the user's travel style, pace, and interests.
    """
    return generate_smart_recommendations(preferences)
