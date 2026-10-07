import React, { useState, useEffect } from 'react';
import { SAMPLE_RESULT_SUMMARY } from '../../data/unit3Data';
import {
  pronunciationProgress,
  TARGET_PRONUNCIATION_WORDS,
} from '../../services/pronunciationProgress';
import {
  Award,
  BookOpen,
  MessageSquareText,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Mic,
} from 'lucide-react';

interface ResultsSectionProps {
  onReviewAgain: () => void;
  onReviewWord: (wordId: string) => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  onReviewAgain,
  onReviewWord,
}) => {
  const result = SAMPLE_RESULT_SUMMARY;

  const [, setProgressUpdate] = useState<number>(0);
  useEffect(() => {
    return pronunciationProgress.subscribe(() => {
      setProgressUpdate((c) => c + 1);
    });
  }, []);

  const bestScores = pronunciationProgress.getBestScores();
  const practisedCount = pronunciationProgress.getPractisedCount();
  const averageBestScore = pronunciationProgress.getAverageBestScore();

  return (
    <div className="space-y-8">
      {/* Results Header / Celebration Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Student Results Dashboard
              </span>
              <span className="text-amber-100 text-xs font-medium">
                {result.studentName} • {result.grade}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {result.rating}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium">
              {result.ratingVi}
            </p>
          </div>

          {/* Big Score Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-4 sm:p-5 flex items-center gap-4 self-start md:self-auto">
            <div className="w-14 h-14 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-black shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-100 uppercase tracking-wider block">
                Total Score
              </span>
              <div className="text-3xl font-black leading-none">
                {result.totalScore}
                <span className="text-base font-semibold text-amber-200"> / {result.maxScore}</span>
              </div>
              <span className="text-2xs text-amber-100 mt-1 block font-medium">
                Grade 5 Star Result
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics: Vocabulary vs Sentence Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vocabulary Performance Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Vocabulary Performance
                </h3>
                <p className="text-2xs text-slate-500">Target Vocabulary (8 words)</p>
              </div>
            </div>
            <span className="text-xl font-black text-sky-600">
              {result.vocabPerformance.percentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${result.vocabPerformance.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{result.vocabPerformance.masteredCount} of 8 words mastered</span>
              <span className="font-semibold text-sky-700">Excellent</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">
            Great mastery of Australian, American, Japanese, friendly, clever, active.
          </p>
        </div>

        {/* Sentence Pattern Performance Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Sentence Pattern Performance
                </h3>
                <p className="text-2xs text-slate-500">Pattern 1 &amp; Pattern 2</p>
              </div>
            </div>
            <span className="text-xl font-black text-emerald-600">
              {result.sentencePatternPerformance.percentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${result.sentencePatternPerformance.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Mẫu câu quốc tịch &amp; tính cách</span>
              <span className="font-semibold text-emerald-700">Good progress</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">
            Notice: remember to use adjective in “What’s she like?” questions.
          </p>
        </div>
      </div>

      {/* PRONUNCIATION / Luyện phát âm (Formative result for 8 target words) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Formative Coach
                </span>
                <h3 className="font-black text-slate-800 text-xl">
                  PRONUNCIATION PRACTICE (Luyện phát âm)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI Pronunciation Coach results for the 8 target Unit 3 words.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
              <span className="text-3xs uppercase tracking-wider font-bold text-slate-400 block">
                Words Practised
              </span>
              <span className="text-sm font-black text-slate-800">
                {practisedCount} / 8
              </span>
            </div>

            <div className="bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200 text-center">
              <span className="text-3xs uppercase tracking-wider font-bold text-rose-600 block">
                Average Best Score
              </span>
              <span className="text-sm font-black text-rose-700">
                {averageBestScore !== null ? `${averageBestScore} / 100` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* 8 Target Words Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TARGET_PRONUNCIATION_WORDS.map((word) => {
            const score = bestScores[word];
            const isPractised = typeof score === 'number';

            return (
              <div
                key={word}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPractised
                    ? 'bg-white border-rose-200 shadow-2xs hover:border-rose-400'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-3xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        ['Australian', 'Malaysian', 'American', 'Japanese'].includes(word)
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {['Australian', 'Malaysian', 'American', 'Japanese'].includes(word)
                        ? 'Nationality'
                        : 'Personality'}
                    </span>
                    {isPractised && score >= 90 ? (
                      <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Excellent
                      </span>
                    ) : null}
                  </div>

                  <h4 className="text-base font-black text-slate-800">{word}</h4>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isPractised ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  >
                    {isPractised ? `Best: ${score} / 100` : 'Not practised'}
                  </span>

                  <button
                    type="button"
                    onClick={() => onReviewWord(word.toLowerCase())}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={`Luyện phát âm từ ${word}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Words that need more practice */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>Words that need more practice (Từ vựng cần ôn lại)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any word below to immediately open its review flashcard.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
            {result.wordsNeedingPractice.length} target words to reinforce
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.wordsNeedingPractice.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 hover:bg-amber-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-amber-800 border border-amber-200">
                    {item.category}
                  </span>
                  <span className="text-2xs text-amber-700 font-semibold">
                    {item.missedCount} missed in practice
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-800">{item.word}</h4>
                <p className="text-xs text-slate-600 font-medium">{item.meaning}</p>
              </div>

              <button
                type="button"
                onClick={() => onReviewWord(item.word.toLowerCase())}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Review Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mistakes & Explanations History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <span>Mistakes &amp; Learning Support (Ghi chú sửa lỗi chi tiết)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Review previous practice questions and teacher grammar notes to avoid repeated errors.
          </p>
        </div>

        <div className="space-y-4">
          {result.mistakesHistory.map((mistake) => (
            <div
              key={mistake.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  {mistake.category}
                </span>
                <span className="text-2xs text-rose-600 font-bold">Needs Attention</span>
              </div>

              <p className="text-sm font-bold text-slate-800">
                Câu hỏi: “{mistake.questionText}”
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-medium">
                  <span className="font-bold block text-2xs uppercase text-rose-600">Câu trả lời sai:</span>
                  ✕ {mistake.studentAnswer}
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                  <span className="font-bold block text-2xs uppercase text-emerald-600">Đáp án chính xác:</span>
                  ✓ {mistake.correctAnswer}
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Giải thích cho học sinh: </span>
                {mistake.explanationVi}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Again Primary Call to Action */}
      <div className="bg-sky-50 rounded-3xl p-6 sm:p-8 border-2 border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold text-sky-950">Ready to boost your score?</h4>
          <p className="text-xs sm:text-sm text-sky-700 mt-1">
            Revisit the flashcards, listen to the conversation, and check the sentence patterns.
          </p>
        </div>

        <button
          type="button"
          onClick={onReviewAgain}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Review Again (Ôn tập lại ngay)</span>
        </button>
      </div>
    </div>
  );
};
