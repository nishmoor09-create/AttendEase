import React, { useState } from 'react';

export function Navbar({ activeTab, setActiveTab, overallStats, targetPercentage, onOpenOnboarding, onLoadDemo, onResetData }) {
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
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('calendar')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 font-bold text-lg text-white">
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

          {/* Desktop Navigation Links */}
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

          {/* Right Header Controls (Badge & Quick Actions) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quick Target Chip */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isTargetMet 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isTargetMet ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-pulse'}`} />
              <span>Overall: <strong className="font-bold">{pct}%</strong> (Target {targetPercentage}%)</span>
            </div>

            {/* Demo Loader Shortcut */}
            <button
              onClick={onLoadDemo}
              title="Pre-fill past dates with realistic sample data for instant preview"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition"
            >
              ⚡ Load Demo Data
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Small Overall Badge on Mobile */}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
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
              className="w-full py-2 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-700/50 text-center"
            >
              ⚡ Pre-load Realistic Demo Data
            </button>
            <button
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs font-medium rounded-lg text-center"
            >
              🗑️ Reset All Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
