import React, { useState } from "react";

export default function ExportModal({ itinerary, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!itinerary) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(itinerary, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Share & Export Itinerary</h3>
            <p className="text-xs text-slate-500">
              Download your complete plan or print a travel handbook
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">{itinerary.title}</h4>
            <p className="text-xs text-slate-600 mt-1">{itinerary.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 mt-3">
              <span>📍 {itinerary.destination}</span>
              <span>•</span>
              <span>📅 {itinerary.total_days} Days</span>
              <span>•</span>
              <span>💰 Est. ${itinerary.total_estimated_cost}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handlePrint}
              className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-900 text-left transition flex items-center space-x-3"
            >
              <span className="text-2xl">🖨️</span>
              <div>
                <span className="block text-xs font-bold">Print Travel Handbook</span>
                <span className="text-[11px] text-indigo-700/80">Opens browser PDF print dialog</span>
              </div>
            </button>

            <button
              onClick={handleCopyJson}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition flex items-center space-x-3"
            >
              <span className="text-2xl">{copied ? "✅" : "📋"}</span>
              <div>
                <span className="block text-xs font-bold">{copied ? "Copied to Clipboard!" : "Copy Full JSON"}</span>
                <span className="text-[11px] text-slate-500">Raw structured data for APIs</span>
              </div>
            </button>
          </div>

          {/* Quick Preview of Packing Tips */}
          {itinerary.packing_tips && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
              <span className="font-bold text-amber-900 block mb-1.5">🎒 Recommended Packing Essentials:</span>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                {itinerary.packing_tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
