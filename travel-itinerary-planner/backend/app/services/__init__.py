from .gemini_service import gemini_service
from .supabase_service import supabase_service
from .recommendation_engine import generate_smart_recommendations

__all__ = [
    "gemini_service",
    "supabase_service",
    "generate_smart_recommendations"
]
