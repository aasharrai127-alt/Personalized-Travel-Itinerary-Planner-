import React, { useState } from "react";
import ActivityCard from "./ActivityCard";

export default function DayView({ day, onToggleActivity, onRegenerateDay, isRegenerating }) {
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleRegenSubmit = (e) => {
    e.preventDefault();
    onRegenerateDay(day.day_number, feedback);
    setShowRegenModal(false);
    setFeedback("");
  };

  return (
    <div className="space-y-6">
      {/* Day Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
              <span>Day {day.day_number}</span>
              <span>•</span>
              <span>{day.date}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">{day.theme}</h3>
            {day.logistics_advice && (
              <p className="text-xs text-indigo-200/80 mt-2 flex items-center space-x-1.5">
                <span>🧭 Route Optimization:</span>
                <span>{day.logistics_advice}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-3.5 py-2 rounded-2xl text-right">
              <span className="block text-[10px] uppercase font-bold text-indigo-200">Est. Daily Spend</span>
              <span className="text-lg font-black text-white">${day.daily_estimated_cost.toFixed(0)}</span>
            </div>

            <button
              onClick={() => setShowRegenModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1 shadow-sm"
            >
              <span>🔄 Regenerate Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regeneration Modal */}
      {showRegenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900">
              Customize & Regenerate Day {day.day_number}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Provide instructions or preferences (e.g., "Add more relaxed outdoor parks" or "Include a local food market").
            </p>

            <form onSubmit={handleRegenSubmit} className="mt-4 space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your preferences here..."
                rows="3"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              ></textarea>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegenModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegenerating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isRegenerating ? "Regenerating..." : "Apply & Rewrite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Time Slot Sections */}
      <div className="space-y-6">
        {/* Morning Activities */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Morning Session</h4>
          </div>
          <div className="space-y-3">
            {day.morning_activities?.map((act) => (
              <ActivityCard key={act.id} activity={act} onToggleComplete={onToggleActivity} />
            ))}
          </div>
        </div>

        {/* Afternoon Activities */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Afternoon Session</h4>
          </div>
          <div className="space-y-3">
            {day.afternoon_activities?.map((act) => (
              <ActivityCard key={act.id} activity={act} onToggleComplete={onToggleActivity} />
            ))}
          </div>
        </div>

        {/* Evening Activities */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Evening Session</h4>
          </div>
          <div className="space-y-3">
            {day.evening_activities?.map((act) => (
              <ActivityCard key={act.id} activity={act} onToggleComplete={onToggleActivity} />
            ))}
          </div>
        </div>

        {/* Dining Recommendations */}
        {day.dining_options && day.dining_options.length > 0 && (
          <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-base">🍴</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Curated Dining & Culinary Highlights
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {day.dining_options.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl p-3.5 border border-emerald-200/60 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {d.meal_type}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{d.price_range}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 truncate">{d.restaurant_name}</h5>
                  <p className="text-[11px] text-slate-500">{d.cuisine}</p>
                  <div className="mt-2 text-[11px] text-slate-700 font-medium bg-slate-50 p-2 rounded-lg">
                    <span className="text-emerald-700 font-semibold">Recommended:</span> {d.recommended_dish}
                  </div>
                  {d.notes && <p className="text-[10px] text-slate-400 mt-1 italic">{d.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
