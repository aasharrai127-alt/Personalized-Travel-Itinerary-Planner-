import React from "react";

export default function Navbar({ onReset, onOpenSaved, savedCount, isLiveBackend, onSelectScenario }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">WanderWise AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Personalized Travel Itinerary Planner</p>
          </div>
        </div>

        {/* Center: Scenario Quick Jump Buttons */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-100/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => onSelectScenario("solo_weekend")}
            className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-xs transition"
          >
            🎒 Solo Weekend
          </button>
          <button
            onClick={() => onSelectScenario("couple_romantic")}
            className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-xs transition"
          >
            💑 Romantic Couple
          </button>
          <button
            onClick={() => onSelectScenario("group_friends")}
            className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-white hover:shadow-xs transition"
          >
            👥 Friends Group
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isLiveBackend ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`}></span>
            <span className="font-medium hidden sm:inline">{isLiveBackend ? "FastAPI Live" : "Fast Client Mode"}</span>
          </div>

          <button
            onClick={onOpenSaved}
            className="relative px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Saved Trips</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-600 text-[10px] text-white font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onReset}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1"
          >
            <span>+ New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
}
