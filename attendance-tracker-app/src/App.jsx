const { useState, useEffect } = React;

// 1. STORAGE SERVICE & UTILS
const TIMETABLE_KEY = 'college_attendance_timetable_v1';
const LOGS_KEY = 'college_attendance_logs_v1';
const SETTINGS_KEY = 'college_attendance_settings_v1';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_SUBJECT_PRESETS = [
  'Mathematics', 'Physics', 'Data Structures', 'Database Systems', 
  'Operating Systems', 'Computer Networks', 'Web Development', 
  'AI & ML', 'Software Engg', 'Digital Logic', 'Free / Break'
];

const DEFAULT_TIMETABLE = {
  Monday: ['Mathematics', 'Physics', 'Data Structures', 'Database Systems', 'Free / Break', 'Operating Systems', 'Computer Networks', 'Library'],
  Tuesday: ['Computer Networks', 'AI & ML', 'Mathematics', 'Software Engg', 'Free / Break', 'Data Structures', 'Database Systems', 'Physics'],
  Wednesday: ['Operating Systems', 'Operating Systems', 'Mathematics', 'Digital Logic', 'Free / Break', 'AI & ML', 'Web Development', 'Free / Break'],
  Thursday: ['Data Structures', 'Database Systems', 'Computer Networks', 'Physics', 'Free / Break', 'Software Engg', 'Digital Logic', 'Mathematics'],
  Friday: ['Web Development', 'Web Development', 'AI & ML', 'Operating Systems', 'Free / Break', 'Physics', 'Data Structures', 'Library'],
  Saturday: ['Digital Logic', 'Software Engg', 'Mathematics', 'Computer Networks', 'Free / Break', 'Free / Break', 'Free / Break', 'Free / Break']
};

const DEFAULT_SETTINGS = {
  targetPercentage: 75,
  includeSaturday: true,
  includeSunday: false,
  userName: 'Student',
  courseName: 'B.Tech CS / IT',
  semester: 'Semester 5',
  hasCompletedOnboarding: false
};

const COLOR_PALETTE = [
  { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', badgeBg: 'bg-indigo-500', hex: '#6366f1' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', badgeBg: 'bg-emerald-500', hex: '#10b981' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', badgeBg: 'bg-cyan-500', hex: '#06b6d4' },
  { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', badgeBg: 'bg-purple-500', hex: '#a855f7' },
  { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', badgeBg: 'bg-amber-500', hex: '#f59e0b' },
  { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/30', badgeBg: 'bg-pink-500', hex: '#ec4899' },
  { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', badgeBg: 'bg-blue-500', hex: '#3b82f6' },
  { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', badgeBg: 'bg-teal-500', hex: '#14b8a6' },
  { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', badgeBg: 'bg-violet-500', hex: '#8b5cf6' },
  { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', badgeBg: 'bg-rose-500', hex: '#f43f5e' }
];

function getSubjectColor(subjectName) {
  if (!subjectName || subjectName.toLowerCase().includes('free') || subjectName.toLowerCase().includes('break')) {
    return { bg: 'bg-slate-800/50', text: 'text-slate-400', border: 'border-slate-700/50', badgeBg: 'bg-slate-600', hex: '#64748b' };
  }
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

function getTimetable() {
  try {
    const data = localStorage.getItem(TIMETABLE_KEY);
    return data ? JSON.parse(data) : DEFAULT_TIMETABLE;
  } catch (e) {
    return DEFAULT_TIMETABLE;
  }
}

function saveTimetable(timetable) {
  try {
    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
  } catch (e) {}
}

function getLogs() {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function saveLogs(logs) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {}
}

function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDayName(date) {
  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysMap[date.getDay()];
}

function loadDemoData() {
  saveTimetable(DEFAULT_TIMETABLE);
  const logs = {};
  const today = new Date(2026, 6, 29); // 2026-07-29
  
  for (let i = 35; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = formatDateKey(date);
    const dayName = getDayName(date);

    if (dayName === 'Sunday') continue;

    if (i % 9 === 0) {
      logs[dateKey] = {
        type: 'holiday',
        slots: [],
        note: i % 18 === 0 ? 'Institutional Holiday' : 'Festival / Weekend Leave'
      };
      continue;
    }

    const daySlots = DEFAULT_TIMETABLE[dayName] || [];
    const slotsLog = daySlots.map((subject, index) => {
      const isFree = subject.toLowerCase().includes('free') || subject.toLowerCase().includes('break');
      if (isFree) {
        return { slot: index + 1, subject, status: 'free' };
      }
      const isAbsent = (i + index * 3) % 7 === 0;
      return {
        slot: index + 1,
        subject,
        status: isAbsent ? 'absent' : 'present'
      };
    });

    logs[dateKey] = {
      type: 'working',
      slots: slotsLog,
      note: ''
    };
  }

  saveLogs(logs);
  saveSettings({
    ...DEFAULT_SETTINGS,
    hasCompletedOnboarding: true
  });
}

function clearAllData() {
  localStorage.removeItem(TIMETABLE_KEY);
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}

function calculateOverallStats(logs) {
  let totalConductedHours = 0;
  let totalHoursPresent = 0;
  let totalHoursAbsent = 0;
  let totalHolidays = 0;
  let totalWorkingDaysLogged = 0;

  const dayWiseStats = {};

  Object.entries(logs).forEach(([dateKey, log]) => {
    if (log.type === 'holiday') {
      totalHolidays++;
      return;
    }

    if (log.type === 'working' && log.slots) {
      totalWorkingDaysLogged++;
      let dayConducted = 0;
      let dayPresent = 0;
      let dayAbsent = 0;

      log.slots.forEach(slot => {
        if (slot.status === 'present') {
          totalConductedHours++;
          totalHoursPresent++;
          dayConducted++;
          dayPresent++;
        } else if (slot.status === 'absent') {
          totalConductedHours++;
          totalHoursAbsent++;
          dayConducted++;
          dayAbsent++;
        }
      });

      const dateObj = new Date(dateKey + 'T00:00:00');
      dayWiseStats[dateKey] = {
        dateKey,
        dayName: getDayName(dateObj),
        conducted: dayConducted,
        present: dayPresent,
        absent: dayAbsent
      };
    }
  });

  const percentage = totalConductedHours > 0 
    ? ((totalHoursPresent / totalConductedHours) * 100).toFixed(1) 
    : '0.0';

  return {
    totalConductedHours,
    totalHoursPresent,
    totalHoursAbsent,
    totalHolidays,
    totalWorkingDaysLogged,
    percentage: parseFloat(percentage),
    dayWiseStats
  };
}

function calculateSubjectStats(logs, timetable, targetPercentage = 75) {
  const subjectMap = {};

  Object.values(timetable).forEach(daySlots => {
    daySlots.forEach(subject => {
      if (subject && !subject.toLowerCase().includes('free') && !subject.toLowerCase().includes('break')) {
        if (!subjectMap[subject]) {
          subjectMap[subject] = { name: subject, attended: 0, conducted: 0, absent: 0 };
        }
      }
    });
  });

  Object.values(logs).forEach(log => {
    if (log.type === 'working' && log.slots) {
      log.slots.forEach(slot => {
        const subName = slot.subject;
        if (!subName || subName.toLowerCase().includes('free') || subName.toLowerCase().includes('break')) {
          return;
        }

        if (!subjectMap[subName]) {
          subjectMap[subName] = { name: subName, attended: 0, conducted: 0, absent: 0 };
        }

        if (slot.status === 'present') {
          subjectMap[subName].conducted++;
          subjectMap[subName].attended++;
        } else if (slot.status === 'absent') {
          subjectMap[subName].conducted++;
          subjectMap[subName].absent++;
        }
      });
    }
  });

  return Object.values(subjectMap).map(item => {
    const percentage = item.conducted > 0 
      ? ((item.attended / item.conducted) * 100).toFixed(1) 
      : '0.0';
    const numericPercentage = parseFloat(percentage);

    const targetRatio = targetPercentage / 100;
    let safeBunksPossible = 0;
    let classesToAttendNeeded = 0;

    if (item.conducted > 0) {
      if (numericPercentage >= targetPercentage) {
        safeBunksPossible = Math.floor((item.attended - targetRatio * item.conducted) / targetRatio);
        if (safeBunksPossible < 0) safeBunksPossible = 0;
      } else {
        classesToAttendNeeded = Math.ceil((targetRatio * item.conducted - item.attended) / (1 - targetRatio));
        if (classesToAttendNeeded < 0) classesToAttendNeeded = 0;
      }
    }

    return {
      ...item,
      percentage: numericPercentage,
      isAboveTarget: numericPercentage >= targetPercentage,
      safeBunksPossible,
      classesToAttendNeeded,
      color: getSubjectColor(item.name)
    };
  });
}

// 2. NAVBAR COMPONENT
function Navbar({ activeTab, setActiveTab, overallStats, targetPercentage, onLoadDemo, onResetData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'calendar', label: 'Calendar / Logging', icon: '📅' },
    { id: 'overall', label: 'Overall Dashboard', icon: '📊' },
    { id: 'subjects', label: 'Subject Details', icon: '📚' },
    { id: 'timetable', label: 'Timetable Settings', icon: '⚙️' }
  ];

  const pct = overallStats ? overallStats.percentage : 0;
  const isTargetMet = pct >= targetPercentage;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('calendar')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-md font-bold text-lg text-white">
              ✓
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
                AttendEase
              </h1>
              <p className="text-[10px] text-indigo-400 font-medium tracking-wide uppercase">
                College Attendance Tracker
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isTargetMet 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isTargetMet ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-pulse'}`} />
              <span>Overall: <strong className="font-bold">{pct}%</strong> (Target {targetPercentage}%)</span>
            </div>

            <button
              onClick={onLoadDemo}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition"
            >
              ⚡ Load Demo Data
            </button>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              isTargetMet ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {pct}%
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 focus:outline-none"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 bg-slate-800/50 hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onLoadDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-indigo-950/60 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-700/50"
            >
              ⚡ Pre-load Realistic Demo Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// 3. CALENDAR VIEW
function CalendarView({ logs, onSelectDate, currentMonthDate, setCurrentMonthDate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();

  let startOffset = firstDayOfMonth.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentMonthDate(new Date());

  const todayStr = formatDateKey(new Date());
  const gridCells = [];
  
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    gridCells.push({
      date: new Date(year, month - 1, prevMonthLastDate - i),
      isCurrentMonth: false
    });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    gridCells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true
    });
  }

  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }

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
      return { type: 'working', present, absent, free, conducted, percentage };
    }
    return null;
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={prevMonth} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700">◀</button>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight min-w-[180px] text-center">
            {monthNames[month]} <span className="text-indigo-400 font-light">{year}</span>
          </h2>
          <button onClick={nextMonth} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700">▶</button>
          <button onClick={goToToday} className="px-3 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold">Today</button>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          {['all', 'working', 'holiday', 'unlogged'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                selectedFilter === filter ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-6 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className={`py-2 text-xs sm:text-sm font-bold uppercase ${idx >= 5 ? 'text-indigo-400' : 'text-slate-400'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {gridCells.map((cell, idx) => {
            const dateStr = formatDateKey(cell.date);
            const isToday = dateStr === todayStr;
            const status = getDayStatus(cell.date);
            const isSunday = cell.date.getDay() === 0;

            let isFilteredOut = false;
            if (selectedFilter === 'working' && status?.type !== 'working') isFilteredOut = true;
            if (selectedFilter === 'holiday' && status?.type !== 'holiday') isFilteredOut = true;
            if (selectedFilter === 'unlogged' && status !== null) isFilteredOut = true;

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(cell.date)}
                className={`relative min-h-[90px] sm:min-h-[110px] p-2 rounded-xl sm:rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'opacity-30 bg-slate-950/40 border-slate-900 text-slate-600'
                    : isFilteredOut
                    ? 'opacity-25 bg-slate-900 border-slate-800'
                    : isToday
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500/80 ring-2 ring-indigo-500/40'
                    : status?.type === 'holiday'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : status?.type === 'working'
                    ? 'bg-slate-800/40 border-slate-700/60'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm sm:text-base font-extrabold ${
                    isToday
                      ? 'w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                      : isSunday
                      ? 'text-rose-400'
                      : cell.isCurrentMonth
                      ? 'text-slate-200'
                      : 'text-slate-600'
                  }`}>
                    {cell.date.getDate()}
                  </span>

                  {status?.type === 'holiday' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Holiday
                    </span>
                  )}

                  {status?.type === 'working' && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      status.percentage >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {status.percentage}%
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  {status?.type === 'working' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                        <span className="text-emerald-400 font-bold">✓ {status.present}P</span>
                        {status.absent > 0 && <span className="text-rose-400 font-bold">✗ {status.absent}A</span>}
                        {status.free > 0 && <span className="text-slate-400">{status.free}F</span>}
                      </div>

                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex">
                        <div style={{ width: `${status.conducted > 0 ? (status.present / status.conducted) * 100 : 0}%` }} className="bg-emerald-500 h-full" />
                        <div style={{ width: `${status.conducted > 0 ? (status.absent / status.conducted) * 100 : 0}%` }} className="bg-rose-500 h-full" />
                      </div>
                    </div>
                  )}

                  {status?.type === 'holiday' && (
                    <p className="text-[10px] text-amber-300/80 truncate italic">{status.note || 'No Classes'}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 4. DAY LOGGER MODAL
function DayLoggerModal({ date, logs, timetable, onSave, onClose }) {
  if (!date) return null;

  const dateKey = formatDateKey(date);
  const dayName = getDayName(date);
  const existingLog = logs[dateKey];

  const defaultDayType = existingLog ? existingLog.type : (dayName === 'Sunday' ? 'holiday' : 'working');
  const [dayType, setDayType] = useState(defaultDayType);
  const [holidayNote, setHolidayNote] = useState(existingLog?.note || (dayName === 'Sunday' ? 'Sunday / Weekend' : ''));

  const [slots, setSlots] = useState(() => {
    if (existingLog && existingLog.slots && existingLog.slots.length > 0) {
      return existingLog.slots.map((s, idx) => ({ ...s, slot: idx + 1 }));
    }

    const defaultDaySlots = timetable[dayName] || Array(8).fill('Free / Break');
    return Array.from({ length: 8 }, (_, idx) => {
      const subject = defaultDaySlots[idx] || 'Free / Break';
      const isFree = subject.toLowerCase().includes('free') || subject.toLowerCase().includes('break');
      return { slot: idx + 1, subject, status: isFree ? 'free' : 'present' };
    });
  });

  const handleStatusToggle = (index, status) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], status };
    setSlots(updated);
  };

  const markAll = (status) => {
    const updated = slots.map(slot => {
      const isFree = slot.subject.toLowerCase().includes('free') || slot.subject.toLowerCase().includes('break');
      return { ...slot, status: isFree ? 'free' : status };
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <span className="text-xs font-semibold uppercase text-indigo-400">Attendance Logger</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{date.toDateString()}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Is this a Working Day or a Holiday?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDayType('working')}
                className={`py-3 px-4 rounded-xl font-bold text-sm ${
                  dayType === 'working' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                📖 Working Day
              </button>
              <button
                type="button"
                onClick={() => setDayType('holiday')}
                className={`py-3 px-4 rounded-xl font-bold text-sm ${
                  dayType === 'holiday' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                🏖️ Holiday / No Class
              </button>
            </div>
          </div>

          {dayType === 'holiday' && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <p className="text-xs text-amber-200">Holiday hours are excluded from conducted totals.</p>
              <input
                type="text"
                value={holidayNote}
                onChange={(e) => setHolidayNote(e.target.value)}
                placeholder="Reason / Holiday Name"
                className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          )}

          {dayType === 'working' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400">8 Slots:</span>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => markAll('present')} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-lg">✓ All Present</button>
                  <button type="button" onClick={() => markAll('absent')} className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg">✗ All Absent</button>
                </div>
              </div>

              <div className="space-y-3">
                {slots.map((slot, index) => {
                  const isFree = slot.subject.toLowerCase().includes('free') || slot.subject.toLowerCase().includes('break');
                  return (
                    <div key={index} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 font-bold text-xs flex items-center justify-center">H{slot.slot}</div>
                        <input
                          type="text"
                          value={slot.subject}
                          onChange={(e) => {
                            const updated = [...slots];
                            updated[index].subject = e.target.value;
                            setSlots(updated);
                          }}
                          className="bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-slate-700 px-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        {isFree ? (
                          <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-400">☕ Free / Break</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(index, 'present')}
                              className={`px-4 py-2 rounded-xl font-bold text-xs ${slot.status === 'present' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                            >
                              ✓ Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(index, 'absent')}
                              className={`px-4 py-2 rounded-xl font-bold text-xs ${slot.status === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                            >
                              ✗ Absent
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

        <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400">Cancel</button>
          <button type="button" onClick={handleSave} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white">Save Attendance</button>
        </div>
      </div>
    </div>
  );
}

// 5. OVERALL DASHBOARD
function OverallDashboard({ stats, targetPercentage }) {
  const { totalConductedHours, totalHoursPresent, totalHoursAbsent, totalHolidays, totalWorkingDaysLogged, percentage, dayWiseStats } = stats;
  const isTargetMet = percentage >= targetPercentage;

  const dayStatsArray = Object.values(dayWiseStats).sort((a, b) => a.dateKey.localeCompare(b.dateKey)).slice(-14);

  const pieRadius = 60;
  const circumference = 2 * Math.PI * pieRadius;
  const presentPct = totalConductedHours > 0 ? (totalHoursPresent / totalConductedHours) : 0;
  const presentStrokeDash = presentPct * circumference;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full">Overall Analytics</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Attendance Performance</h2>
        </div>
        <div className={`p-5 rounded-2xl border text-center ${isTargetMet ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-rose-950/40 border-rose-500/40 text-rose-400'}`}>
          <span className="text-xs font-bold uppercase text-slate-300">Overall Percentage</span>
          <h3 className="text-4xl font-black mt-1">{percentage}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase">Conducted Hours</p>
          <h3 className="text-2xl font-bold text-white mt-1">{totalConductedHours} hrs</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase">Hours Attended</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{totalHoursPresent} hrs</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase">Hours Missed</p>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">{totalHoursAbsent} hrs</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase">Logged Days</p>
          <h3 className="text-2xl font-bold text-white mt-1">{totalWorkingDaysLogged} ({totalHolidays} Holidays)</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between">
          <h3 className="text-lg font-bold text-white">Present vs Absent Ratio</h3>
          <div className="relative my-6 flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r={pieRadius} stroke="#1e293b" strokeWidth="20" fill="transparent" />
              <circle cx="96" cy="96" r={pieRadius} stroke="#f43f5e" strokeWidth="20" fill="transparent" strokeDasharray={`${circumference}`} strokeDashoffset="0" />
              <circle cx="96" cy="96" r={pieRadius} stroke="#10b981" strokeWidth="20" fill="transparent" strokeDasharray={`${presentStrokeDash} ${circumference - presentStrokeDash}`} strokeDashoffset="0" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white">{percentage}%</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white">Day-Wise Summary Bar Graph</h3>
          <div className="my-6 min-h-[200px] flex items-end space-x-2">
            {dayStatsArray.map((day) => {
              const maxHours = 8;
              const presentHeight = (day.present / maxHours) * 100;
              const absentHeight = (day.absent / maxHours) * 100;
              return (
                <div key={day.dateKey} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-slate-950 rounded h-40 flex flex-col justify-end p-1">
                    <div style={{ height: `${absentHeight}%` }} className="w-full bg-rose-500 rounded-t" />
                    <div style={{ height: `${presentHeight}%` }} className="w-full bg-emerald-500 rounded-b" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-2">{day.dateKey.substring(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. SUBJECT DASHBOARD
function SubjectDashboard({ subjectStats, targetPercentage }) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">Subject Details</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Subject-Wise Attendance</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjectStats.map((sub) => {
          const { name, attended, conducted, absent, percentage, isAboveTarget, safeBunksPossible, classesToAttendNeeded } = sub;
          return (
            <div key={name} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isAboveTarget ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{percentage}%</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl"><span className="text-slate-400">Attended</span><p className="text-base font-bold text-emerald-400">{attended} hrs</p></div>
                <div className="bg-slate-950 p-2.5 rounded-xl"><span className="text-slate-400">Missed</span><p className="text-base font-bold text-rose-400">{absent} hrs</p></div>
                <div className="bg-slate-950 p-2.5 rounded-xl"><span className="text-slate-400">Total</span><p className="text-base font-bold text-white">{conducted} hrs</p></div>
              </div>

              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                <div style={{ width: `${percentage}%` }} className={`h-full ${isAboveTarget ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>

              <div className={`p-4 rounded-2xl border text-xs ${isAboveTarget ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'}`}>
                {isAboveTarget
                  ? `🎉 You can safely skip ${safeBunksPossible} upcoming classes while maintaining 75%+ target.`
                  : `⚠️ You need to attend ${classesToAttendNeeded} consecutive upcoming classes to hit ${targetPercentage}%.`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 7. TIMETABLE SETTINGS
function TimetableSettings({ timetable, settings, onSaveTimetable, onSaveSettings, onLoadDemo, onResetData }) {
  const [activeDay, setActiveDay] = useState('Monday');
  const [editedTimetable, setEditedTimetable] = useState(timetable);
  const [targetPercentage, setTargetPercentage] = useState(settings.targetPercentage || 75);

  const handleSlotChange = (day, index, value) => {
    const daySlots = [...(editedTimetable[day] || Array(8).fill('Free / Break'))];
    daySlots[index] = value;
    setEditedTimetable({ ...editedTimetable, [day]: daySlots });
  };

  const handleSaveAll = () => {
    onSaveTimetable(editedTimetable);
    onSaveSettings({ ...settings, targetPercentage: Number(targetPercentage), hasCompletedOnboarding: true });
    alert('Timetable & Settings Saved!');
  };

  const currentSlots = editedTimetable[activeDay] || Array(8).fill('Free / Break');

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Timetable Settings</h2>
        <button onClick={handleSaveAll} className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl">💾 Save Changes</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Target Attendance: {targetPercentage}%</h3>
            <input type="range" min="50" max="95" value={targetPercentage} onChange={(e) => setTargetPercentage(e.target.value)} className="w-full accent-indigo-500" />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <button onClick={onLoadDemo} className="w-full py-2.5 bg-indigo-950 text-indigo-300 text-xs font-bold rounded-xl">⚡ Pre-fill Past 35 Days Demo Data</button>
            <button onClick={onResetData} className="w-full py-2.5 bg-rose-950 text-rose-300 text-xs font-bold rounded-xl">🗑️ Reset All Records</button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {DAYS.map(day => (
              <button key={day} onClick={() => setActiveDay(day)} className={`px-4 py-2 rounded-xl font-bold text-xs ${activeDay === day ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'}`}>{day}</button>
            ))}
          </div>

          <div className="space-y-3">
            {currentSlots.map((subject, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
                <span className="w-8 text-indigo-400 font-bold text-xs">H{idx + 1}</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => handleSlotChange(activeDay, idx, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. ONBOARDING MODAL
function OnboardingModal({ onStartCustom, onLoadDemo }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center mx-auto text-2xl text-white">🎓</div>
        <h2 className="text-2xl font-extrabold text-white">Welcome to AttendEase</h2>
        <p className="text-slate-400 text-sm">College attendance tracker with 8-slot daily logging and 75% target recovery advisor.</p>
        <div className="space-y-3">
          <button onClick={onStartCustom} className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm">🗓️ Set Up My Day-Wise Timetable</button>
          <button onClick={onLoadDemo} className="w-full py-3.5 rounded-2xl bg-slate-800 text-indigo-300 font-semibold text-sm">⚡ Pre-load Realistic Demo Data</button>
        </div>
      </div>
    </div>
  );
}

// 9. MAIN APP COORDINATOR
function App() {
  const [timetable, setTimetableState] = useState(() => getTimetable());
  const [logs, setLogsState] = useState(() => getLogs());
  const [settings, setSettingsState] = useState(() => getSettings());

  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 6, 29));

  const [showOnboarding, setShowOnboarding] = useState(!settings.hasCompletedOnboarding);

  const overallStats = calculateOverallStats(logs);
  const subjectStats = calculateSubjectStats(logs, timetable, settings.targetPercentage || 75);

  const handleSaveDayLog = (dateKey, logData) => {
    const updatedLogs = { ...logs, [dateKey]: logData };
    setLogsState(updatedLogs);
    saveLogs(updatedLogs);
  };

  const handleSaveTimetable = (newTimetable) => {
    setTimetableState(newTimetable);
    saveTimetable(newTimetable);
  };

  const handleSaveSettings = (newSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setTimetableState(getTimetable());
    setLogsState(getLogs());
    setSettingsState(getSettings());
    setShowOnboarding(false);
  };

  const handleResetData = () => {
    if (window.confirm('Clear all data?')) {
      clearAllData();
      setTimetableState(getTimetable());
      setLogsState(getLogs());
      setSettingsState(getSettings());
      setShowOnboarding(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overallStats={overallStats}
        targetPercentage={settings.targetPercentage || 75}
        onLoadDemo={handleLoadDemo}
        onResetData={handleResetData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'calendar' && (
          <CalendarView
            logs={logs}
            onSelectDate={(date) => setSelectedDate(date)}
            currentMonthDate={currentMonthDate}
            setCurrentMonthDate={setCurrentMonthDate}
          />
        )}

        {activeTab === 'overall' && (
          <OverallDashboard
            stats={overallStats}
            targetPercentage={settings.targetPercentage || 75}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectDashboard
            subjectStats={subjectStats}
            targetPercentage={settings.targetPercentage || 75}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableSettings
            timetable={timetable}
            settings={settings}
            onSaveTimetable={handleSaveTimetable}
            onSaveSettings={handleSaveSettings}
            onLoadDemo={handleLoadDemo}
            onResetData={handleResetData}
          />
        )}
      </main>

      {selectedDate && (
        <DayLoggerModal
          date={selectedDate}
          logs={logs}
          timetable={timetable}
          onSave={handleSaveDayLog}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {showOnboarding && (
        <OnboardingModal
          onStartCustom={() => {
            setShowOnboarding(false);
            setActiveTab('timetable');
          }}
          onLoadDemo={handleLoadDemo}
        />
      )}

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AttendEase • Mobile-First College Attendance Tracker</span>
          <span>Target Standard: {settings.targetPercentage || 75}% • Data stored locally in browser</span>
        </div>
      </footer>
    </div>
  );
}

// 10. RENDER TO DOM
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
