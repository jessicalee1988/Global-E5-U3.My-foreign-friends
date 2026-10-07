import React, { useState } from 'react';
import { LearnSubsection } from '../../types';
import { VocabularySection } from './VocabularySection';
import { ConversationSection } from './ConversationSection';
import { SentencePatternsSection } from './SentencePatternsSection';
import { BookOpen, MessageSquare, ListFilter, Sparkles } from 'lucide-react';

interface LearnAndReviewAreaProps {
  initialSubsection?: LearnSubsection;
  selectedWordId?: string;
}

export const LearnAndReviewArea: React.FC<LearnAndReviewAreaProps> = ({
  initialSubsection = 'vocabulary',
  selectedWordId,
}) => {
  const [currentSubsection, setCurrentSubsection] = useState<LearnSubsection>(initialSubsection);

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-nav Pills */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                AREA 1
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Learn &amp; Review (Học &amp; Ôn tập)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a study section below to review vocabulary, conversations, or key sentence patterns.
            </p>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setCurrentSubsection('vocabulary')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentSubsection === 'vocabulary'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>A. Vocabulary (8)</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentSubsection('conversation')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentSubsection === 'conversation'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>B. Conversation</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentSubsection('patterns')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentSubsection === 'patterns'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>C. Sentence Patterns</span>
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="pt-6">
          {currentSubsection === 'vocabulary' && (
            <VocabularySection selectedWordId={selectedWordId} />
          )}
          {currentSubsection === 'conversation' && <ConversationSection />}
          {currentSubsection === 'patterns' && <SentencePatternsSection />}
        </div>
      </div>
    </div>
  );
};
