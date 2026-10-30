-- ==============================================================================
-- Personalized Travel Itinerary Planner - Seed Data for 3 Core Scenarios
-- ==============================================================================

-- SCENARIO 1: Solo Traveler Weekend Getaway in Paris
INSERT INTO trips (id, destination, title, travel_style, group_size, budget_tier, pace, start_date, end_date, total_days, total_budget, metadata)
VALUES (
    'trip_solo_paris_01',
    'Paris',
    'Solo Explorer: Paris Weekend Getaway',
    'solo',
    1,
    'budget',
    'moderate',
    '2026-11-06',
    '2026-11-08',
    3,
    215.00,
    '{
      "summary": "Frictionless 3-day solo trip with optimized transit and affordable cultural highlights.",
      "packing_tips": ["Metro card", "Comfortable walking shoes", "Crossbody anti-theft bag"]
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- SCENARIO 2: Romantic Couple Vacation in Rome
INSERT INTO trips (id, destination, title, travel_style, group_size, budget_tier, pace, start_date, end_date, total_days, total_budget, metadata)
VALUES (
    'trip_couple_rome_02',
    'Rome',
    'Romantic Escape: Rome for Two',
    'couple',
    2,
    'luxury',
    'relaxed',
    '2026-11-12',
    '2026-11-16',
    5,
    940.00,
    '{
      "summary": "Romantic Roman holiday featuring candlelit dining, scenic sunset hills, and unhurried pacing.",
      "packing_tips": ["Smart casual evening attire", "Sunscreen", "Polaroid camera"]
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- SCENARIO 3: Small Group Adventure in Tokyo
INSERT INTO trips (id, destination, title, travel_style, group_size, budget_tier, pace, start_date, end_date, total_days, total_budget, metadata)
VALUES (
    'trip_friends_tokyo_03',
    'Tokyo',
    'Tokyo Group Quest: Culture, Tech & Food',
    'friends',
    4,
    'moderate',
    'fast-paced',
    '2026-11-20',
    '2026-11-24',
    5,
    1180.00,
    '{
      "summary": "Dynamic multi-day group holiday balancing gaming, anime districts, historic shrines, and Izakaya crawls.",
      "packing_tips": ["Suica transit card", "Coin pouch for yen", "Pocket Wi-Fi"]
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;
