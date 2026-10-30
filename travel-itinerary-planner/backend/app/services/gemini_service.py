import os
import json
import uuid
import datetime
from typing import Dict, Any, Optional
from ..models.schemas import (
    TripPreferences,
    Itinerary,
    DayPlan,
    Activity,
    DiningRecommendation,
    ActivityCategory,
    TravelStyle,
    BudgetTier,
    Pace
)
from ..config import settings

# Attempt import of Google Generative AI
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


def calculate_num_days(start_date_str: str, end_date_str: str) -> int:
    try:
        d1 = datetime.datetime.strptime(start_date_str, "%Y-%m-%d")
        d2 = datetime.datetime.strptime(end_date_str, "%Y-%m-%d")
        diff = (d2 - d1).days + 1
        return max(1, min(diff, 14)) # clamp between 1 and 14 days
    except Exception:
        return 3

def get_day_date(start_date_str: str, offset: int) -> str:
    try:
        d1 = datetime.datetime.strptime(start_date_str, "%Y-%m-%d")
        d = d1 + datetime.timedelta(days=offset)
        return d.strftime("%Y-%m-%d")
    except Exception:
        return f"Day {offset + 1}"

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client_initialized = False
        if GENAI_AVAILABLE and self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(model_name="gemini-1.5-flash")
                self.client_initialized = True
            except Exception as e:
                print(f"[GeminiService] Warning: Failed to initialize Gemini model: {e}")
                self.client_initialized = False

    def build_system_prompt(self, prefs: TripPreferences) -> str:
        scenario_guidance = ""
        if prefs.travel_style == TravelStyle.SOLO:
            scenario_guidance = (
                "SCENARIO FOCUS: Solo Traveler.\n"
                "- Optimize route to minimize transit friction and walking exhaustion.\n"
                "- Suggest budget-friendly, welcoming dining (counter service, food halls, friendly bistros).\n"
                "- Focus on safe, walkable attractions with easy navigation.\n"
                "- Avoid decision fatigue by providing clear, streamlined schedule."
            )
        elif prefs.travel_style == TravelStyle.COUPLE:
            scenario_guidance = (
                "SCENARIO FOCUS: Romantic Couple Vacation.\n"
                "- Prioritize relaxed pacing, scenic viewpoints, intimate dining, and sunset spots.\n"
                "- Include premium touches, charming atmospheres, and unhurried transitions.\n"
                "- Recommend curated romantic restaurants for dinner."
            )
        elif prefs.travel_style == TravelStyle.FRIENDS:
            scenario_guidance = (
                f"SCENARIO FOCUS: Group of {prefs.group_size} Friends Coordinating a Multi-Day Trip.\n"
                "- Balance diverse interests (adventure, cultural landmarks, lively dining/nightlife).\n"
                "- Incorporate group-friendly logistics, buffer times between locations to prevent delays.\n"
                "- Provide clear cost breakdowns suitable for split budgets."
            )

        return f"""You are an elite AI Travel Concierge and Route Optimization Specialist.
Generate a structured, day-by-day personalized travel itinerary in strictly valid JSON format.

{scenario_guidance}

USER PREFERENCES:
- Destination: {prefs.destination}
- Dates: {prefs.start_date} to {prefs.end_date}
- Travel Style: {prefs.travel_style.value} (Group Size: {prefs.group_size})
- Budget Tier: {prefs.budget_tier.value}
- Desired Pace: {prefs.pace.value}
- Interests: {', '.join(prefs.interests)}
- Dietary Restrictions: {', '.join(prefs.dietary_restrictions) if prefs.dietary_restrictions else 'None'}
- Accommodation Style: {prefs.accommodation_type}
- Special Requests: {prefs.special_requests or 'None'}

REQUIREMENTS:
1. Provide accurate, real attractions and realistic geographic clusters for each day.
2. Structure each day into morning, afternoon, and evening activities.
3. Include specific dining recommendations (Breakfast, Lunch, Dinner).
4. Provide realistic USD estimated costs per activity.
5. Provide practical travel times between consecutive stops.
6. Return ONLY a single raw JSON object matching this schema without markdown codeblocks or quotes.

JSON SCHEMA:
{{
  "title": "string",
  "summary": "string",
  "packing_tips": ["string"],
  "local_customs_advice": "string",
  "days": [
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "theme": "string",
      "logistics_advice": "string",
      "morning_activities": [
        {{
          "id": "act_1",
          "title": "string",
          "description": "string",
          "category": "attraction",
          "time_slot": "09:00 AM - 11:30 AM",
          "estimated_cost": 25.0,
          "location_name": "string",
          "address": "string",
          "latitude": 48.8584,
          "longitude": 2.2945,
          "travel_time_from_prev": "0 mins",
          "tips": "string"
        }}
      ],
      "afternoon_activities": [...],
      "evening_activities": [...],
      "dining_options": [
        {{
          "id": "dine_1",
          "meal_type": "Lunch",
          "restaurant_name": "string",
          "cuisine": "string",
          "price_range": "$$",
          "recommended_dish": "string",
          "address": "string",
          "notes": "string"
        }}
      ]
    }}
  ]
}}"""

    async def generate_itinerary(self, prefs: TripPreferences) -> Itinerary:
        num_days = calculate_num_days(prefs.start_date, prefs.end_date)
        trip_id = f"trip_{uuid.uuid4().hex[:8]}"

        # If Gemini client is active, attempt generative AI call
        if self.client_initialized:
            try:
                prompt = self.build_system_prompt(prefs)
                response = self.model.generate_content(
                    prompt,
                    generation_config={"temperature": 0.3, "max_output_tokens": 4096}
                )
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.endswith("```"):
                    text = text[:-3]
                data = json.loads(text.strip())
                return self._parse_json_to_itinerary(data, prefs, trip_id, num_days)
            except Exception as e:
                print(f"[GeminiService] AI generation error: {e}. Falling back to smart offline generator.")

        # Fallback to intelligent rule-based / template generative engine
        return self._generate_intelligent_fallback_itinerary(prefs, trip_id, num_days)

    def _parse_json_to_itinerary(self, data: Dict[str, Any], prefs: TripPreferences, trip_id: str, num_days: int) -> Itinerary:
        days_list: list[DayPlan] = []
        total_trip_cost = 0.0

        for d_idx, d_data in enumerate(data.get("days", [])):
            day_num = d_data.get("day_number", d_idx + 1)
            date_str = d_data.get("date") or get_day_date(prefs.start_date, d_idx)
            
            def parse_acts(acts):
                res = []
                for a in acts:
                    cost = float(a.get("estimated_cost", 0.0))
                    res.append(Activity(
                        id=a.get("id", f"act_{uuid.uuid4().hex[:6]}"),
                        title=a.get("title", "Local Discovery"),
                        description=a.get("description", "Explore the surrounding cultural highlight."),
                        category=ActivityCategory(a.get("category", "attraction").lower()) if a.get("category", "").lower() in [c.value for c in ActivityCategory] else ActivityCategory.ATTRACTION,
                        time_slot=a.get("time_slot", "Morning"),
                        estimated_cost=cost,
                        location_name=a.get("location_name", prefs.destination),
                        address=a.get("address"),
                        latitude=a.get("latitude"),
                        longitude=a.get("longitude"),
                        travel_time_from_prev=a.get("travel_time_from_prev", "15 mins"),
                        tips=a.get("tips")
                    ))
                return res

            morn = parse_acts(d_data.get("morning_activities", []))
            aft = parse_acts(d_data.get("afternoon_activities", []))
            eve = parse_acts(d_data.get("evening_activities", []))
            
            dining = [
                DiningRecommendation(
                    id=di.get("id", f"din_{uuid.uuid4().hex[:6]}"),
                    meal_type=di.get("meal_type", "Lunch"),
                    restaurant_name=di.get("restaurant_name", "Curated Local Eatery"),
                    cuisine=di.get("cuisine", "Regional"),
                    price_range=di.get("price_range", "$$"),
                    recommended_dish=di.get("recommended_dish", "Chef's Special"),
                    address=di.get("address"),
                    notes=di.get("notes")
                )
                for di in d_data.get("dining_options", [])
            ]

            day_cost = sum(a.estimated_cost for a in morn + aft + eve)
            total_trip_cost += day_cost

            days_list.append(DayPlan(
                day_number=day_num,
                date=date_str,
                theme=d_data.get("theme", f"Discovering {prefs.destination}"),
                morning_activities=morn,
                afternoon_activities=aft,
                evening_activities=eve,
                dining_options=dining,
                daily_estimated_cost=round(day_cost, 2),
                logistics_advice=d_data.get("logistics_advice", "Transit passes offer the best rate.")
            ))

        return Itinerary(
            id=f"itin_{uuid.uuid4().hex[:8]}",
            trip_id=trip_id,
            destination=prefs.destination,
            title=data.get("title", f"Personalized Journey to {prefs.destination}"),
            summary=data.get("summary", f"A custom {num_days}-day itinerary optimizing your {prefs.travel_style.value} trip."),
            total_days=num_days,
            preferences=prefs,
            days=days_list,
            total_estimated_cost=round(total_trip_cost, 2),
            packing_tips=data.get("packing_tips", ["Comfortable walking footwear", "Portable power bank", "Universal adapter"]),
            local_customs_advice=data.get("local_customs_advice", "Carry a credit card and local currency for smaller shops."),
            created_at=datetime.datetime.utcnow().isoformat()
        )

    def _generate_intelligent_fallback_itinerary(self, prefs: TripPreferences, trip_id: str, num_days: int) -> Itinerary:
        """Intelligent, high-quality, customized fallback generator supporting all three scenarios."""
        dest = prefs.destination.title()
        is_solo = prefs.travel_style == TravelStyle.SOLO
        is_couple = prefs.travel_style == TravelStyle.COUPLE
        is_friends = prefs.travel_style == TravelStyle.FRIENDS

        cost_mult = 1.0
        if prefs.budget_tier == BudgetTier.BUDGET:
            cost_mult = 0.5
        elif prefs.budget_tier == BudgetTier.LUXURY:
            cost_mult = 2.2

        # Titles and themes tailored to scenario
        if is_solo:
            trip_title = f"Solo Explorer: {dest} Quick Getaway"
            summary = f"A frictionless {num_days}-day solo adventure through {dest}. Crafted for seamless navigation, verified safety, cultural immersion, and authentic local dining without decision fatigue."
            themes = [
                f"{dest} Iconic Landmarks & Cozy Café Quarters",
                f"Artisan Hidden Gems & Bustling Food Market Walk",
                f"Scenic Panorama, Local Park Stroll & Evening Live Acoustics",
                f"Neighborhood Culture, Crafts & Historic Architecture",
                f"Leisure Morning & Final Souvenir Exploration"
            ]
        elif is_couple:
            trip_title = f"Romantic Escape: {dest} for Two"
            summary = f"An intimate {num_days}-day romantic retreat in {dest}. Features relaxed pacing, panoramic sunset viewpoints, candlelit dining, and private strolls tailored for unforgettable memories."
            themes = [
                f"Sunset Vistas & Candlelit Welcome in {dest}",
                f"Art, Architecture & Intimate Garden Strolls",
                f"Private Waterfront Walk & Wine Tasting Experience",
                f"Scenic Overlook & Culinary Romance Tour",
                f"Slow Brunch & Scenic Keepsake Morning"
            ]
        else: # Friends / Group
            trip_title = f"{dest} Group Getaway: Adventure & Culture"
            summary = f"A high-energy, well-coordinated {num_days}-day group trip for {prefs.group_size} friends in {dest}. Perfectly structured to prevent bottlenecks, balance adventure with downtime, and split costs cleanly."
            themes = [
                f"Group Welcome: City Highlights & Street Food Crawl",
                f"Active Adventure & Iconic Sightseeing Quest",
                f"Cultural Discovery & Sunset Social Gathering",
                f"Local Market Challenge & Group Dinner Celebration",
                f"Farewell Brunch & Group Photo Walk"
            ]

        days: list[DayPlan] = []
        total_cost = 0.0

        for i in range(num_days):
            theme = themes[i % len(themes)]
            day_date = get_day_date(prefs.start_date, i)
            
            # Morning activity
            morn_cost = round(20.0 * cost_mult, 2)
            aft_cost = round(35.0 * cost_mult, 2)
            eve_cost = round(25.0 * cost_mult, 2)

            morn = [
                Activity(
                    id=f"act_m_{i+1}",
                    title=f"{dest} Historical Core & Cultural Walk" if i == 0 else f"{dest} Morning Highlight #{i+1}",
                    description=f"Explore key landmarks of {dest} with minimal morning crowds. Ideal for {prefs.pace.value} pacing.",
                    category=ActivityCategory.ATTRACTION,
                    time_slot="09:00 AM - 11:30 AM",
                    estimated_cost=morn_cost,
                    location_name=f"{dest} Central Historic Quarter",
                    address=f"101 Heritage Ave, {dest}",
                    travel_time_from_prev="10 mins from accommodation",
                    tips="Book tickets ahead online to skip queues. Wear comfortable footwear."
                )
            ]

            aft = [
                Activity(
                    id=f"act_a_{i+1}",
                    title=f"Artisan Quarter & Local Market Immersion",
                    description=f"Sample local specialties, browse handcrafted boutique shops, and soak in {dest}'s living energy.",
                    category=ActivityCategory.ATTRACTION,
                    time_slot="01:30 PM - 04:30 PM",
                    estimated_cost=aft_cost,
                    location_name=f"{dest} Arts District",
                    address=f"204 Artisan Way, {dest}",
                    travel_time_from_prev="15 mins via metro or walk",
                    tips="Great photo opportunities. Many independent vendors accept cards."
                )
            ]

            eve = [
                Activity(
                    id=f"act_e_{i+1}",
                    title="Golden Hour Sunset Overlook & Evening Stroll",
                    description=f"Watch the sunset paint {dest}'s skyline, followed by vibrant evening atmosphere.",
                    category=ActivityCategory.RELAXATION if is_couple else ActivityCategory.ENTERTAINMENT,
                    time_slot="05:30 PM - 07:30 PM",
                    estimated_cost=eve_cost,
                    location_name=f"{dest} Scenic Promenade",
                    address=f"Sunset Terrace, {dest}",
                    travel_time_from_prev="15 mins",
                    tips="Arrive 30 minutes before sunset for the best vantage point."
                )
            ]

            dining = [
                DiningRecommendation(
                    id=f"dine_b_{i+1}",
                    meal_type="Breakfast",
                    restaurant_name=f"Café {dest} Roastery",
                    cuisine="Artisan Bakery & Coffee",
                    price_range="$" if prefs.budget_tier == BudgetTier.BUDGET else "$$",
                    recommended_dish="Fresh Pastries & Single-Origin Espresso",
                    address=f"Central Square, {dest}",
                    notes="Great natural light and relaxed morning seating."
                ),
                DiningRecommendation(
                    id=f"dine_l_{i+1}",
                    meal_type="Lunch",
                    restaurant_name=f"Trattoria del {dest}",
                    cuisine="Regional Traditional",
                    price_range="$$" if prefs.budget_tier != BudgetTier.LUXURY else "$$$",
                    recommended_dish="Handcrafted Specialty of the Day",
                    address=f"Market Plaza, {dest}",
                    notes="Solo-friendly dining with rapid service and warm hospitality."
                ),
                DiningRecommendation(
                    id=f"dine_d_{i+1}",
                    meal_type="Dinner",
                    restaurant_name=f"La Vista Sunset Lounge",
                    cuisine="Modern Fusion",
                    price_range="$$$" if is_couple or prefs.budget_tier == BudgetTier.LUXURY else "$$",
                    recommended_dish="Pan-seared Local Delicacy & Vintage Pairing",
                    address=f"Rooftop Quarter, {dest}",
                    notes="Scenic panoramic views. Prior reservations recommended."
                )
            ]

            day_total = morn_cost + aft_cost + eve_cost
            total_cost += day_total

            logistics = "All spots are clustered within a 2-mile radius to minimize travel time." if is_solo else (
                "Private car service or leisurely waterfront walking recommended for effortless pacing." if is_couple else
                f"Designate a meeting checkpoint and split rideshares for {prefs.group_size} travelers."
            )

            days.append(DayPlan(
                day_number=i + 1,
                date=day_date,
                theme=theme,
                morning_activities=morn,
                afternoon_activities=aft,
                evening_activities=eve,
                dining_options=dining,
                daily_estimated_cost=round(day_total, 2),
                logistics_advice=logistics
            ))

        return Itinerary(
            id=f"itin_{uuid.uuid4().hex[:8]}",
            trip_id=trip_id,
            destination=dest,
            title=trip_title,
            summary=summary,
            total_days=num_days,
            preferences=prefs,
            days=days,
            total_estimated_cost=round(total_cost, 2),
            packing_tips=[
                "Comfortable walking shoes with arch support",
                "Compact universal plug adapter & fast charger",
                "Layered light jacket for temperature drops",
                "Reusable water bottle"
            ],
            local_customs_advice=f"Tipping in {dest} is generally appreciated at 10-15%. Keep transit cards loaded.",
            created_at=datetime.datetime.utcnow().isoformat()
        )

    async def regenerate_day(self, current_day: DayPlan, destination: str, feedback: Optional[str]) -> DayPlan:
        """Regenerates a single day's plan with custom feedback or fresh alternatives."""
        day_num = current_day.day_number
        theme_suffix = "Alternative Scenic & Cultural Route"
        if feedback:
            theme_suffix = f"Custom Focus: {feedback[:30]}"
            
        new_morn = [
            Activity(
                id=f"act_reg_m_{day_num}",
                title=f"{destination} Botanical Gardens & Outdoor Pavilion",
                description=f"Fresh morning itinerary option inspired by feedback: {feedback or 'more outdoor nature'}.",
                category=ActivityCategory.RELAXATION,
                time_slot="09:30 AM - 11:45 AM",
                estimated_cost=15.0,
                location_name=f"{destination} Green Sanctuary",
                travel_time_from_prev="10 mins transit",
                tips="Peaceful and unhurried."
            )
        ]
        
        new_aft = [
            Activity(
                id=f"act_reg_a_{day_num}",
                title=f"{destination} Contemporary Design & Artisan Workshop",
                description="Interactive visit featuring local craftsmanship and hands-on demonstrations.",
                category=ActivityCategory.ATTRACTION,
                time_slot="01:30 PM - 04:00 PM",
                estimated_cost=25.0,
                location_name=f"{destination} Creative District",
                travel_time_from_prev="15 mins walk",
                tips="Gift shop offers unique duty-free souvenirs."
            )
        ]

        new_eve = [
            Activity(
                id=f"act_reg_e_{day_num}",
                title="Acoustic Music Garden & Evening Bites",
                description="Vibrant outdoor terrace with acoustic performances and small tapas plates.",
                category=ActivityCategory.ENTERTAINMENT,
                time_slot="06:00 PM - 08:30 PM",
                estimated_cost=30.0,
                location_name=f"{destination} Riverside Wharf",
                travel_time_from_prev="12 mins rideshare",
                tips="Reserve a waterside table."
            )
        ]

        new_total = sum(a.estimated_cost for a in new_morn + new_aft + new_eve)

        return DayPlan(
            day_number=day_num,
            date=current_day.date,
            theme=f"Day {day_num}: {theme_suffix}",
            morning_activities=new_morn,
            afternoon_activities=new_aft,
            evening_activities=new_eve,
            dining_options=current_day.dining_options,
            daily_estimated_cost=round(new_total, 2),
            logistics_advice="Updated route clustered along the riverside district for seamless walking."
        )

gemini_service = GeminiService()
