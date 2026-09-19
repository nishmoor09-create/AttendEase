import React from 'react';

export function OverallDashboard({ stats, targetPercentage }) {
  const {
    totalConductedHours,
    totalHoursPresent,
    totalHoursAbsent,
    totalHolidays,
    totalWorkingDaysLogged,
    percentage,
    dayWiseStats
  } = stats;

  const isTargetMet = percentage >= targetPercentage;

  // Convert dayWiseStats object to sorted array for Bar Chart
  const dayStatsArray = Object.values(dayWiseStats)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(-14); // show last 14 logged working days

  // SVG Doughnut Chart parameters
  const pieRadius = 60;
  const circumference = 2 * Math.PI * pieRadius;
  const presentPct = totalConductedHours > 0 ? (totalHoursPresent / totalConductedHours) : 0;
  const presentStrokeDash = presentPct * circumference;
  const absentStrokeDash = (1 - presentPct) * circumference;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 uppercase tracking-wider">
            Overall Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Attendance Performance Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Real-time aggregate tracking of conducted classes, attendance percentage, and day-wise breakdown.
          </p>
        </div>

        {/* Big Percentage Card */}
        <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border min-w-[160px] text-center shadow-lg ${
          isTargetMet 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-400'
        }`}>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Overall Attendance
          </span>
          <span className="text-4xl sm:text-5xl font-black mt-1 tracking-tight">
            {percentage}%
          </span>
          <span className={`text-xs font-semibold mt-1 px-2.5 py-0.5 rounded-full ${
            isTargetMet ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {isTargetMet ? `✓ Meets ${targetPercentage}% Target` : `⚠️ Below ${targetPercentage}% Target`}
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Conducted Hours */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xl font-bold">
            ⏱️
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conducted Hours</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalConductedHours} <span className="text-xs font-normal text-slate-400">hrs</span></h3>
          </div>
        </div>

        {/* Total Hours Attended */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl font-bold">
            ✅
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attended Hours</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-0.5">{totalHoursPresent} <span className="text-xs font-normal text-slate-400">hrs</span></h3>
          </div>
        </div>

        {/* Total Hours Missed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center text-xl font-bold">
            ❌
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hours Missed</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-0.5">{totalHoursAbsent} <span className="text-xs font-normal text-slate-400">hrs</span></h3>
          </div>
        </div>

        {/* Total Working Days & Holidays */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl font-bold">
            📅
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logged Days</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{totalWorkingDaysLogged} <span className="text-xs font-normal text-amber-400">({totalHolidays} Holidays)</span></h3>
          </div>
        </div>

      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie / Doughnut Chart Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>🥧</span>
              <span>Present vs Absent Ratio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Overall conducted hours proportion</p>
          </div>

          <div className="relative my-6 flex items-center justify-center">
            {/* SVG Doughnut */}
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="96"
                cy="96"
                r={pieRadius}
                stroke="#1e293b"
                strokeWidth="20"
                fill="transparent"
              />
              {/* Absent Segment */}
              <circle
                cx="96"
                cy="96"
                r={pieRadius}
                stroke="#f43f5e"
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={`${circumference}`}
                strokeDashoffset="0"
                className="transition-all duration-700 ease-out"
              />
              {/* Present Segment */}
              <circle
                cx="96"
                cy="96"
                r={pieRadius}
                stroke="#10b981"
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={`${presentStrokeDash} ${circumference - presentStrokeDash}`}
                strokeDashoffset="0"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white">{percentage}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Attendance</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-medium">Present</span>
              </div>
              <span className="font-bold text-white">{totalHoursPresent} hrs</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-300 font-medium">Absent</span>
              </div>
              <span className="font-bold text-white">{totalHoursAbsent} hrs</span>
            </div>
          </div>
        </div>

        {/* Day-Wise Summary Bar Graph */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>📊</span>
                <span>Day-Wise Attendance Breakdown</span>
              </h3>
              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 font-medium">
                Last 14 Logged Days
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Stacked breakdown of Present (Green) vs Absent (Red) hours per day</p>
          </div>

          {/* Bar Chart Container */}
          <div className="my-6 min-h-[220px] flex items-end space-x-2 sm:space-x-3 overflow-x-auto pb-2">
            {dayStatsArray.length === 0 ? (
              <div className="w-full h-40 flex flex-col items-center justify-center text-slate-500 text-sm italic">
                <span>No logged days yet.</span>
                <span className="text-xs">Tap a date on the calendar to mark attendance!</span>
              </div>
            ) : (
              dayStatsArray.map((day) => {
                const maxHours = 8;
                const presentHeight = (day.present / maxHours) * 100;
                const absentHeight = (day.absent / maxHours) * 100;
                const dayDateObj = new Date(day.dateKey + 'T00:00:00');
                const label = `${dayDateObj.getDate()} ${dayDateObj.toLocaleDateString('en-US', { month: 'short' })}`;

                return (
                  <div key={day.dateKey} className="flex-1 min-w-[36px] flex flex-col items-center group">
                    {/* Tooltip on hover */}
                    <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-[10px] text-white p-1.5 rounded border border-slate-700 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                      {day.present}P / {day.absent}A ({day.conducted} hrs)
                    </div>

                    {/* Bar Stack */}
                    <div className="w-full bg-slate-950 rounded-t-xl h-44 flex flex-col justify-end p-1 overflow-hidden relative border border-slate-800">
                      {/* Absent Bar segment */}
                      <div
                        style={{ height: `${absentHeight}%` }}
                        className="w-full bg-rose-500/80 group-hover:bg-rose-400 rounded-t transition-all duration-300"
                        title={`${day.absent} Absent`}
                      />
                      {/* Present Bar segment */}
                      <div
                        style={{ height: `${presentHeight}%` }}
                        className="w-full bg-emerald-500 group-hover:bg-emerald-400 rounded-b transition-all duration-300"
                        title={`${day.present} Present`}
                      />
                    </div>

                    {/* Date label */}
                    <span className="text-[10px] font-bold text-slate-400 mt-2 text-center group-hover:text-white transition">
                      {label}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Bar Chart Legend */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Present Hours</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                <span>Absent Hours</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500">Max 8 hrs/day</span>
          </div>

        </div>

      </div>

    </div>
  );
}
