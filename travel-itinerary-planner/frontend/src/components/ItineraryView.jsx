import React, { useState } from "react";
import DayView from "./DayView";
import BudgetTracker from "./BudgetTracker";
import MapView from "./MapView";
import RecommendationsPanel from "./RecommendationsPanel";

export default function ItineraryView({
  itinerary,
  preferences,
  recommendations,
  onToggleActivity,
  onRegenerateDay,
  onSaveTrip,
  onOpenExport,
  isRegenerating,
  onAddRecommendation
}) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return null;
  }

  const currentDay = itinerary.days[activeDayIndex] || itinerary.days[0];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-full">
                {preferences.travel_style} Trip • {itinerary.total_days} Days
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {preferences.start_date} &rarr; {preferences.end_date}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                {preferences.group_size === 1 ? "1 Solo Traveler" : `${preferences.group_size} Travelers`}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {itinerary.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {itinerary.summary}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={onSaveTrip}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
            >
              <span>💾 Save Trip</span>
            </button>
            <button
              onClick={onOpenExport}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-indigo-100"
            >
              <span>📤 Export & Share</span>
            </button>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex items-center space-x-2 mt-6 overflow-x-auto pb-2 border-t border-slate-100 pt-4">
          {itinerary.days.map((d, idx) => {
            const isActive = idx === activeDayIndex;
            return (
              <button
                key={d.day_number}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-2 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60"
                }`}
              >
                <span>Day {d.day_number}</span>
                <span className="text-[10px] opacity-70">(${d.daily_estimated_cost.toFixed(0)})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left = Day View, Right = Sidecards (Budget, Map, Recommendations) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2">
          <DayView
            day={currentDay}
            onToggleActivity={onToggleActivity}
            onRegenerateDay={onRegenerateDay}
            isRegenerating={isRegenerating}
          />
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          <BudgetTracker itinerary={itinerary} preferences={preferences} />
          <MapView day={currentDay} destination={itinerary.destination} />
          <RecommendationsPanel
            recommendations={recommendations}
            onAddActivity={onAddRecommendation}
            destination={itinerary.destination}
          />
        </div>
      </div>
    </div>
  );
}
