-- ==============================================================================
-- Personalized Travel Itinerary Planner - Supabase Database Schema
-- Epic 2: Supabase Database Setup
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    destination TEXT NOT NULL,
    title TEXT NOT NULL,
    travel_style TEXT NOT NULL CHECK (travel_style IN ('solo', 'couple', 'family', 'friends', 'business')),
    group_size INTEGER NOT NULL DEFAULT 1,
    budget_tier TEXT NOT NULL CHECK (budget_tier IN ('budget', 'moderate', 'luxury')),
    pace TEXT NOT NULL CHECK (pace IN ('relaxed', 'moderate', 'fast-paced')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    total_budget NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ITINERARIES TABLE
CREATE TABLE IF NOT EXISTS itineraries (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    total_estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    packing_tips TEXT[] DEFAULT ARRAY[]::TEXT[],
    local_customs_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DAYS TABLE
CREATE TABLE IF NOT EXISTS itinerary_days (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    itinerary_id TEXT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    theme TEXT NOT NULL,
    daily_estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    logistics_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    day_id TEXT NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('attraction', 'dining', 'transport', 'relaxation', 'accommodation', 'entertainment')),
    time_slot TEXT NOT NULL,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    location_name TEXT NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    travel_time_from_prev TEXT DEFAULT '15 mins',
    tips TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DINING RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS dining_recommendations (
    id TEXT PRIMARY KEY,
    day_id TEXT NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner')),
    restaurant_name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    price_range TEXT NOT NULL CHECK (price_range IN ('$', '$$', '$$$')),
    recommended_dish TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS user_preferences (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL UNIQUE,
    preferred_interests TEXT[] DEFAULT ARRAY['sightseeing', 'food']::TEXT[],
    default_travel_style TEXT DEFAULT 'solo',
    default_budget_tier TEXT DEFAULT 'moderate',
    dietary_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id ON itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_days_itinerary_id ON itinerary_days(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON activities(day_id);
CREATE INDEX IF NOT EXISTS idx_dining_day_id ON dining_recommendations(day_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE dining_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE POLICIES FOR PUBLIC CLIENT ACCESS (CAN BE RESTRICTED WITH AUTH)
CREATE POLICY "Allow public read access to trips" ON trips FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to trips" ON trips FOR ALL USING (true);

CREATE POLICY "Allow public read access to itineraries" ON itineraries FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to itineraries" ON itineraries FOR ALL USING (true);

CREATE POLICY "Allow public read access to activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to activities" ON activities FOR ALL USING (true);
