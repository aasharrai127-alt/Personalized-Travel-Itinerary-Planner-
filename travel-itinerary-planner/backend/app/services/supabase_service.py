import json
import os
from typing import List, Optional, Dict, Any
from ..config import settings
from ..models.schemas import Itinerary, DayPlan

try:
    from supabase import create_client, Client
    SUPABASE_LIB_AVAILABLE = True
except ImportError:
    SUPABASE_LIB_AVAILABLE = False


class SupabaseService:
    def __init__(self):
        self.client: Optional[Any] = None
        self.is_connected = False
        self._memory_store: Dict[str, Dict[str, Any]] = {}
        
        # Local JSON cache file for persistence even without Supabase
        self.cache_file = os.path.join(os.path.dirname(__file__), "..", "..", "local_trips_store.json")
        self._load_local_cache()

        if (
            SUPABASE_LIB_AVAILABLE
            and settings.SUPABASE_URL
            and settings.SUPABASE_KEY
            and settings.SUPABASE_URL != "https://your-project.supabase.co"
        ):
            try:
                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                self.is_connected = True
                print("[SupabaseService] Successfully connected to remote Supabase instance.")
            except Exception as e:
                print(f"[SupabaseService] Warning: Could not connect to Supabase: {e}. Using resilient local store.")

    def _load_local_cache(self):
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self._memory_store = json.load(f)
            except Exception:
                self._memory_store = {}

    def _save_local_cache(self):
        try:
            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(self._memory_store, f, indent=2)
        except Exception as e:
            print(f"[SupabaseService] Failed to write local cache: {e}")

    async def save_itinerary(self, itinerary: Itinerary) -> bool:
        itin_dict = itinerary.model_dump()
        self._memory_store[itinerary.trip_id] = itin_dict
        self._save_local_cache()

        if self.is_connected and self.client:
            try:
                # Upsert into supabase 'trips' and 'itineraries' tables
                self.client.table("trips").upsert({
                    "id": itinerary.trip_id,
                    "destination": itinerary.destination,
                    "title": itinerary.title,
                    "total_days": itinerary.total_days,
                    "total_budget": itinerary.total_estimated_cost,
                    "travel_style": itinerary.preferences.travel_style.value,
                    "created_at": itinerary.created_at,
                    "metadata": itin_dict
                }).execute()
                return True
            except Exception as e:
                print(f"[SupabaseService] Remote upsert failed: {e}. Local copy retained.")
        return True

    async def get_itinerary(self, trip_id: str) -> Optional[Itinerary]:
        if self.is_connected and self.client:
            try:
                res = self.client.table("trips").select("*").eq("id", trip_id).execute()
                if res.data and len(res.data) > 0:
                    meta = res.data[0].get("metadata")
                    if meta:
                        return Itinerary(**meta)
            except Exception as e:
                print(f"[SupabaseService] Remote fetch failed: {e}. Checking local cache.")

        if trip_id in self._memory_store:
            return Itinerary(**self._memory_store[trip_id])
        return None

    async def list_trips(self) -> List[Dict[str, Any]]:
        trips = []
        if self.is_connected and self.client:
            try:
                res = self.client.table("trips").select("id, destination, title, total_days, total_budget, travel_style, created_at").order("created_at", desc=True).execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] Remote list failed: {e}. Falling back to local store.")

        for tid, data in self._memory_store.items():
            trips.append({
                "id": tid,
                "destination": data.get("destination", "Unknown"),
                "title": data.get("title", "Saved Trip"),
                "total_days": data.get("total_days", 1),
                "total_budget": data.get("total_estimated_cost", 0.0),
                "travel_style": data.get("preferences", {}).get("travel_style", "solo"),
                "created_at": data.get("created_at", "")
            })
        return trips

    async def delete_trip(self, trip_id: str) -> bool:
        if trip_id in self._memory_store:
            del self._memory_store[trip_id]
            self._save_local_cache()

        if self.is_connected and self.client:
            try:
                self.client.table("trips").delete().eq("id", trip_id).execute()
            except Exception as e:
                print(f"[SupabaseService] Remote delete error: {e}")
        return True

    async def update_day(self, trip_id: str, new_day: DayPlan) -> Optional[Itinerary]:
        itin = await self.get_itinerary(trip_id)
        if not itin:
            return None
        
        # Replace the specific day
        updated_days = []
        for d in itin.days:
            if d.day_number == new_day.day_number:
                updated_days.append(new_day)
            else:
                updated_days.append(d)
        itin.days = updated_days
        itin.total_estimated_cost = round(sum(d.daily_estimated_cost for d in updated_days), 2)
        
        await self.save_itinerary(itin)
        return itin

supabase_service = SupabaseService()
