import React, { useState, useEffect } from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';
import { TileItem } from '../../../data/practiceData';

interface UnscrambleWordInteractionProps {
  tiles?: TileItem[];
  shuffledLetters?: string[];
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  attemptsLeft: number;
}

export const UnscrambleWordInteraction: React.FC<UnscrambleWordInteractionProps> = ({
  tiles: propTiles,
  shuffledLetters,
  onAnswerChange,
  isAnswerChecked,
  isCorrect,
  correctAnswer,
  attemptsLeft,
}) => {
  // Fixed original sequence of source tiles
  const [sourceTiles, setSourceTiles] = useState<TileItem[]>([]);
  // Sequence of selected tiles in answer area
  const [arrangedTiles, setArrangedTiles] = useState<TileItem[]>([]);

  // Synchronize when question tiles change
  useEffect(() => {
    let initialTiles: TileItem[] = [];
    if (propTiles && propTiles.length > 0) {
      initialTiles = propTiles;
    } else if (shuffledLetters && shuffledLetters.length > 0) {
      initialTiles = shuffledLetters.map((char, idx) => ({
        id: `tile_${char}_${idx}`,
        letter: char.toUpperCase(),
      }));
    } else {
      initialTiles = correctAnswer.split('').map((char, idx) => ({
        id: `tile_${char}_${idx}`,
        letter: char.toUpperCase(),
      }));
    }

    setSourceTiles(initialTiles);
    setArrangedTiles([]);
    onAnswerChange('');
  }, [propTiles, shuffledLetters, correctAnswer]);

  const usedTileIdSet = new Set(arrangedTiles.map((t) => t.id));
  const isInteractionDisabled = isAnswerChecked && (isCorrect || attemptsLeft === 0);

  // 1. Pick a tile from source pool
  const handleSelectTile = (tile: TileItem) => {
    if (isInteractionDisabled) return;
    if (usedTileIdSet.has(tile.id)) return;

    const nextArranged = [...arrangedTiles, tile];
    setArrangedTiles(nextArranged);
    const word = nextArranged.map((t) => t.letter).join('');
    onAnswerChange(word);
  };

  // 2. Remove specific tile from answer area
  const handleRemoveFromAnswer = (tile: TileItem) => {
    if (isInteractionDisabled) return;

    const nextArranged = arrangedTiles.filter((t) => t.id !== tile.id);
    setArrangedTiles(nextArranged);
    const word = nextArranged.map((t) => t.letter).join('');
    onAnswerChange(word);
  };

  // 3. UNDO: Remove only the most recently selected letter
  const handleUndo = () => {
    if (isInteractionDisabled || arrangedTiles.length === 0) return;

    const nextArranged = arrangedTiles.slice(0, -1);
    setArrangedTiles(nextArranged);
    const word = nextArranged.map((t) => t.letter).join('');
    onAnswerChange(word);
  };

  // 4. RESET: Return all letters to original shuffled positions and clear answer
  const handleReset = () => {
    if (isInteractionDisabled || arrangedTiles.length === 0) return;

    setArrangedTiles([]);
    onAnswerChange('');
  };

  const totalLength = sourceTiles.length;
  const isFullAnswerPlaced = arrangedTiles.length === totalLength;

  return (
    <div className="space-y-6 pt-2">
      {/* ================================================== */}
      {/* ANSWER AREA                                       */}
      {/* ================================================== */}
      <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border-2 border-indigo-200 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-md">
              ANSWER AREA
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({arrangedTiles.length}/{totalLength} chữ cái)
            </span>
          </div>

          {/* Controls: UNDO & RESET */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isInteractionDisabled || arrangedTiles.length === 0}
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Gỡ chữ cái vừa chọn gần nhất"
            >
              <Undo2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>↶ UNDO</span>
            </button>

            <button
              type="button"
              disabled={isInteractionDisabled || arrangedTiles.length === 0}
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Đặt lại toàn bộ từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>↻ RESET</span>
            </button>
          </div>
        </div>

        {/* Selected Letter Tiles Tray */}
        <div className="min-h-20 sm:min-h-24 bg-white rounded-2xl p-4 border-2 border-dashed border-indigo-300 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {arrangedTiles.length === 0 ? (
            <div className="text-center py-2">
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Chạm lần lượt các thẻ chữ cái bên dưới để xếp từ vào đây
              </p>
              <p className="text-2xs text-slate-400 mt-0.5">
                (Có thể bấm vào thẻ đã xếp để gỡ bỏ hoặc dùng nút ↶ UNDO)
              </p>
            </div>
          ) : (
            arrangedTiles.map((tile, idx) => {
              let tileStyle =
                'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-xs cursor-pointer';

              if (isAnswerChecked) {
                if (isCorrect) {
                  tileStyle =
                    'bg-emerald-600 text-white border-emerald-700 shadow-xs cursor-default';
                } else if (attemptsLeft === 0) {
                  tileStyle =
                    'bg-rose-600 text-white border-rose-700 shadow-xs cursor-default';
                } else {
                  tileStyle =
                    'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs cursor-pointer';
                }
              }

              return (
                <button
                  key={`${tile.id}-${idx}`}
                  type="button"
                  disabled={isInteractionDisabled}
                  onClick={() => handleRemoveFromAnswer(tile)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 font-black text-xl sm:text-2xl flex items-center justify-center transition-all active:scale-95 select-none ${tileStyle}`}
                  title={!isInteractionDisabled ? 'Chạm để gỡ chữ này' : undefined}
                >
                  {tile.letter}
                </button>
              );
            })
          )}

          {/* Visual slot placeholders for remaining unplaced letters */}
          {!isFullAnswerPlaced &&
            Array.from({ length: totalLength - arrangedTiles.length }).map((_, i) => (
              <div
                key={`empty-slot-${i}`}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 flex items-center justify-center select-none"
              >
                <span className="text-slate-300 font-mono text-sm">•</span>
              </div>
            ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* SOURCE LETTER TILES                                */}
      {/* ================================================== */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            LETTER TILES (Thẻ chữ cái cho sẵn):
          </span>
        </div>

        {/* Shuffled Letter Tiles Grid - wrapped naturally for mobile/tablet */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 max-w-2xl mx-auto">
          {sourceTiles.map((tile) => {
            const isUsed = usedTileIdSet.has(tile.id);

            if (isUsed) {
              // Source tile marked as USED: cannot be clicked again
              return (
                <div
                  key={tile.id}
                  className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/70 text-slate-300 font-black text-xl sm:text-2xl flex items-center justify-center select-none cursor-not-allowed opacity-40 transition-all"
                >
                  {tile.letter}
                </div>
              );
            }

            // Available clickable source tile
            return (
              <button
                key={tile.id}
                type="button"
                disabled={isInteractionDisabled}
                onClick={() => handleSelectTile(tile)}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-white hover:bg-indigo-50 border-2 border-indigo-200 hover:border-indigo-500 text-indigo-950 font-black text-xl sm:text-2xl shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center select-none"
                title="Chạm để xếp chữ này vào câu trả lời"
              >
                {tile.letter}
              </button>
            );
          })}
        </div>

        {/* Helper prompt */}
        <p className="text-xs text-slate-500">
          Chạm từng thẻ để chuyển vào ô trả lời. Khi dùng hết các thẻ, nút <strong>CHECK</strong> sẽ sẵn sàng.
        </p>
      </div>
    </div>
  );
};

