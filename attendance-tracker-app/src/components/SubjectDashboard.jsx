import React from 'react';

export function SubjectDashboard({ subjectStats, targetPercentage }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 uppercase tracking-wider">
            Subject Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Subject-Wise Attendance Details
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Detailed breakdown of attended vs conducted hours for each course subject with Smart Attendance Advisor.
          </p>
        </div>

        {/* Target Indicator Chip */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3 text-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center">
            🎯
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Min Target Standard</span>
            <p className="text-base font-bold text-white">{targetPercentage}% Attendance</p>
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      {subjectStats.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl">📚</span>
          <h3 className="text-lg font-bold text-white">No Subjects Found in Timetable</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Please configure your day-wise timetable in Settings to view subject-wise attendance analytics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectStats.map((sub) => {
            const {
              name,
              attended,
              conducted,
              absent,
              percentage,
              isAboveTarget,
              safeBunksPossible,
              classesToAttendNeeded,
              color
            } = sub;

            return (
              <div
                key={name}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-5 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  
                  {/* Subject Name Header & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-2xl ${color.bg} ${color.text} border ${color.border} font-extrabold text-sm flex items-center justify-center uppercase shrink-0`}>
                        {name.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                          {name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          {conducted} Total Conducted {conducted === 1 ? 'Hour' : 'Hours'}
                        </p>
                      </div>
                    </div>

                    {/* Percentage Pill */}
                    <div className={`px-3 py-1 rounded-full text-xs font-black border ${
                      isAboveTarget 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {percentage}%
                    </div>
                  </div>

                  {/* Hours Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Attended</span>
                      <p className="text-lg font-bold text-emerald-400">{attended} hrs</p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Missed</span>
                      <p className="text-lg font-bold text-rose-400">{absent} hrs</p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Total</span>
                      <p className="text-lg font-bold text-white">{conducted} hrs</p>
                    </div>
                  </div>

                  {/* Visual Progress Bar with 75% Target Marker */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                      <span>Progress</span>
                      <span className={isAboveTarget ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {percentage}% / {targetPercentage}%
                      </span>
                    </div>

                    <div className="relative w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      {/* 75% Target Line */}
                      <div
                        style={{ left: `${targetPercentage}%` }}
                        className="absolute top-0 bottom-0 w-0.5 bg-indigo-400 z-10 opacity-70"
                        title={`Target: ${targetPercentage}%`}
                      />

                      {/* Progress Fill */}
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${
                          isAboveTarget ? 'bg-gradient-to-r from-emerald-600 to-teal-400' : 'bg-gradient-to-r from-rose-600 to-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                </div>

                {/* Smart Attendance Advisor Box */}
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed mt-4 transition ${
                  isAboveTarget
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  {conducted === 0 ? (
                    <p className="text-slate-400 italic">No classes logged for this subject yet.</p>
                  ) : isAboveTarget ? (
                    <div className="flex items-start space-x-2">
                      <span className="text-base">🎉</span>
                      <div>
                        <strong className="font-bold text-white">Safe Attendance Margin:</strong>
                        <p className="mt-0.5 text-emerald-200/90">
                          {safeBunksPossible > 0
                            ? `You can safely skip ${safeBunksPossible} upcoming ${safeBunksPossible === 1 ? 'class' : 'classes'} while staying above ${targetPercentage}%.`
                            : `You are right at the ${targetPercentage}% boundary! Don't miss any upcoming classes.`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2">
                      <span className="text-base">⚠️</span>
                      <div>
                        <strong className="font-bold text-white">Attendance Recovery Advisor:</strong>
                        <p className="mt-0.5 text-rose-200/90">
                          You need to attend <u className="font-bold text-white">{classesToAttendNeeded} consecutive</u> upcoming {classesToAttendNeeded === 1 ? 'class' : 'classes'} without missing to hit {targetPercentage}%.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
