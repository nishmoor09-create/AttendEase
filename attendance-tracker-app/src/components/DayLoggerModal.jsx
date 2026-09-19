import React, { useState, useEffect } from 'react';
import { formatDateKey, getDayName, getSubjectColor } from '../storage';

export function DayLoggerModal({ date, logs, timetable, onSave, onClose }) {
  if (!date) return null;

  const dateKey = formatDateKey(date);
  const dayName = getDayName(date);
  const existingLog = logs[dateKey];

  // Initialize state based on existing log or timetable defaults
  const defaultDayType = existingLog ? existingLog.type : (dayName === 'Sunday' ? 'holiday' : 'working');
  const [dayType, setDayType] = useState(defaultDayType);
  const [holidayNote, setHolidayNote] = useState(existingLog?.note || (dayName === 'Sunday' ? 'Sunday / Weekend' : ''));

  // Initialize 8 slots
  const [slots, setSlots] = useState(() => {
    if (existingLog && existingLog.slots && existingLog.slots.length > 0) {
      return existingLog.slots.map((s, idx) => ({ ...s, slot: idx + 1 }));
    }

    // Fallback to day's timetable
    const defaultDaySlots = timetable[dayName] || Array(8).fill('Free / Break');
    return Array.from({ length: 8 }, (_, idx) => {
      const subject = defaultDaySlots[idx] || 'Free / Break';
      const isFree = subject.toLowerCase().includes('free') || subject.toLowerCase().includes('break');
      return {
        slot: idx + 1,
        subject,
        status: isFree ? 'free' : 'present'
      };
    });
  });

  const handleStatusToggle = (index, status) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], status };
    setSlots(updated);
  };

  const handleSubjectChange = (index, newSubject) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], subject: newSubject };
    setSlots(updated);
  };

  const markAll = (status) => {
    const updated = slots.map(slot => {
      const isFree = slot.subject.toLowerCase().includes('free') || slot.subject.toLowerCase().includes('break');
      return {
        ...slot,
        status: isFree ? 'free' : status
      };
    });
    setSlots(updated);
  };

  const handleSave = () => {
    onSave(dateKey, {
      type: dayType,
      slots: dayType === 'working' ? slots : [],
      note: dayType === 'holiday' ? holidayNote : ''
    });
    onClose();
  };

  const dateFormattedStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Attendance Logger
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {dateFormattedStr}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Day Type Selector (Working vs Holiday) */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Day Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDayType('working')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
                  dayType === 'working'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>📖 Working Day</span>
              </button>

              <button
                type="button"
                onClick={() => setDayType('working') && setDayType('holiday')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
                  dayType === 'holiday'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>🏖️ Holiday / No Class</span>
              </button>
            </div>
          </div>

          {/* IF HOLIDAY */}
          {dayType === 'holiday' && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-amber-300 font-bold">
                <span>🏖️</span>
                <h4>Holiday Information</h4>
              </div>
              <p className="text-xs text-amber-200/80">
                Marking this day as a Holiday excludes all 8 hours from total conducted hours calculations.
              </p>
              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">
                  Reason / Holiday Name (Optional):
                </label>
                <input
                  type="text"
                  value={holidayNote}
                  onChange={(e) => setHolidayNote(e.target.value)}
                  placeholder="e.g. Festival, Institutional Holiday, Sick Leave"
                  className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* IF WORKING DAY */}
          {dayType === 'working' && (
            <div className="space-y-4">
              
              {/* Quick Batch Controls */}
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400">
                  Quick Actions (8 Slots):
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => markAll('present')}
                    className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/30 transition"
                  >
                    ✓ All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => markAll('absent')}
                    className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/30 transition"
                  >
                    ✗ All Absent
                  </button>
                </div>
              </div>

              {/* 8 Hours Slots List */}
              <div className="space-y-3">
                {slots.map((slot, index) => {
                  const subjectColor = getSubjectColor(slot.subject);
                  const isFree = slot.subject.toLowerCase().includes('free') || slot.subject.toLowerCase().includes('break');

                  return (
                    <div
                      key={index}
                      className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                    >
                      {/* Hour Index & Subject */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 font-bold text-xs flex items-center justify-center border border-slate-700 shrink-0">
                          H{slot.slot}
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={slot.subject}
                            onChange={(e) => handleSubjectChange(index, e.target.value)}
                            className="w-full bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 transition"
                            placeholder="Enter Subject Name"
                          />
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${subjectColor.bg} ${subjectColor.text}`}>
                            Slot {slot.slot} (1 Hr)
                          </span>
                        </div>
                      </div>

                      {/* Present / Absent / Free Toggle Buttons */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {isFree ? (
                          <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            ☕ Free / Break
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(index, 'present')}
                              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 flex items-center space-x-1 ${
                                slot.status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400 scale-105'
                                  : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                              }`}
                            >
                              <span>✓</span>
                              <span>Present</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusToggle(index, 'absent')}
                              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 flex items-center space-x-1 ${
                                slot.status === 'absent'
                                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400 scale-105'
                                  : 'bg-slate-800/80 text-slate-400 hover:text-rose-300 hover:bg-slate-800'
                              }`}
                            >
                              <span>✗</span>
                              <span>Absent</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusToggle(index, 'free')}
                              title="Mark as Free / Class Cancelled"
                              className={`px-2.5 py-2 rounded-xl font-semibold text-xs transition ${
                                slot.status === 'free'
                                  ? 'bg-slate-700 text-slate-200 border border-slate-600'
                                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              Free
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/95 backdrop-blur flex items-center justify-end space-x-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
          >
            Save Attendance
          </button>
        </div>

      </div>
    </div>
  );
}
