import React, { useState } from 'react';
import { formatDateKey, getDayName } from '../storage';

export function CalendarView({ logs, onSelectDate, currentMonthDate, setCurrentMonthDate }) {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'working', 'holiday', 'unlogged'

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();

  // Get starting day offset (0 = Sunday, 1 = Monday, etc.)
  // Let's adjust so week starts on Monday (0 = Mon, ..., 6 = Sun)
  let startOffset = firstDayOfMonth.getDay() - 1;
  if (startOffset < 0) startOffset = 6; // Sunday becomes 6

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonthDate(new Date());
  };

  const todayStr = formatDateKey(new Date());

  // Generate calendar grid cells
  const gridCells = [];
  
  // Previous month padding days
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    gridCells.push({
      date: new Date(year, month - 1, prevMonthLastDate - i),
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    gridCells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true
    });
  }

  // Next month padding days to complete 7-column grid
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }

  // Helper to format slot counts for a date cell
  const getDayStatus = (date) => {
    const key = formatDateKey(date);
    const log = logs[key];
    if (!log) return null;

    if (log.type === 'holiday') {
      return { type: 'holiday', note: log.note || 'Holiday' };
    }

    if (log.type === 'working' && log.slots) {
      let present = 0;
      let absent = 0;
      let free = 0;
      log.slots.forEach(s => {
        if (s.status === 'present') present++;
        else if (s.status === 'absent') absent++;
        else if (s.status === 'free') free++;
      });
      const conducted = present + absent;
      const percentage = conducted > 0 ? Math.round((present / conducted) * 100) : 0;
      return {
        type: 'working',
        present,
        absent,
        free,
        conducted,
        percentage
      };
    }

    return null;
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      
      {/* Top Controls Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Month & Year Title with Nav Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={prevMonth}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition"
            title="Previous Month"
          >
            ◀
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight min-w-[180px] text-center">
            {monthNames[month]} <span className="text-indigo-400 font-light">{year}</span>
          </h2>

          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition"
            title="Next Month"
          >
            ▶
          </button>

          <button
            onClick={goToToday}
            className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 rounded-xl text-xs font-semibold transition"
          >
            Today
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          {['all', 'working', 'holiday', 'unlogged'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                selectedFilter === filter
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar Grid Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-6 shadow-2xl overflow-hidden">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {daysOfWeek.map((day, idx) => (
            <div
              key={day}
              className={`py-2 text-xs sm:text-sm font-bold uppercase tracking-wider ${
                idx >= 5 ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid Days */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {gridCells.map((cell, idx) => {
            const dateStr = formatDateKey(cell.date);
            const isToday = dateStr === todayStr;
            const status = getDayStatus(cell.date);
            const isSunday = cell.date.getDay() === 0;

            // Apply filter logic
            let isFilteredOut = false;
            if (selectedFilter === 'working' && status?.type !== 'working') isFilteredOut = true;
            if (selectedFilter === 'holiday' && status?.type !== 'holiday') isFilteredOut = true;
            if (selectedFilter === 'unlogged' && status !== null) isFilteredOut = true;

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(cell.date)}
                className={`relative min-h-[90px] sm:min-h-[110px] p-2 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'opacity-30 bg-slate-950/40 border-slate-900 text-slate-600'
                    : isFilteredOut
                    ? 'opacity-25 bg-slate-900 border-slate-800'
                    : isToday
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                    : status?.type === 'holiday'
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                    : status?.type === 'working'
                    ? 'bg-slate-800/40 border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/30'
                }`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm sm:text-base font-extrabold ${
                    isToday
                      ? 'w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md'
                      : isSunday
                      ? 'text-rose-400'
                      : cell.isCurrentMonth
                      ? 'text-slate-200'
                      : 'text-slate-600'
                  }`}>
                    {cell.date.getDate()}
                  </span>

                  {/* Holiday Badge */}
                  {status?.type === 'holiday' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Holiday
                    </span>
                  )}

                  {/* Logged Badge */}
                  {status?.type === 'working' && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      status.percentage >= 75
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {status.percentage}%
                    </span>
                  )}
                </div>

                {/* Status Slot Summary Content */}
                <div className="mt-1">
                  {status?.type === 'working' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                        <span className="text-emerald-400 font-bold">✓ {status.present}P</span>
                        {status.absent > 0 && <span className="text-rose-400 font-bold">✗ {status.absent}A</span>}
                        {status.free > 0 && <span className="text-slate-400">{status.free}F</span>}
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${status.conducted > 0 ? (status.present / status.conducted) * 100 : 0}%` }}
                          className="bg-emerald-500 h-full"
                        />
                        <div
                          style={{ width: `${status.conducted > 0 ? (status.absent / status.conducted) * 100 : 0}%` }}
                          className="bg-rose-500 h-full"
                        />
                      </div>
                    </div>
                  )}

                  {status?.type === 'holiday' && (
                    <p className="text-[10px] text-amber-300/80 truncate italic">
                      {status.note || 'No Classes'}
                    </p>
                  )}

                  {!status && cell.isCurrentMonth && (
                    <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
                        + Mark Attendance
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar Footer & Legend */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Working Day (Present)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Absent Class</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Holiday (Excluded)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span>Unlogged Date</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            💡 Tap any date to edit or record attendance.
          </p>
        </div>

      </div>

    </div>
  );
}
