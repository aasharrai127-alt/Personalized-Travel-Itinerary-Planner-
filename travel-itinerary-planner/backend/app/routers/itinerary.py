from fastapi import APIRouter, HTTPException, Path, Body
from typing import Dict, Any
from ..models.schemas import (
    GenerateItineraryRequest,
    RegenerateDayRequest,
    Itinerary,
    DayPlan
)
from ..services.gemini_service import gemini_service
from ..services.supabase_service import supabase_service

router = APIRouter(prefix="/api/itinerary", tags=["Itinerary"])

@router.post("/generate", response_model=Itinerary)
async def generate_itinerary(request: GenerateItineraryRequest):
    """
    Generate an AI-powered personalized day-by-day travel itinerary
    based on user destination, dates, budget tier, travel style, and interests.
    """
    try:
        itin = await gemini_service.generate_itinerary(request.preferences)
        await supabase_service.save_itinerary(itin)
        return itin
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")

@router.get("/{trip_id}", response_model=Itinerary)
async def get_itinerary(trip_id: str = Path(..., description="The unique trip identifier")):
    """
    Fetch an existing itinerary by its trip ID from Supabase or local cache.
    """
    itin = await supabase_service.get_itinerary(trip_id)
    if not itin:
        raise HTTPException(status_code=404, detail=f"Itinerary for trip '{trip_id}' not found")
    return itin

@router.post("/regenerate-day", response_model=Itinerary)
async def regenerate_specific_day(request: RegenerateDayRequest):
    """
    Regenerates a specific day in an itinerary based on user refinement notes
    without disrupting the rest of the trip plan.
    """
    itin = await supabase_service.get_itinerary(request.trip_id)
    if not itin:
        raise HTTPException(status_code=404, detail="Trip not found")

    target_day = None
    for d in itin.days:
        if d.day_number == request.day_number:
            target_day = d
            break

    if not target_day:
        raise HTTPException(status_code=400, detail=f"Day {request.day_number} does not exist in trip")

    new_day = await gemini_service.regenerate_day(
        current_day=target_day,
        destination=itin.destination,
        feedback=request.feedback
    )

    updated_itin = await supabase_service.update_day(request.trip_id, new_day)
    return updated_itin

@router.patch("/{trip_id}/activity/{activity_id}")
async def toggle_activity_status(
    trip_id: str,
    activity_id: str,
    payload: Dict[str, Any] = Body(...)
):
    """
    Toggle completed status or update notes on a particular activity.
    """
    itin = await supabase_service.get_itinerary(trip_id)
    if not itin:
        raise HTTPException(status_code=404, detail="Trip not found")

    found = False
    for day in itin.days:
        for act in (day.morning_activities + day.afternoon_activities + day.evening_activities):
            if act.id == activity_id:
                if "is_completed" in payload:
                    act.is_completed = bool(payload["is_completed"])
                if "notes" in payload:
                    act.tips = payload["notes"]
                found = True
                break
        if found:
            break

    if not found:
        raise HTTPException(status_code=404, detail="Activity not found")

    await supabase_service.save_itinerary(itin)
    return {"status": "success", "activity_id": activity_id, "is_completed": payload.get("is_completed")}
