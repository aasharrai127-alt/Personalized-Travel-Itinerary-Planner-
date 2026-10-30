from .itinerary import router as itinerary_router
from .recommendations import router as recommendations_router
from .trips import router as trips_router

__all__ = ["itinerary_router", "recommendations_router", "trips_router"]
