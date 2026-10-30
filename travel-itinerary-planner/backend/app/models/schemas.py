from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field

class TravelStyle(str, Enum):
    SOLO = "solo"
    COUPLE = "couple"
    FAMILY = "family"
    FRIENDS = "friends"
    BUSINESS = "business"

class BudgetTier(str, Enum):
    BUDGET = "budget"
    MODERATE = "moderate"
    LUXURY = "luxury"

class Pace(str, Enum):
    RELAXED = "relaxed"
    MODERATE = "moderate"
    FAST_PACED = "fast-paced"

class ActivityCategory(str, Enum):
    ATTRACTION = "attraction"
    DINING = "dining"
    TRANSPORT = "transport"
    RELAXATION = "relaxation"
    ACCOMMODATION = "accommodation"
    ENTERTAINMENT = "entertainment"

class Activity(BaseModel):
    id: str = Field(..., description="Unique activity ID")
    title: str = Field(..., description="Name of the attraction or activity")
    description: str = Field(..., description="Short engaging description of what to do")
    category: ActivityCategory = Field(default=ActivityCategory.ATTRACTION)
    time_slot: str = Field(..., description="e.g. 09:00 AM - 11:30 AM")
    estimated_cost: float = Field(default=0.0, description="Estimated cost in USD")
    location_name: str = Field(..., description="Venue or landmark name")
    address: Optional[str] = Field(default=None, description="Physical address or area")
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    travel_time_from_prev: Optional[str] = Field(default="15 mins", description="Estimated transit time from previous activity")
    tips: Optional[str] = Field(default=None, description="Insider advice, photo spots, dress code")
    is_completed: bool = Field(default=False)

class DiningRecommendation(BaseModel):
    id: str
    meal_type: str = Field(..., description="Breakfast, Lunch, or Dinner")
    restaurant_name: str
    cuisine: str
    price_range: str = Field(..., description="$, $$, or $$$")
    recommended_dish: str
    address: Optional[str] = None
    notes: Optional[str] = None

class DayPlan(BaseModel):
    day_number: int
    date: str = Field(..., description="YYYY-MM-DD format")
    theme: str = Field(..., description="Daily theme, e.g., 'Historic Quarters & Sunset Dining'")
    morning_activities: List[Activity] = Field(default_factory=list)
    afternoon_activities: List[Activity] = Field(default_factory=list)
    evening_activities: List[Activity] = Field(default_factory=list)
    dining_options: List[DiningRecommendation] = Field(default_factory=list)
    daily_estimated_cost: float = Field(default=0.0)
    logistics_advice: str = Field(default="Use public transit or walk between close points.")

class TripPreferences(BaseModel):
    destination: str = Field(..., description="City, country or region")
    start_date: str = Field(..., description="YYYY-MM-DD")
    end_date: str = Field(..., description="YYYY-MM-DD")
    travel_style: TravelStyle = Field(default=TravelStyle.SOLO)
    group_size: int = Field(default=1, ge=1, le=50)
    budget_tier: BudgetTier = Field(default=BudgetTier.MODERATE)
    total_budget_limit: Optional[float] = Field(default=None, description="Optional total budget in USD")
    pace: Pace = Field(default=Pace.MODERATE)
    interests: List[str] = Field(default_factory=lambda: ["sightseeing", "food"])
    dietary_restrictions: List[str] = Field(default_factory=list)
    accommodation_type: Optional[str] = Field(default="Hotel", description="Hotel, Boutique, Hostel, Resort, Airbnb")
    special_requests: Optional[str] = Field(default=None)

class Itinerary(BaseModel):
    id: str
    trip_id: str
    destination: str
    title: str
    summary: str
    total_days: int
    preferences: TripPreferences
    days: List[DayPlan]
    total_estimated_cost: float
    packing_tips: List[str] = Field(default_factory=list)
    local_customs_advice: Optional[str] = None
    created_at: str

class GenerateItineraryRequest(BaseModel):
    preferences: TripPreferences

class RegenerateDayRequest(BaseModel):
    trip_id: str
    day_number: int
    feedback: Optional[str] = Field(default=None, description="User note, e.g., 'Make it more outdoorsy and add a seaside lunch'")

class RecommendationItem(BaseModel):
    id: str
    name: str
    category: str
    description: str
    tag: str
    rating: float
    price_level: str
    location: str
    match_score: int

class RecommendationResponse(BaseModel):
    destination: str
    recommendations: List[RecommendationItem]
    insights: str
