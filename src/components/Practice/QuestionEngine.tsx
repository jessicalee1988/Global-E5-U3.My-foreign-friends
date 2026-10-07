import React, { useState, useEffect } from 'react';
import {
  PracticeQuestion,
  VocabActivityMeta,
  getActivityQuestions,
} from '../../data/practiceData';
import { MultipleChoiceInteraction } from './interactions/MultipleChoiceInteraction';
import { MissingLettersInteraction } from './interactions/MissingLettersInteraction';
import { UnscrambleWordInteraction } from './interactions/UnscrambleWordInteraction';
import { ContextChoiceInteraction } from './interactions/ContextChoiceInteraction';
import { ActivityResults } from './ActivityResults';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface QuestionEngineProps {
  activity: VocabActivityMeta;
  questions: PracticeQuestion[];
  onBackToActivities: () => void;
  onActivityComplete?: (activityId: string, score: number, total: number) => void;
}

export const QuestionEngine: React.FC<QuestionEngineProps> = ({
  activity,
  questions: initialQuestions,
  onBackToActivities,
  onActivityComplete,
}) => {
  const [sessionQuestions, setSessionQuestions] = useState<PracticeQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number>(2);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [wordsToReview, setWordsToReview] = useState<string[]>([]);
  const [grammarPointsToReview, setGrammarPointsToReview] = useState<string[]>([]);
  const [missedQuestions, setMissedQuestions] = useState<PracticeQuestion[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isReviewSession, setIsReviewSession] = useState<boolean>(false);

  // Synchronize when initialQuestions changes
  useEffect(() => {
    setSessionQuestions(initialQuestions);
    setCurrentIndex(0);
    setUserAnswer('');
    setAttemptsLeft(2);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setWordsToReview([]);
    setGrammarPointsToReview([]);
    setMissedQuestions([]);
    setIsFinished(false);
    setIsReviewSession(false);
  }, [initialQuestions]);

  // If questions is empty
  if (!sessionQuestions || sessionQuestions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <p className="text-slate-600">Chưa có câu hỏi nào trong chuyên đề này.</p>
        <button
          type="button"
          onClick={onBackToActivities}
          className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-sm"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const currentQuestion = sessionQuestions[currentIndex];
  const totalQuestions = sessionQuestions.length;

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (!userAnswer || !userAnswer.trim()) return;

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = currentQuestion.correctAnswer.trim().toLowerCase();
    const correct = normalizedUser === normalizedCorrect;

    setIsAnswerChecked(true);

    if (correct) {
      setIsCorrect(true);
      // Correct on 1st or 2nd attempt awards 1 point
      setScore((s) => s + 1);
    } else {
      setIsCorrect(false);
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);

      // If out of attempts after 2nd try
      if (remaining === 0) {
        if (!wordsToReview.includes(currentQuestion.targetWord)) {
          setWordsToReview((prev) => [...prev, currentQuestion.targetWord]);
        }
        if (currentQuestion.learningFocus && !grammarPointsToReview.includes(currentQuestion.learningFocus)) {
          setGrammarPointsToReview((prev) => [...prev, currentQuestion.learningFocus!]);
        }
        if (!missedQuestions.some((q) => q.id === currentQuestion.id)) {
          setMissedQuestions((prev) => [...prev, currentQuestion]);
        }
      }
    }
  };

  // Move to next question or complete
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

  // Try again with fresh set of questions
  const handleTryAgain = () => {
    const fresh = getActivityQuestions(activity.id, true);
    setSessionQuestions(fresh);
    setCurrentIndex(0);
    setUserAnswer('');
    setAttemptsLeft(2);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setWordsToReview([]);
    setGrammarPointsToReview([]);
    setMissedQuestions([]);
    setIsFinished(false);
    setIsReviewSession(false);
  };

  // Review mistakes: replay only the questions missed after 2 attempts
  // Uses the same teacher-approved questions and tiles; does not overwrite activity score
  const handleReviewMistakes = () => {
    if (missedQuestions.length === 0) return;
    setSessionQuestions([...missedQuestions]);
    setCurrentIndex(0);
    setUserAnswer('');
    setAttemptsLeft(2);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setWordsToReview([]);
    setGrammarPointsToReview([]);
    setMissedQuestions([]);
    setIsFinished(false);
    setIsReviewSession(true);
  };

  if (isFinished) {
    return (
      <ActivityResults
        activity={activity}
        score={score}
        totalQuestions={totalQuestions}
        wordsToReview={wordsToReview}
        grammarPointsToReview={grammarPointsToReview}
        onReviewMistakes={missedQuestions.length > 0 ? handleReviewMistakes : undefined}
        onTryAgain={handleTryAgain}
        onBackToPractice={onBackToActivities}
      />
    );
  }

  const isNextEnabled = isAnswerChecked && (isCorrect || attemptsLeft === 0);
  const isAllLettersUsed =
    activity.id !== 'unscramble-word' ||
    (Boolean(userAnswer) && userAnswer.trim().length === currentQuestion.correctAnswer.length);

  const canCheck =
    Boolean(userAnswer && userAnswer.trim()) &&
    isAllLettersUsed &&
    (!isAnswerChecked || (!isCorrect && attemptsLeft === 1));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header: Activity & Back */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={onBackToActivities}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách bài</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
            {activity.title}
          </span>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            Điểm: {score}
          </span>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
          <span className="flex items-center gap-2 text-sky-700">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span className="text-slate-300 font-normal">|</span>
            <span className="font-mono text-indigo-700 font-extrabold">WORD {currentIndex + 1} / {totalQuestions}</span>
          </span>
          <span className="text-slate-400 font-mono text-xs">
            {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Instruction & Prompt */}
      <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-sky-600 text-white text-2xs font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
              Yêu cầu
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              {currentQuestion.instruction}
            </span>
          </div>

          {currentQuestion.category && (
            <span className="text-2xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 shadow-2xs">
              {currentQuestion.category}
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200/70">
          <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-relaxed whitespace-pre-line">
            {currentQuestion.prompt}
          </p>
        </div>
      </div>

      {/* Answer Area (Interaction Component) */}
      <div className="py-1">
        {activity.id === 'multiple-choice' && (
          <MultipleChoiceInteraction
            options={currentQuestion.options || []}
            selectedOption={userAnswer || null}
            onSelectOption={(opt) => {
              setUserAnswer(opt);
              if (isAnswerChecked && !isCorrect && attemptsLeft > 0) {
                setIsAnswerChecked(false);
              }
            }}
            isAnswerChecked={isAnswerChecked}
            isCorrect={isCorrect}
            correctAnswer={currentQuestion.correctAnswer}
            attemptsLeft={attemptsLeft}
          />
        )}

        {activity.id === 'missing-letters' && (
          <MissingLettersInteraction
            missingTemplate={currentQuestion.missingTemplate}
            correctAnswer={currentQuestion.correctAnswer}
            userAnswer={userAnswer}
            onAnswerChange={(ans) => {
              setUserAnswer(ans);
              if (isAnswerChecked && !isCorrect && attemptsLeft > 0) {
                setIsAnswerChecked(false);
              }
            }}
            isAnswerChecked={isAnswerChecked}
            isCorrect={isCorrect}
            attemptsLeft={attemptsLeft}
          />
        )}

        {activity.id === 'unscramble-word' && (
          <UnscrambleWordInteraction
            tiles={currentQuestion.tiles}
            shuffledLetters={currentQuestion.letters || []}
            userAnswer={userAnswer}
            onAnswerChange={(ans) => {
              setUserAnswer(ans);
              if (isAnswerChecked && !isCorrect && attemptsLeft > 0) {
                setIsAnswerChecked(false);
              }
            }}
            isAnswerChecked={isAnswerChecked}
            isCorrect={isCorrect}
            correctAnswer={currentQuestion.correctAnswer}
            attemptsLeft={attemptsLeft}
          />
        )}

        {activity.id === 'vocab-context' && (
          <ContextChoiceInteraction
            options={currentQuestion.options || []}
            selectedOption={userAnswer || null}
            onSelectOption={(opt) => {
              setUserAnswer(opt);
              if (isAnswerChecked && !isCorrect && attemptsLeft > 0) {
                setIsAnswerChecked(false);
              }
            }}
            isAnswerChecked={isAnswerChecked}
            isCorrect={isCorrect}
            correctAnswer={currentQuestion.correctAnswer}
            attemptsLeft={attemptsLeft}
          />
        )}
      </div>

      {/* Immediate Feedback Area */}
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
                    Great job! Em đã trả lời chính xác.
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white border-2 border-emerald-400 font-black text-emerald-900 text-xl tracking-wider self-start sm:self-auto shadow-2xs">
                {currentQuestion.correctAnswer.toUpperCase()}
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
                  {activity.id === 'unscramble-word'
                    ? 'Chưa chính xác. Em hãy dùng nút ↶ UNDO hoặc ↻ RESET để sắp xếp lại nhé!'
                    : 'Chưa chính xác. Em còn 1 lần thử lại, hãy chọn lại nhé!'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3 text-rose-950 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm sm:text-base">The correct word is:</span>
                </div>
                <span className="px-4 py-1.5 rounded-xl bg-white border-2 border-rose-400 font-black text-rose-900 text-xl tracking-wider self-start sm:self-auto shadow-2xs">
                  {currentQuestion.correctAnswer.toUpperCase()}
                </span>
              </div>
              {(currentQuestion.feedback || currentQuestion.explanation) && (
                <div className="p-3 bg-white/90 rounded-xl border border-rose-200 text-xs sm:text-sm text-slate-700">
                  <span className="font-bold text-rose-800 block mb-0.5">💡 Giải thích & Ghi nhớ:</span>
                  <p>{currentQuestion.feedback || currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Footer: CHECK or NEXT */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-2xs text-slate-400 font-medium hidden sm:inline">
          {currentQuestion.isTestData && (
            <span className="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              [TEST DATA]
            </span>
          )}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          {!isNextEnabled ? (
            <button
              type="button"
              disabled={!canCheck}
              onClick={handleCheckAnswer}
              className={`px-6 py-3 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                canCheck
                  ? 'bg-sky-600 hover:bg-sky-700 text-white active:scale-95'
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
    </div>
  );
};
