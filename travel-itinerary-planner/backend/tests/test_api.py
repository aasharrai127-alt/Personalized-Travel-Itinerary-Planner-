import pytest
from app.models.schemas import TripPreferences, TravelStyle, BudgetTier, Pace
from app.services.recommendation_engine import generate_smart_recommendations
from app.services.gemini_service import gemini_service

def test_recommendation_engine_solo_weekend():
    """Tests Scenario 1: Solo traveler preferences"""
    prefs = TripPreferences(
        destination="Paris",
        start_date="2026-11-01",
        end_date="2026-11-03",
        travel_style=TravelStyle.SOLO,
        group_size=1,
        budget_tier=BudgetTier.BUDGET,
        pace=Pace.MODERATE,
        interests=["food", "sightseeing"]
    )
    res = generate_smart_recommendations(prefs)
    assert res.destination == "Paris"
    assert len(res.recommendations) > 0
    # First recommendation should have high match score
    assert res.recommendations[0].match_score >= 80

def test_recommendation_engine_romantic_couple():
    """Tests Scenario 2: Romantic couple preferences"""
    prefs = TripPreferences(
        destination="Rome",
        start_date="2026-11-05",
        end_date="2026-11-09",
        travel_style=TravelStyle.COUPLE,
        group_size=2,
        budget_tier=BudgetTier.LUXURY,
        pace=Pace.RELAXED,
        interests=["romantic", "culture", "fine dining"]
    )
    res = generate_smart_recommendations(prefs)
    assert res.destination == "Rome"
    assert any("Romantic" in r.tag or "romantic" in r.description.lower() for r in res.recommendations)

def test_recommendation_engine_group_friends():
    """Tests Scenario 3: Small group friends multi-day trip"""
    prefs = TripPreferences(
        destination="Tokyo",
        start_date="2026-11-10",
        end_date="2026-11-15",
        travel_style=TravelStyle.FRIENDS,
        group_size=4,
        budget_tier=BudgetTier.MODERATE,
        pace=Pace.FAST_PACED,
        interests=["adventure", "food", "nightlife"]
    )
    res = generate_smart_recommendations(prefs)
    assert res.destination == "Tokyo"
    assert "friends" in res.insights.lower()

@pytest.mark.asyncio
async def test_fallback_itinerary_generation():
    """Tests that itinerary generator creates complete day plans with morning, afternoon, evening activities and dining."""
    prefs = TripPreferences(
        destination="Tokyo",
        start_date="2026-11-01",
        end_date="2026-11-03",
        travel_style=TravelStyle.SOLO,
        group_size=1,
        budget_tier=BudgetTier.BUDGET,
        pace=Pace.MODERATE,
        interests=["food", "sightseeing"]
    )
    itin = await gemini_service.generate_itinerary(prefs)
    assert itin.destination == "Tokyo"
    assert itin.total_days == 3
    assert len(itin.days) == 3
    for day in itin.days:
        assert len(day.morning_activities) > 0
        assert len(day.afternoon_activities) > 0
        assert len(day.evening_activities) > 0
        assert len(day.dining_options) > 0
        assert day.daily_estimated_cost > 0
    assert itin.total_estimated_cost > 0
