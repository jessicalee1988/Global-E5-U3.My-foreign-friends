export type PatternActivityId =
  | 'choose-correct-sentence'
  | 'complete-sentence'
  | 'choose-correct-response'
  | 'find-mistake';

export type GrammarFocusKey =
  | 'nationality_question'
  | 'nationality_answer'
  | 'personality_question'
  | 'personality_answer'
  | 'country_vs_nationality'
  | 'from_country'
  | 'he_she'
  | 'whats_like'
  | 'nationality_response'
  | 'personality_response'
  | 'nationality_vs_personality';

export interface SentencePatternQuestion {
  id: string;
  activityType: PatternActivityId;
  pattern: 'pattern1_nationality' | 'pattern2_personality' | 'general_pattern';
  instruction: string;
  instructionVi: string;
  prompt: string;
  sentenceContext?: string;
  context?: string;
  promptBeforeBlank?: string;
  promptAfterBlank?: string;
  incorrectSentence?: string; // Specifically for Activity D: Find the Mistake
  options: string[];
  correctAnswer: string;
  grammarFocus: GrammarFocusKey;
  grammarFocusText: string;
  feedback: string;
  isTestData?: boolean;
}

export interface PatternActivityMeta {
  id: PatternActivityId;
  code: string;
  title: string;
  titleVi: string;
  plannedQuestions: number;
  description: string;
  colorTheme: 'blue' | 'indigo' | 'purple' | 'amber';
}

export const PATTERN_ACTIVITIES: PatternActivityMeta[] = [
  {
    id: 'choose-correct-sentence',
    code: 'A',
    title: 'CHOOSE THE CORRECT SENTENCE',
    titleVi: 'Chọn câu đúng',
    plannedQuestions: 15,
    description: 'Đọc tình huống/yêu cầu và chọn câu ngữ pháp chuẩn xác nhất.',
    colorTheme: 'blue',
  },
  {
    id: 'complete-sentence',
    code: 'B',
    title: 'COMPLETE THE SENTENCE',
    titleVi: 'Hoàn thành câu',
    plannedQuestions: 15,
    description: 'Chạm chọn thẻ từ/cụm từ đúng để điền vào chỗ trống trong câu.',
    colorTheme: 'indigo',
  },
  {
    id: 'choose-correct-response',
    code: 'C',
    title: 'CHOOSE THE CORRECT RESPONSE',
    titleVi: 'Chọn câu trả lời phù hợp',
    plannedQuestions: 10,
    description: 'Đọc câu hỏi và chọn câu đáp lại phù hợp và chuẩn xác nhất.',
    colorTheme: 'purple',
  },
  {
    id: 'find-mistake',
    code: 'D',
    title: 'FIND THE MISTAKE',
    titleVi: 'Tìm và sửa lỗi',
    plannedQuestions: 10,
    description: 'Nhận diện câu bị sai và chọn câu đã được sửa lỗi chính xác.',
    colorTheme: 'amber',
  },
];

// Fixed teacher grammar feedback system (No generative AI at runtime)
export const FIXED_GRAMMAR_FEEDBACK: Record<GrammarFocusKey, { title: string; tip: string }> = {
  nationality_question: {
    title: 'Hỏi quốc tịch (Nationality Question)',
    tip: 'Dùng cấu trúc: What nationality is he/she?',
  },
  nationality_answer: {
    title: 'Trả lời quốc tịch (Nationality Answer)',
    tip: 'Dùng cấu trúc: He’s / She’s + nationality (quốc tịch).',
  },
  personality_question: {
    title: 'Hỏi tính cách (Personality Question)',
    tip: 'Dùng cấu trúc: What’s he/she like?',
  },
  personality_answer: {
    title: 'Trả lời tính cách (Personality Answer)',
    tip: 'Dùng cấu trúc: He’s / She’s + adjective (tính từ chỉ tính cách).',
  },
  country_vs_nationality: {
    title: 'Phân biệt Quốc gia và Quốc tịch',
    tip: 'Dùng: from + COUNTRY (tên quốc gia) | be + NATIONALITY (tên quốc tịch).',
  },
  from_country: {
    title: 'Cấu trúc from + country',
    tip: 'Dùng: from + COUNTRY (tên quốc gia, ví dụ: from Australia, from Japan).',
  },
  he_she: {
    title: 'Chủ ngữ he / she',
    tip: 'he → He’s (Anh ấy là) | she → She’s (Cô ấy là). Đi với động từ to be "is".',
  },
  whats_like: {
    title: 'Phân biệt What’s like vs What does like',
    tip: '“What’s she like?” hỏi về tính cách | “What does she like?” hỏi về sở thích.',
  },
  nationality_response: {
    title: 'Câu trả lời về quốc tịch',
    tip: "What nationality is he/she? → He's / She's + nationality.",
  },
  personality_response: {
    title: 'Câu trả lời về tính cách',
    tip: "What's he/she like? → He's / She's + adjective.",
  },
  nationality_vs_personality: {
    title: 'Phân biệt Quốc tịch và Tính cách',
    tip: 'Hỏi nationality → trả lời quốc tịch | Hỏi like? → trả lời tính cách.',
  },
};

// Student-friendly grammar review label mapping (Official Teacher Specification)
export const GRAMMAR_REVIEW_LABELS: Record<GrammarFocusKey, string> = {
  nationality_question: 'What nationality is he/she?',
  nationality_answer: "He's/She's + nationality",
  personality_question: "What's he/she like?",
  personality_answer: "He's/She's + adjective",
  country_vs_nationality: 'Country vs Nationality',
  from_country: 'from + country',
  whats_like: "What's he/she like?",
  he_she: 'he / she + is',
  nationality_response: "What nationality is he/she?\nHe's/She's + nationality.",
  personality_response: "What's he/she like?\nHe's/She's + adjective.",
  nationality_vs_personality: 'Nationality or personality?',
};

// ==================================================
// OFFICIAL TEACHER-APPROVED 15-QUESTION BANK
// ACTIVITY A: CHOOSE THE CORRECT SENTENCE
// ==================================================
export const OFFICIAL_CHOOSE_CORRECT_SENTENCE_QUESTIONS: SentencePatternQuestion[] = [
  // QUESTION 1
  {
    id: 'sp-ccs-q1',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern1_nationality',
    instruction: "Choose the correct question to ask about a boy's nationality.",
    instructionVi: 'Chọn câu hỏi đúng để hỏi về quốc tịch của bạn nam.',
    prompt: "Choose the correct question to ask about a boy's nationality.",
    options: [
      'What nationality is he?',
      'What nationality he is?',
      'What is nationality he?',
      'What nationality he?',
    ],
    correctAnswer: 'What nationality is he?',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'Use: What nationality is he?',
    isTestData: false,
  },
  // QUESTION 2
  {
    id: 'sp-ccs-q2',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern1_nationality',
    instruction: "Choose the correct question to ask about a girl's nationality.",
    instructionVi: 'Chọn câu hỏi đúng để hỏi về quốc tịch của bạn nữ.',
    prompt: "Choose the correct question to ask about a girl's nationality.",
    options: [
      'What nationality she is?',
      'What nationality is she?',
      'What is she nationality?',
      'What nationality she?',
    ],
    correctAnswer: 'What nationality is she?',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'Use: What nationality is she?',
    isTestData: false,
  },
  // QUESTION 3
  {
    id: 'sp-ccs-q3',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "He's Australian.",
      "He's Australia.",
      'He Australian.',
      "He's from Australian.",
    ],
    correctAnswer: "He's Australian.",
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: "Use: He's + nationality.",
    isTestData: false,
  },
  // QUESTION 4
  {
    id: 'sp-ccs-q4',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "She's Malaysia.",
      'She Malaysian.',
      "She's Malaysian.",
      "She's from Malaysian.",
    ],
    correctAnswer: "She's Malaysian.",
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: "Use: She's + nationality.",
    isTestData: false,
  },
  // QUESTION 5
  {
    id: 'sp-ccs-q5',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "She's America.",
      "She's American.",
      'She American.',
      "She's from American.",
    ],
    correctAnswer: "She's American.",
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: 'America = country.\nAmerican = nationality.',
    isTestData: false,
  },
  // QUESTION 6
  {
    id: 'sp-ccs-q6',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "He's Japan.",
      "He's Japanese.",
      'He Japanese.',
      "He's from Japanese.",
    ],
    correctAnswer: "He's Japanese.",
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: 'Japan = country.\nJapanese = nationality.',
    isTestData: false,
  },
  // QUESTION 7
  {
    id: 'sp-ccs-q7',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern2_personality',
    instruction: "Choose the correct question to ask about a boy's personality.",
    instructionVi: 'Chọn câu hỏi đúng để hỏi về tính cách của bạn nam.',
    prompt: "Choose the correct question to ask about a boy's personality.",
    options: [
      "What's he like?",
      'What he like?',
      "What's like he?",
      'What does he nationality?',
    ],
    correctAnswer: "What's he like?",
    grammarFocus: 'personality_question',
    grammarFocusText: "What's he/she like?",
    feedback: "Use: What's he like?",
    isTestData: false,
  },
  // QUESTION 8
  {
    id: 'sp-ccs-q8',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern2_personality',
    instruction: "Choose the correct question to ask about a girl's personality.",
    instructionVi: 'Chọn câu hỏi đúng để hỏi về tính cách của bạn nữ.',
    prompt: "Choose the correct question to ask about a girl's personality.",
    options: [
      'What she like?',
      "What's like she?",
      "What's she like?",
      'What nationality she like?',
    ],
    correctAnswer: "What's she like?",
    grammarFocus: 'personality_question',
    grammarFocusText: "What's he/she like?",
    feedback: "Use: What's she like?",
    isTestData: false,
  },
  // QUESTION 9
  {
    id: 'sp-ccs-q9',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "She's friendly.",
      "She's friend.",
      'She friendly.',
      "She's from friendly.",
    ],
    correctAnswer: "She's friendly.",
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's / She's + adjective",
    feedback: "Use: She's + adjective.",
    isTestData: false,
  },
  // QUESTION 10
  {
    id: 'sp-ccs-q10',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      'He helpful.',
      "He's help.",
      "He's helpful.",
      "He's from helpful.",
    ],
    correctAnswer: "He's helpful.",
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's / She's + adjective",
    feedback: "Use: He's + adjective.",
    isTestData: false,
  },
  // QUESTION 11
  {
    id: 'sp-ccs-q11',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "He's clever.",
      'He clever.',
      "He's clever is.",
      "He's from clever.",
    ],
    correctAnswer: "He's clever.",
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's / She's + adjective",
    feedback: "Use: He's + adjective.",
    isTestData: false,
  },
  // QUESTION 12
  {
    id: 'sp-ccs-q12',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "She's active.",
      'She active.',
      "She's activity.",
      "She's from active.",
    ],
    correctAnswer: "She's active.",
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's / She's + adjective",
    feedback: "Use: She's + adjective.",
    isTestData: false,
  },
  // QUESTION 13
  {
    id: 'sp-ccs-q13',
    activityType: 'choose-correct-sentence',
    pattern: 'general_pattern',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "He's from Australian.",
      "He's from Australia.",
      "He's Australia from.",
      'He from Australia.',
    ],
    correctAnswer: "He's from Australia.",
    grammarFocus: 'country_vs_nationality',
    grammarFocusText: 'from + country / be + nationality',
    feedback: "Use FROM + COUNTRY:\nHe's from Australia.",
    isTestData: false,
  },
  // QUESTION 14
  {
    id: 'sp-ccs-q14',
    activityType: 'choose-correct-sentence',
    pattern: 'general_pattern',
    instruction: 'Choose the correct sentence.',
    instructionVi: 'Chọn câu đúng.',
    prompt: 'Choose the correct sentence.',
    options: [
      "She's from Japanese.",
      "She's Japan.",
      "She's from Japan.",
      'She from Japanese.',
    ],
    correctAnswer: "She's from Japan.",
    grammarFocus: 'country_vs_nationality',
    grammarFocusText: 'from + country / be + nationality',
    feedback: "Use FROM + COUNTRY:\nShe's from Japan.",
    isTestData: false,
  },
  // QUESTION 15
  {
    id: 'sp-ccs-q15',
    activityType: 'choose-correct-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct question.',
    instructionVi: 'Chọn câu hỏi đúng.',
    prompt: "You want to know what kind of person Lily is.\n\nChoose the correct question.",
    options: [
      'What nationality is she?',
      "What's she like?",
      "Where's she from?",
      'What does she nationality?',
    ],
    correctAnswer: "What's she like?",
    grammarFocus: 'whats_like',
    grammarFocusText: "What's he/she like?",
    feedback: '"What\'s she like?" asks about her personality or characteristics.',
    isTestData: false,
  },
];

// ==================================================
// OFFICIAL TEACHER-APPROVED 15-QUESTION BANK
// ACTIVITY B: COMPLETE THE SENTENCE
// ==================================================
export const OFFICIAL_COMPLETE_SENTENCE_QUESTIONS: SentencePatternQuestion[] = [
  // QUESTION 1
  {
    id: 'sp-cs-q1',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: 'What nationality _____ he?',
    promptBeforeBlank: 'What nationality',
    promptAfterBlank: 'he?',
    options: ['am', 'are', 'is', 'does'],
    correctAnswer: 'is',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'Use:\nWhat nationality is he?',
    isTestData: false,
  },
  // QUESTION 2
  {
    id: 'sp-cs-q2',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: 'What nationality _____ she?',
    promptBeforeBlank: 'What nationality',
    promptAfterBlank: 'she?',
    options: ['is', 'are', 'does', 'am'],
    correctAnswer: 'is',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'Use:\nWhat nationality is she?',
    isTestData: false,
  },
  // QUESTION 3
  {
    id: 'sp-cs-q3',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: 'What _____ is he?',
    promptBeforeBlank: 'What',
    promptAfterBlank: 'is he?',
    options: ['country', 'nationality', 'friendly', 'Australian'],
    correctAnswer: 'nationality',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'The question is:\nWhat nationality is he?',
    isTestData: false,
  },
  // QUESTION 4
  {
    id: 'sp-cs-q4',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: '_____ nationality is she?',
    promptBeforeBlank: '',
    promptAfterBlank: 'nationality is she?',
    options: ['Where', 'Who', 'What', 'How'],
    correctAnswer: 'What',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'Use:\nWhat nationality is she?',
    isTestData: false,
  },
  // QUESTION 5
  {
    id: 'sp-cs-q5',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: "He's _____.",
    promptBeforeBlank: "He's",
    promptAfterBlank: '.',
    options: ['Australia', 'Australian', 'from Australian', 'Australia from'],
    correctAnswer: 'Australian',
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: "Use:\nHe's + nationality.\n\nAustralia → Australian",
    isTestData: false,
  },
  // QUESTION 6
  {
    id: 'sp-cs-q6',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: "She's _____.",
    promptBeforeBlank: "She's",
    promptAfterBlank: '.',
    options: ['Malaysia', 'from Malaysian', 'Malaysian', 'Malaysia is'],
    correctAnswer: 'Malaysian',
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: 'Malaysia → Malaysian',
    isTestData: false,
  },
  // QUESTION 7
  {
    id: 'sp-cs-q7',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: "She's _____.",
    promptBeforeBlank: "She's",
    promptAfterBlank: '.',
    options: ['America', 'American', 'from American', 'America from'],
    correctAnswer: 'American',
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: 'America → American',
    isTestData: false,
  },
  // QUESTION 8
  {
    id: 'sp-cs-q8',
    activityType: 'complete-sentence',
    pattern: 'pattern1_nationality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: "He's _____.",
    promptBeforeBlank: "He's",
    promptAfterBlank: '.',
    options: ['Japan', 'from Japanese', 'Japanese', 'Japan is'],
    correctAnswer: 'Japanese',
    grammarFocus: 'nationality_answer',
    grammarFocusText: "He's / She's + nationality",
    feedback: 'Japan → Japanese',
    isTestData: false,
  },
  // QUESTION 9
  {
    id: 'sp-cs-q9',
    activityType: 'complete-sentence',
    pattern: 'general_pattern',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: "He's from _____.",
    promptBeforeBlank: "He's from",
    promptAfterBlank: '.',
    options: ['Australian', 'Australia', 'active', 'nationality'],
    correctAnswer: 'Australia',
    grammarFocus: 'country_vs_nationality',
    grammarFocusText: 'from + country / be + nationality',
    feedback: "Use:\n\nFROM + COUNTRY\n\nHe's from Australia.",
    isTestData: false,
  },
  // QUESTION 10
  {
    id: 'sp-cs-q10',
    activityType: 'complete-sentence',
    pattern: 'general_pattern',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: "She's from _____.",
    promptBeforeBlank: "She's from",
    promptAfterBlank: '.',
    options: ['Japanese', 'friendly', 'Japan', 'nationality'],
    correctAnswer: 'Japan',
    grammarFocus: 'country_vs_nationality',
    grammarFocusText: 'from + country / be + nationality',
    feedback: "Use:\n\nFROM + COUNTRY\n\nShe's from Japan.",
    isTestData: false,
  },
  // QUESTION 11
  {
    id: 'sp-cs-q11',
    activityType: 'complete-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    context: 'You are asking about a boy.',
    sentenceContext: 'You are asking about a boy.',
    prompt: "What's _____ like?",
    promptBeforeBlank: "What's",
    promptAfterBlank: 'like?',
    options: ['he', 'she', 'his', 'him'],
    correctAnswer: 'he',
    grammarFocus: 'personality_question',
    grammarFocusText: "What's he/she like?",
    feedback: "Use:\nWhat's he like?",
    isTestData: false,
  },
  // QUESTION 12
  {
    id: 'sp-cs-q12',
    activityType: 'complete-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    context: 'You are asking about a girl.',
    sentenceContext: 'You are asking about a girl.',
    prompt: "What's _____ like?",
    promptBeforeBlank: "What's",
    promptAfterBlank: 'like?',
    options: ['he', 'her', 'she', 'hers'],
    correctAnswer: 'she',
    grammarFocus: 'personality_question',
    grammarFocusText: "What's he/she like?",
    feedback: "Use:\nWhat's she like?",
    isTestData: false,
  },
  // QUESTION 13
  {
    id: 'sp-cs-q13',
    activityType: 'complete-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    context: 'Mai likes making new friends.',
    sentenceContext: 'Mai likes making new friends.',
    prompt: "She's _____.",
    promptBeforeBlank: "She's",
    promptAfterBlank: '.',
    options: ['Japan', 'friendly', 'Australian', 'Malaysia'],
    correctAnswer: 'friendly',
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's / She's + adjective",
    feedback: "Use:\nShe's + adjective.",
    isTestData: false,
  },
  // QUESTION 14
  {
    id: 'sp-cs-q14',
    activityType: 'complete-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    context: 'Nam likes helping other people.',
    sentenceContext: 'Nam likes helping other people.',
    prompt: "He's _____.",
    promptBeforeBlank: "He's",
    promptAfterBlank: '.',
    options: ['helpful', 'Malaysia', 'Japanese', 'Australia'],
    correctAnswer: 'helpful',
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's / She's + adjective",
    feedback: "Use:\nHe's + adjective.",
    isTestData: false,
  },
  // QUESTION 15
  {
    id: 'sp-cs-q15',
    activityType: 'complete-sentence',
    pattern: 'pattern2_personality',
    instruction: 'Choose the correct word or phrase to complete the sentence.',
    instructionVi: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu.',
    prompt: "What's she _____?",
    promptBeforeBlank: "What's she",
    promptAfterBlank: '?',
    options: ['likes', 'liking', 'like', 'liked'],
    correctAnswer: 'like',
    grammarFocus: 'whats_like',
    grammarFocusText: "What's he/she like?",
    feedback: "Use the fixed pattern:\n\nWhat's she like?\n\nThis asks about her personality or characteristics.",
    isTestData: false,
  },
];

// ==================================================
// OFFICIAL TEACHER-APPROVED 10-QUESTION BANK
// ACTIVITY C: CHOOSE THE CORRECT RESPONSE
// ==================================================
export const OFFICIAL_CHOOSE_CORRECT_RESPONSE_QUESTIONS: SentencePatternQuestion[] = [
  // QUESTION 1
  {
    id: 'sp-ccr-q1',
    activityType: 'choose-correct-response',
    pattern: 'pattern1_nationality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: 'What nationality is he?',
    options: ["He's Australian.", "He's friendly.", "He's active.", 'He likes Australia.'],
    correctAnswer: "He's Australian.",
    grammarFocus: 'nationality_response',
    grammarFocusText: "What nationality is he/she?\nHe's/She's + nationality.",
    feedback: "“What nationality is he?” asks about nationality.\n\nUse:\nHe's + nationality.",
    isTestData: false,
  },
  // QUESTION 2
  {
    id: 'sp-ccr-q2',
    activityType: 'choose-correct-response',
    pattern: 'pattern1_nationality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: 'What nationality is she?',
    options: ["She's helpful.", "She's Malaysian.", "She's friendly.", "She's active."],
    correctAnswer: "She's Malaysian.",
    grammarFocus: 'nationality_response',
    grammarFocusText: "What nationality is he/she?\nHe's/She's + nationality.",
    feedback: "Use:\nShe's + nationality.",
    isTestData: false,
  },
  // QUESTION 3
  {
    id: 'sp-ccr-q3',
    activityType: 'choose-correct-response',
    pattern: 'pattern1_nationality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: 'What nationality is she?',
    options: ["She's clever.", "She's friendly.", "She's American.", "She's helpful."],
    correctAnswer: "She's American.",
    grammarFocus: 'nationality_response',
    grammarFocusText: "What nationality is he/she?\nHe's/She's + nationality.",
    feedback: 'American is a nationality.',
    isTestData: false,
  },
  // QUESTION 4
  {
    id: 'sp-ccr-q4',
    activityType: 'choose-correct-response',
    pattern: 'pattern1_nationality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: 'What nationality is he?',
    options: ["He's active.", "He's Japanese.", "He's helpful.", "He's clever."],
    correctAnswer: "He's Japanese.",
    grammarFocus: 'nationality_response',
    grammarFocusText: "What nationality is he/she?\nHe's/She's + nationality.",
    feedback: 'Japanese is a nationality.',
    isTestData: false,
  },
  // QUESTION 5
  {
    id: 'sp-ccr-q5',
    activityType: 'choose-correct-response',
    pattern: 'pattern2_personality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: "What's she like?",
    options: ["She's Australian.", "She's from Australia.", "She's friendly.", "She's Australia."],
    correctAnswer: "She's friendly.",
    grammarFocus: 'personality_response',
    grammarFocusText: "What's he/she like?\nHe's/She's + adjective.",
    feedback: "“What's she like?” asks about personality.\n\nUse:\nShe's + adjective.",
    isTestData: false,
  },
  // QUESTION 6
  {
    id: 'sp-ccr-q6',
    activityType: 'choose-correct-response',
    pattern: 'pattern2_personality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: "What's he like?",
    options: ["He's Malaysian.", "He's helpful.", "He's from Malaysia.", "He's Malaysia."],
    correctAnswer: "He's helpful.",
    grammarFocus: 'personality_response',
    grammarFocusText: "What's he/she like?\nHe's/She's + adjective.",
    feedback: 'Helpful describes personality.',
    isTestData: false,
  },
  // QUESTION 7
  {
    id: 'sp-ccr-q7',
    activityType: 'choose-correct-response',
    pattern: 'pattern2_personality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: "What's he like?",
    options: ["He's American.", "He's from America.", "He's clever.", "He's America."],
    correctAnswer: "He's clever.",
    grammarFocus: 'personality_response',
    grammarFocusText: "What's he/she like?\nHe's/She's + adjective.",
    feedback: "Clever describes a person's characteristic.",
    isTestData: false,
  },
  // QUESTION 8
  {
    id: 'sp-ccr-q8',
    activityType: 'choose-correct-response',
    pattern: 'pattern2_personality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: "What's she like?",
    options: ["She's Japanese.", "She's active.", "She's Japan.", "She's from Japan."],
    correctAnswer: "She's active.",
    grammarFocus: 'personality_response',
    grammarFocusText: "What's he/she like?\nHe's/She's + adjective.",
    feedback: "Active describes a person's characteristic.",
    isTestData: false,
  },
  // QUESTION 9
  {
    id: 'sp-ccr-q9',
    activityType: 'choose-correct-response',
    pattern: 'pattern1_nationality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: 'What nationality is she?',
    options: ["She's friendly.", "She's helpful.", "She's Japanese.", "She's active."],
    correctAnswer: "She's Japanese.",
    grammarFocus: 'nationality_vs_personality',
    grammarFocusText: 'Nationality or personality?',
    feedback: 'The question asks about NATIONALITY.\n\nJapanese = nationality.\nfriendly / helpful / active = personality words.',
    isTestData: false,
  },
  // QUESTION 10
  {
    id: 'sp-ccr-q10',
    activityType: 'choose-correct-response',
    pattern: 'pattern2_personality',
    instruction: 'Read the question and choose the best response.',
    instructionVi: 'Đọc câu hỏi và chọn câu trả lời phù hợp nhất.',
    prompt: "What's she like?",
    options: ["She's Malaysian.", "She's American.", "She's Australian.", "She's friendly."],
    correctAnswer: "She's friendly.",
    grammarFocus: 'nationality_vs_personality',
    grammarFocusText: 'Nationality or personality?',
    feedback: 'The question asks about PERSONALITY.\n\nfriendly = personality word.',
    isTestData: false,
  },
];

// ==================================================
// OFFICIAL TEACHER-APPROVED 10-QUESTION BANK
// ACTIVITY D: FIND THE MISTAKE
// ==================================================
export const OFFICIAL_FIND_MISTAKE_QUESTIONS: SentencePatternQuestion[] = [
  // QUESTION 1
  {
    id: 'sp-fm-q1',
    activityType: 'find-mistake',
    pattern: 'pattern1_nationality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: 'What nationality he?',
    prompt: 'Choose the correct sentence.',
    options: [
      'What nationality is he?',
      'What is nationality he?',
      'What nationality he is?',
      'What he nationality?',
    ],
    correctAnswer: 'What nationality is he?',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'Use:\nWhat nationality is he?',
    isTestData: false,
  },
  // QUESTION 2
  {
    id: 'sp-fm-q2',
    activityType: 'find-mistake',
    pattern: 'pattern1_nationality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: 'What nationality she?',
    prompt: 'Choose the correct sentence.',
    options: [
      'What she nationality?',
      'What nationality is she?',
      'What nationality she is?',
      'What is she nationality?',
    ],
    correctAnswer: 'What nationality is she?',
    grammarFocus: 'nationality_question',
    grammarFocusText: 'What nationality is he/she?',
    feedback: 'Use:\nWhat nationality is she?',
    isTestData: false,
  },
  // QUESTION 3
  {
    id: 'sp-fm-q3',
    activityType: 'find-mistake',
    pattern: 'pattern1_nationality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: "He's Australia.",
    prompt: 'Choose the correct sentence.',
    options: [
      "He's Australian.",
      'He Australian.',
      "He's from Australian.",
      'He is Australia from.',
    ],
    correctAnswer: "He's Australian.",
    grammarFocus: 'country_vs_nationality',
    grammarFocusText: 'Country vs Nationality',
    feedback: 'Australia = country\nAustralian = nationality\n\nUse:\nHe\'s Australian.',
    isTestData: false,
  },
  // QUESTION 4
  {
    id: 'sp-fm-q4',
    activityType: 'find-mistake',
    pattern: 'pattern1_nationality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: "She's Japan.",
    prompt: 'Choose the correct sentence.',
    options: [
      'She Japanese.',
      "She's from Japanese.",
      "She's Japanese.",
      "She's Japan nationality.",
    ],
    correctAnswer: "She's Japanese.",
    grammarFocus: 'country_vs_nationality',
    grammarFocusText: 'Country vs Nationality',
    feedback: 'Japan = country\nJapanese = nationality\n\nUse:\nShe\'s Japanese.',
    isTestData: false,
  },
  // QUESTION 5
  {
    id: 'sp-fm-q5',
    activityType: 'find-mistake',
    pattern: 'pattern1_nationality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: "He's from Australian.",
    prompt: 'Choose the correct sentence.',
    options: [
      "He's from Australia.",
      "He's Australia.",
      'He from Australian.',
      "He's from Australia nationality.",
    ],
    correctAnswer: "He's from Australia.",
    grammarFocus: 'from_country',
    grammarFocusText: 'from + country',
    feedback: 'Use:\n\nFROM + COUNTRY\n\nHe\'s from Australia.',
    isTestData: false,
  },
  // QUESTION 6
  {
    id: 'sp-fm-q6',
    activityType: 'find-mistake',
    pattern: 'pattern1_nationality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: "She's from Japanese.",
    prompt: 'Choose the correct sentence.',
    options: [
      "She's Japanese from.",
      "She's from Japan.",
      "She's Japan.",
      'She from Japan.',
    ],
    correctAnswer: "She's from Japan.",
    grammarFocus: 'from_country',
    grammarFocusText: 'from + country',
    feedback: 'Use:\n\nFROM + COUNTRY\n\nShe\'s from Japan.',
    isTestData: false,
  },
  // QUESTION 7
  {
    id: 'sp-fm-q7',
    activityType: 'find-mistake',
    pattern: 'pattern2_personality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: 'What he like?',
    prompt: 'Choose the correct sentence.',
    options: [
      "What's he like?",
      'What he is like?',
      "What's like he?",
      'What does he like personality?',
    ],
    correctAnswer: "What's he like?",
    grammarFocus: 'personality_question',
    grammarFocusText: "What's he/she like?",
    feedback: "Use:\nWhat's he like?\n\nWhat's = What is",
    isTestData: false,
  },
  // QUESTION 8
  {
    id: 'sp-fm-q8',
    activityType: 'find-mistake',
    pattern: 'pattern2_personality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: 'What she like?',
    prompt: 'Choose the correct sentence.',
    options: [
      "What's like she?",
      'What she is like?',
      "What's she like?",
      'What does she nationality?',
    ],
    correctAnswer: "What's she like?",
    grammarFocus: 'personality_question',
    grammarFocusText: "What's he/she like?",
    feedback: "Use:\nWhat's she like?",
    isTestData: false,
  },
  // QUESTION 9
  {
    id: 'sp-fm-q9',
    activityType: 'find-mistake',
    pattern: 'pattern2_personality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: 'She friendly.',
    prompt: 'Choose the correct sentence.',
    options: [
      "She's friendly.",
      'She is friendly is.',
      "She's from friendly.",
      'She friendly is.',
    ],
    correctAnswer: "She's friendly.",
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's/She's + adjective",
    feedback: "Use:\n\nShe's + adjective.\n\nShe's friendly.",
    isTestData: false,
  },
  // QUESTION 10
  {
    id: 'sp-fm-q10',
    activityType: 'find-mistake',
    pattern: 'pattern2_personality',
    instruction: 'Read the incorrect sentence and choose the correct sentence.',
    instructionVi: 'Đọc câu sai và chọn câu đã được sửa đúng.',
    incorrectSentence: 'He active.',
    prompt: 'Choose the correct sentence.',
    options: [
      "He's activity.",
      'He is active is.',
      "He's from active.",
      "He's active.",
    ],
    correctAnswer: "He's active.",
    grammarFocus: 'personality_answer',
    grammarFocusText: "He's/She's + adjective",
    feedback: "Use:\n\nHe's + adjective.\n\nHe's active.",
    isTestData: false,
  },
];

// ==================================================
// OFFICIAL 50-QUESTION SENTENCE PATTERNS PRACTICE
// ==================================================
export const TEST_SENTENCE_PATTERN_QUESTIONS: Record<PatternActivityId, SentencePatternQuestion[]> = {
  'choose-correct-sentence': OFFICIAL_CHOOSE_CORRECT_SENTENCE_QUESTIONS,
  'complete-sentence': OFFICIAL_COMPLETE_SENTENCE_QUESTIONS,
  'choose-correct-response': OFFICIAL_CHOOSE_CORRECT_RESPONSE_QUESTIONS,
  'find-mistake': OFFICIAL_FIND_MISTAKE_QUESTIONS,
};

export function getSentencePatternQuestions(activityId: PatternActivityId, randomize = true): SentencePatternQuestion[] {
  const list = TEST_SENTENCE_PATTERN_QUESTIONS[activityId] || [];

  if (!randomize) {
    return [...list];
  }

  // 1. Randomize the order of the questions
  const shuffledQuestions = [...list].sort(() => Math.random() - 0.5);

  // 2. Randomize options while preserving the correct answer string exactly
  return shuffledQuestions.map((q) => {
    if (q.options && q.options.length > 0) {
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: shuffledOptions,
      };
    }
    return q;
  });
}

// Fixed rule-based performance analysis (No AI needed)
export function getPatternPerformanceAnalysis(
  stats: Record<PatternActivityId, { score: number; total?: number; totalQuestions?: number; isCompleted: boolean }>
): {
  strongPoints: string[];
  needsPracticePoints: string[];
  overallAccuracy: number;
} {
  const strong: string[] = [];
  const needs: string[] = [];

  const activityLabels: Record<PatternActivityId, { name: string; focus: string }> = {
    'choose-correct-sentence': {
      name: 'Chọn câu đúng',
      focus: 'Nhận biết cấu trúc câu hỏi & trả lời quốc tịch, tính cách',
    },
    'complete-sentence': {
      name: 'Hoàn thành câu',
      focus: 'Điền trợ động từ "is" và dạng từ (quốc tịch/tính cách) phù hợp',
    },
    'choose-correct-response': {
      name: 'Chọn câu trả lời phù hợp',
      focus: 'Phân biệt chuẩn xác giữa câu hỏi quốc tịch và câu hỏi tính cách',
    },
    'find-mistake': {
      name: 'Tìm và sửa lỗi',
      focus: 'Phân biệt quốc gia (from + country) và quốc tịch (be + nationality)',
    },
  };

  let totalScore = 0;
  let totalQuestions = 0;

  for (const act of PATTERN_ACTIVITIES) {
    const s = stats[act.id];
    if (s && s.isCompleted) {
      const tot = s.total ?? s.totalQuestions ?? act.plannedQuestions;
      totalScore += s.score;
      totalQuestions += tot;
      const pct = tot > 0 ? (s.score / tot) * 100 : 0;
      const meta = activityLabels[act.id];

      if (pct >= 80) {
        strong.push(`${act.titleVi} (${meta.focus})`);
      } else {
        needs.push(`${act.titleVi} (${meta.focus})`);
      }
    }
  }

  // Fallback defaults if perfect or struggling
  if (strong.length === 0) {
    strong.push('Đã nỗ lực hoàn thành tất cả 4 dạng bài tập mẫu câu Unit 3');
  }
  if (needs.length === 0) {
    needs.push('Cả 4 dạng bài tập đều đạt kết quả xuất sắc! Tiếp tục duy trì phong độ.');
  }

  const overallAccuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return {
    strongPoints: strong,
    needsPracticePoints: needs,
    overallAccuracy,
  };
}
