import React, { useState } from "react";

const POPULAR_DESTINATIONS = ["Paris", "Tokyo", "Rome", "Bali", "New York", "Barcelona", "Kyoto"];

const INTEREST_OPTIONS = [
  { id: "sightseeing", label: "Historic Sightseeing", icon: "🏛️" },
  { id: "food", label: "Culinary & Food", icon: "🍜" },
  { id: "romantic", label: "Romantic Spots", icon: "🍷" },
  { id: "culture", label: "Art & Culture", icon: "🎨" },
  { id: "nature", label: "Nature & Parks", icon: "🌿" },
  { id: "adventure", label: "Outdoor Adventure", icon: "🧗" },
  { id: "nightlife", label: "Bars & Nightlife", icon: "🍸" },
  { id: "shopping", label: "Boutique Shopping", icon: "🛍️" },
];

export default function TripBuilder({ preferences, onChange, onGenerate, isGenerating }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleInterest = (interestId) => {
    const current = preferences.interests || [];
    if (current.includes(interestId)) {
      onChange({ ...preferences, interests: current.filter((i) => i !== interestId) });
    } else {
      onChange({ ...preferences, interests: [...current, interestId] });
    }
  };

  const calculateDays = () => {
    if (!preferences.start_date || !preferences.end_date) return 3;
    const d1 = new Date(preferences.start_date);
    const d2 = new Date(preferences.end_date);
    const diff = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diff, 14));
  };

  const daysCount = calculateDays();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/40 mb-10">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Design Your Intelligent Travel Itinerary
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure your preferences. Our Generative AI engine constructs an optimized, day-wise plan.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            {daysCount} Days Trip
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Destination & Quick Chips */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Where are you going? <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              📍
            </span>
            <input
              type="text"
              value={preferences.destination || ""}
              onChange={(e) => onChange({ ...preferences, destination: e.target.value })}
              placeholder="e.g. Paris, Tokyo, Rome, New York..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Quick city suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] text-slate-400 font-medium">Quick Pick:</span>
            {POPULAR_DESTINATIONS.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onChange({ ...preferences, destination: city })}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  preferences.destination?.toLowerCase() === city.toLowerCase()
                    ? "bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs"
                    : "bg-slate-100/70 hover:bg-slate-200/70 text-slate-700 border-slate-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={preferences.start_date || ""}
              onChange={(e) => onChange({ ...preferences, start_date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={preferences.end_date || ""}
              onChange={(e) => onChange({ ...preferences, end_date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Travel Style Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Travel Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "solo", label: "Solo Traveler", icon: "🎒", desc: "Route-optimized, safe, friendly" },
              { id: "couple", label: "Romantic Couple", icon: "💑", desc: "Relaxed pacing, sunset spots" },
              { id: "friends", label: "Group / Friends", icon: "👥", desc: "Split budget, group balance" },
              { id: "family", label: "Family Holiday", icon: "👨‍👩‍👧", desc: "All ages, easy transitions" },
            ].map((style) => {
              const isSelected = preferences.travel_style === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onChange({ 
                    ...preferences, 
                    travel_style: style.id,
                    group_size: style.id === "solo" ? 1 : (style.id === "couple" ? 2 : (preferences.group_size < 3 ? 4 : preferences.group_size))
                  })}
                  className={`p-3 rounded-2xl border text-left transition relative ${
                    isSelected
                      ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-bold"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xl mb-1">{style.icon}</div>
                  <div className="text-xs font-bold">{style.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-normal leading-tight">{style.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Group Size and Budget Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Group Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Travelers ({preferences.group_size || 1})
            </label>
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => onChange({ ...preferences, group_size: Math.max(1, (preferences.group_size || 1) - 1) })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="50"
                value={preferences.group_size || 1}
                onChange={(e) => onChange({ ...preferences, group_size: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full text-center bg-transparent font-bold text-slate-900 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onChange({ ...preferences, group_size: (preferences.group_size || 1) + 1 })}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Budget Tier */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Budget Tier
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
              {[
                { id: "budget", label: "Budget", icon: "$" },
                { id: "moderate", label: "Moderate", icon: "$$" },
                { id: "luxury", label: "Luxury", icon: "$$$" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => onChange({ ...preferences, budget_tier: tier.id })}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    preferences.budget_tier === tier.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tier.icon} {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desired Pace */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Trip Pacing
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
              {[
                { id: "relaxed", label: "Relaxed" },
                { id: "moderate", label: "Balanced" },
                { id: "fast-paced", label: "Action" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange({ ...preferences, pace: p.id })}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    preferences.pace === p.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests Multi-Select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Interests & Highlights (Select multiple)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INTEREST_OPTIONS.map((opt) => {
              const active = (preferences.interests || []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleInterest(opt.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center space-x-2 transition ${
                    active
                      ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-bold shadow-xs"
                      : "bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle Advanced Preferences */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>{showAdvanced ? "▲ Hide Advanced Options" : "▼ Show Dietary & Special Requests"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Budget Target ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={preferences.total_budget_limit || ""}
                  onChange={(e) => onChange({ ...preferences, total_budget_limit: parseFloat(e.target.value) || null })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Notes or Requirements
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian dining, avoid steep climbs, late mornings"
                  value={preferences.special_requests || ""}
                  onChange={(e) => onChange({ ...preferences, special_requests: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            type="button"
            disabled={isGenerating}
            onClick={onGenerate}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition duration-200 flex items-center justify-center space-x-2 ${
              isGenerating
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25 active:scale-[0.99]"
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Synthesizing Optimal Route & Recommendations...</span>
              </>
            ) : (
              <>
                <span>✨ Generate Personalized AI Itinerary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
