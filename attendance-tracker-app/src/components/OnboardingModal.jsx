import React from 'react';

export function OnboardingModal({ onStartCustom, onLoadDemo }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30 text-2xl text-white">
          🎓
        </div>

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to AttendEase
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            Your personal college attendance assistant. Easily track working days, mark 8-hour daily slots, and monitor 75% target criteria.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onStartCustom}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            🗓️ Set Up My Day-Wise Timetable
          </button>

          <button
            onClick={onLoadDemo}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold text-sm border border-slate-700 transition"
          >
            ⚡ Pre-load Realistic Demo Data (Instant Test Drive)
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          You can edit your timetable, add custom subjects, or change target percentages anytime in Settings.
        </p>

      </div>
    </div>
  );
}
