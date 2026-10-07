export type NavigationTab = 'learn' | 'practice' | 'results';

export type LearnSubsection = 'vocabulary' | 'conversation' | 'patterns';

export type VocabCategory = 'Countries & Nationalities' | 'Personality';

export interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  vietnameseMeaning: string;
  category: VocabCategory;
  exampleSentence: string;
  exampleVietnamese: string;
  imagePlaceholderId: string;
  audioPlaceholderId: string;
  countryOrBase?: string;
  teacherAssetPath: {
    image: string;
    audio: string;
  };
}

export interface ConversationLine {
  speaker: string;
  speakerRole: 'Pupil A' | 'Pupil B' | 'Lily';
  avatarColor: string;
  english: string;
  vietnamese: string;
}

export interface ConversationLessonData {
  lessonId: 1 | 2;
  lessonTitle: string;
  unitTitle: string;
  page: number;
  imageFilename: string;
  audioFilename: string;
  staticImagePath: string;
  staticAudioPath: string;
  instructionEn: string;
  instructionVi: string;
  dialogueA: {
    speaker: string;
    text: string;
  }[];
  dialogueB: {
    speaker: string;
    text: string;
  }[];
  keyLanguage: {
    question: string;
    answer: string;
  }[];
  learningNote?: {
    term1: string;
    meaning1: string;
    term2: string;
    meaning2: string;
  };
}

export interface ConversationData {
  title: string;
  vietnameseTitle: string;
  imagePlaceholderId: string;
  audioPlaceholderId: string;
  teacherAssetPath: {
    image: string;
    audio: string;
  };
  partA: {
    title: string;
    lines: ConversationLine[];
  };
  partB: {
    title: string;
    lines: ConversationLine[];
  };
}

export interface SentencePatternExample {
  question: string;
  answer: string;
  questionVi: string;
  answerVi: string;
}

export interface SentencePatternData {
  id: string;
  title: string;
  patternFormula: {
    question: string;
    answer: string;
  };
  purposeEn: string;
  purposeVi: string;
  examples: SentencePatternExample[];
  grammarNotes: {
    title: string;
    content: string;
    highlight?: string;
  }[];
  rememberPoints?: string[];
  importantGrammarNote?: {
    warning: string;
    explanation: string;
  };
  modelAssetPlaceholder: {
    id: string;
    filename: string;
    description: string;
  };
}

export interface PracticeModuleSpec {
  id: string;
  title: string;
  titleVi: string;
  totalQuestions: number;
  description: string;
  iconName: string;
  colorTheme: 'blue' | 'emerald' | 'amber';
  categories?: {
    name: string;
    nameVi: string;
    count: number;
  }[];
  targetSkills: string[];
}

export interface StudentResultSummary {
  studentName: string;
  grade: string;
  totalScore: number;
  maxScore: number;
  rating: string;
  ratingVi: string;
  vocabPerformance: {
    score: number;
    total: number;
    percentage: number;
    masteredCount: number;
  };
  sentencePatternPerformance: {
    score: number;
    total: number;
    percentage: number;
    masteredCount: number;
  };
  wordsNeedingPractice: {
    word: string;
    meaning: string;
    missedCount: number;
    category: VocabCategory;
  }[];
  mistakesHistory: {
    id: string;
    category: string;
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    explanationVi: string;
  }[];
}
