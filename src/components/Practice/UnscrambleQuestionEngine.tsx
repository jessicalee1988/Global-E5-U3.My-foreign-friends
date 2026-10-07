import React, { useState, useEffect } from 'react';
import {
  UnscrambleActivityMeta,
  UnscrambleSentenceQuestion,
  getUnscrambleSentenceQuestions,
} from '../../data/unscrambleSentenceData';
import { UnscrambleSentenceInteraction } from './interactions/UnscrambleSentenceInteraction';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';

interface UnscrambleQuestionEngineProps {
  activity: UnscrambleActivityMeta;
  questions: UnscrambleSentenceQuestion[];
  onBackToActivities: () => void;
  onActivityComplete?: (activityId: string, score: number, total: number) => void;
}

export const UnscrambleQuestionEngine: React.FC<UnscrambleQuestionEngineProps> = ({
  activity,
  questions: initialQuestions,
  onBackToActivities,
  onActivityComplete,
}) => {
  const [sessionQuestions, setSessionQuestions] = useState<UnscrambleSentenceQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number>(2);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [missedQuestions, setMissedQuestions] = useState<UnscrambleSentenceQuestion[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isReviewSession, setIsReviewSession] = useState<boolean>(false);

  useEffect(() => {
    setSessionQuestions(initialQuestions);
    setCurrentIndex(0);
    setUserAnswer('');
    setAttemptsLeft(2);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setMissedQuestions([]);
    setIsFinished(false);
    setIsReviewSession(false);
  }, [initialQuestions]);

  if (!sessionQuestions || sessionQuestions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <p className="text-slate-600">Chưa có câu hỏi nào trong chuyên đề này.</p>
        <button
          type="button"
          onClick={onBackToActivities}
          className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-sm cursor-pointer"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const currentQuestion = sessionQuestions[currentIndex];
  const totalQuestions = sessionQuestions.length;

  const normalizeSentence = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/\s+/g, ' ');
  };

  const handleCheckAnswer = () => {
    if (!userAnswer || !userAnswer.trim()) return;

    const normalizedUser = normalizeSentence(userAnswer);
    const normalizedCorrect = normalizeSentence(currentQuestion.correctSentence);
    const correct = normalizedUser === normalizedCorrect;

    setIsAnswerChecked(true);

    if (correct) {
      setIsCorrect(true);
      setScore((s) => s + 1);
    } else {
      setIsCorrect(false);
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);

      if (remaining === 0) {
        if (!missedQuestions.some((q) => q.id === currentQuestion.id)) {
          setMissedQuestions((prev) => [...prev, currentQuestion]);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setUserAnswer('');
      setAttemptsLeft(2);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
      if (onActivityComplete && !isReviewSession) {
        onActivityComplete(activity.id, score, totalQuestions);
      }
    }
  };

  const handleTryAgain = () => {
    const fresh = getUnscrambleSentenceQuestions(activity.id, true);
    setSessionQuestions(fresh);
    setCurrentIndex(0);
    setUserAnswer('');
    setAttemptsLeft(2);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setMissedQuestions([]);
    setIsFinished(false);
    setIsReviewSession(false);
  };

  const handleReviewMistakes = () => {
    if (missedQuestions.length === 0) return;
    setSessionQuestions([...missedQuestions]);
    setCurrentIndex(0);
    setUserAnswer('');
    setAttemptsLeft(2);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setMissedQuestions([]);
    setIsFinished(false);
    setIsReviewSession(true);
  };

  // Completion Screen
  if (isFinished) {
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isPerfect = score === totalQuestions && totalQuestions > 0;

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-3">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md ${
              isPerfect
                ? 'bg-amber-100 text-amber-600 ring-4 ring-amber-200'
                : 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-200'
            }`}
          >
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {activity.title} • HOÀN THÀNH
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-2">
              {activity.title} COMPLETE!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Em đã hoàn thành xuất sắc các bài tập sắp xếp câu hoàn chỉnh!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</span>
            <p className="text-3xl font-black text-slate-800">
              {score} <span className="text-base font-bold text-slate-400">/ {totalQuestions}</span>
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
            <p className="text-3xl font-black text-amber-600">{accuracy}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {missedQuestions.length > 0 && (
            <button
              type="button"
              onClick={handleReviewMistakes}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>REVIEW MISTAKES</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleTryAgain}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          <button
            type="button"
            onClick={onBackToActivities}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO UNSCRAMBLE SENTENCES</span>
          </button>
        </div>
      </div>
    );
  }

  const isNextEnabled = isAnswerChecked && (isCorrect || attemptsLeft === 0);
  const wordsInAnswer = userAnswer.trim() ? userAnswer.trim().split(' ').length : 0;
  const isAllWordsUsed = wordsInAnswer === currentQuestion.shuffledWords.length;
  const canCheck = isAllWordsUsed && (!isAnswerChecked || (!isCorrect && attemptsLeft === 1));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={onBackToActivities}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách bài tập</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {activity.title}
          </span>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            Điểm: {score}
          </span>
        </div>
      </div>

      {/* Progress Bar & Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
          <span className="flex items-center gap-2 text-amber-700">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span className="text-slate-300 font-normal">|</span>
            <span className="font-mono text-amber-800 font-extrabold">CÂU {currentIndex + 1} / {totalQuestions}</span>
          </span>
          <span className="text-slate-400 font-mono text-xs">
            {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction & Prompt Banner */}
      <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-600 text-white text-2xs font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
              Yêu cầu
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              {currentQuestion.instruction}
            </span>
          </div>

          {currentQuestion.instructionVi && (
            <span className="text-xs text-slate-500 italic">
              ({currentQuestion.instructionVi})
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200/70">
          <p className="text-base sm:text-lg font-black text-slate-800">
            {currentQuestion.prompt}
          </p>
          {currentQuestion.contextVi && (
            <p className="text-xs text-slate-500 mt-0.5">
              💡 Nghĩa tiếng Việt: <span className="font-semibold text-slate-700">{currentQuestion.contextVi}</span>
            </p>
          )}
        </div>
      </div>

      {/* Interaction Component */}
      <UnscrambleSentenceInteraction
        shuffledWords={currentQuestion.shuffledWords}
        userAnswer={userAnswer}
        onAnswerChange={(ans) => {
          setUserAnswer(ans);
          if (isAnswerChecked && !isCorrect && attemptsLeft > 0) {
            setIsAnswerChecked(false);
          }
        }}
        isAnswerChecked={isAnswerChecked}
        isCorrect={isCorrect}
        correctAnswer={currentQuestion.correctSentence}
        attemptsLeft={attemptsLeft}
      />

      {/* Immediate Feedback */}
      {isAnswerChecked && (
        <div className="animate-fade-in">
          {isCorrect ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-black">✓ Correct!</p>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                    Xuất sắc! Em đã ghép câu hoàn toàn chính xác.
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white border-2 border-emerald-400 font-black text-emerald-900 text-base sm:text-lg tracking-wide self-start sm:self-auto shadow-2xs">
                {currentQuestion.correctSentence}
              </div>
            </div>
          ) : attemptsLeft > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3 text-amber-950 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-black">✗ Not quite. Try again!</p>
                <p className="text-xs sm:text-sm font-semibold text-amber-800">
                  Thứ tự từ chưa chính xác. Em còn 1 lần thử lại, hãy dùng nút ↶ UNDO hoặc ↻ RESET để đổi vị trí từ nhé!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3 text-rose-950 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm sm:text-base">The correct sentence is:</span>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-white border-2 border-rose-400 font-black text-rose-900 text-base sm:text-lg tracking-wide self-start sm:self-auto shadow-2xs">
                  {currentQuestion.correctSentence}
                </span>
              </div>
              {currentQuestion.feedback && (
                <div className="p-3 bg-white/90 rounded-xl border border-rose-200 text-xs sm:text-sm text-slate-700">
                  <span className="font-bold text-rose-800 block mb-0.5">💡 Cấu trúc câu chuẩn:</span>
                  <p>{currentQuestion.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        {!isNextEnabled ? (
          <button
            type="button"
            disabled={!canCheck}
            onClick={handleCheckAnswer}
            className={`px-6 py-3 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
              canCheck
                ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>CHECK</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 animate-pulse"
          >
            <span>{currentIndex < totalQuestions - 1 ? 'NEXT →' : 'FINISH'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
