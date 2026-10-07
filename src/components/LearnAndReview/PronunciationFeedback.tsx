import React from 'react';
import { PronunciationResult } from '../../services/pronunciationAnalyzer';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  TrendingUp,
  Play,
  Pause,
} from 'lucide-react';

interface PronunciationFeedbackProps {
  result: PronunciationResult;
  previousScore: number | null;
  bestScore: number | null;
  onListenAgain: () => void;
  onTryAgain: () => void;
  onNextWord?: () => void;
  isModelAudioPlaying?: boolean;
  onPlayRecording?: () => void;
  isPlayingRecording?: boolean;
}

export const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({
  result,
  previousScore,
  bestScore,
  onListenAgain,
  onTryAgain,
  onNextWord,
  isModelAudioPlaying = false,
  onPlayRecording,
  isPlayingRecording = false,
}) => {
  const { totalScore, scores, strengths, focusAreas, studentTip, targetWord } = result;

  // Score Band Calculation
  const getScoreBand = (score: number) => {
    if (score >= 90) {
      return {
        labelEn: 'Excellent!',
        labelVi: 'Xuất sắc!',
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-300',
        badgeBg: 'bg-emerald-600',
        ringColor: 'ring-emerald-400',
      };
    }
    if (score >= 80) {
      return {
        labelEn: 'Great job!',
        labelVi: 'Rất tốt!',
        colorClass: 'text-teal-700 bg-teal-50 border-teal-300',
        badgeBg: 'bg-teal-600',
        ringColor: 'ring-teal-400',
      };
    }
    if (score >= 70) {
      return {
        labelEn: 'Good!',
        labelVi: 'Khá tốt!',
        colorClass: 'text-sky-700 bg-sky-50 border-sky-300',
        badgeBg: 'bg-sky-600',
        ringColor: 'ring-sky-400',
      };
    }
    if (score >= 60) {
      return {
        labelEn: 'Keep practising!',
        labelVi: 'Cố gắng thêm nhé!',
        colorClass: 'text-amber-700 bg-amber-50 border-amber-300',
        badgeBg: 'bg-amber-600',
        ringColor: 'ring-amber-400',
      };
    }
    return {
      labelEn: 'Listen and try again!',
      labelVi: 'Nghe lại và thử lại nhé!',
      colorClass: 'text-orange-700 bg-orange-50 border-orange-300',
      badgeBg: 'bg-orange-500',
      ringColor: 'ring-orange-300',
    };
  };

  const scoreBand = getScoreBand(totalScore);

  // Improvement check: only show positive encouragement if new score is higher
  const hasImprovement = previousScore !== null && totalScore > previousScore;

  const tipText = result.tip || studentTip;
  const wordScore = scores.wordMatch ?? scores.wordRecognition ?? 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
              PRONUNCIATION FEEDBACK
            </h3>
            <p className="text-2xs text-slate-500 font-medium">AI nhận xét phát âm</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xs uppercase tracking-wider font-bold text-slate-400 block">
            Target
          </span>
          <span className="text-base font-black text-rose-600">{targetWord}</span>
        </div>
      </div>

      {/* Wrong-word detection encouragement banner if wordMatch is false */}
      {!result.wordMatch && (
        <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5 text-amber-700" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-amber-950">
              Listen to the word again and try once more.
            </p>
            <p className="text-amber-800 font-medium mt-0.5">
              Nghe lại từ mẫu và thử lại nhé.
            </p>
          </div>
        </div>
      )}

      {/* Main Score Showcase */}
      <div className="bg-gradient-to-br from-slate-50 to-rose-50/50 rounded-2xl p-5 border-2 border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Large Overall Score */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 leading-none">
                {totalScore}
              </span>
              <span className="text-3xs font-bold text-slate-400 mt-0.5">/ 100</span>
            </div>
            {bestScore !== null && totalScore >= bestScore && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 text-3xs font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                <Award className="w-2.5 h-2.5" />
                BEST
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${scoreBand.colorClass}`}
            >
              <span>{scoreBand.labelEn}</span>
              <span className="text-3xs opacity-80">({scoreBand.labelVi})</span>
            </div>

            {/* Score comparison for retries */}
            {previousScore !== null && (
              <div className="flex items-center gap-2 text-xs pt-0.5">
                <span className="text-slate-500">
                  Previous: <b className="text-slate-700">{previousScore}</b>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  New: <b className="text-slate-900">{totalScore}</b>
                </span>
              </div>
            )}

            {hasImprovement && (
              <div className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md animate-bounce">
                <TrendingUp className="w-3 h-3" />
                <span>Great improvement! (Em tiến bộ rồi!)</span>
              </div>
            )}
          </div>
        </div>

        {/* Four Compact Dimension Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
          {/* 1. Word Match */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              WORD
            </span>
            <div className="text-sm font-black text-slate-800">
              {wordScore}
              <span className="text-3xs text-slate-400 font-normal"> / 30</span>
            </div>
          </div>

          {/* 2. Key Sounds */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              SOUNDS
            </span>
            <div className="text-sm font-black text-slate-800">
              {scores.keySounds}
              <span className="text-3xs text-slate-400 font-normal"> / 30</span>
            </div>
          </div>

          {/* 3. Word Stress */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              STRESS
            </span>
            <div className="text-sm font-black text-slate-800">
              {scores.wordStress}
              <span className="text-3xs text-slate-400 font-normal"> / 20</span>
            </div>
          </div>

          {/* 4. Clarity */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              CLARITY
            </span>
            <div className="text-sm font-black text-slate-800">
              {scores.clarity}
              <span className="text-3xs text-slate-400 font-normal"> / 20</span>
            </div>
          </div>
        </div>
      </div>

      {/* STUDENT FEEDBACK SECTIONS */}
      <div className="space-y-3">
        {/* WHAT YOU DID WELL */}
        {strengths && strengths.length > 0 && (
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>✓ WHAT YOU DID WELL (Em làm tốt)</span>
            </div>
            <ul className="space-y-1 text-xs text-emerald-950 pl-1 font-medium">
              {strengths.slice(0, 2).map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TRY THIS */}
        {focusAreas && focusAreas.length > 0 && (
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>△ TRY THIS (Em hãy chú ý)</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-950 pl-1 font-medium">
              {focusAreas.slice(0, 2).map((area, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold shrink-0">△</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TIP */}
        {tipText && (
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-black uppercase tracking-wide text-indigo-900 block mb-0.5">
                TIP
              </span>
              <p className="text-indigo-950 font-medium leading-relaxed">{tipText}</p>
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS AFTER FEEDBACK */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. LISTEN AGAIN (Plays ONLY existing teacher-provided model MP3) */}
          <button
            type="button"
            onClick={onListenAgain}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              isModelAudioPlaying
                ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                : 'bg-white hover:bg-sky-50 text-sky-700 border border-sky-300'
            }`}
            title="Nghe lại bản phát âm chuẩn của giáo viên"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isModelAudioPlaying ? 'Đang phát mẫu...' : '🔊 Nghe lại mẫu'}</span>
          </button>

          {/* 2. PLAY MY VOICE (Listen to student recording) */}
          {onPlayRecording && (
            <button
              type="button"
              onClick={onPlayRecording}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                isPlayingRecording
                  ? 'bg-pink-600 text-white ring-2 ring-pink-300'
                  : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200'
              }`}
              title="Nghe lại bản thu âm của bạn"
            >
              {isPlayingRecording ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Dừng nghe</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>▶ Nghe lại giọng em</span>
                </>
              )}
            </button>
          )}

          {/* 3. TRY AGAIN (Return to recording mode) */}
          <button
            type="button"
            onClick={onTryAgain}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Thu âm lại để cải thiện điểm số"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>🎙 Thu âm lại</span>
          </button>
        </div>

        {/* 4. NEXT WORD (Move to next card and reset recorder) */}
        {onNextWord && (
          <button
            type="button"
            onClick={onNextWord}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-900 text-white shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ml-auto"
            title="Chuyển sang từ vựng tiếp theo"
          >
            <span>Từ tiếp theo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
