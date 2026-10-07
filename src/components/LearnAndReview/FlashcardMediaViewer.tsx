import React, { useState, useEffect } from 'react';
import { ExtendedVocabItem } from '../../data/unit3Data';
import { assetManager } from '../../services/assetManager';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  Music,
  Mic,
} from 'lucide-react';

interface FlashcardMediaViewerProps {
  item: ExtendedVocabItem;
  onOpenSpeak?: () => void;
}

export const FlashcardMediaViewer: React.FC<FlashcardMediaViewerProps> = ({
  item,
  onOpenSpeak,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  useEffect(() => {
    const refresh = () => {
      const url = assetManager.getAssetUrl(item.imagePlaceholderId);
      setImageUrl(url);
      setImageLoadError(false);
    };

    refresh();
    return assetManager.subscribe(refresh);
  }, [item]);

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);

    const played = await assetManager.playAudio(
      item.audioPlaceholderId,
      () => {
        setIsPlayingAudio(false);
      }
    );

    if (!played) {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Flashcard Graphic Display */}
      <div className="relative aspect-16/9 sm:aspect-16/10 rounded-2xl overflow-hidden border-2 border-sky-200 bg-gradient-to-b from-sky-50/70 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 shadow-sm">
        {imageUrl && !imageLoadError ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt={item.word}
              onError={() => setImageLoadError(true)}
              className="max-h-full max-w-full object-contain rounded-xl shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          /* Clean Informative Flashcard View */
          <div className="w-full h-full flex flex-col justify-between text-center p-3 sm:p-5 bg-white/95 rounded-xl border border-sky-100 shadow-2xs">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold shadow-2xs">
                <span>{item.visualDetails.bannerTitle}</span>
              </span>
              <span className="text-2xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                {item.category === 'Countries & Nationalities' ? '🌏 Quốc tịch' : '🌟 Tính cách'}
              </span>
            </div>

            {/* Core Word Information */}
            <div className="my-auto py-2 space-y-2">
              <div className="inline-block px-6 py-2 rounded-2xl bg-sky-50 border-2 border-sky-200 shadow-xs">
                <h3 className="text-3xl sm:text-4xl font-black text-sky-700 tracking-tight">
                  {item.word}
                </h3>
                <p className="text-sm sm:text-base font-mono font-semibold text-slate-700 mt-0.5">
                  {item.ipa}
                </p>
                <p className="text-base sm:text-lg font-bold text-pink-600 mt-1">
                  {item.vietnameseMeaning}
                </p>
              </div>

              {/* Visual Scene Context */}
              <div className="max-w-md mx-auto p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-700 font-bold text-2xs uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Hình ảnh mô tả:</span>
                </div>
                <p className="text-slate-800 font-medium leading-snug">
                  • {item.visualDetails.characterDescription}
                </p>
                <p className="text-slate-500 text-2xs leading-snug">
                  • Bối cảnh: {item.visualDetails.backgroundElements}
                </p>
              </div>
            </div>

            {/* Motto */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <span className="text-2xs text-slate-400 font-medium">
                {item.visualDetails.motto || 'Global Success English 5'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Audio Playback & Pronunciation Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-sky-50 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isPlayingAudio
                ? 'bg-emerald-500 text-white shadow-md animate-pulse'
                : 'bg-sky-600 text-white shadow-xs'
            }`}
          >
            {isPlayingAudio ? (
              <Music className="w-5 h-5 animate-bounce" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Official Audio: {item.word}
              </span>
            </div>
            <p className="text-2xs text-slate-500 mt-0.5">
              {isPlayingAudio ? 'Đang phát âm thanh...' : 'Nghe mẫu phát âm chuẩn của giáo viên'}
            </p>
          </div>
        </div>

        {/* Audio Controls (Listen & Speak) */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handlePlayAudio}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
              isPlayingAudio
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
            title="Nghe phát âm chuẩn"
          >
            {isPlayingAudio ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Replay</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>🔊 Listen</span>
              </>
            )}
          </button>

          {onOpenSpeak && (
            <button
              type="button"
              onClick={onOpenSpeak}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white shadow-xs transition-all cursor-pointer"
              title="Luyện phát âm từ này (Ghi âm giọng nói)"
            >
              <Mic className="w-4 h-4" />
              <span>🎙 Speak</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
