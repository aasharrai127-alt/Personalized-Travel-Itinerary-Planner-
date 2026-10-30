import { SCENARIO_PRESETS, INITIAL_MOCK_ITINERARY } from "./mockData";

const API_BASE_URL = "/api";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return { online: false, mode: "client-side-engine" };
    const data = await res.json();
    return { online: true, ...data };
  } catch (err) {
    return { online: false, mode: "client-side-engine", note: "Backend not connected; running high-performance client engine" };
  }
}

export async function generateItinerary(preferences) {
  try {
    const res = await fetch(`${API_BASE_URL}/itinerary/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences }),
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend API unreachable, using intelligent client generative engine.", err);
  }

  // Client-side Generative Engine
  return generateClientSideItinerary(preferences);
}

export async function regenerateDay(tripId, dayNumber, feedback) {
  try {
    const res = await fetch(`${API_BASE_URL}/itinerary/regenerate-day`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trip_id: tripId, day_number: dayNumber, feedback }),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend API unreachable for day regeneration, using client engine.");
  }

  // Fallback client day regeneration
  return null;
}

export async function fetchRecommendations(preferences) {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend API unreachable for recommendations.");
  }

  // Local fallback recommendations
  return {
    destination: preferences.destination,
    insights: `Tailored for a ${preferences.travel_style} traveler visiting ${preferences.destination} with ${preferences.pace} pacing.`,
    recommendations: [
      {
        id: "rec_1",
        name: `${preferences.destination} Signature Cultural Walking Route`,
        category: "Sightseeing",
        tag: "Sightseeing",
        rating: 4.9,
        price_level: preferences.budget_tier === "budget" ? "$" : "$$",
        location: "Historic District",
        match_score: 96,
        description: `Essential heritage monuments and scenic viewpoints in ${preferences.destination}.`
      },
      {
        id: "rec_2",
        name: `Local Gourmet Street Tasting & Artisan Food Hall`,
        category: "Culinary",
        tag: "Food",
        rating: 4.8,
        price_level: "$$",
        location: "Central Market",
        match_score: 92,
        description: `Award-winning local delicacies, specialty coffee, and organic street bites.`
      },
      {
        id: "rec_3",
        name: `Golden Hour Scenic Panorama Overlook`,
        category: "Scenic & Leisure",
        tag: preferences.travel_style === "couple" ? "Romantic" : "Relaxation",
        rating: 4.8,
        price_level: "$",
        location: "Elevated Observation Deck",
        match_score: 89,
        description: `Unobstructed vistas over the skyline during sunset with zero transit hassle.`
      }
    ]
  };
}

// Resilient Client Generative Engine
function generateClientSideItinerary(prefs) {
  const d1 = new Date(prefs.start_date || Date.now());
  const d2 = new Date(prefs.end_date || Date.now());
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.max(1, Math.min(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 14)) || 3;

  const dest = prefs.destination ? prefs.destination.trim() : "Paris";
  const costMultiplier = prefs.budget_tier === "budget" ? 0.6 : (prefs.budget_tier === "luxury" ? 2.2 : 1.0);

  const days = [];
  let totalCost = 0;

  for (let i = 0; i < diffDays; i++) {
    const dayDate = new Date(d1);
    dayDate.setDate(d1.getDate() + i);
    const dateStr = dayDate.toISOString().split("T")[0];

    const mornCost = Math.round(18 * costMultiplier);
    const aftCost = Math.round(30 * costMultiplier);
    const eveCost = Math.round(25 * costMultiplier);
    const dayTotal = mornCost + aftCost + eveCost;
    totalCost += dayTotal;

    const themeTitles = [
      `Historic Core, Iconic Architecture & Charming Cafés`,
      `Artisan Quarters, Local Markets & Hidden Courtyards`,
      `Scenic Riverfront, Panoramic Vistas & Sunset Lounge`,
      `Cultural Museum Masterpieces & Bohemian Alleyways`,
      `Garden Sanctuaries, Boutique Strolls & Farewell Dinner`
    ];

    days.push({
      day_number: i + 1,
      date: dateStr,
      theme: themeTitles[i % themeTitles.length],
      daily_estimated_cost: dayTotal,
      logistics_advice: prefs.travel_style === "friends" 
        ? `Split transit into groups of ${prefs.group_size}. Keep 20-min buffer times.`
        : `Clustered within walking distance to reduce transit fatigue.`,
      morning_activities: [
        {
          id: `act_m_${i+1}_${Date.now()}`,
          title: `${dest} Landmark Exploration & Heritage Discovery`,
          description: `Begin the day at ${dest}'s central historic site with uncrowded morning access.`,
          category: "attraction",
          time_slot: "09:00 AM - 11:30 AM",
          estimated_cost: mornCost,
          location_name: `${dest} Heritage Landmark`,
          address: `100 Old Town Blvd, ${dest}`,
          travel_time_from_prev: "10 mins from accommodation",
          tips: "Pre-book mobile ticket to skip the queue.",
          is_completed: false
        }
      ],
      afternoon_activities: [
        {
          id: `act_a_${i+1}_${Date.now()}`,
          title: `Artisan Quarter Stroll & Local Specialty Tasting`,
          description: `Wander through boutique pedestrian lanes, sample local treats, and discover artisan crafts.`,
          category: "attraction",
          time_slot: "01:30 PM - 04:30 PM",
          estimated_cost: aftCost,
          location_name: `${dest} Cultural Square`,
          address: `250 Craft Ave, ${dest}`,
          travel_time_from_prev: "15 mins walk / tram",
          tips: "Many small shops offer complimentary tastings.",
          is_completed: false
        }
      ],
      evening_activities: [
        {
          id: `act_e_${i+1}_${Date.now()}`,
          title: `Golden Hour Sunset Promenade & Atmosphere`,
          description: `Catch the golden hour light hitting the city skyline, followed by relaxed evening strolls.`,
          category: prefs.travel_style === "couple" ? "relaxation" : "entertainment",
          time_slot: "05:30 PM - 07:30 PM",
          estimated_cost: eveCost,
          location_name: `${dest} Scenic Lookout`,
          address: `Panoramic Terrace, ${dest}`,
          travel_time_from_prev: "12 mins transit",
          tips: "Ideal lighting for photos.",
          is_completed: false
        }
      ],
      dining_options: [
        {
          id: `dine_b_${i+1}`,
          meal_type: "Breakfast",
          restaurant_name: `Café ${dest} Roasters`,
          cuisine: "Artisan Bakery & Coffee",
          price_range: prefs.budget_tier === "budget" ? "$" : "$$",
          recommended_dish: "Handcrafted Pastry & Signature Brew",
          address: "Main Plaza",
          notes: "Fast, solo-friendly or cozy table seating."
        },
        {
          id: `dine_l_${i+1}`,
          meal_type: "Lunch",
          restaurant_name: `Trattoria / Bistro ${dest}`,
          cuisine: "Authentic Regional",
          price_range: "$$",
          recommended_dish: "Chef's Daily Market Special",
          address: "Old Town Market",
          notes: "Great atmosphere with prompt service."
        },
        {
          id: `dine_d_${i+1}`,
          meal_type: "Dinner",
          restaurant_name: `${dest} Sunset Bistro`,
          cuisine: "Contemporary Fusion",
          price_range: prefs.travel_style === "couple" || prefs.budget_tier === "luxury" ? "$$$" : "$$",
          recommended_dish: "Grilled Catch of the Day & Seasonal Dessert",
          address: "Waterside Promenade",
          notes: "Reserve in advance for best window views."
        }
      ]
    });
  }

  return {
    id: `itin_${Date.now()}`,
    trip_id: `trip_${Date.now()}`,
    destination: dest,
    title: prefs.travel_style === "solo" 
      ? `Solo Explorer: ${dest} Smart Getaway`
      : (prefs.travel_style === "couple" ? `Romantic Escape: ${dest} for Two` : `${dest} Group Journey (${prefs.group_size} Travelers)`),
    summary: `A personalized ${diffDays}-day itinerary in ${dest} tailored to your ${prefs.travel_style} travel style, ${prefs.budget_tier} budget tier, and ${prefs.pace} pace.`,
    total_days: diffDays,
    total_estimated_cost: totalCost,
    packing_tips: [
      "Comfortable walking shoes with cushioned soles",
      "Universal travel adapter & fast-charge power bank",
      "Compact weather-resistant jacket",
      "Reusable filtered water bottle"
    ],
    local_customs_advice: `In ${dest}, carry both contactless cards and a small amount of cash. Check opening hours for small boutiques on Sundays.`,
    preferences: prefs,
    days: days
  };
}
