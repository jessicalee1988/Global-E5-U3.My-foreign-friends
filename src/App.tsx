/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { LearnAndReviewArea } from './components/LearnAndReview/LearnAndReviewArea';
import { PracticeSection } from './components/Practice/PracticeSection';
import { ResultsSection } from './components/Results/ResultsSection';
import { Globe, Smile } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('learn');
  const [selectedWordForReview, setSelectedWordForReview] = useState<string | undefined>(undefined);

  const handleReviewAgain = () => {
    setSelectedWordForReview(undefined);
    setCurrentTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSpecificWord = (wordId: string) => {
    setSelectedWordForReview(wordId);
    setCurrentTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans selection:bg-sky-200">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedWordForReview(undefined);
          setCurrentTab(tab);
        }}
      />

      {/* Hero Subtitle Card */}
      <section className="bg-gradient-to-b from-sky-100/60 via-indigo-50/40 to-transparent pt-6 pb-4 border-b border-sky-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-sky-200 text-sky-800 text-xs font-bold shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Grade 5 English Learning Platform • Global Success</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Unit 3 – My foreign friends
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Ôn tập từ vựng về quốc tịch &amp; tính cách, bài hội thoại, mẫu câu chuẩn và làm các bài tập thực hành.
              </p>
            </div>

            {/* Quick Stats / Helper Badges */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-700">8 Target Words</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <Smile className="w-4 h-4 text-amber-500" />
                <span className="text-slate-700">2 Core Patterns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Learning Hub Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {currentTab === 'learn' && (
          <LearnAndReviewArea
            selectedWordId={selectedWordForReview}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeSection />
        )}

        {currentTab === 'results' && (
          <ResultsSection
            onReviewAgain={handleReviewAgain}
            onReviewWord={handleReviewSpecificWord}
          />
        )}
      </main>

      {/* Primary School Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-12 py-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Unit 3 – My foreign friends</span>
            <span>•</span>
            <span>Tiếng Anh 5 Global Success</span>
          </div>
          <span className="text-slate-400 font-medium">
            Học tập &amp; Ôn luyện • Bộ Giáo Dục và Đào Tạo
          </span>
        </div>
      </footer>
    </div>
  );
}
