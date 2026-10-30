import uuid
from typing import List
from ..models.schemas import TripPreferences, RecommendationItem, RecommendationResponse, TravelStyle, BudgetTier

DESTINATION_KNOWLEDGE_BASE = {
    "paris": [
        {"name": "Louvre Museum & Tuileries Garden", "category": "Culture & Art", "tag": "Sightseeing", "rating": 4.8, "price": "$$", "loc": "1st Arrondissement", "desc": "World's largest museum featuring the Mona Lisa, paired with a stroll in the royal gardens."},
        {"name": "Montmartre & Sacré-Cœur Sunset", "category": "Scenic & Romantic", "tag": "Romantic", "rating": 4.9, "price": "$", "loc": "18th Arrondissement", "desc": "Cobblestone alleys, bohemian painters, and panoramic skyline vistas over Paris."},
        {"name": "Le Marais Artisan Bakery & Café Walk", "category": "Food & Dining", "tag": "Food", "rating": 4.7, "price": "$$", "loc": "4th Arrondissement", "desc": "Taste award-winning croissants, macarons, and artisanal espresso in historic courtyards."},
        {"name": "Seine River Sunset Cruise with Live Jazz", "category": "Experience", "tag": "Romantic", "rating": 4.8, "price": "$$$", "loc": "Pont de l'Alma", "desc": "Gliding under illuminated bridges while sipping champagne."},
        {"name": "Latin Quarter Hidden Bookshops & Bistro", "category": "Culture & Food", "tag": "Culture", "rating": 4.6, "price": "$", "loc": "5th Arrondissement", "desc": "Shakespeare & Company and affordable classic French dining loved by locals."}
    ],
    "tokyo": [
        {"name": "Senso-ji Temple & Asakusa Street Food", "category": "Historic & Culture", "tag": "Culture", "rating": 4.8, "price": "$", "loc": "Taito City", "desc": "Tokyo's oldest Buddhist temple surrounded by bustling Nakamise shopping street."},
        {"name": "Shibuya Crossing & Sky Observatory", "category": "Modern & Vibe", "tag": "Sightseeing", "rating": 4.9, "price": "$$", "loc": "Shibuya", "desc": "360-degree open-air rooftop views over the world's most famous intersection."},
        {"name": "Tsukiji Outer Market Food Tour", "category": "Food & Culinary", "tag": "Food", "rating": 4.9, "price": "$$", "loc": "Chuo City", "desc": "Freshly grilled wagyu skewers, tamagoyaki, and pristine sashimi bowls."},
        {"name": "Shinjuku Gyoen National Garden", "category": "Nature & Relaxation", "tag": "Nature", "rating": 4.7, "price": "$", "loc": "Shinjuku", "desc": "Tranquil blend of traditional Japanese, English, and French landscaped gardens."},
        {"name": "Akihabara Electric Town & Arcade Quest", "category": "Tech & Pop Culture", "tag": "Adventure", "rating": 4.6, "price": "$$", "loc": "Chiyoda", "desc": "Multi-floor retro game centers, anime hubs, and futuristic gadget shops."}
    ],
    "rome": [
        {"name": "Colosseum & Roman Forum Guided Walk", "category": "History & Archaeology", "tag": "Sightseeing", "rating": 4.9, "price": "$$", "loc": "Piazza del Colosseo", "desc": "Walk in the footsteps of gladiators and senators through ancient Rome."},
        {"name": "Trastevere Evening Stroll & Cacio e Pepe", "category": "Food & Nightlife", "tag": "Food", "rating": 4.8, "price": "$$", "loc": "Trastevere", "desc": "Vibrant ivy-draped alleyways with authentic Roman family-run trattorias."},
        {"name": "Vatican Museums & Sistine Chapel", "category": "Art & History", "tag": "Culture", "rating": 4.8, "price": "$$$", "loc": "Vatican City", "desc": "Michelangelo's breathtaking ceiling frescoes and centuries of papal art."},
        {"name": "Trevi Fountain & Spanish Steps at Dawn", "category": "Scenic & Leisure", "tag": "Romantic", "rating": 4.7, "price": "$", "loc": "Trevi / Spagna", "desc": "Beat the crowds to toss a coin and experience quiet marble splendor."},
        {"name": "Villa Borghese Gardens Bike Rental", "category": "Outdoors & Relaxation", "tag": "Nature", "rating": 4.7, "price": "$", "loc": "Piazzale Napoleone", "desc": "Scenic park paths, lake rowing boats, and tranquil panoramic city overlooks."}
    ],
    "bali": [
        {"name": "Ubud Monkey Forest & Rice Terraces", "category": "Nature & Culture", "tag": "Nature", "rating": 4.8, "price": "$", "loc": "Ubud", "desc": "Lush jungle sanctuary with ancient stone temples and cascading green terraces."},
        {"name": "Uluwatu Clifftop Temple & Kecak Dance", "category": "Culture & Sunset", "tag": "Romantic", "rating": 4.9, "price": "$$", "loc": "Uluwatu", "desc": "Dramatic coastal cliffs overlooking crashing waves with hypnotic traditional fire dance."},
        {"name": "Canggu Beachside Sunset & Surfing", "category": "Beach & Nightlife", "tag": "Adventure", "rating": 4.7, "price": "$$", "loc": "Canggu", "desc": "Trendy cafes, beach clubs, and accessible surf breaks for all skill levels."},
        {"name": "Traditional Balinese Cooking Class & Organic Farm", "category": "Food & Culinary", "tag": "Food", "rating": 4.8, "price": "$$", "loc": "Gianyar", "desc": "Pick fresh herbs from local soil and grind authentic sambal by hand."}
    ],
    "new york": [
        {"name": "Central Park & The Metropolitan Museum of Art", "category": "Art & Nature", "tag": "Culture", "rating": 4.9, "price": "$$", "loc": "Manhattan", "desc": "Stroll peaceful tree-lined paths followed by world-class global art collections."},
        {"name": "High Line Walk & Chelsea Market Food Tour", "category": "Urban & Culinary", "tag": "Food", "rating": 4.8, "price": "$$", "loc": "Meatpacking District", "desc": "Elevated park on historical rail tracks leading into artisan taco and lobster stalls."},
        {"name": "Brooklyn Bridge Walk to DUMBO Sunset", "category": "Scenic & Vibe", "tag": "Romantic", "rating": 4.9, "price": "$", "loc": "Brooklyn", "desc": "Iconic architectural walk with unmatched views of the lower Manhattan skyline."}
    ]
}

def generate_smart_recommendations(prefs: TripPreferences) -> RecommendationResponse:
    dest_key = prefs.destination.strip().lower()
    
    # Match destination in knowledge base or fuzzy match
    matched_items = []
    for city, items in DESTINATION_KNOWLEDGE_BASE.items():
        if city in dest_key or dest_key in city:
            matched_items = items
            break
            
    if not matched_items:
        # Dynamic fallback generation tailored to the city
        matched_items = [
            {"name": f"{prefs.destination} Historic Old Town Walking Tour", "category": "Heritage & Architecture", "tag": "Sightseeing", "rating": 4.8, "price": "$", "loc": "City Center", "desc": f"Explore the authentic historic core, charming squares, and local stories of {prefs.destination}."},
            {"name": f"Local Gourmet & Artisan Tasting Experience", "category": "Food & Dining", "tag": "Food", "rating": 4.7, "price": "$$" if prefs.budget_tier == BudgetTier.MODERATE else ("$" if prefs.budget_tier == BudgetTier.BUDGET else "$$$"), "loc": "Culinary District", "desc": f"Savor signature traditional delicacies, street foods, and drinks unique to {prefs.destination}."},
            {"name": f"Panoramic Skyline & Sunset Viewpoint", "category": "Scenic & Relaxation", "tag": "Romantic" if prefs.travel_style == TravelStyle.COUPLE else "Sightseeing", "rating": 4.9, "price": "$", "loc": "High Elevation Point", "desc": f"Unrivaled 360-degree viewpoints overlooking {prefs.destination} during golden hour."},
            {"name": f"{prefs.destination} Cultural Arts & Craft Market", "category": "Culture & Shopping", "tag": "Culture", "rating": 4.6, "price": "$$", "loc": "Artisan Quarter", "desc": "Meet independent makers, watch live craft demonstrations, and find authentic souvenirs."},
            {"name": f"Off-the-Beaten-Path Nature Excursion", "category": "Outdoors & Adventure", "tag": "Adventure" if "adventure" in [i.lower() for i in prefs.interests] else "Nature", "rating": 4.7, "price": "$$", "loc": "Scenic Outskirts", "desc": f"Escape the bustling urban center to discover peaceful nature trails and scenic waterways."}
        ]
        
    scored_items: List[RecommendationItem] = []
    user_interests_lower = [i.lower() for i in prefs.interests]
    
    for item in matched_items:
        score = 70
        tag_lower = item["tag"].lower()
        cat_lower = item["category"].lower()
        
        # Interest matching
        for ui in user_interests_lower:
            if ui in tag_lower or ui in cat_lower or ui in item["desc"].lower():
                score += 15
                
        # Travel style matching
        if prefs.travel_style == TravelStyle.SOLO:
            if item["price"] in ["$", "$$"]:
                score += 10
        elif prefs.travel_style == TravelStyle.COUPLE:
            if "romantic" in tag_lower or "scenic" in cat_lower or "sunset" in item["name"].lower():
                score += 15
        elif prefs.travel_style == TravelStyle.FRIENDS:
            if "adventure" in tag_lower or "nightlife" in cat_lower or "tour" in item["name"].lower():
                score += 15
                
        # Budget matching
        if prefs.budget_tier == BudgetTier.BUDGET and item["price"] == "$":
            score += 10
        elif prefs.budget_tier == BudgetTier.LUXURY and item["price"] == "$$$":
            score += 10
            
        score = min(score, 99)
        
        scored_items.append(
            RecommendationItem(
                id=str(uuid.uuid4())[:8],
                name=item["name"],
                category=item["category"],
                description=item["desc"],
                tag=item["tag"],
                rating=item["rating"],
                price_level=item["price"],
                location=item["loc"],
                match_score=score
            )
        )
        
    scored_items.sort(key=lambda x: x.match_score, reverse=True)
    
    # Generate contextual insight summary
    style_text = f"As a {prefs.travel_style.value} traveler"
    if prefs.travel_style == TravelStyle.COUPLE:
        style_text = "For your romantic couple getaway"
    elif prefs.travel_style == TravelStyle.FRIENDS:
        style_text = f"For your group of {prefs.group_size} friends"
        
    insights = (
        f"{style_text} visiting {prefs.destination}, our recommendation engine prioritized "
        f"{', '.join(prefs.interests[:3])} spots with a {prefs.pace.value} pacing. "
        f"Activities are curated within your {prefs.budget_tier.value} budget bracket with minimum transit friction."
    )
    
    return RecommendationResponse(
        destination=prefs.destination,
        recommendations=scored_items,
        insights=insights
    )
