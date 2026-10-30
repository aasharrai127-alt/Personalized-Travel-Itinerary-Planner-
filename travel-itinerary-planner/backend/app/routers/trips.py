from fastapi import APIRouter, HTTPException, Path
from typing import List, Dict, Any
from ..services.supabase_service import supabase_service

router = APIRouter(prefix="/api/trips", tags=["Trips Management"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_all_trips():
    """
    List all trips created and stored in Supabase or local storage.
    """
    return await supabase_service.list_trips()

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str = Path(..., description="ID of trip to delete")):
    """
    Delete a saved trip and its associated itinerary.
    """
    success = await supabase_service.delete_trip(trip_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete trip")
    return {"status": "success", "message": f"Trip {trip_id} removed"}
