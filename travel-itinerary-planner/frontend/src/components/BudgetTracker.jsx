import React from "react";

export default function BudgetTracker({ itinerary, preferences }) {
  if (!itinerary) return null;

  const totalCost = itinerary.total_estimated_cost || 0;
  const targetBudget = preferences.total_budget_limit || (totalCost * 1.25);
  const groupSize = preferences.group_size || 1;
  const perPersonCost = Math.round(totalCost / groupSize);

  const percentUsed = Math.min(100, Math.round((totalCost / targetBudget) * 100));

  // Estimate breakdown
  const activityCost = Math.round(totalCost * 0.45);
  const diningCost = Math.round(totalCost * 0.35);
  const transitCost = Math.round(totalCost * 0.20);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Intelligent Budget & Expense Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            {groupSize > 1 ? `Calculated for group of ${groupSize} travelers` : "Individual traveler budget tracker"}
          </p>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            totalCost <= targetBudget
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {totalCost <= targetBudget ? "✓ On Budget" : "⚠ Above Target"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600">Total Estimated Trip Spend</span>
          <span className="text-slate-900">${totalCost.toFixed(0)} / ${targetBudget.toFixed(0)}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              percentUsed > 90 ? "bg-amber-500" : "bg-indigo-600"
            }`}
            style={{ width: `${percentUsed}%` }}
          ></div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Per Person</span>
          <span className="text-base font-black text-indigo-700">${perPersonCost}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Attractions</span>
          <span className="text-base font-bold text-slate-800">${activityCost}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Dining</span>
          <span className="text-base font-bold text-slate-800">${diningCost}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Local Transit</span>
          <span className="text-base font-bold text-slate-800">${transitCost}</span>
        </div>
      </div>
    </div>
  );
}
