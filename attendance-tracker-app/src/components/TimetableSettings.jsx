import React, { useState } from 'react';
import { DAYS, DEFAULT_SUBJECT_PRESETS, getSubjectColor } from '../storage';

export function TimetableSettings({ timetable, settings, onSaveTimetable, onSaveSettings, onLoadDemo, onResetData }) {
  const [activeDay, setActiveDay] = useState('Monday');
  const [editedTimetable, setEditedTimetable] = useState(timetable);
  const [targetPercentage, setTargetPercentage] = useState(settings.targetPercentage || 75);
  const [userName, setUserName] = useState(settings.userName || '');
  const [courseName, setCourseName] = useState(settings.courseName || '');
  const [newPresetSubject, setNewPresetSubject] = useState('');
  const [presetSubjects, setPresetSubjects] = useState(DEFAULT_SUBJECT_PRESETS);
  const [saveToast, setSaveToast] = useState(false);

  const handleSlotChange = (day, index, value) => {
    const daySlots = [...(editedTimetable[day] || Array(8).fill('Free / Break'))];
    daySlots[index] = value;
    setEditedTimetable({
      ...editedTimetable,
      [day]: daySlots
    });
  };

  const handleCopyDayToAll = (sourceDay) => {
    const sourceSlots = editedTimetable[sourceDay] || Array(8).fill('Free / Break');
    const updated = { ...editedTimetable };
    DAYS.forEach(day => {
      updated[day] = [...sourceSlots];
    });
    setEditedTimetable(updated);
    showToast();
  };

  const handleAddPreset = () => {
    if (newPresetSubject.trim() && !presetSubjects.includes(newPresetSubject.trim())) {
      setPresetSubjects([...presetSubjects, newPresetSubject.trim()]);
      setNewPresetSubject('');
    }
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSaveAll = () => {
    onSaveTimetable(editedTimetable);
    onSaveSettings({
      ...settings,
      targetPercentage: Number(targetPercentage),
      userName,
      courseName,
      hasCompletedOnboarding: true
    });
    showToast();
  };

  const currentSlots = editedTimetable[activeDay] || Array(8).fill('Free / Break');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <span>✓</span>
          <span>Timetable & Settings Saved Successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 uppercase tracking-wider">
            App Setup
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Timetable & Preference Settings
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Configure your weekly 8-hour slot schedule, target attendance ratio, and subject presets.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          💾 Save Changes
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Target & Profile Preferences */}
        <div className="space-y-6">
          
          {/* Target Percentage Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>🎯</span>
              <span>Target Attendance Limit</span>
            </h3>
            <p className="text-xs text-slate-400">
              Minimum target percentage required by your college (e.g. 75%).
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Minimum Goal</span>
                <span className="text-2xl font-black text-indigo-400">{targetPercentage}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="1"
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>50%</span>
                <span>65%</span>
                <span>75% (Standard)</span>
                <span>85%</span>
                <span>95%</span>
              </div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>👤</span>
              <span>Student Profile</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Name:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Course & Branch:</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Data Controls & Demo Data */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Data Management</h3>
            <button
              onClick={onLoadDemo}
              className="w-full py-2.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-700/50 transition"
            >
              ⚡ Pre-fill Past 35 Days Demo Data
            </button>
            <button
              onClick={onResetData}
              className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-xl border border-rose-800/50 transition"
            >
              🗑️ Clear & Reset All Records
            </button>
          </div>

        </div>

        {/* Right Columns (2-col): Day-wise 8-Hour Timetable Slot Editor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>🗓️</span>
                <span>Day-Wise 8-Hour Timetable</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set subject names for each 1-hour slot (Hour 1 to Hour 8) per weekday.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopyDayToAll(activeDay)}
              title="Copy current day's slots to all weekdays"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              📋 Copy {activeDay} to All Days
            </button>
          </div>

          {/* Weekday Selector Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {DAYS.map((day) => {
              const isActive = activeDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition min-w-[90px] text-center ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Preset Subject Chips Autocomplete */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Preset Subject Chips (Click to fill slot):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetSubjects.map((sub) => (
                <span
                  key={sub}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700 cursor-pointer transition"
                  onClick={() => {
                    // Fill first empty slot or currently focused slot
                    const emptyIdx = currentSlots.findIndex(s => !s || s === 'Free / Break');
                    if (emptyIdx !== -1) {
                      handleSlotChange(activeDay, emptyIdx, sub);
                    }
                  }}
                >
                  + {sub}
                </span>
              ))}
            </div>
          </div>

          {/* 8 Hour Slots Inputs */}
          <div className="space-y-3 pt-2">
            {currentSlots.map((subject, idx) => {
              const color = getSubjectColor(subject);
              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3 transition hover:border-slate-700"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-indigo-400 font-extrabold text-xs flex items-center justify-center border border-slate-800 shrink-0">
                    H{idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => handleSlotChange(activeDay, idx, e.target.value)}
                      placeholder="Subject Name (e.g., Mathematics, Lab, Free)"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none transition"
                    />
                  </div>

                  {/* Preset Quick Pill */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${color.bg} ${color.text} border ${color.border}`}>
                    Hour {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
