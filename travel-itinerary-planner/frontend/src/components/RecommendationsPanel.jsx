import React from "react";

export default function RecommendationsPanel({ recommendations, onAddActivity, destination }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Curated Recommendations in {destination}
          </h3>
          <p className="text-xs text-slate-400">
            Hand-picked alternative attractions & experiences with high match scores
          </p>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
          AI Suggested
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 transition flex items-start justify-between gap-3"
          >
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {item.match_score}% Match
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {item.price_level} • ⭐ {item.rating}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                {item.description}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">📍 {item.location}</span>
            </div>

            <button
              onClick={() => onAddActivity(item)}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-600 text-xs font-bold hover:bg-indigo-50 hover:border-indigo-300 transition shadow-xs"
              title="Add into current day"
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
