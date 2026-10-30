import React from "react";

export default function MapView({ day, destination }) {
  if (!day) return null;

  const activities = [
    ...(day.morning_activities || []).map((a) => ({ ...a, period: "Morning", color: "bg-amber-500", border: "border-amber-400" })),
    ...(day.afternoon_activities || []).map((a) => ({ ...a, period: "Afternoon", color: "bg-blue-600", border: "border-blue-400" })),
    ...(day.evening_activities || []).map((a) => ({ ...a, period: "Evening", color: "bg-purple-600", border: "border-purple-400" })),
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Geographic Route & Activity Clusters
          </h3>
          <p className="text-xs text-slate-400">
            Clustered path for Day {day.day_number} in {destination} to minimize transit friction
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {activities.length} Stops Planned
        </span>
      </div>

      {/* Visual Route Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {activities.map((act, idx) => (
          <div key={act.id} className="relative group">
            {/* Step Marker Dot */}
            <div
              className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full ${act.color} text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white shadow-xs`}
            >
              {idx + 1}
            </div>

            <div className="bg-slate-50/80 group-hover:bg-indigo-50/40 rounded-2xl p-3.5 border border-slate-200/80 transition">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold uppercase tracking-wider text-slate-500">
                  {act.period} • {act.time_slot}
                </span>
                {act.travel_time_from_prev && (
                  <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                    🚶 {act.travel_time_from_prev}
                  </span>
                )}
              </div>
              <h5 className="text-xs font-bold text-slate-900">{act.title}</h5>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-1">
                <span>📍</span>
                <span className="truncate">{act.location_name} {act.address ? `• ${act.address}` : ""}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
