export const SCENARIO_PRESETS = [
  {
    id: "solo_weekend",
    title: "Scenario 1: Solo Weekend Getaway",
    subtitle: "Short weekend trip, optimized travel time & affordable dining",
    icon: "🎒",
    badge: "Solo Explorer",
    preferences: {
      destination: "Paris",
      start_date: "2026-11-06",
      end_date: "2026-11-08",
      travel_style: "solo",
      group_size: 1,
      budget_tier: "budget",
      total_budget_limit: 300,
      pace: "moderate",
      interests: ["sightseeing", "food", "culture"],
      dietary_restrictions: [],
      accommodation_type: "Boutique Hostel",
      special_requests: "Solo-friendly eateries with easy walking routes."
    }
  },
  {
    id: "couple_romantic",
    title: "Scenario 2: Romantic Couple Vacation",
    subtitle: "Relaxed pacing, scenic sunset spots & premium stays",
    icon: "💑",
    badge: "Couples Romance",
    preferences: {
      destination: "Rome",
      start_date: "2026-11-12",
      end_date: "2026-11-16",
      travel_style: "couple",
      group_size: 2,
      budget_tier: "luxury",
      total_budget_limit: 1500,
      pace: "relaxed",
      interests: ["romantic", "culture", "fine dining", "nature"],
      dietary_restrictions: ["Vegetarian Options"],
      accommodation_type: "5-Star Boutique Hotel",
      special_requests: "Intimate dinner spots with panoramic views and unhurried schedule."
    }
  },
  {
    id: "group_friends",
    title: "Scenario 3: Small Group Multi-Day Trip",
    subtitle: "Group coordination, balanced adventure & split budgets",
    icon: "👥",
    badge: "Group Adventure",
    preferences: {
      destination: "Tokyo",
      start_date: "2026-11-20",
      end_date: "2026-11-24",
      travel_style: "friends",
      group_size: 4,
      budget_tier: "moderate",
      total_budget_limit: 2000,
      pace: "fast-paced",
      interests: ["adventure", "culture", "food", "nightlife", "shopping"],
      dietary_restrictions: [],
      accommodation_type: "Modern Multi-room Apartment",
      special_requests: "Buffer times between activities to avoid group delays; clear cost splits."
    }
  }
];

export const INITIAL_MOCK_ITINERARY = {
  id: "itin_demo_01",
  trip_id: "trip_demo_paris",
  destination: "Paris",
  title: "Solo Explorer: Paris Weekend Getaway",
  summary: "A balanced 3-day solo getaway optimizing transit, eliminating decision fatigue, and delivering authentic dining and iconic cultural sights.",
  total_days: 3,
  total_estimated_cost: 215.00,
  packing_tips: [
    "Comfortable walking shoes (15k+ steps/day)",
    "Contactless payment card / Apple Pay",
    "Compact universal power adapter",
    "Light rain jacket"
  ],
  local_customs_advice: "Always say 'Bonjour' when entering any bakery or café. Tipping is round-up only.",
  preferences: SCENARIO_PRESETS[0].preferences,
  days: [
    {
      day_number: 1,
      date: "2026-11-06",
      theme: "Historic Latin Quarter, Bookshops & Sunset Seine",
      daily_estimated_cost: 65.0,
      logistics_advice: "All locations are within 1.5 miles of each other. Walk or take Metro Line 4.",
      morning_activities: [
        {
          id: "act_101",
          title: "Shakespeare and Company & Notre-Dame Square",
          description: "Browse the historic independent bookshop and admire the Gothic façade of Notre-Dame Cathedral.",
          category: "attraction",
          time_slot: "09:30 AM - 11:30 AM",
          estimated_cost: 0.0,
          location_name: "Latin Quarter / Île de la Cité",
          address: "37 Rue de la Bûcherie, 75005 Paris",
          travel_time_from_prev: "10 mins from hostel",
          tips: "Arrive right at opening to enjoy quiet reading upstairs in the poetry library.",
          is_completed: true
        }
      ],
      afternoon_activities: [
        {
          id: "act_102",
          title: "Sainte-Chapelle Stained Glass Marvel",
          description: "Marvel at 1,113 scenes in glowing 13th-century stained glass soaring two stories high.",
          category: "attraction",
          time_slot: "01:30 PM - 03:30 PM",
          estimated_cost: 13.0,
          location_name: "Sainte-Chapelle",
          address: "10 Bd du Palais, 75001 Paris",
          travel_time_from_prev: "8 mins walk across bridge",
          tips: "Pre-book timed skip-the-line ticket on the official national monuments portal.",
          is_completed: false
        }
      ],
      evening_activities: [
        {
          id: "act_103",
          title: "Sunset Promenade along Pont des Arts",
          description: "Walk across the pedestrian footbridge as golden hour hits the river, listening to local accordionists.",
          category: "relaxation",
          time_slot: "05:30 PM - 07:00 PM",
          estimated_cost: 0.0,
          location_name: "Pont des Arts",
          address: "Passerelle des Arts, 75006 Paris",
          travel_time_from_prev: "12 mins stroll along quays",
          tips: "Grab a fresh crêpe from a riverside cart before sunset.",
          is_completed: false
        }
      ],
      dining_options: [
        {
          id: "dine_101",
          meal_type: "Breakfast",
          restaurant_name: "La Parisienne Bakery",
          cuisine: "French Artisan Bakery",
          price_range: "$",
          recommended_dish: "Award-winning Butter Croissant & Café Crème",
          address: "52 Bd Saint-Germain",
          notes: "Counter service, quick and cheap."
        },
        {
          id: "dine_102",
          meal_type: "Lunch",
          restaurant_name: "Bouillon Racine",
          cuisine: "Classic Art Nouveau French Bistro",
          price_range: "$$",
          recommended_dish: "Duck Confit with Herb Potatoes",
          address: "3 Rue Racine",
          notes: "Very welcoming to solo diners with fast, cordial service."
        },
        {
          id: "dine_103",
          meal_type: "Dinner",
          restaurant_name: "Breizh Café Odéon",
          cuisine: "Artisan Brittany Crêperie",
          price_range: "$$",
          recommended_dish: "Organic Buckwheat Galette with Artisanal Cider",
          address: "1 Rue de l'Odéon",
          notes: "Cozy bar counter seating ideal for individual travelers."
        }
      ]
    },
    {
      day_number: 2,
      date: "2026-11-07",
      theme: "Le Marais Hidden Courtyards, Art & Vintage Finds",
      daily_estimated_cost: 85.0,
      logistics_advice: "The Marais is entirely walkable. No transit needed between stops.",
      morning_activities: [
        {
          id: "act_201",
          title: "Musée Carnavalet (History of Paris)",
          description: "Stroll through royal mansion courtyards discovering Roman ruins, French Revolution artifacts, and Proust's bedroom.",
          category: "attraction",
          time_slot: "10:00 AM - 12:30 PM",
          estimated_cost: 0.0,
          location_name: "Carnavalet Museum",
          address: "23 Rue de Sévigné, 75003 Paris",
          travel_time_from_prev: "15 mins walk",
          tips: "Permanent collection admission is completely free for all visitors.",
          is_completed: false
        }
      ],
      afternoon_activities: [
        {
          id: "act_202",
          title: "Place des Vosges & Concept Boutiques",
          description: "Relax on the manicured lawns of Paris's oldest planned square, surrounded by 17th-century red-brick arcades.",
          category: "attraction",
          time_slot: "02:00 PM - 04:30 PM",
          estimated_cost: 0.0,
          location_name: "Place des Vosges",
          address: "Place des Vosges, 75004 Paris",
          travel_time_from_prev: "6 mins walk",
          tips: "Victor Hugo's former apartment is in corner house #6.",
          is_completed: false
        }
      ],
      evening_activities: [
        {
          id: "act_203",
          title: "Acoustic Jazz Cellar Experience",
          description: "Intimate live jazz performance in an atmospheric underground vaulted stone cellar.",
          category: "entertainment",
          time_slot: "08:30 PM - 10:30 PM",
          estimated_cost: 22.0,
          location_name: "Caveau de la Huchette",
          address: "5 Rue de la Huchette, 75005 Paris",
          travel_time_from_prev: "15 mins",
          tips: "Entry includes one drink. Very safe and welcoming vibe.",
          is_completed: false
        }
      ],
      dining_options: [
        {
          id: "dine_201",
          meal_type: "Lunch",
          restaurant_name: "L'As du Fallafel",
          cuisine: "Middle Eastern Street Food",
          price_range: "$",
          recommended_dish: "Special Falafel Pita with Roasted Eggplant",
          address: "34 Rue des Rosiers",
          notes: "Famous quick lunch with lively takeaway queue."
        },
        {
          id: "dine_202",
          meal_type: "Dinner",
          restaurant_name: "Les Philosophes",
          cuisine: "Classic Parisian Brasserie",
          price_range: "$$",
          recommended_dish: "French Onion Soup Gratinée & Boeuf Bourguignon",
          address: "28 Rue Vieille-du-Temple",
          notes: "Sidewalk tables perfect for people-watching."
        }
      ]
    },
    {
      day_number: 3,
      date: "2026-11-08",
      theme: "Montmartre Bohemian Alleys & Panoramic Skyline",
      daily_estimated_cost: 65.0,
      logistics_advice: "Take Metro Line 12 to Abbesses station. Use Montmartre Funicular if avoiding stair climbing.",
      morning_activities: [
        {
          id: "act_301",
          title: "Sacré-Cœur Dome & Morning Panorama",
          description: "Climb up to the dome for Paris's second highest vantage point after the Eiffel Tower.",
          category: "attraction",
          time_slot: "09:00 AM - 11:00 AM",
          estimated_cost: 8.0,
          location_name: "Basilique du Sacré-Cœur",
          address: "35 Rue du Chevalier de la Barre, 75018 Paris",
          travel_time_from_prev: "20 mins metro",
          tips: "Arrive before 09:30 to beat tour buses. Beware of string bracelet sellers on stairs.",
          is_completed: false
        }
      ],
      afternoon_activities: [
        {
          id: "act_302",
          title: "Rue de l'Abreuvoir & Place Dalida Walking Loop",
          description: "Wander down one of Paris's most picturesque cobblestone curves, past La Maison Rose.",
          category: "relaxation",
          time_slot: "01:00 PM - 03:00 PM",
          estimated_cost: 0.0,
          location_name: "Montmartre Village",
          address: "Rue de l'Abreuvoir, 75018 Paris",
          travel_time_from_prev: "5 mins walk",
          tips: "Great photography spots without heavy crowds.",
          is_completed: false
        }
      ],
      evening_activities: [
        {
          id: "act_303",
          title: "Farewell Sunset Drink at Rooftop Terrass Hotel",
          description: "Sip a mocktail or wine with unobstructed 180° views of the Eiffel Tower flashing at twilight.",
          category: "relaxation",
          time_slot: "05:30 PM - 07:00 PM",
          estimated_cost: 16.0,
          location_name: "Terrass'' Hotel Rooftop",
          address: "12-14 Rue Joseph de Maistre",
          travel_time_from_prev: "10 mins walk",
          tips: "No reservation needed for the terrace bar; walk-in early for window seats.",
          is_completed: false
        }
      ],
      dining_options: [
        {
          id: "dine_301",
          meal_type: "Lunch",
          restaurant_name: "Le Coq & Fils",
          cuisine: "Poultry Specialists / French Comfort",
          price_range: "$$",
          recommended_dish: "Slow-roasted Farmhouse Poultry with Crispy Frites",
          address: "98 Rue Lepic",
          notes: "Warm wood interior and hearty portions."
        }
      ]
    }
  ]
};
