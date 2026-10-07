import React from 'react';
import { NavigationTab } from '../types';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40 shadow-xs">
      {/* Top Banner for Grade 5 Educational Context */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white text-xs sm:text-sm px-4 py-1.5 font-medium flex items-center justify-between">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shrink-0">
              English 5
            </span>
            <span className="truncate">Global Success • Bộ Giáo Dục và Đào Tạo</span>
            <span className="hidden sm:inline-block text-sky-200">|</span>
            <span className="hidden sm:inline-block text-sky-100">Review &amp; Practice App</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-sky-100 font-semibold shrink-0">
            <Globe className="w-3.5 h-3.5 text-sky-200" />
            <span>Unit 3: My foreign friends</span>
          </div>
        </div>
      </div>

      {/* Main Learning Header & Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* App Branding */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => onSelectTab('learn')}
              className="cursor-pointer group flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-tight group-hover:text-sky-600 transition-colors">
                    Unit 3 – My foreign friends
                  </h1>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  English 5 – Global Success <span className="text-sky-600 font-semibold">• Review &amp; Practice</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls: 3 Core Learning Tabs */}
          <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 md:pt-0">
            <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onSelectTab('learn')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'learn'
                    ? 'bg-white text-sky-700 shadow-xs border border-sky-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-sky-500" />
                <span>1. LEARN &amp; REVIEW</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('practice')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'practice'
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>2. PRACTICE</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('results')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'results'
                    ? 'bg-white text-amber-700 shadow-xs border border-amber-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>3. MY RESULTS</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
