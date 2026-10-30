import React from "react";
import { SCENARIO_PRESETS } from "../services/mockData";

export default function ScenarioPresets({ onSelectPreset, activePresetId }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Official Evaluation Scenarios
          </h2>
          <p className="text-xs text-slate-400">
            Click any scenario to instantly preload verified trip parameters
          </p>
        </div>
        <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 font-semibold px-2.5 py-1 rounded-full">
          3 Scenarios Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SCENARIO_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left relative overflow-hidden ${
                isSelected
                  ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                  : "bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-xs hover:border-indigo-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  ACTIVE
                </div>
              )}
              <div className="flex items-start space-x-3 mb-2">
                <span className="text-2xl p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                  {preset.icon}
                </span>
                <div className="flex-1 pr-6">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full mb-1">
                    {preset.badge}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {preset.title.replace("Scenario ", "S")}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {preset.subtitle}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">📍 {preset.preferences.destination}</span>
                  <span>•</span>
                  <span>{preset.preferences.group_size === 1 ? "1 Solo" : `${preset.preferences.group_size} People`}</span>
                </div>
                <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition inline-flex items-center">
                  Load &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
