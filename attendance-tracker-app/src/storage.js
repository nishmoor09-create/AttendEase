// Storage Keys
const TIMETABLE_KEY = 'college_attendance_timetable_v1';
const LOGS_KEY = 'college_attendance_logs_v1';
const SETTINGS_KEY = 'college_attendance_settings_v1';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const DEFAULT_SUBJECT_PRESETS = [
  'Mathematics', 'Physics', 'Data Structures', 'Database Systems', 
  'Operating Systems', 'Computer Networks', 'Web Development', 
  'AI & ML', 'Software Engg', 'Digital Logic', 'Free / Break'
];

export const DEFAULT_TIMETABLE = {
  Monday: ['Mathematics', 'Physics', 'Data Structures', 'Database Systems', 'Free / Break', 'Operating Systems', 'Computer Networks', 'Library'],
  Tuesday: ['Computer Networks', 'AI & ML', 'Mathematics', 'Software Engg', 'Free / Break', 'Data Structures', 'Database Systems', 'Physics'],
  Wednesday: ['Operating Systems', 'Operating Systems', 'Mathematics', 'Digital Logic', 'Free / Break', 'AI & ML', 'Web Development', 'Free / Break'],
  Thursday: ['Data Structures', 'Database Systems', 'Computer Networks', 'Physics', 'Free / Break', 'Software Engg', 'Digital Logic', 'Mathematics'],
  Friday: ['Web Development', 'Web Development', 'AI & ML', 'Operating Systems', 'Free / Break', 'Physics', 'Data Structures', 'Library'],
  Saturday: ['Digital Logic', 'Software Engg', 'Mathematics', 'Computer Networks', 'Free / Break', 'Free / Break', 'Free / Break', 'Free / Break']
};

export const DEFAULT_SETTINGS = {
  targetPercentage: 75,
  includeSaturday: true,
  includeSunday: false,
  userName: 'Student',
  courseName: 'B.Tech CS / IT',
  semester: 'Semester 5',
  hasCompletedOnboarding: false
};

// Preset colors for subjects
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

export const getSubjectColor = (subjectName) => {
  if (!subjectName || subjectName.toLowerCase().includes('free') || subjectName.toLowerCase().includes('break')) {
    return { bg: 'bg-slate-800/50', text: 'text-slate-400', border: 'border-slate-700/50', badgeBg: 'bg-slate-600', hex: '#64748b' };
  }
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

// Storage Functions
export const getTimetable = () => {
  try {
    const data = localStorage.getItem(TIMETABLE_KEY);
    return data ? JSON.parse(data) : DEFAULT_TIMETABLE;
  } catch (e) {
    console.error('Failed to load timetable:', e);
    return DEFAULT_TIMETABLE;
  }
};

export const saveTimetable = (timetable) => {
  try {
    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
  } catch (e) {
    console.error('Failed to save timetable:', e);
  }
};

export const getLogs = () => {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to load logs:', e);
    return {};
  }
};

export const saveLogs = (logs) => {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs:', e);
  }
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

// Helper to format Date string YYYY-MM-DD
export const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getDayName = (date) => {
  const dayIndex = date.getDay(); // 0 is Sunday
  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysMap[dayIndex];
};

// Pre-load demo historical data for testing and immediate visualization
export const loadDemoData = () => {
  saveTimetable(DEFAULT_TIMETABLE);
  
  const logs = {};
  const today = new Date(2026, 6, 29); // 2026-07-29
  
  // Seed past 35 days of historical data
  for (let i = 35; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = formatDateKey(date);
    const dayName = getDayName(date);

    // Skip Sundays
    if (dayName === 'Sunday') continue;

    // Make some days holidays (e.g. Saturdays or random days)
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
      // Realistic attendance pattern (~82% attendance rate)
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
};

export const clearAllData = () => {
  localStorage.removeItem(TIMETABLE_KEY);
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
};

// Calculate overall analytics summary
export const calculateOverallStats = (logs) => {
  let totalConductedHours = 0;
  let totalHoursPresent = 0;
  let totalHoursAbsent = 0;
  let totalHolidays = 0;
  let totalWorkingDaysLogged = 0;

  const dayWiseStats = {}; // { 'YYYY-MM-DD': { conducted, present, absent, dayName } }

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
        // 'free' slots are excluded from total conducted hours
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
};

// Calculate subject-wise analytics summary
export const calculateSubjectStats = (logs, timetable, targetPercentage = 75) => {
  const subjectMap = {}; // { subjectName: { attended, conducted, absent } }

  // First collect all unique subjects from timetable
  Object.values(timetable).forEach(daySlots => {
    daySlots.forEach(subject => {
      if (subject && !subject.toLowerCase().includes('free') && !subject.toLowerCase().includes('break')) {
        if (!subjectMap[subject]) {
          subjectMap[subject] = { name: subject, attended: 0, conducted: 0, absent: 0 };
        }
      }
    });
  });

  // Now scan logs to count actual conducted & attended hours
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

    // Smart Attendance Advisor logic:
    // If percentage >= targetPercentage: How many upcoming classes can student safely skip?
    // If percentage < targetPercentage: How many consecutive classes must student attend to hit target?
    const targetRatio = targetPercentage / 100;
    let safeBunksPossible = 0;
    let classesToAttendNeeded = 0;

    if (item.conducted > 0) {
      if (numericPercentage >= targetPercentage) {
        // Attended / (Conducted + X) >= targetRatio => Attended >= targetRatio * Conducted + targetRatio * X => X <= (Attended - targetRatio * Conducted) / targetRatio
        safeBunksPossible = Math.floor((item.attended - targetRatio * item.conducted) / targetRatio);
        if (safeBunksPossible < 0) safeBunksPossible = 0;
      } else {
        // (Attended + Y) / (Conducted + Y) >= targetRatio => Y >= (targetRatio * Conducted - Attended) / (1 - targetRatio)
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
};
