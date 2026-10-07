import React, { useState, useEffect, useRef } from 'react';

interface MissingLettersInteractionProps {
  missingTemplate?: string;
  correctAnswer: string;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  attemptsLeft: number;
}

export const MissingLettersInteraction: React.FC<MissingLettersInteractionProps> = ({
  missingTemplate,
  correctAnswer,
  onAnswerChange,
  isAnswerChecked,
  isCorrect,
  attemptsLeft,
}) => {
  // Parse template: tokens split by space
  // e.g. "J _ p _ n _ s e" -> ['J', '_', 'p', '_', 'n', '_', 's', 'e']
  const tokens = missingTemplate
    ? missingTemplate.trim().split(/\s+/).filter(Boolean)
    : correctAnswer.split('').map((char, i) => (i % 2 === 1 ? '_' : char));

  // Find original indices of blanks ('_') in tokens array
  const blankIndices = tokens
    .map((token, idx) => (token === '_' ? idx : -1))
    .filter((idx) => idx !== -1);

  // Store individual blank inputs
  const [blankValues, setBlankValues] = useState<string[]>(
    () => new Array(blankIndices.length).fill('')
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Synchronize when question changes
  useEffect(() => {
    setBlankValues(new Array(blankIndices.length).fill(''));
    onAnswerChange('');
    // Auto-focus first empty box
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [missingTemplate, correctAnswer]);

  const handleBlankChange = (index: number, val: string) => {
    const char = val.slice(-1); // Take latest typed character
    const updated = [...blankValues];
    updated[index] = char;
    setBlankValues(updated);

    // Reconstruct full word
    let blankPointer = 0;
    const fullWord = tokens
      .map((tok) => {
        if (tok === '_') {
          const c = updated[blankPointer] || '';
          blankPointer++;
          return c;
        }
        return tok;
      })
      .join('');

    onAnswerChange(fullWord.trim());

    // Auto-advance to next empty box if a character was entered
    if (char && index < blankIndices.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!blankValues[index] && index > 0) {
        // Current box is empty, move to previous box and clear it
        e.preventDefault();
        const updated = [...blankValues];
        updated[index - 1] = '';
        setBlankValues(updated);

        let blankPointer = 0;
        const fullWord = tokens
          .map((tok) => {
            if (tok === '_') {
              const c = updated[blankPointer] || '';
              blankPointer++;
              return c;
            }
            return tok;
          })
          .join('');
        onAnswerChange(fullWord.trim());
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < blankIndices.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const isDisabled = isAnswerChecked && (isCorrect || attemptsLeft === 0);

  return (
    <div className="space-y-4 pt-2">
      {/* Individual letter slots card */}
      <div className="bg-slate-50/90 rounded-2xl p-6 sm:p-8 border-2 border-slate-200 flex flex-col items-center gap-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>Letter Boxes (Điền các chữ cái còn thiếu vào ô trống):</span>
        </div>

        {/* Word Letter Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
          {tokens.map((token, idx) => {
            if (token === '_') {
              const blankIdx = blankIndices.indexOf(idx);
              const val = blankValues[blankIdx] || '';
              const targetChar = correctAnswer[idx] || '';
              const isBlankCorrect = val.toLowerCase() === targetChar.toLowerCase();

              // Evaluated letter by letter
              let boxStyles = 'border-sky-400 bg-white text-sky-900 focus:border-sky-600 focus:ring-2 focus:ring-sky-200';
              if (isAnswerChecked) {
                if (isBlankCorrect) {
                  boxStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-black shadow-xs';
                } else if (attemptsLeft === 0) {
                  boxStyles = 'border-rose-400 bg-rose-50 text-rose-900 font-black';
                } else {
                  boxStyles = 'border-amber-400 bg-amber-50 text-amber-950 font-bold';
                }
              }

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <input
                    ref={(el) => {
                      inputRefs.current[blankIdx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    disabled={isDisabled}
                    value={val}
                    onChange={(e) => handleBlankChange(blankIdx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(blankIdx, e)}
                    placeholder="•"
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl border-2 outline-none transition-all cursor-text focus:scale-105 ${boxStyles}`}
                  />
                  {/* Subtle letter indicator after check */}
                  {isAnswerChecked && (
                    <span className="absolute -bottom-5 text-2xs font-mono font-bold">
                      {isBlankCorrect ? (
                        <span className="text-emerald-600">✓</span>
                      ) : attemptsLeft === 0 ? (
                        <span className="text-rose-500">✗</span>
                      ) : (
                        <span className="text-amber-500">?</span>
                      )}
                    </span>
                  )}
                </div>
              );
            }

            // Fixed non-editable letter card
            return (
              <div
                key={idx}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-slate-100/90 border-2 border-slate-300 text-slate-800 flex items-center justify-center font-black text-xl sm:text-2xl shadow-2xs select-none"
              >
                {token}
              </div>
            );
          })}
        </div>

        {/* Helpful hint guidance */}
        <p className="text-xs text-slate-500 text-center font-medium">
          Gõ 1 chữ cái vào từng ô trống [ ]. Con trỏ sẽ tự động chuyển sang ô tiếp theo.
        </p>
      </div>
    </div>
  );
};

