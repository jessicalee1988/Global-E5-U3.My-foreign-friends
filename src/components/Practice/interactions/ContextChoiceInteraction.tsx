import React from 'react';
import { MultipleChoiceInteraction } from './MultipleChoiceInteraction';

interface ContextChoiceInteractionProps {
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  attemptsLeft: number;
}

export const ContextChoiceInteraction: React.FC<ContextChoiceInteractionProps> = (props) => {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-900 font-semibold flex items-center gap-2">
        <span>💡 Gợi ý ngữ cảnh:</span>
        <span className="text-teal-800">
          Đọc kỹ câu và chọn từ vựng phù hợp nhất với nghĩa của câu.
        </span>
      </div>
      <MultipleChoiceInteraction {...props} />
    </div>
  );
};
