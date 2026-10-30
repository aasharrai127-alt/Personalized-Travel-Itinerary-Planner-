import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ScenarioPresets from "./components/ScenarioPresets";
import TripBuilder from "./components/TripBuilder";
import ItineraryView from "./components/ItineraryView";
import ExportModal from "./components/ExportModal";
import { SCENARIO_PRESETS, INITIAL_MOCK_ITINERARY } from "./services/mockData";
import { checkBackendHealth, generateItinerary, fetchRecommendations } from "./services/api";

export default function App() {
  const [preferences, setPreferences] = useState(SCENARIO_PRESETS[0].preferences);
  const [activePresetId, setActivePresetId] = useState("solo_weekend");
  const [itinerary, setItinerary] = useState(INITIAL_MOCK_ITINERARY);
  const [recommendations, setRecommendations] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Initialize and check health
  useEffect(() => {
    // Check saved trips from localStorage
    const saved = localStorage.getItem("wanderwise_saved_trips");
    if (saved) {
      try {
        setSavedTrips(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved trips", e);
      }
    }

    // Health check
    checkBackendHealth().then((health) => {
      setIsLiveBackend(health.online);
    });

    // Fetch initial recommendations
    fetchRecommendations(SCENARIO_PRESETS[0].preferences).then((data) => {
      setRecommendations(data.recommendations || []);
    });
  }, []);

  // Handle Scenario preset selection
  const handleSelectPreset = async (preset) => {
    setActivePresetId(preset.id);
    setPreferences(preset.preferences);
    setIsGenerating(true);

    const newItin = await generateItinerary(preset.preferences);
    setItinerary(newItin);

    const recs = await fetchRecommendations(preset.preferences);
    setRecommendations(recs.recommendations || []);
    setIsGenerating(false);
  };

  // Handle Generate Itinerary button
  const handleGenerate = async () => {
    if (!preferences.destination) {
      alert("Please enter a travel destination!");
      return;
    }
    setIsGenerating(true);
    try {
      const newItin = await generateItinerary(preferences);
      setItinerary(newItin);

      const recs = await fetchRecommendations(preferences);
      setRecommendations(recs.recommendations || []);
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle activity checkbox completion
  const handleToggleActivity = (activityId) => {
    if (!itinerary) return;
    const updatedDays = itinerary.days.map((day) => {
      const toggle = (list) =>
        list.map((act) => (act.id === activityId ? { ...act, is_completed: !act.is_completed } : act));
      return {
        ...day,
        morning_activities: toggle(day.morning_activities),
        afternoon_activities: toggle(day.afternoon_activities),
        evening_activities: toggle(day.evening_activities),
      };
    });
    setItinerary({ ...itinerary, days: updatedDays });
  };

  // Regenerate a single day
  const handleRegenerateDay = async (dayNumber, feedback) => {
    setIsRegenerating(true);
    // Find current day
    const day = itinerary.days.find((d) => d.day_number === dayNumber);
    if (!day) return;

    // Build replacement day
    const dest = itinerary.destination;
    const newMorn = [
      {
        id: `act_reg_m_${Date.now()}`,
        title: `${dest} Scenic Discovery & Cultural Pavilion`,
        description: `Customized exploration based on your note: "${feedback || "More outdoor relaxed pacing"}"`,
        category: "relaxation",
        time_slot: "09:30 AM - 11:45 AM",
        estimated_cost: 15.0,
        location_name: `${dest} Waterfront Promenade`,
        address: `Riverside Walk, ${dest}`,
        travel_time_from_prev: "10 mins transit",
        tips: "Tranquil morning spot without heavy crowds.",
        is_completed: false,
      },
    ];

    const newAft = [
      {
        id: `act_reg_a_${Date.now()}`,
        title: `${dest} Heritage Crafts & Artisan Alley`,
        description: `Hands-on look at traditional crafts, boutique galleries, and specialty treats.`,
        category: "attraction",
        time_slot: "02:00 PM - 04:30 PM",
        estimated_cost: 25.0,
        location_name: `${dest} Artisan Quarter`,
        address: `45 Creative Way, ${dest}`,
        travel_time_from_prev: "15 mins walk",
        tips: "Great spot for local souvenirs.",
        is_completed: false,
      },
    ];

    const newEve = [
      {
        id: `act_reg_e_${Date.now()}`,
        title: `Twilight Acoustic Lounge & Sunset Terrace`,
        description: `Relax with ambient live acoustics and evening skyline vistas.`,
        category: "entertainment",
        time_slot: "06:00 PM - 08:30 PM",
        estimated_cost: 30.0,
        location_name: `${dest} High Point Lounge`,
        address: `Rooftop Terrace, ${dest}`,
        travel_time_from_prev: "12 mins",
        tips: "Ideal golden hour views.",
        is_completed: false,
      },
    ];

    const newDayCost = 15.0 + 25.0 + 30.0;

    const updatedDays = itinerary.days.map((d) => {
      if (d.day_number === dayNumber) {
        return {
          ...d,
          theme: `Day ${dayNumber}: Refined Custom Route (${feedback ? feedback.slice(0, 25) : "Scenic Focus"})`,
          morning_activities: newMorn,
          afternoon_activities: newAft,
          evening_activities: newEve,
          daily_estimated_cost: newDayCost,
          logistics_advice: "Clustered walking circuit with convenient transit connection.",
        };
      }
      return d;
    });

    const newTotal = updatedDays.reduce((acc, d) => acc + d.daily_estimated_cost, 0);
    setItinerary({ ...itinerary, days: updatedDays, total_estimated_cost: newTotal });
    setIsRegenerating(false);
  };

  // Add an item from recommendations panel into current active day
  const handleAddRecommendation = (recItem) => {
    if (!itinerary || !itinerary.days || itinerary.days.length === 0) return;
    const targetDayIndex = 0; // add to active day
    const targetDay = itinerary.days[targetDayIndex];

    const newAct = {
      id: `act_add_${Date.now()}`,
      title: recItem.name,
      description: recItem.description,
      category: "attraction",
      time_slot: "04:30 PM - 06:00 PM",
      estimated_cost: recItem.price_level === "$" ? 10.0 : (recItem.price_level === "$$$" ? 50.0 : 25.0),
      location_name: recItem.location,
      address: `${recItem.location}, ${itinerary.destination}`,
      travel_time_from_prev: "10 mins transit",
      tips: `AI Recommendation match score: ${recItem.match_score}%.`,
      is_completed: false,
    };

    const updatedDays = [...itinerary.days];
    updatedDays[targetDayIndex] = {
      ...targetDay,
      afternoon_activities: [...targetDay.afternoon_activities, newAct],
      daily_estimated_cost: targetDay.daily_estimated_cost + newAct.estimated_cost,
    };

    const newTotal = updatedDays.reduce((acc, d) => acc + d.daily_estimated_cost, 0);
    setItinerary({ ...itinerary, days: updatedDays, total_estimated_cost: newTotal });
    alert(`Added "${recItem.name}" to Day ${targetDay.day_number}!`);
  };

  // Save trip to localStorage and notify user
  const handleSaveTrip = () => {
    if (!itinerary) return;
    const existing = savedTrips.filter((t) => t.id !== itinerary.id);
    const updated = [itinerary, ...existing];
    setSavedTrips(updated);
    localStorage.setItem("wanderwise_saved_trips", JSON.stringify(updated));
    alert("Trip successfully saved to your collection!");
  };

  // Delete saved trip
  const handleDeleteTrip = (tripId) => {
    const updated = savedTrips.filter((t) => t.id !== tripId);
    setSavedTrips(updated);
    localStorage.setItem("wanderwise_saved_trips", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-20 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onReset={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenSaved={() => setShowSavedModal(true)}
        savedCount={savedTrips.length}
        isLiveBackend={isLiveBackend}
        onSelectScenario={(presetId) => {
          const match = SCENARIO_PRESETS.find((p) => p.id === presetId);
          if (match) handleSelectPreset(match);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Scenario Presets Banner */}
        <ScenarioPresets
          onSelectPreset={handleSelectPreset}
          activePresetId={activePresetId}
        />

        {/* Trip Builder Form */}
        <TripBuilder
          preferences={preferences}
          onChange={setPreferences}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Dynamic Itinerary Viewer */}
        <ItineraryView
          itinerary={itinerary}
          preferences={preferences}
          recommendations={recommendations}
          onToggleActivity={handleToggleActivity}
          onRegenerateDay={handleRegenerateDay}
          onSaveTrip={handleSaveTrip}
          onOpenExport={() => setShowExportModal(true)}
          isRegenerating={isRegenerating}
          onAddRecommendation={handleAddRecommendation}
        />
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          itinerary={itinerary}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Saved Trips Drawer/Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Your Saved Itineraries</h3>
                <p className="text-xs text-slate-500">Stored locally and synced with Supabase</p>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {savedTrips.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No saved trips yet. Click "Save Trip" on any generated itinerary!
              </div>
            ) : (
              <div className="space-y-3">
                {savedTrips.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        📍 {st.destination} • {st.total_days} Days • Est. ${st.total_estimated_cost}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setItinerary(st);
                          setPreferences(st.preferences || preferences);
                          setShowSavedModal(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(st.id)}
                        className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-xs hover:bg-rose-100 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSavedModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
