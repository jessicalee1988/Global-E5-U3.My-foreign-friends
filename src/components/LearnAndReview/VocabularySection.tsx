import React, { useState, useEffect } from 'react';
import { TARGET_VOCABULARY, ExtendedVocabItem } from '../../data/unit3Data';
import { VocabCategory } from '../../types';
import { assetManager } from '../../services/assetManager';
import { FlashcardMediaViewer } from './FlashcardMediaViewer';
import { PronunciationPracticePanel } from './PronunciationPracticePanel';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Image as ImageIcon,
  CheckCircle,
  LayoutGrid,
  Layers,
  Mic,
} from 'lucide-react';

interface VocabularySectionProps {
  onSelectWordForReview?: (wordId: string) => void;
  selectedWordId?: string;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  selectedWordId,
}) => {
  const [activeCategory, setActiveCategory] = useState<VocabCategory | 'All'>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [activeAudioPlayingId, setActiveAudioPlayingId] = useState<string | null>(null);
  const [selectedWordForPronunciation, setSelectedWordForPronunciation] =
    useState<ExtendedVocabItem | null>(null);

  // Subscribe to asset manager changes
  const [, setAssetUpdateCounter] = useState<number>(0);
  useEffect(() => {
    return assetManager.subscribe(() => {
      setAssetUpdateCounter((c) => c + 1);
    });
  }, []);

  // Filtered vocabulary list
  const filteredWords: ExtendedVocabItem[] = TARGET_VOCABULARY.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  // If selectedWordId changes, navigate to that item
  useEffect(() => {
    if (selectedWordId) {
      const idx = filteredWords.findIndex((item) => item.id === selectedWordId);
      if (idx !== -1) {
        setCurrentIndex(idx);
        setViewMode('flashcard');
      } else {
        setActiveCategory('All');
        const allIdx = TARGET_VOCABULARY.findIndex((item) => item.id === selectedWordId);
        if (allIdx !== -1) {
          setCurrentIndex(allIdx);
          setViewMode('flashcard');
        }
      }
    }
  }, [selectedWordId]);

  // Ensure currentIndex stays within bounds when filtering
  useEffect(() => {
    if (currentIndex >= filteredWords.length) {
      setCurrentIndex(0);
    }
  }, [activeCategory, filteredWords.length, currentIndex]);

  const currentWord: ExtendedVocabItem = filteredWords[currentIndex] || filteredWords[0];

  const handlePrevious = () => {
    assetManager.stopAudio();
    setActiveAudioPlayingId(null);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredWords.length - 1));
  };

  const handleNext = () => {
    assetManager.stopAudio();
    setActiveAudioPlayingId(null);
    setCurrentIndex((prev) => (prev < filteredWords.length - 1 ? prev + 1 : 0));
  };

  const handleListenClick = async (word: ExtendedVocabItem) => {
    if (activeAudioPlayingId === word.id) {
      assetManager.stopAudio();
      setActiveAudioPlayingId(null);
      return;
    }

    setActiveAudioPlayingId(word.id);
    const played = await assetManager.playAudio(
      word.audioPlaceholderId,
      () => {
        setActiveAudioPlayingId(null);
      }
    );

    if (!played) {
      setActiveAudioPlayingId(null);
    }
  };

  const handleTogglePlayAll = async () => {
    if (isPlayingAll) {
      assetManager.stopAudio();
      setIsPlayingAll(false);
      setActiveAudioPlayingId(null);
      return;
    }

    setIsPlayingAll(true);
    let playIdx = 0;

    const playSequence = async () => {
      if (playIdx >= filteredWords.length) {
        setIsPlayingAll(false);
        setActiveAudioPlayingId(null);
        return;
      }

      setCurrentIndex(playIdx);
      const word = filteredWords[playIdx];
      setActiveAudioPlayingId(word.id);

      await assetManager.playAudio(
        word.audioPlaceholderId,
        () => {
          playIdx++;
          setTimeout(playSequence, 500);
        }
      );
    };

    playSequence();
  };

  return (
    <div className="space-y-6">
      {/* Section Sub-header & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-sky-50/80 p-4 rounded-2xl border border-sky-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              SECTION A
            </span>
            <h3 className="text-lg font-bold text-slate-800">Target Vocabulary (8 words)</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Learn and review the official 8 target vocabulary words for Unit 3.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-sky-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('flashcard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'flashcard'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcard</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid (8)</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
          Group by:
        </span>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('All');
            setCurrentIndex(0);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'All'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All (8)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('Countries & Nationalities');
            setCurrentIndex(0);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'Countries & Nationalities'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
          }`}
        >
          🌏 Countries &amp; Nationalities (4)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('Personality');
            setCurrentIndex(0);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'Personality'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          🌟 Personality (4)
        </button>
      </div>

      {/* FLASHCARD MODE */}
      {viewMode === 'flashcard' && currentWord && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-white rounded-3xl border-2 border-sky-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
            {/* Flashcard Header Bar */}
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 px-5 py-3 border-b border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-sky-700 border border-sky-200 shadow-2xs">
                  {currentWord.category === 'Countries & Nationalities'
                    ? '🌏 Nationalities'
                    : '🌟 Personality'}
                </span>
                {currentWord.countryOrBase && (
                  <span className="text-xs font-medium text-slate-500 hidden sm:inline-block">
                    {currentWord.countryOrBase}
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Card {currentIndex + 1} of {filteredWords.length}
              </div>
            </div>

            {/* Flashcard Body with Media Viewer */}
            <div className="p-6 sm:p-8 space-y-6">
              <FlashcardMediaViewer
                item={currentWord}
                onOpenSpeak={() => setSelectedWordForPronunciation(currentWord)}
              />

              {/* Example sentence */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                <span className="text-2xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                  Pattern in Context (Mẫu câu ví dụ chuẩn SGK):
                </span>
                <p className="text-base font-bold text-slate-800">
                  “{currentWord.exampleSentence}”
                </p>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  “{currentWord.exampleVietnamese}”
                </p>
              </div>
            </div>

            {/* Flashcard Bottom Controls Bar */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleTogglePlayAll}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer ${
                  isPlayingAll
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAll ? 'Stop Play All' : 'Play all (8 words)'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID OVERVIEW MODE (All 8 items together) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredWords.map((item, idx) => {
            const hasImage = assetManager.hasAsset(item.imagePlaceholderId);
            const imageUrl = assetManager.getAssetUrl(item.imagePlaceholderId);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Image Frame */}
                  <div className="aspect-4/3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-2 mb-3 overflow-hidden">
                    {hasImage && imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.word}
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="w-6 h-6 text-sky-500 mx-auto mb-1" />
                        <span className="text-xs font-black text-slate-700 block">
                          {item.word}
                        </span>
                        <span className="text-3xs text-slate-400">
                          {item.ipa}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-3xs font-bold px-2 py-0.5 rounded-full ${
                        item.category === 'Countries & Nationalities'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.category === 'Countries & Nationalities' ? 'Nationality' : 'Personality'}
                    </span>
                    <span className="text-3xs font-mono text-slate-400">#{idx + 1}</span>
                  </div>

                  <h4 className="text-xl font-bold text-slate-800">{item.word}</h4>
                  <p className="text-xs font-mono text-indigo-600 mb-1">{item.ipa}</p>
                  <p className="text-xs font-medium text-emerald-700 line-clamp-1">
                    {item.vietnameseMeaning}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleListenClick(item)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      activeAudioPlayingId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-sky-50 hover:bg-sky-100 text-sky-700'
                    }`}
                    title="Nghe mẫu phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{activeAudioPlayingId === item.id ? 'Playing' : 'Listen'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWordForPronunciation(item)}
                    className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Luyện phát âm từ này (Ghi âm giọng nói)"
                  >
                    <Mic className="w-3.5 h-3.5 text-rose-600" />
                    <span>Speak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const originalIdx = filteredWords.findIndex((w) => w.id === item.id);
                      setCurrentIndex(originalIdx);
                      setViewMode('flashcard');
                    }}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Unit 3 Target Vocabulary Checklist */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Official 8 Target Words for Unit 3 (Strict Curriculum)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {TARGET_VOCABULARY.map((v) => (
            <div key={v.id} className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-3xs font-bold uppercase">
                {v.category === 'Countries & Nationalities' ? 'NATIONALITY' : 'PERSONALITY'}
              </span>
              <span className="font-black text-slate-800 text-sm">{v.word}</span>
              <span className="text-slate-500 block text-3xs">{v.vietnameseMeaning}</span>
              <span className="text-indigo-600 font-mono text-3xs">{v.ipa}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pronunciation Recording Practice Modal / Panel */}
      <PronunciationPracticePanel
        item={selectedWordForPronunciation}
        isOpen={Boolean(selectedWordForPronunciation)}
        onClose={() => setSelectedWordForPronunciation(null)}
        onNextWord={() => {
          const nextIdx = currentIndex < filteredWords.length - 1 ? currentIndex + 1 : 0;
          setCurrentIndex(nextIdx);
          const nextItem = filteredWords[nextIdx];
          if (nextItem) {
            setSelectedWordForPronunciation(nextItem);
          }
        }}
      />
    </div>
  );
};
