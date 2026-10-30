import React from "react";

const CATEGORY_STYLES = {
  attraction: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "🏛️" },
  dining: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "🍴" },
  relaxation: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "🌅" },
  entertainment: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "🎭" },
  transport: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: "🚇" }
};

export default function ActivityCard({ activity, onToggleComplete }) {
  const cat = CATEGORY_STYLES[activity.category] || CATEGORY_STYLES.attraction;
  const isDone = activity.is_completed;

  return (
    <div
      className={`rounded-2xl p-4 transition border ${
        isDone
          ? "bg-slate-50/70 border-slate-200 opacity-70"
          : "bg-white border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(activity.id)}
            className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition ${
              isDone
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-slate-300 hover:border-indigo-500 bg-white"
            }`}
          >
            {isDone && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                {cat.icon} {activity.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                ⏰ {activity.time_slot}
              </span>
              {activity.travel_time_from_prev && (
                <span className="text-[10px] text-slate-400 font-medium">
                  • 🚶 {activity.travel_time_from_prev}
                </span>
              )}
            </div>

            <h4 className={`text-sm font-bold text-slate-900 ${isDone ? "line-through text-slate-400" : ""}`}>
              {activity.title}
            </h4>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {activity.description}
            </p>

            {activity.location_name && (
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-2">
                <span>📍</span>
                <span className="truncate">{activity.location_name} {activity.address ? `(${activity.address})` : ""}</span>
              </div>
            )}

            {activity.tips && (
              <div className="mt-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start space-x-1.5">
                <span className="text-amber-600 font-bold">💡 Tip:</span>
                <span>{activity.tips}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cost Badge */}
        <div className="text-right shrink-0">
          <span className="inline-block text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            {activity.estimated_cost > 0 ? `$${activity.estimated_cost.toFixed(0)}` : "Free"}
          </span>
        </div>
      </div>
    </div>
  );
}
