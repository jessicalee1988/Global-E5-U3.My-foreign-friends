import React, { useState, useEffect, useRef } from 'react';
import { CONVERSATION_LESSONS } from '../../data/unit3Data';
import { ConversationLessonData } from '../../types';
import { assetManager } from '../../services/assetManager';
import {
  Volume2,
  Pause,
  RotateCcw,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const ConversationSection: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<1 | 2>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    return assetManager.subscribe(() => {
      setRefreshTick((t) => t + 1);
    });
  }, []);

  const currentLesson: ConversationLessonData =
    CONVERSATION_LESSONS.find((l) => l.lessonId === activeLessonId) ||
    CONVERSATION_LESSONS[0];

  const imageUrl = assetManager.getAssetUrl(currentLesson.imageFilename);
  const audioUrl = assetManager.getAssetUrl(currentLesson.audioFilename);

  // When switching lessons: stop current audio, reset to 0:00, load newly selected lesson audio
  const handleSwitchLesson = (lessonId: 1 | 2) => {
    if (activeLessonId === lessonId) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setImageError(false);
    setActiveLessonId(lessonId);
  };

  // Audio play/pause/replay logic
  const handleListen = async () => {
    assetManager.stopAudio();

    if (!audioRef.current || !audioUrl) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Conversation audio play failed:', err);
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = async () => {
    assetManager.stopAudio();

    if (!audioRef.current || !audioUrl) return;

    try {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Conversation audio replay failed:', err);
    }
  };

  // Synchronize audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden audio element for lesson conversation */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}

      {/* SECTION HEADER & LESSON SELECTOR */}
      <div className="bg-sky-50/80 p-4 sm:p-5 rounded-2xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              SECTION B
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              Textbook Conversations (2 Lessons)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Listen and practice the official textbook dialogue from Global Success English 5.
          </p>
        </div>

        {/* 2 Lesson Selection Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-sky-200 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSwitchLesson(1)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeLessonId === 1
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>LESSON 1</span>
            <span className="text-3xs font-normal opacity-80">(Page 22)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchLesson(2)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeLessonId === 2
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>LESSON 2</span>
            <span className="text-3xs font-normal opacity-80">(Page 24)</span>
          </button>
        </div>
      </div>

      {/* MAIN CONVERSATION LAYOUT */}
      <div className="space-y-6">
        {/* Conversation Image Container */}
        <div className="bg-white rounded-3xl border-2 border-sky-100 p-4 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                {currentLesson.lessonTitle} • Activity 1
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline-block">
                {currentLesson.unitTitle} • Page {currentLesson.page}
              </span>
            </div>
          </div>

          {/* Image Display Frame (16:9 Aspect Ratio Preserved) */}
          <div className="relative w-full aspect-16/9 rounded-2xl bg-gradient-to-b from-sky-50 to-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={`${currentLesson.lessonTitle} conversation`}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Fallback view when image is loading or unavailable */
              <div className="p-6 text-center space-y-2 max-w-md">
                <BookOpen className="w-10 h-10 text-sky-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  {currentLesson.lessonTitle}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentLesson.unitTitle} • Page {currentLesson.page}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AUDIO PANEL (Listen, Pause, Replay) */}
        <div className="bg-white rounded-3xl border-2 border-sky-100 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Audio Panel • {currentLesson.lessonTitle}</span>
                </span>
              </div>

              {/* Instruction as required */}
              <div className="mt-1 text-xs text-slate-600">
                <span className="font-bold text-sky-800">{currentLesson.instructionEn}</span>{' '}
                <span className="text-slate-500 italic">({currentLesson.instructionVi})</span>
              </div>
            </div>
          </div>

          {/* Audio Progress Slider */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-200"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-2xs font-mono text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Interactive Audio Controls: 🔊 Listen | ⏸ Pause | ↻ Replay */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleListen}
              disabled={isPlaying}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer ${
                isPlaying
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Listen (Nghe)</span>
            </button>

            <button
              type="button"
              onClick={handlePause}
              disabled={!isPlaying}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer ${
                !isPlaying
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Pause className="w-4 h-4" />
              <span>⏸ Pause (Tạm dừng)</span>
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>↻ Replay (Nghe lại từ đầu)</span>
            </button>
          </div>
        </div>

        {/* DIALOGUE LANGUAGE CONTENT & KEY LANGUAGE AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Complete Dialogue Text Area */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-sky-100 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Textbook Dialogue ({currentLesson.lessonTitle})</span>
              </h4>
              <span className="text-2xs text-slate-400 font-medium">Original Script</span>
            </div>

            {/* Part A Dialogue */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wide block">
                Part A:
              </span>
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 space-y-2">
                {currentLesson.dialogueA.map((line, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-bold text-slate-700 mr-2">{line.speaker}:</span>
                    <span className="font-semibold text-slate-800">“{line.text}”</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Part B Dialogue */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wide block">
                Part B:
              </span>
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
                {currentLesson.dialogueB.map((line, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-bold text-slate-700 mr-2">{line.speaker}:</span>
                    <span className="font-semibold text-slate-800">“{line.text}”</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KEY LANGUAGE AREA & Short Learning Note */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border-2 border-sky-100 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>KEY LANGUAGE</span>
                </h4>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Mẫu câu cần nhớ
                </span>
              </div>

              {/* Key language questions and answers */}
              <div className="space-y-3">
                {currentLesson.keyLanguage.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1"
                  >
                    <p className="text-sm font-bold text-slate-800">{item.question}</p>
                    <p className="text-base font-black text-amber-900">{item.answer}</p>
                  </div>
                ))}
              </div>

              {/* Short Learning Note if present */}
              {currentLesson.learningNote && (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
                  <span className="text-2xs font-bold uppercase tracking-wider text-sky-800 block">
                    Learning Note (Ghi chú kiến thức):
                  </span>
                  <div className="text-xs text-sky-950 space-y-1 font-medium">
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-sky-200">
                      <span className="font-bold">{currentLesson.learningNote.term1}</span>
                      <span className="text-slate-500 text-2xs">=</span>
                      <span className="text-sky-700 font-bold">
                        {currentLesson.learningNote.meaning1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-sky-200">
                      <span className="font-bold">{currentLesson.learningNote.term2}</span>
                      <span className="text-slate-500 text-2xs">=</span>
                      <span className="text-sky-700 font-bold">
                        {currentLesson.learningNote.meaning2}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pedagogical Step Guide: LOOK → LISTEN → REPEAT */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-700 block uppercase text-2xs tracking-wider">
                Phương pháp học hội thoại:
              </span>
              <div className="flex items-center justify-between text-2xs font-bold text-slate-700">
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  1. LOOK (Nhìn)
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  2. LISTEN (Nghe)
                </span>
                <span>→</span>
                <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">
                  3. REPEAT (Nhắc lại)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
