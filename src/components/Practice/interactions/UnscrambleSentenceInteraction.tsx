import React, { useState, useEffect } from 'react';
import { RotateCcw, Undo2, Sparkles } from 'lucide-react';

interface WordTile {
  id: string;
  word: string;
}

interface UnscrambleSentenceInteractionProps {
  shuffledWords: string[];
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  attemptsLeft: number;
}

export const UnscrambleSentenceInteraction: React.FC<UnscrambleSentenceInteractionProps> = ({
  shuffledWords,
  onAnswerChange,
  isAnswerChecked,
  isCorrect,
  correctAnswer,
  attemptsLeft,
}) => {
  const [sourceTiles, setSourceTiles] = useState<WordTile[]>([]);
  const [arrangedTiles, setArrangedTiles] = useState<WordTile[]>([]);

  useEffect(() => {
    const tiles: WordTile[] = (shuffledWords || []).map((w, idx) => ({
      id: `word_${idx}_${w}`,
      word: w,
    }));
    setSourceTiles(tiles);
    setArrangedTiles([]);
    onAnswerChange('');
  }, [shuffledWords]);

  const usedTileIds = new Set(arrangedTiles.map((t) => t.id));
  const isInteractionDisabled = isAnswerChecked && (isCorrect || attemptsLeft === 0);

  const handleSelectTile = (tile: WordTile) => {
    if (isInteractionDisabled) return;
    if (usedTileIds.has(tile.id)) return;

    const next = [...arrangedTiles, tile];
    setArrangedTiles(next);
    onAnswerChange(next.map((t) => t.word).join(' '));
  };

  const handleRemoveTile = (tile: WordTile) => {
    if (isInteractionDisabled) return;
    const next = arrangedTiles.filter((t) => t.id !== tile.id);
    setArrangedTiles(next);
    onAnswerChange(next.map((t) => t.word).join(' '));
  };

  const handleUndo = () => {
    if (isInteractionDisabled || arrangedTiles.length === 0) return;
    const next = arrangedTiles.slice(0, -1);
    setArrangedTiles(next);
    onAnswerChange(next.map((t) => t.word).join(' '));
  };

  const handleReset = () => {
    if (isInteractionDisabled || arrangedTiles.length === 0) return;
    setArrangedTiles([]);
    onAnswerChange('');
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Answer Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-amber-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CÂU CỦA EM (ANSWER AREA):</span>
          </span>
          <span className="font-mono text-2xs">
            {arrangedTiles.length} / {sourceTiles.length} từ đã ghép
          </span>
        </div>

        <div
          className={`min-h-[72px] p-4 rounded-2xl border-2 transition-all flex flex-wrap items-center gap-2.5 ${
            isAnswerChecked
              ? isCorrect
                ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                : attemptsLeft === 0
                ? 'border-rose-400 bg-rose-50/40'
                : 'border-amber-400 bg-amber-50/40'
              : arrangedTiles.length > 0
              ? 'border-amber-400 bg-amber-50/20 shadow-2xs'
              : 'border-dashed border-slate-300 bg-slate-50/60'
          }`}
        >
          {arrangedTiles.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium italic w-full text-center py-2 select-none">
              Chạm vào các thẻ từ bên dưới để ghép thành câu hoàn chỉnh...
            </p>
          ) : (
            arrangedTiles.map((tile, idx) => (
              <button
                key={tile.id}
                type="button"
                disabled={isInteractionDisabled}
                onClick={() => handleRemoveTile(tile)}
                className={`group px-4 py-2 rounded-xl font-bold text-sm sm:text-base transition-all shadow-2xs flex items-center gap-2 cursor-pointer active:scale-95 animate-fade-in ${
                  isAnswerChecked
                    ? isCorrect
                      ? 'bg-emerald-600 text-white'
                      : attemptsLeft === 0
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-600 text-white'
                    : 'bg-white text-slate-800 border-2 border-amber-300 hover:border-rose-400 hover:bg-rose-50'
                }`}
                title="Chạm để bỏ từ này về hàng dưới"
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-rose-200 text-slate-600 group-hover:text-rose-700 text-2xs font-mono font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{tile.word}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Controls: Undo & Reset */}
      <div className="flex items-center justify-between">
        <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
          THẺ TỪ (CLICK TILES):
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isInteractionDisabled || arrangedTiles.length === 0}
            onClick={handleUndo}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isInteractionDisabled || arrangedTiles.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer active:scale-95'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>↶ UNDO</span>
          </button>

          <button
            type="button"
            disabled={isInteractionDisabled || arrangedTiles.length === 0}
            onClick={handleReset}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isInteractionDisabled || arrangedTiles.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer active:scale-95'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>↻ RESET</span>
          </button>
        </div>
      </div>

      {/* Shuffled Word Pool */}
      <div className="flex flex-wrap gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 min-h-[80px] items-center justify-center">
        {sourceTiles.map((tile) => {
          const isUsed = usedTileIds.has(tile.id);

          return (
            <button
              key={tile.id}
              type="button"
              disabled={isInteractionDisabled || isUsed}
              onClick={() => handleSelectTile(tile)}
              className={`px-4 py-2.5 rounded-xl font-black text-sm sm:text-base transition-all select-none ${
                isUsed
                  ? 'bg-slate-100 text-slate-300 border border-slate-200 opacity-40 cursor-not-allowed line-through'
                  : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95'
              }`}
            >
              {tile.word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
