import React from 'react';

interface SentenceCompletionInteractionProps {
  prompt: string;
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  attemptsLeft: number;
}

export const SentenceCompletionInteraction: React.FC<SentenceCompletionInteractionProps> = ({
  prompt,
  options,
  selectedOption,
  onSelectOption,
  isAnswerChecked,
  isCorrect,
  correctAnswer,
  attemptsLeft,
}) => {
  // Parse prompt with blank '_____'
  // e.g. "What nationality _____ she?" or "She’s _____."
  const parts = prompt.split(/_{2,}/);
  const prefix = parts[0] || '';
  const suffix = parts.length > 1 ? parts.slice(1).join('') : '';

  const letters = ['A', 'B', 'C', 'D'];
  const isDisabled = isAnswerChecked && (isCorrect || attemptsLeft === 0);

  // In first attempt incorrect: remove incorrect word from the blank and allow another selection
  // In second attempt incorrect: insert the correct word into the sentence and show complete correct sentence
  let displayedWordInBlank = selectedOption;
  if (isAnswerChecked) {
    if (!isCorrect) {
      if (attemptsLeft === 1) {
        // First attempt incorrect: remove word from blank
        displayedWordInBlank = null;
      } else if (attemptsLeft === 0) {
        // Second attempt incorrect: insert correct word
        displayedWordInBlank = correctAnswer;
      }
    }
  }

  // Blank styling in sentence display
  let blankStyle = 'border-indigo-400 bg-white text-indigo-900 border-dashed';
  if (isAnswerChecked) {
    if (isCorrect) {
      blankStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-black border-solid shadow-xs';
    } else if (attemptsLeft === 0) {
      blankStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black border-solid shadow-xs';
    } else {
      blankStyle = 'border-amber-400 bg-amber-50 text-amber-950 font-bold border-dashed';
    }
  } else if (displayedWordInBlank) {
    blankStyle = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-black border-solid shadow-xs';
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Live Sentence Preview with Interactive Blank Box */}
      <div className="bg-slate-50/90 rounded-2xl p-6 sm:p-8 border-2 border-slate-200 text-center shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Câu hoàn chỉnh (Xem trước):
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xl sm:text-2xl font-black text-slate-800 leading-relaxed">
          {prefix && <span>{prefix}</span>}

          <div
            className={`min-w-28 sm:min-w-36 h-12 sm:h-14 px-4 rounded-xl border-2 flex items-center justify-center transition-all select-none ${blankStyle}`}
          >
            {displayedWordInBlank ? (
              <span className="tracking-wide animate-scale-in">{displayedWordInBlank}</span>
            ) : (
              <span className="text-slate-300 font-mono text-sm sm:text-base font-normal">
                _____
              </span>
            )}
          </div>

          {suffix && <span>{suffix}</span>}
        </div>
      </div>

      {/* Selectable Word/Phrase Cards */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block text-center">
          Chạm thẻ từ dưới đây để điền vào chỗ trống:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const letter = letters[idx] || String.fromCharCode(65 + idx);

            let cardStyle =
              'bg-white border-2 border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 shadow-2xs';

            if (isAnswerChecked) {
              if (isCorrect) {
                if (isSelected) {
                  cardStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                } else {
                  cardStyle = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60';
                }
              } else {
                if (attemptsLeft === 0) {
                  if (opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
                    cardStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-50 border-2 border-rose-400 text-rose-950 opacity-80';
                  } else {
                    cardStyle = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-amber-50 border-2 border-amber-400 text-amber-950 font-bold';
                }
              }
            } else if (isSelected) {
              cardStyle = 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-200';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectOption(opt)}
                className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${cardStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-base sm:text-lg font-black tracking-tight text-center">
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
