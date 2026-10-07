import React, { useState, useEffect, useRef } from 'react';
import { ExtendedVocabItem } from '../../data/unit3Data';
import { assetManager } from '../../services/assetManager';
import {
  analyzePronunciation,
  PronunciationResult,
} from '../../services/pronunciationAnalyzer';
import { pronunciationProgress } from '../../services/pronunciationProgress';
import { PronunciationFeedback } from './PronunciationFeedback';
import {
  Mic,
  Square,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  X,
  AlertCircle,
  Headphones,
  CheckCircle2,
  Sparkles,
  Loader2,
  VolumeX,
} from 'lucide-react';

interface PronunciationPracticePanelProps {
  item: ExtendedVocabItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNextWord?: () => void;
}

export const PronunciationPracticePanel: React.FC<PronunciationPracticePanelProps> = ({
  item,
  isOpen,
  onClose,
  onNextWord,
}) => {
  // Panel modes: 'record' | 'analyzing' | 'feedback' | 'low-confidence' | 'error'
  const [panelMode, setPanelMode] = useState<
    'record' | 'analyzing' | 'feedback' | 'low-confidence' | 'error'
  >('record');

  // Model audio state
  const [isPlayingModel, setIsPlayingModel] = useState<boolean>(false);

  // Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);

  // Recorded audio state
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState<boolean>(false);
  const [recordingPlaybackProgress, setRecordingPlaybackProgress] = useState<number>(0);

  // Analysis results & score comparison
  const [analysisResult, setAnalysisResult] = useState<PronunciationResult | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [lastAttemptScore, setLastAttemptScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs for audio and media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioBlobRef = useRef<Blob | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const maxDurationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop everything and clean up when item changes or modal closes
  const stopAndCleanup = () => {
    // Stop model audio
    assetManager.stopAudio();
    setIsPlayingModel(false);

    // Stop recording timer
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    mediaRecorderRef.current = null;

    // Stop mic stream
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    setIsRecording(false);
    setRecordingDuration(0);

    // Stop recorded audio playback
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
      recordedAudioElementRef.current = null;
    }
    setIsPlayingRecording(false);
    setRecordingPlaybackProgress(0);
  };

  // Reset state when target word changes or modal opens/closes
  useEffect(() => {
    stopAndCleanup();
    setMicError(null);
    setPanelMode('record');
    setAnalysisResult(null);
    setPreviousScore(null);
    setLastAttemptScore(null);
    setErrorMessage(null);
    recordedAudioBlobRef.current = null;

    setRecordedAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    return () => {
      stopAndCleanup();
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [item?.id, isOpen]);

  if (!isOpen || !item) return null;

  // 1. Play teacher's model audio
  const handlePlayModelAudio = async () => {
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
      setIsPlayingRecording(false);
    }

    setIsPlayingModel(true);
    const played = await assetManager.playAudio(item.audioPlaceholderId, () => {
      setIsPlayingModel(false);
    });

    if (!played) {
      setIsPlayingModel(false);
      setMicError(`Chưa có file audio mẫu cho từ "${item.word}".`);
      setTimeout(() => setMicError(null), 3500);
    }
  };

  // 2. Start recording (requests microphone permission only now!)
  const handleStartRecording = async () => {
    setMicError(null);
    assetManager.stopAudio();
    setIsPlayingModel(false);

    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
      setIsPlayingRecording(false);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('Trình duyệt của bạn không hỗ trợ ghi âm trực tiếp qua microphone.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      let selectedMimeType = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      const options = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: selectedMimeType || 'audio/webm',
        });
        if (audioBlob.size > 0) {
          recordedAudioBlobRef.current = audioBlob;
          if (recordedAudioUrl) {
            URL.revokeObjectURL(recordedAudioUrl);
          }
          const newUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(newUrl);
        }

        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }
        setIsRecording(false);
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingDuration(0);

      const startTime = Date.now();
      recordingTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingDuration(elapsed);
      }, 500);

      maxDurationTimerRef.current = setTimeout(() => {
        handleStopRecording();
      }, 10000);
    } catch (err: unknown) {
      console.error('Microphone access error:', err);
      setIsRecording(false);
      setMicError(
        'Không thể truy cập microphone. Vui lòng cho phép quyền truy cập micro trong trình duyệt để luyện phát âm.'
      );
    }
  };

  // 3. Stop recording
  const handleStopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.requestData();
        }
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping media recorder:', e);
      }
    }
    setIsRecording(false);
  };

  // 4. Play student's recorded audio
  const handlePlayRecording = () => {
    if (!recordedAudioUrl) return;

    assetManager.stopAudio();
    setIsPlayingModel(false);

    if (isPlayingRecording && recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
      setIsPlayingRecording(false);
      return;
    }

    const audio = new Audio(recordedAudioUrl);
    recordedAudioElementRef.current = audio;
    setIsPlayingRecording(true);
    setRecordingPlaybackProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setRecordingPlaybackProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setIsPlayingRecording(false);
      setRecordingPlaybackProgress(100);
      recordedAudioElementRef.current = null;
    };

    audio.onerror = () => {
      setIsPlayingRecording(false);
      recordedAudioElementRef.current = null;
    };

    audio.play().catch((err) => {
      console.warn('Could not play recorded audio:', err);
      setIsPlayingRecording(false);
    });
  };

  // 5. Record again
  const handleRecordAgain = () => {
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
      recordedAudioElementRef.current = null;
    }
    setIsPlayingRecording(false);
    setRecordingPlaybackProgress(0);
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    recordedAudioBlobRef.current = null;
    handleStartRecording();
  };

  // 6. CHECK PRONUNCIATION (Phase 2 AI Analysis)
  const handleCheckPronunciation = async () => {
    if (!recordedAudioBlobRef.current) {
      setMicError('Chưa có bản ghi âm để phân tích. Em hãy ghi âm trước nhé.');
      return;
    }

    // Stop playback if playing
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
      setIsPlayingRecording(false);
    }
    assetManager.stopAudio();
    setIsPlayingModel(false);

    setPanelMode('analyzing');
    setErrorMessage(null);

    try {
      const result = await analyzePronunciation(
        recordedAudioBlobRef.current,
        item.word
      );

      // Only route to low-confidence if recording was truly empty/silent with 0 score and no feedback
      const hasFeedbackContent =
        result.totalScore > 0 ||
        (Array.isArray(result.strengths) && result.strengths.length > 0) ||
        (Array.isArray(result.focusAreas) && result.focusAreas.length > 0 && result.focusAreas[0] !== 'Thu âm to và rõ ràng hơn');

      if (!hasFeedbackContent && (result.confidence === 'low' || result.isLowConfidence)) {
        setAnalysisResult(result);
        setPanelMode('low-confidence');
        return;
      }

      // Track previous vs new score for improvement encouragement
      setPreviousScore(lastAttemptScore);
      setLastAttemptScore(result.totalScore);

      // Save best score to session progress
      if (result.totalScore > 0) {
        pronunciationProgress.saveScore(item.word, result.totalScore);
      }

      setAnalysisResult(result);
      setPanelMode('feedback');
    } catch (err: unknown) {
      console.error('Pronunciation check error:', err);
      setErrorMessage(
        "We couldn't check your pronunciation this time. Please try again."
      );
      setPanelMode('error');
    }
  };

  // 7. Actions after feedback or errors
  const handleTryAgain = () => {
    if (recordedAudioElementRef.current) {
      recordedAudioElementRef.current.pause();
      recordedAudioElementRef.current = null;
    }
    setIsPlayingRecording(false);
    setRecordingPlaybackProgress(0);

    // Keep previous score intact so the next attempt can compare!
    setPanelMode('record');
  };

  const handleNextWordClick = () => {
    stopAndCleanup();
    if (onNextWord) {
      onNextWord();
    }
  };

  // Format seconds as 00:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentBestScore = pronunciationProgress.getBestScore(item.word);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full border-2 border-rose-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide leading-none">
                PRONUNCIATION COACH
              </h3>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                Luyện &amp; Kiểm tra phát âm AI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Đóng (Close)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Target Word Showcase */}
          <div className="bg-gradient-to-b from-rose-50/70 to-pink-50/40 rounded-2xl p-5 border border-rose-100 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200 shadow-2xs">
                {item.category === 'Countries & Nationalities'
                  ? '🌏 Nationality'
                  : '🌟 Personality'}
              </span>
              {currentBestScore !== null && (
                <span className="text-3xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                  Best: {currentBestScore} / 100
                </span>
              )}
            </div>

            {/* Target Word */}
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              {item.word}
            </h2>

            {/* IPA */}
            {item.ipa && (
              <p className="text-base font-mono font-bold text-indigo-600 mt-1">
                {item.ipa}
              </p>
            )}

            {/* Vietnamese Meaning */}
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              {item.vietnameseMeaning}
            </p>
          </div>

          {/* Friendly Error Notice */}
          {micError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">{micError}</span>
              </div>
            </div>
          )}

          {/* VIEW MODE 1: ANALYZING STATE */}
          {panelMode === 'analyzing' && (
            <div className="bg-gradient-to-b from-indigo-50/50 to-pink-50/30 rounded-2xl p-8 border-2 border-indigo-100 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800">
                  AI is listening...
                </h3>
                <p className="text-sm text-indigo-700 font-bold">
                  AI đang nghe...
                </p>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-2xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Kiểm tra phát âm cho từ “{item.word}”</span>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: LOW CONFIDENCE / AUDIO QUALITY ISSUE (ANTI-HALLUCINATION) */}
          {panelMode === 'low-confidence' && (
            <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <VolumeX className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-amber-950">
                  I couldn&apos;t hear you clearly.
                  <br />
                  Please record again.
                </h4>
                <p className="text-sm text-amber-800 font-semibold pt-1">
                  Mình chưa nghe rõ giọng nói.
                  <br />
                  Em hãy nói to và rõ hơn vào micro nhé!
                </p>
              </div>

              {analysisResult?.tip && (
                <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium max-w-sm mx-auto">
                  💡 <b>Mẹo:</b> {analysisResult.tip}
                </div>
              )}

              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayModelAudio}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🔊 Nghe lại mẫu</span>
                </button>

                <button
                  type="button"
                  onClick={handleRecordAgain}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>🎙 THU ÂM LẠI</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: ERROR STATE */}
          {panelMode === 'error' && (
            <div className="bg-rose-50 rounded-2xl p-6 border-2 border-rose-200 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-rose-950">
                  We couldn&apos;t check your pronunciation this time.
                  <br />
                  Please try again.
                </h4>
                <p className="text-xs text-rose-800 font-medium">
                  Chưa thể kiểm tra phát âm lúc này.
                  <br />
                  Em hãy thử lại nhé.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRY AGAIN</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE 4: STRUCTURED FEEDBACK STATE */}
          {panelMode === 'feedback' && analysisResult && (
            <PronunciationFeedback
              result={analysisResult}
              previousScore={previousScore}
              bestScore={currentBestScore}
              onListenAgain={handlePlayModelAudio}
              onTryAgain={handleTryAgain}
              onNextWord={onNextWord ? handleNextWordClick : undefined}
              isModelAudioPlaying={isPlayingModel}
              onPlayRecording={handlePlayRecording}
              isPlayingRecording={isPlayingRecording}
            />
          )}

          {/* VIEW MODE 5: RECORDING & PRACTICE MODE */}
          {panelMode === 'record' && (
            <>
              {/* SECTION 1: LISTEN FIRST */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-2xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      LISTEN FIRST (Nghe mẫu trước)
                    </span>
                  </div>
                  <span className="text-3xs text-slate-400 font-medium">
                    Official Model Audio
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePlayModelAudio}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-98 cursor-pointer ${
                    isPlayingModel
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-sky-50 text-sky-700 border-2 border-sky-200 hover:border-sky-300'
                  }`}
                >
                  {isPlayingModel ? (
                    <>
                      <Headphones className="w-4 h-4 animate-bounce" />
                      <span>Đang phát giọng đọc mẫu...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-sky-600" />
                      <span>🔊 Listen to the model</span>
                    </>
                  )}
                </button>
              </div>

              {/* SECTION 2: YOUR TURN */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-2xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      YOUR TURN (Đến lượt bạn)
                    </span>
                  </div>
                  {recordedAudioUrl && !isRecording && (
                    <span className="inline-flex items-center gap-1 text-3xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Đã ghi âm
                    </span>
                  )}
                </div>

                <div className="text-center py-1">
                  <span className="text-xs text-slate-500 font-medium">Now say:</span>
                  <p className="text-lg font-black text-rose-600 tracking-tight">
                    “{item.word}”
                  </p>
                </div>

                {/* RECORDING IN PROGRESS */}
                {isRecording ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                        </span>
                        <span className="text-xs font-bold text-rose-700">
                          Đang ghi âm... Hãy phát âm rõ ràng!
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-800 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                        {formatTime(recordingDuration)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 active:scale-98 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>⏹ STOP RECORDING (Dừng ghi âm)</span>
                    </button>
                  </div>
                ) : recordedAudioUrl ? (
                  /* PLAYBACK & REVIEW & AI CHECK */
                  <div className="space-y-3">
                    {/* Custom Playback Bar */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Bản ghi âm của bạn:
                        </span>
                        <span className="text-3xs font-mono text-slate-500">
                          {formatTime(recordingDuration || 2)}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 transition-all duration-100"
                          style={{ width: `${recordingPlaybackProgress}%` }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handlePlayRecording}
                        className="w-full py-2.5 px-3 rounded-lg font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {isPlayingRecording ? (
                          <>
                            <Pause className="w-4 h-4 text-rose-600" />
                            <span>Tạm dừng</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-rose-600 fill-rose-600" />
                            <span>▶ PLAY MY VOICE (Nghe lại bản ghi của bạn)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Compare with model & Record again */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handlePlayModelAudio}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Nghe lại mẫu giáo viên để so sánh"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>🔊 Nghe lại mẫu</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRecordAgain}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>🎙 RECORD AGAIN</span>
                      </button>
                    </div>

                    {/* ✨ CHECK PRONUNCIATION BUTTON */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleCheckPronunciation}
                        className="w-full py-3 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 active:scale-98 text-white flex flex-col items-center justify-center gap-0.5 shadow-lg transition-all cursor-pointer animate-pulse"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>✨ CHECK PRONUNCIATION</span>
                        </div>
                        <span className="text-xs font-bold text-pink-100">
                          AI nhận xét phát âm
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* IDLE STATE: READY TO START RECORDING */
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 active:scale-98 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>🎙 START RECORDING (Bắt đầu ghi âm)</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>AI Formative Pronunciation Coach • Grade 5</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
