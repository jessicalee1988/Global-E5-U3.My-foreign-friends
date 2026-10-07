import React, { useState } from 'react';
import {
  VOCAB_ACTIVITIES,
  VocabActivityId,
  VocabActivityMeta,
  PracticeQuestion,
  getActivityQuestions,
} from '../../data/practiceData';
import {
  PATTERN_ACTIVITIES,
  PatternActivityId,
  PatternActivityMeta,
  SentencePatternQuestion,
  getSentencePatternQuestions,
  getPatternPerformanceAnalysis,
} from '../../data/sentencePatternPracticeData';
import {
  UNSCRAMBLE_ACTIVITIES,
  UnscrambleActivityId,
  UnscrambleActivityMeta,
  UnscrambleSentenceQuestion,
  getUnscrambleSentenceQuestions,
} from '../../data/unscrambleSentenceData';
import { QuestionEngine } from './QuestionEngine';
import { PatternQuestionEngine } from './PatternQuestionEngine';
import { UnscrambleQuestionEngine } from './UnscrambleQuestionEngine';
import {
  BookOpen,
  MessageSquareText,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react';

type PracticeView =
  | 'home'
  | 'vocab-overview'
  | 'patterns-overview'
  | 'unscramble-overview'
  | 'active-activity'
  | 'active-pattern-activity'
  | 'active-unscramble-activity';

interface ActivityProgress {
  completedCount: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
}

export const PracticeSection: React.FC = () => {
  const [currentView, setCurrentView] = useState<PracticeView>('home');
  const [activeActivityId, setActiveActivityId] = useState<VocabActivityId | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<PracticeQuestion[]>([]);

  // Pattern activity session state
  const [activePatternActivityId, setActivePatternActivityId] = useState<PatternActivityId | null>(null);
  const [activePatternQuestions, setActivePatternQuestions] = useState<SentencePatternQuestion[]>([]);

  // Unscramble activity session state
  const [activeUnscrambleActivityId, setActiveUnscrambleActivityId] = useState<UnscrambleActivityId | null>(null);
  const [activeUnscrambleQuestions, setActiveUnscrambleQuestions] = useState<UnscrambleSentenceQuestion[]>([]);

  // Track progress and scores per activity (Module 1 - Vocabulary)
  const [activityStats, setActivityStats] = useState<Record<VocabActivityId, ActivityProgress>>({
    'multiple-choice': { completedCount: 0, score: 0, totalQuestions: 30, isCompleted: false },
    'missing-letters': { completedCount: 0, score: 0, totalQuestions: 25, isCompleted: false },
    'unscramble-word': { completedCount: 0, score: 0, totalQuestions: 25, isCompleted: false },
    'vocab-context': { completedCount: 0, score: 0, totalQuestions: 20, isCompleted: false },
  });

  // Track progress and scores per activity (Module 2 - Sentence Patterns)
  const [patternActivityStats, setPatternActivityStats] = useState<Record<PatternActivityId, ActivityProgress>>({
    'choose-correct-sentence': { completedCount: 0, score: 0, totalQuestions: 15, isCompleted: false },
    'complete-sentence': { completedCount: 0, score: 0, totalQuestions: 15, isCompleted: false },
    'choose-correct-response': { completedCount: 0, score: 0, totalQuestions: 10, isCompleted: false },
    'find-mistake': { completedCount: 0, score: 0, totalQuestions: 10, isCompleted: false },
  });

  // Track progress and scores per activity (Module 3 - Unscramble Sentences)
  const [unscrambleActivityStats, setUnscrambleActivityStats] = useState<Record<UnscrambleActivityId, ActivityProgress>>({
    'question-formation': { completedCount: 0, score: 0, totalQuestions: 10, isCompleted: false },
    'answer-formation': { completedCount: 0, score: 0, totalQuestions: 10, isCompleted: false },
  });

  const handleStartActivity = (id: VocabActivityId) => {
    setActiveActivityId(id);
    setActiveQuestions(getActivityQuestions(id, true));
    setCurrentView('active-activity');
  };

  const handleActivityComplete = (activityId: string, score: number, total: number) => {
    const actId = activityId as VocabActivityId;
    setActivityStats((prev) => ({
      ...prev,
      [actId]: {
        completedCount: total,
        score,
        totalQuestions: prev[actId]?.totalQuestions || total,
        isCompleted: true,
      },
    }));
  };

  const handleStartPatternActivity = (id: PatternActivityId) => {
    setActivePatternActivityId(id);
    setActivePatternQuestions(getSentencePatternQuestions(id, true));
    setCurrentView('active-pattern-activity');
  };

  const handlePatternActivityComplete = (activityId: string, score: number, total: number) => {
    const actId = activityId as PatternActivityId;
    setPatternActivityStats((prev) => ({
      ...prev,
      [actId]: {
        completedCount: total,
        score,
        totalQuestions: prev[actId]?.totalQuestions || total,
        isCompleted: true,
      },
    }));
  };

  const handleStartUnscrambleActivity = (id: UnscrambleActivityId) => {
    setActiveUnscrambleActivityId(id);
    setActiveUnscrambleQuestions(getUnscrambleSentenceQuestions(id, true));
    setCurrentView('active-unscramble-activity');
  };

  const handleUnscrambleActivityComplete = (activityId: string, score: number, total: number) => {
    const actId = activityId as UnscrambleActivityId;
    setUnscrambleActivityStats((prev) => ({
      ...prev,
      [actId]: {
        completedCount: total,
        score,
        totalQuestions: prev[actId]?.totalQuestions || total,
        isCompleted: true,
      },
    }));
  };

  const activeActivityMeta = VOCAB_ACTIVITIES.find((a) => a.id === activeActivityId);
  const activePatternActivityMeta = PATTERN_ACTIVITIES.find((a) => a.id === activePatternActivityId);
  const activeUnscrambleActivityMeta = UNSCRAMBLE_ACTIVITIES.find((a) => a.id === activeUnscrambleActivityId);

  const totalCompletedPatterns =
    patternActivityStats['choose-correct-sentence'].completedCount +
    patternActivityStats['complete-sentence'].completedCount +
    patternActivityStats['choose-correct-response'].completedCount +
    patternActivityStats['find-mistake'].completedCount;

  const totalScorePatterns =
    patternActivityStats['choose-correct-sentence'].score +
    patternActivityStats['complete-sentence'].score +
    patternActivityStats['choose-correct-response'].score +
    patternActivityStats['find-mistake'].score;

  const isModule2AllCompleted =
    patternActivityStats['choose-correct-sentence'].isCompleted &&
    patternActivityStats['complete-sentence'].isCompleted &&
    patternActivityStats['choose-correct-response'].isCompleted &&
    patternActivityStats['find-mistake'].isCompleted;

  const patternAnalysis = getPatternPerformanceAnalysis(patternActivityStats);

  return (
    <div className="space-y-6">
      {/* ================================================== */}
      {/* 1. PRACTICE HOME: 3 MODULES                        */}
      {/* ================================================== */}
      {currentView === 'home' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md tracking-wider">
                    AREA 2
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                    PRACTICE HOME
                  </h2>
                </div>
                <h3 className="text-base font-bold text-emerald-700 mt-0.5">
                  Luyện tập kiến thức Unit 3
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Chọn chuyên đề luyện tập phù hợp để củng cố từ vựng và mẫu câu.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold self-start sm:self-auto">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3 Practice Modules</span>
              </div>
            </div>
          </div>

          {/* 3 Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Module 1: VOCABULARY (ACTIVE) */}
            <div
              onClick={() => setCurrentView('vocab-overview')}
              className="bg-white rounded-3xl p-6 border-2 border-blue-400 hover:border-blue-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                    100 Questions
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
                    MODULE 1
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    1. VOCABULARY
                  </h3>
                  <p className="text-xs font-semibold text-blue-800">
                    Luyện tập từ vựng
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    4 dạng bài tập: Trắc nghiệm, điền chữ cái còn thiếu, sắp xếp thẻ chữ và từ vựng theo ngữ cảnh.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10 mt-4">
                <span className="text-xs font-bold text-slate-500">
                  4 Activities
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>VÀO LUYỆN TẬP</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Module 2: SENTENCE PATTERNS (ACTIVE) */}
            <div
              onClick={() => setCurrentView('patterns-overview')}
              className="bg-white rounded-3xl p-6 border-2 border-indigo-400 hover:border-indigo-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <MessageSquareText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                    50 Questions
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
                    MODULE 2
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    2. SENTENCE PATTERNS
                  </h3>
                  <p className="text-xs font-semibold text-indigo-800">
                    Luyện tập mẫu câu
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Hỏi &amp; trả lời về quốc tịch và tính cách người bạn nước ngoài.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10 mt-4">
                <span className="text-xs font-bold text-slate-500">
                  4 Activities
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>VÀO LUYỆN TẬP</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Module 3: UNSCRAMBLE SENTENCES (ACTIVE) */}
            <div
              onClick={() => setCurrentView('unscramble-overview')}
              className="bg-white rounded-3xl p-6 border-2 border-amber-400 hover:border-amber-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    20 Questions
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                    MODULE 3
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    3. UNSCRAMBLE SENTENCES
                  </h3>
                  <p className="text-xs font-semibold text-amber-800">
                    Sắp xếp câu hoàn chỉnh
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Ghép các thẻ từ thành câu hỏi và câu trả lời hoàn chỉnh theo chuẩn SGK.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10 mt-4">
                <span className="text-xs font-bold text-slate-500">
                  2 Activities
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 group-hover:translate-x-1 transition-transform">
                  <span>VÀO LUYỆN TẬP</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. VOCABULARY PRACTICE: 4 ACTIVITIES               */}
      {/* ================================================== */}
      {currentView === 'vocab-overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentView('home')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại Practice Home</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md tracking-wider">
                    MODULE 1
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    VOCABULARY PRACTICE
                  </h2>
                </div>
                <h3 className="text-base font-bold text-blue-700 mt-0.5">
                  Luyện tập từ vựng
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1.5 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-black">
                  100 questions • 4 activities
                </span>
              </div>
            </div>

            {/* Target Words Pill Reminder */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">8 từ vựng mục tiêu:</span>
              {['Australian', 'Malaysian', 'American', 'Japanese', 'friendly', 'helpful', 'clever', 'active'].map((w) => (
                <span
                  key={w}
                  className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold shadow-2xs"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          {/* 4 Activity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VOCAB_ACTIVITIES.map((activity) => {
              const stats = activityStats[activity.id];

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {activity.code}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {activity.plannedQuestions} questions
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">
                        {activity.title}
                      </h4>
                      <p className="text-xs font-bold text-blue-700">
                        {activity.titleVi}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.description}
                      </p>
                    </div>

                    {/* Progress indicator & Score */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                          Tiến độ
                        </span>
                        <span className="font-bold text-slate-700">
                          {stats.completedCount} / {activity.plannedQuestions} completed
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                          Điểm
                        </span>
                        <span className="font-bold text-blue-700">
                          {stats.isCompleted ? `${stats.score} đ` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Button & Status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xs font-bold text-slate-400">
                      {stats.isCompleted ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã làm ({stats.completedCount}/{stats.totalQuestions} câu)</span>
                        </span>
                      ) : (
                        <span>
                          {activity.id === 'multiple-choice'
                            ? 'Sẵn sàng 30 câu hỏi chính thức'
                            : 'Sẵn sàng luyện tập'}
                        </span>
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStartActivity(activity.id)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      {stats.isCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>LÀM LẠI</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>START</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 3. SENTENCE PATTERNS PRACTICE: 4 ACTIVITIES        */}
      {/* ================================================== */}
      {currentView === 'patterns-overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentView('home')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại Practice Home</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md tracking-wider">
                    MODULE 2
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    SENTENCE PATTERNS PRACTICE
                  </h2>
                </div>
                <h3 className="text-base font-bold text-indigo-700 mt-0.5">
                  Luyện tập mẫu câu
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1.5 rounded-2xl bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-black">
                  50 questions • 4 activities
                </span>
              </div>
            </div>

            {/* Display the Two Learning Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 shadow-2xs space-y-1.5">
                <span className="text-2xs font-black uppercase tracking-wider text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-200 inline-block">
                  PATTERN 1
                </span>
                <p className="text-sm font-black text-indigo-950 font-mono">
                  What nationality is he / she?
                </p>
                <p className="text-xs font-bold text-indigo-800 font-mono">
                  He’s / She’s + nationality.
                </p>
                <p className="text-2xs text-slate-500">
                  Hỏi &amp; trả lời về quốc tịch người bạn nước ngoài.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 shadow-2xs space-y-1.5">
                <span className="text-2xs font-black uppercase tracking-wider text-purple-600 bg-white px-2 py-0.5 rounded-md border border-purple-200 inline-block">
                  PATTERN 2
                </span>
                <p className="text-sm font-black text-purple-950 font-mono">
                  What’s he / she like?
                </p>
                <p className="text-xs font-bold text-purple-800 font-mono">
                  He’s / She’s + adjective.
                </p>
                <p className="text-2xs text-slate-500">
                  Hỏi &amp; trả lời về tính cách người bạn nước ngoài.
                </p>
              </div>
            </div>

            {/* Module 2 Total Progress Indicator */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">
                  TOTAL PROGRESS: {totalCompletedPatterns} / 50
                </span>
                {totalCompletedPatterns === 50 ? (
                  <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-black border border-emerald-300 flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>50 / 50 completed • MODULE COMPLETE ✓</span>
                  </span>
                ) : (
                  <span className="text-indigo-600 font-mono font-black">
                    {Math.round((totalCompletedPatterns / 50) * 100)}%
                  </span>
                )}
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(totalCompletedPatterns / 50) * 100}%` }}
                />
              </div>
            </div>

            {/* Module 2 Completion Summary When All 4 Activities Completed */}
            {isModule2AllCompleted && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-white border-2 border-indigo-300 shadow-sm space-y-5 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
                  <div>
                    <span className="text-2xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 inline-block">
                      TỔNG KẾT MODULE 2
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                      SENTENCE PATTERNS COMPLETE!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Em đã hoàn thành trọn vẹn cả 4 chuyên đề luyện tập mẫu câu Unit 3.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center px-4 py-2 bg-white rounded-2xl border border-indigo-200 shadow-2xs">
                      <span className="text-2xs font-bold text-slate-400 block uppercase">TOTAL SCORE</span>
                      <span className="text-2xl font-black text-slate-800">{totalScorePatterns} / 50</span>
                    </div>
                    <div className="text-center px-4 py-2 bg-white rounded-2xl border border-indigo-200 shadow-2xs">
                      <span className="text-2xs font-bold text-slate-400 block uppercase">OVERALL ACCURACY</span>
                      <span className="text-2xl font-black text-indigo-600">{patternAnalysis.overallAccuracy}%</span>
                    </div>
                  </div>
                </div>

                {/* Activity Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-2xs font-bold text-slate-400 block">A. Choose Sentence</span>
                    <span className="font-black text-indigo-900">{patternActivityStats['choose-correct-sentence'].score} / 15</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-2xs font-bold text-slate-400 block">B. Complete Sentence</span>
                    <span className="font-black text-indigo-900">{patternActivityStats['complete-sentence'].score} / 15</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-2xs font-bold text-slate-400 block">C. Correct Response</span>
                    <span className="font-black text-indigo-900">{patternActivityStats['choose-correct-response'].score} / 10</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-2xs font-bold text-slate-400 block">D. Find the Mistake</span>
                    <span className="font-black text-indigo-900">{patternActivityStats['find-mistake'].score} / 10</span>
                  </div>
                </div>

                {/* Strengths & Review Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-black">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>YOU'RE GOOD AT (Điểm em đã làm tốt)</span>
                    </div>
                    <ul className="space-y-1 text-emerald-950 font-medium list-disc list-inside">
                      {patternAnalysis.strongPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-900 font-black">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>REVIEW AGAIN (Nội dung cần ôn lại)</span>
                    </div>
                    <ul className="space-y-1 text-amber-950 font-medium list-disc list-inside">
                      {patternAnalysis.needsPracticePoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4 Activity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PATTERN_ACTIVITIES.map((activity) => {
              const stats = patternActivityStats[activity.id];

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-indigo-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {activity.code}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {activity.plannedQuestions} Questions
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">
                        {activity.title}
                      </h4>
                      <p className="text-xs font-bold text-indigo-700">
                        {activity.titleVi}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.description}
                      </p>
                    </div>

                    {/* Progress indicator & Score */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                          Tiến độ
                        </span>
                        <span className="font-bold text-slate-700">
                          {stats.completedCount} / {activity.plannedQuestions} completed
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                          Điểm
                        </span>
                        <span className="font-bold text-indigo-700">
                          {stats.isCompleted ? `${stats.score} đ` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Button & Status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xs font-bold text-slate-400">
                      {stats.isCompleted ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã làm ({stats.completedCount}/{stats.totalQuestions} câu)</span>
                        </span>
                      ) : (
                        <span>
                          {activity.id === 'choose-correct-sentence' || activity.id === 'complete-sentence'
                            ? 'Sẵn sàng 15 câu hỏi chính thức'
                            : 'Sẵn sàng 10 câu hỏi chính thức'}
                        </span>
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStartPatternActivity(activity.id)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      {stats.isCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>LÀM LẠI</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>START</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 4. UNSCRAMBLE SENTENCES: 2 ACTIVITIES              */}
      {/* ================================================== */}
      {currentView === 'unscramble-overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentView('home')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại Practice Home</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md tracking-wider">
                    MODULE 3
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    UNSCRAMBLE SENTENCES PRACTICE
                  </h2>
                </div>
                <h3 className="text-base font-bold text-amber-700 mt-0.5">
                  Sắp xếp câu hoàn chỉnh
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black">
                  20 questions • 2 activities
                </span>
              </div>
            </div>

            {/* Target Formula Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-2xs space-y-1.5">
                <span className="text-2xs font-black uppercase tracking-wider text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200 inline-block">
                  CÂU HỎI (QUESTIONS)
                </span>
                <p className="text-sm font-black text-amber-950 font-mono">
                  What nationality is he / she?
                </p>
                <p className="text-xs font-bold text-amber-800 font-mono">
                  What’s he / she like?
                </p>
                <p className="text-2xs text-slate-500">
                  Thứ tự từ: Từ để hỏi (What / Where) + Danh từ/Trợ động từ + Chủ ngữ.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-2xs space-y-1.5">
                <span className="text-2xs font-black uppercase tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                  CÂU TRẢ LỜI (ANSWERS)
                </span>
                <p className="text-sm font-black text-emerald-950 font-mono">
                  He’s / She’s + nationality.
                </p>
                <p className="text-xs font-bold text-emerald-800 font-mono">
                  He’s / She’s + adjective.
                </p>
                <p className="text-2xs text-slate-500">
                  Thứ tự từ: Chủ ngữ (He’s / She’s) + Quốc tịch / Tính từ chỉ tính cách.
                </p>
              </div>
            </div>
          </div>

          {/* 2 Activity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {UNSCRAMBLE_ACTIVITIES.map((activity) => {
              const stats = unscrambleActivityStats[activity.id];

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {activity.code}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {activity.plannedQuestions} Questions
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-800 tracking-tight">
                        {activity.title}
                      </h4>
                      <p className="text-xs font-bold text-amber-700">
                        {activity.titleVi}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.description}
                      </p>
                    </div>

                    {/* Progress indicator & Score */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                          Tiến độ
                        </span>
                        <span className="font-bold text-slate-700">
                          {stats.completedCount} / {activity.plannedQuestions} completed
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
                          Điểm
                        </span>
                        <span className="font-bold text-amber-700">
                          {stats.isCompleted ? `${stats.score} đ` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Button & Status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xs font-bold text-slate-400">
                      {stats.isCompleted ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã làm ({stats.completedCount}/{stats.totalQuestions} câu)</span>
                        </span>
                      ) : (
                        <span>Sẵn sàng 10 câu hỏi chính thức</span>
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStartUnscrambleActivity(activity.id)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      {stats.isCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>LÀM LẠI</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>START</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 5. ACTIVE VOCABULARY QUESTION ENGINE RUNNER        */}
      {/* ================================================== */}
      {currentView === 'active-activity' && activeActivityMeta && (
        <QuestionEngine
          activity={activeActivityMeta}
          questions={activeQuestions}
          onBackToActivities={() => setCurrentView('vocab-overview')}
          onActivityComplete={handleActivityComplete}
        />
      )}

      {/* ================================================== */}
      {/* 6. ACTIVE SENTENCE PATTERN QUESTION ENGINE RUNNER  */}
      {/* ================================================== */}
      {currentView === 'active-pattern-activity' && activePatternActivityMeta && (
        <PatternQuestionEngine
          activity={activePatternActivityMeta}
          questions={activePatternQuestions}
          onBackToActivities={() => setCurrentView('patterns-overview')}
          onActivityComplete={handlePatternActivityComplete}
        />
      )}

      {/* ================================================== */}
      {/* 7. ACTIVE UNSCRAMBLE QUESTION ENGINE RUNNER        */}
      {/* ================================================== */}
      {currentView === 'active-unscramble-activity' && activeUnscrambleActivityMeta && (
        <UnscrambleQuestionEngine
          activity={activeUnscrambleActivityMeta}
          questions={activeUnscrambleQuestions}
          onBackToActivities={() => setCurrentView('unscramble-overview')}
          onActivityComplete={handleUnscrambleActivityComplete}
        />
      )}
    </div>
  );
};
