import React from 'react';
import { Award, RotateCcw, ArrowLeft, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { VocabActivityMeta } from '../../data/practiceData';

interface ActivityResultsProps {
  activity: VocabActivityMeta;
  score: number;
  totalQuestions: number;
  wordsToReview: string[];
  grammarPointsToReview?: string[];
  onReviewMistakes?: () => void;
  onTryAgain: () => void;
  onBackToPractice: () => void;
}

export const ActivityResults: React.FC<ActivityResultsProps> = ({
  activity,
  score,
  totalQuestions,
  wordsToReview,
  grammarPointsToReview,
  onReviewMistakes,
  onTryAgain,
  onBackToPractice,
}) => {
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const isPerfect = score === totalQuestions && totalQuestions > 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
      {/* Badge & Title */}
      <div className="space-y-3">
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md ${
            isPerfect
              ? 'bg-amber-100 text-amber-600 ring-4 ring-amber-200'
              : 'bg-sky-100 text-sky-600 ring-4 ring-sky-200'
          }`}
        >
          <Award className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            {activity.title} • HOÀN THÀNH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-2">
            {activity.title} COMPLETE!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Em đã hoàn thành các câu hỏi luyện tập của chuyên đề này.
          </p>
        </div>
      </div>

      {/* Stats Cards: Score & Accuracy */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Score
          </span>
          <p className="text-3xl sm:text-4xl font-black text-sky-700">
            {score} <span className="text-base sm:text-lg text-slate-400 font-bold">/ {totalQuestions}</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Accuracy
          </span>
          <p
            className={`text-3xl sm:text-4xl font-black ${
              accuracy >= 80
                ? 'text-emerald-600'
                : accuracy >= 50
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}
          >
            {accuracy}%
          </p>
        </div>
      </div>

      {/* Words to review */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          {wordsToReview.length > 0 ? (
            <>
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Words to review (Từ cần ôn lại):</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-800">Tuyệt vời! Không có từ nào cần ôn lại 🎉</span>
            </>
          )}
        </div>

        {wordsToReview.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {wordsToReview.map((word, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm shadow-2xs"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600">
            Em đã trả lời đúng tất cả các câu hỏi mục tiêu của bài này.
          </p>
        )}
      </div>

      {/* Grammar points to review */}
      {grammarPointsToReview && grammarPointsToReview.length > 0 && (
        <div className="bg-teal-50/80 rounded-2xl p-5 border border-teal-200 text-left space-y-3">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>GRAMMAR POINTS TO REVIEW (Điểm ngữ pháp cần ôn lại):</span>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            {grammarPointsToReview.map((point, idx) => (
              <div
                key={idx}
                className="px-3.5 py-2 rounded-xl bg-white border border-teal-300 font-mono font-bold text-sm text-teal-900 shadow-2xs flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                <span>• {point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {wordsToReview.length > 0 && onReviewMistakes && (
          <button
            type="button"
            onClick={onReviewMistakes}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>REVIEW MISTAKES</span>
          </button>
        )}

        <button
          type="button"
          onClick={onTryAgain}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>

        <button
          type="button"
          onClick={onBackToPractice}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO VOCABULARY PRACTICE</span>
        </button>
      </div>
    </div>
  );
};
