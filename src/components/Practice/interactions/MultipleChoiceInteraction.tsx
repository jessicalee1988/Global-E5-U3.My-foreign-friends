import React from 'react';

interface MultipleChoiceInteractionProps {
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  attemptsLeft: number;
}

export const MultipleChoiceInteraction: React.FC<MultipleChoiceInteractionProps> = ({
  options,
  selectedOption,
  onSelectOption,
  isAnswerChecked,
  isCorrect,
  correctAnswer,
  attemptsLeft,
}) => {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
      {options.map((opt, idx) => {
        const isSelected = selectedOption === opt;
        const isThisCorrect = opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        const letter = letters[idx] || String.fromCharCode(65 + idx);

        let cardStyle =
          'bg-white border-2 border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/50 shadow-2xs';

        if (isAnswerChecked) {
          if (isCorrect) {
            if (isSelected) {
              cardStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs';
            } else {
              cardStyle = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60';
            }
          } else {
            // Incorrect
            if (attemptsLeft === 0) {
              // Final attempt failed: highlight correct answer in green, wrong in red
              if (isThisCorrect) {
                cardStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs';
              } else if (isSelected) {
                cardStyle = 'bg-rose-50 border-2 border-rose-400 text-rose-950 opacity-80';
              } else {
                cardStyle = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60';
              }
            } else {
              // First attempt failed: highlight student's choice with alert
              if (isSelected) {
                cardStyle = 'bg-amber-50 border-2 border-amber-400 text-amber-950';
              }
            }
          }
        } else if (isSelected) {
          cardStyle = 'bg-sky-50 border-2 border-sky-500 text-sky-950 font-bold shadow-xs ring-2 ring-sky-200';
        }

        const isDisabled = isAnswerChecked && (isCorrect || attemptsLeft === 0);

        return (
          <button
            key={idx}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectOption(opt)}
            className={`p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all cursor-pointer active:scale-[0.99] ${cardStyle}`}
          >
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                isSelected
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {letter}
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight">
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
};
