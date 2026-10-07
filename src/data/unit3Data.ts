import {
  VocabItem,
  ConversationData,
  ConversationLessonData,
  SentencePatternData,
  PracticeModuleSpec,
  StudentResultSummary,
} from '../types';

export interface VisualCardDetails {
  bannerTitle: string;
  characterDescription: string;
  backgroundElements: string;
  flagOrProp: string;
  themeColor: string;
  motto?: string;
}

export const AUDIO_VERSION = "v2";

export const vocabAudio = {
  Australian: `/assets/audio/Australian.mp3?ver=${AUDIO_VERSION}`,
  Malaysian: `/assets/audio/Malaysian.mp3?ver=${AUDIO_VERSION}`,
  American: `/assets/audio/American.mp3?ver=${AUDIO_VERSION}`,
  Japanese: `/assets/audio/Japanese.mp3?ver=${AUDIO_VERSION}`,
  friendly: `/assets/audio/friendly.mp3?ver=${AUDIO_VERSION}`,
  helpful: `/assets/audio/helpful.mp3?ver=${AUDIO_VERSION}`,
  clever: `/assets/audio/clever.mp3?ver=${AUDIO_VERSION}`,
  active: `/assets/audio/active.mp3?ver=${AUDIO_VERSION}`,
};

export interface ExtendedVocabItem extends VocabItem {
  visualDetails: VisualCardDetails;
  audioDurationSeconds: number;
}

export const TARGET_VOCABULARY: ExtendedVocabItem[] = [
  // Nationalities (4 items)
  {
    id: 'australian',
    word: 'Australian',
    ipa: "/ɔː'streɪliən/",
    vietnameseMeaning: 'người Úc',
    category: 'Countries & Nationalities',
    countryOrBase: 'Australia (Nước Úc)',
    exampleSentence: 'What nationality is he? — He’s Australian.',
    exampleVietnamese: 'Cậu ấy là người nước nào? — Cậu ấy là người Úc.',
    imagePlaceholderId: 'Australian.png',
    audioPlaceholderId: 'Australian.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/Australian.png',
      audio: vocabAudio.Australian,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Cậu bé tóc đỏ đeo kính tròn, đeo ba lô xanh, mỉm cười rạng rỡ',
      backgroundElements: 'Nhà hát con sò Sydney Opera House, cầu Cảng Sydney, chuột túi Kangaroo, gấu Koala trên biển chỉ đường AUSTRALIA',
      flagOrProp: 'Quốc kỳ nước Úc (Australian Flag)',
      themeColor: '#0284c7',
      motto: 'Australia • G’day Mate!',
    },
  },
  {
    id: 'malaysian',
    word: 'Malaysian',
    ipa: "/mə'leɪʒən/",
    vietnameseMeaning: 'người Malaysia',
    category: 'Countries & Nationalities',
    countryOrBase: 'Malaysia (Nước Ma-lai-xi-a)',
    exampleSentence: 'What nationality is she? — She’s Malaysian.',
    exampleVietnamese: 'Bạn ấy là người nước nào? — Bạn ấy là người Malaysia.',
    imagePlaceholderId: 'Malaysian.png',
    audioPlaceholderId: 'Malaysian.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/Malaysian.png',
      audio: vocabAudio.Malaysian,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Bé gái tóc đen cài hoa trắng xinh xắn, cười tươi chào đón',
      backgroundElements: 'Tháp đôi Petronas Twin Towers cao vút ở Kuala Lumpur, công viên xanh và biển chỉ dẫn MALAYSIA',
      flagOrProp: 'Quốc kỳ Malaysia (Jalur Gemilang)',
      themeColor: '#0ea5e9',
      motto: 'Malaysia • Truly Asia',
    },
  },
  {
    id: 'american',
    word: 'American',
    ipa: "/ə'merɪkən/",
    vietnameseMeaning: 'người Mỹ',
    category: 'Countries & Nationalities',
    countryOrBase: 'America / the USA (Nước Mỹ)',
    exampleSentence: 'What nationality is she? — She’s American.',
    exampleVietnamese: 'Cô ấy là người nước nào? — Cô ấy là người Mỹ.',
    imagePlaceholderId: 'American.png',
    audioPlaceholderId: 'American.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/American.png',
      audio: vocabAudio.American,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Bé gái tóc vàng thắt nơ đỏ xinh đẹp, cầm cờ hoa rạng rỡ',
      backgroundElements: 'Tượng Nữ thần Tự do (Statue of Liberty) giơ cao ngọn đuốc, các tòa nhà chọc trời New York, tàu phà trên sông',
      flagOrProp: 'Quốc kỳ Mỹ (Stars and Stripes)',
      themeColor: '#2563eb',
      motto: 'The United States of America',
    },
  },
  {
    id: 'japanese',
    word: 'Japanese',
    ipa: '/ˌdʒæpəˈniːz/',
    vietnameseMeaning: 'người Nhật',
    category: 'Countries & Nationalities',
    countryOrBase: 'Japan (Nước Nhật Bản)',
    exampleSentence: 'What nationality is she? — She’s Japanese.',
    exampleVietnamese: 'Bạn ấy là người nước nào? — Bạn ấy là người Nhật.',
    imagePlaceholderId: 'Japanese.png',
    audioPlaceholderId: 'Japanese.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/Japanese.png',
      audio: vocabAudio.Japanese,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Bé gái mặc kimono truyền thống họa tiết hoa anh đào, cài trâm hoa sakura',
      backgroundElements: 'Núi Phú Sĩ (Mount Fuji) tuyết phủ, hoa anh đào nở rộ, chùa 5 tầng cổ kính và biển chỉ dẫn JAPAN',
      flagOrProp: 'Quốc kỳ Nhật Bản (Hinomaru)',
      themeColor: '#db2777',
      motto: 'Japan • Land of the Rising Sun',
    },
  },

  // Personality (4 items)
  {
    id: 'friendly',
    word: 'friendly',
    ipa: "/'frendli/",
    vietnameseMeaning: 'thân thiện',
    category: 'Personality',
    exampleSentence: 'What’s she like? — She’s friendly.',
    exampleVietnamese: 'Bạn ấy tính tình thế nào? — Bạn ấy rất thân thiện.',
    imagePlaceholderId: 'friendly.png',
    audioPlaceholderId: 'friendly.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/friendly.png',
      audio: vocabAudio.friendly,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Hai bạn học sinh nữ khoác vai nhau thân thiết, đeo khăn quàng đỏ',
      backgroundElements: 'Sân trường tiểu học khang trang, cô giáo vui vẻ mang sách "Learn Share Be Friends", khẩu hiệu "Good Friends Make a Brighter World!"',
      flagOrProp: 'Sách & khăn quàng đỏ học sinh',
      themeColor: '#10b981',
      motto: 'Good Friends Make a Brighter World!',
    },
  },
  {
    id: 'helpful',
    word: 'helpful',
    ipa: "/'helpfʊl/",
    vietnameseMeaning: 'hữu ích',
    category: 'Personality',
    exampleSentence: 'What’s she like? — She’s helpful.',
    exampleVietnamese: 'Bạn ấy tính tình thế nào? — Bạn ấy rất hay giúp đỡ mọi người.',
    imagePlaceholderId: 'helpful.png',
    audioPlaceholderId: 'helpful.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/helpful.png',
      audio: vocabAudio.helpful,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Hai bạn học sinh nam cùng học tập, bạn đeo kính chỉ bài tận tình cho bạn bên cạnh',
      backgroundElements: 'Phòng học sáng sủa, hộp bút "Good Friends Help Each Other", khẩu hiệu "A Kinder Class, A Brighter World"',
      flagOrProp: 'Vở bài tập & hộp bút',
      themeColor: '#059669',
      motto: 'Good Friends Help Each Other ♡',
    },
  },
  {
    id: 'clever',
    word: 'clever',
    ipa: "/'klevə(r)/",
    vietnameseMeaning: 'thông minh',
    category: 'Personality',
    exampleSentence: 'What’s he like? — He’s clever.',
    exampleVietnamese: 'Cậu ấy tính tình như thế nào? — Cậu ấy rất thông minh.',
    imagePlaceholderId: 'clever.png',
    audioPlaceholderId: 'clever.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/clever.png',
      audio: vocabAudio.clever,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Cậu bé ngồi học cầm bút chì, ánh mắt sáng ngời với bóng đèn ý tưởng phát sáng',
      backgroundElements: 'Chồng sách "THINK, DISCOVER, CREATE", các áp phích "Think Learn Grow Together!" và "Be Curious Be Clever Be You"',
      flagOrProp: 'Bóng đèn ý tưởng phát sáng (Lightbulb)',
      themeColor: '#f59e0b',
      motto: 'Be Curious, Be Clever, Be You ♡',
    },
  },
  {
    id: 'active',
    word: 'active',
    ipa: "/'æktɪv/",
    vietnameseMeaning: 'năng động',
    category: 'Personality',
    exampleSentence: 'What’s he like? — He’s active.',
    exampleVietnamese: 'Cậu ấy tính tình thế nào? — Cậu ấy rất năng động, hoạt bát.',
    imagePlaceholderId: 'active.png',
    audioPlaceholderId: 'active.mp3',
    teacherAssetPath: {
      image: '/assets/vocab/active.png',
      audio: vocabAudio.active,
    },
    audioDurationSeconds: 4,
    visualDetails: {
      bannerTitle: 'New word ♡',
      characterDescription: 'Cậu bé trong trang phục thể dục đang nhảy vượt rào tràn đầy năng lượng trên đường chạy',
      backgroundElements: 'Đường chạy sân trường rực rỡ, nón chóp tập luyện, bảng tiêu chí "Be active, Be healthy, Be happy", băng rôn "Healthy Friends, Happy Friends"',
      flagOrProp: 'Rào chắn thể dục & nón tập',
      themeColor: '#f97316',
      motto: 'Be active • Be healthy • Be happy ♡',
    },
  },
];

export const CONVERSATION_LESSONS: ConversationLessonData[] = [
  {
    lessonId: 1,
    lessonTitle: 'LESSON 1',
    unitTitle: 'Unit 3: My foreign friends',
    page: 22,
    imageFilename: 'Lesson 1.png',
    audioFilename: 'dialogue 1.mp3',
    staticImagePath: '/assets/conversation/Lesson 1.png',
    staticAudioPath: '/assets/conversation/dialogue 1.mp3',
    instructionEn: 'Listen and repeat.',
    instructionVi: 'Nghe và nhắc lại.',
    dialogueA: [
      { speaker: 'Nam', text: 'Mum, I have a new foreign friend.' },
      { speaker: 'Mum', text: 'Do you? Where’s he from?' },
      { speaker: 'Nam', text: 'He’s from Australia.' },
    ],
    dialogueB: [
      { speaker: 'Dad', text: 'What nationality is he?' },
      { speaker: 'Nam', text: 'He’s Australian.' },
    ],
    keyLanguage: [
      { question: 'Where’s he from?', answer: '→ He’s from Australia.' },
      { question: 'What nationality is he?', answer: '→ He’s Australian.' },
    ],
    learningNote: {
      term1: 'Australia',
      meaning1: 'country',
      term2: 'Australian',
      meaning2: 'nationality',
    },
  },
  {
    lessonId: 2,
    lessonTitle: 'LESSON 2',
    unitTitle: 'Unit 3: My foreign friends',
    page: 24,
    imageFilename: 'Lesson 2.png',
    audioFilename: 'dialogue 2.mp3',
    staticImagePath: '/assets/conversation/Lesson 2.png',
    staticAudioPath: '/assets/conversation/dialogue 2.mp3',
    instructionEn: 'Listen and repeat.',
    instructionVi: 'Nghe và nhắc lại.',
    dialogueA: [
      { speaker: 'Pupil 1', text: 'There’s a new pupil in our class. Her name’s Lily.' },
      { speaker: 'Pupil 2', text: 'What nationality is she?' },
      { speaker: 'Pupil 1', text: 'She’s British.' },
    ],
    dialogueB: [
      { speaker: 'Pupil 2', text: 'What’s she like?' },
      { speaker: 'Pupil 1', text: 'She’s friendly.' },
    ],
    keyLanguage: [
      { question: 'What nationality is she?', answer: '→ She’s British.' },
      { question: 'What’s she like?', answer: '→ She’s friendly.' },
    ],
  },
];

export const CONVERSATION_DATA: ConversationData = {
  title: 'Look, listen and repeat',
  vietnameseTitle: 'Nhìn, nghe và nhắc lại',
  imagePlaceholderId: 'conversation_scene_image',
  audioPlaceholderId: 'conversation_audio_main',
  teacherAssetPath: {
    image: '/assets/conversation/conversation_look_listen_repeat.png',
    audio: '/assets/audio/conversation_unit3.mp3',
  },
  partA: {
    title: 'Dialogue A: A new pupil & her nationality',
    lines: [
      {
        speaker: 'Pupil 1 (Nam)',
        speakerRole: 'Pupil A',
        avatarColor: 'bg-blue-500',
        english: '“There’s a new pupil in our class. Her name’s Lily.”',
        vietnamese: '“Có một bạn học sinh mới trong lớp chúng mình. Tên bạn ấy là Lily.”',
      },
      {
        speaker: 'Pupil 2 (Mai)',
        speakerRole: 'Pupil B',
        avatarColor: 'bg-pink-500',
        english: '“What nationality is she?”',
        vietnamese: '“Bạn ấy là người nước nào vậy?”',
      },
      {
        speaker: 'Pupil 1 (Nam)',
        speakerRole: 'Pupil A',
        avatarColor: 'bg-blue-500',
        english: '“She’s British.”',
        vietnamese: '“Bạn ấy là người Anh.”',
      },
    ],
  },
  partB: {
    title: "Dialogue B: Lily's personality",
    lines: [
      {
        speaker: 'Pupil 2 (Mai)',
        speakerRole: 'Pupil B',
        avatarColor: 'bg-pink-500',
        english: '“What’s she like?”',
        vietnamese: '“Bạn ấy tính tình thế nào?”',
      },
      {
        speaker: 'Pupil 1 (Nam)',
        speakerRole: 'Pupil A',
        avatarColor: 'bg-blue-500',
        english: '“She’s friendly.”',
        vietnamese: '“Bạn ấy rất thân thiện.”',
      },
    ],
  },
};

export const SENTENCE_PATTERNS: SentencePatternData[] = [
  {
    id: 'pattern-1',
    title: 'PATTERN 1: Asking and answering about nationality',
    patternFormula: {
      question: 'What nationality is he/she?',
      answer: "He's / She's + nationality.",
    },
    purposeEn: 'Ask and answer about nationality.',
    purposeVi: 'Dùng để hỏi và trả lời về quốc tịch của một bạn nam hoặc một bạn nữ.',
    examples: [
      {
        question: 'What nationality is he?',
        answer: 'He’s Australian.',
        questionVi: 'Cậu ấy là người nước nào?',
        answerVi: 'Cậu ấy là người Úc.',
      },
      {
        question: 'What nationality is she?',
        answer: 'She’s Japanese.',
        questionVi: 'Bạn ấy là người nước nào?',
        answerVi: 'Bạn ấy là người Nhật Bản.',
      },
      {
        question: 'What nationality is she?',
        answer: 'She’s Malaysian.',
        questionVi: 'Bạn ấy là người nước nào?',
        answerVi: 'Bạn ấy là người Malaysia.',
      },
      {
        question: 'What nationality is she?',
        answer: 'She’s American.',
        questionVi: 'Bạn ấy là người nước nào?',
        answerVi: 'Bạn ấy là người Mỹ.',
      },
    ],
    grammarNotes: [
      {
        title: 'Use nationality word after He’s / She’s',
        content: 'Sau He’s hoặc She’s, chúng ta sử dụng từ chỉ QUỐC TỊCH (không dùng tên đất nước).',
        highlight: 'She’s from Japan. ➔ She’s Japanese.',
      },
      {
        title: 'Country vs. Nationality Review',
        content: 'Australia ➔ Australian | Malaysia ➔ Malaysian | America ➔ American | Japan ➔ Japanese | Britain ➔ British',
      },
    ],
    modelAssetPlaceholder: {
      id: 'pattern1_model_image',
      filename: 'pattern1_model.png',
      description: 'Teacher Model & Notice Illustration (Pattern 1)',
    },
  },
  {
    id: 'pattern-2',
    title: 'PATTERN 2: Asking and answering about personality / characteristics',
    patternFormula: {
      question: 'What’s he/she like?',
      answer: "He's / She's + adjective.",
    },
    purposeEn: 'Ask and answer about someone’s personality or characteristics.',
    purposeVi: 'Dùng để hỏi và trả lời về tính cách, tính tình của ai đó (thân thiện, thông minh, hay giúp đỡ,...).',
    examples: [
      {
        question: 'What’s she like?',
        answer: 'She’s friendly.',
        questionVi: 'Bạn ấy tính tình như thế nào?',
        answerVi: 'Bạn ấy rất thân thiện.',
      },
      {
        question: 'What’s she like?',
        answer: 'She’s helpful.',
        questionVi: 'Bạn ấy tính tình như thế nào?',
        answerVi: 'Bạn ấy rất hay giúp đỡ mọi người.',
      },
      {
        question: 'What’s he like?',
        answer: 'He’s clever.',
        questionVi: 'Cậu ấy tính tình như thế nào?',
        answerVi: 'Cậu ấy rất thông minh.',
      },
      {
        question: 'What’s he like?',
        answer: 'He’s active.',
        questionVi: 'Cậu ấy tính tình như thế nào?',
        answerVi: 'Cậu ấy rất năng động.',
      },
    ],
    rememberPoints: [
      'What’s = What is',
      'He’s = He is',
      'She’s = She is',
    ],
    importantGrammarNote: {
      warning: 'Important Grammar Note (Chú ý đặc biệt):',
      explanation:
        '“What’s she like?” asks what kind of person she is (tính cách của bạn ấy ra sao). It does NOT mean “What does she like?” (Không mang nghĩa "Cô ấy thích gì?").',
    },
    grammarNotes: [
      {
        title: 'Target Personality Adjectives in Unit 3',
        content: 'friendly (thân thiện) • helpful (hữu ích, tốt bụng) • clever (thông minh) • active (năng động)',
      },
    ],
    modelAssetPlaceholder: {
      id: 'pattern2_notice_image',
      filename: 'pattern2_notice.png',
      description: 'Teacher Model & Notice Illustration (Pattern 2)',
    },
  },
];

export const PRACTICE_MODULES: PracticeModuleSpec[] = [
  {
    id: 'vocab-practice',
    title: '1. VOCABULARY PRACTICE',
    titleVi: 'Luyện tập Từ vựng',
    totalQuestions: 100,
    description: 'Comprehensive practice for the 8 target vocabulary items across 4 structured categories.',
    iconName: 'BookOpen',
    colorTheme: 'blue',
    categories: [
      { name: 'Multiple Choice', nameVi: 'Trắc nghiệm chọn đáp án', count: 30 },
      { name: 'Missing Letters', nameVi: 'Điền chữ cái còn thiếu', count: 25 },
      { name: 'Unscramble the Word', nameVi: 'Sắp xếp lại các chữ cái', count: 25 },
      { name: 'Vocabulary in Context', nameVi: 'Từ vựng theo ngữ cảnh', count: 20 },
    ],
    targetSkills: [
      'Identify Australian, Malaysian, American, Japanese',
      'Spell personality adjectives: friendly, helpful, clever, active',
      'Match IPA pronunciation with correct spelling',
    ],
  },
  {
    id: 'sentence-patterns',
    title: '2. SENTENCE PATTERNS',
    titleVi: 'Luyện tập Mẫu câu',
    totalQuestions: 50,
    description: 'Master asking and answering about nationalities and personalities using target patterns.',
    iconName: 'MessageSquareText',
    colorTheme: 'emerald',
    categories: [
      { name: 'Nationality Patterns', nameVi: 'Mẫu câu hỏi & trả lời quốc tịch', count: 25 },
      { name: 'Personality Patterns', nameVi: 'Mẫu câu hỏi & trả lời tính cách', count: 25 },
    ],
    targetSkills: [
      'Differentiate between Country and Nationality words',
      'Correctly use He’s / She’s + nationality or adjective',
      'Master the distinction between “What’s she like?” and “What does she like?”',
    ],
  },
  {
    id: 'unscramble-sentence',
    title: '3. UNSCRAMBLE THE SENTENCE',
    titleVi: 'Sắp xếp câu hoàn chỉnh',
    totalQuestions: 20,
    description: 'Arrange interactive word cards in the correct grammatical order to form standard sentences.',
    iconName: 'Layers',
    colorTheme: 'amber',
    categories: [
      { name: 'Question Formation', nameVi: 'Sắp xếp câu hỏi', count: 10 },
      { name: 'Answer Formation', nameVi: 'Sắp xếp câu trả lời', count: 10 },
    ],
    targetSkills: [
      'Word order for questions: What nationality is he/she?',
      'Word order for questions: What’s he/she like?',
      'Capitalization and punctuation rules for English 5',
    ],
  },
];

export const SAMPLE_RESULT_SUMMARY: StudentResultSummary = {
  studentName: 'Minh Anh',
  grade: 'Lớp 5A2',
  totalScore: 85,
  maxScore: 100,
  rating: 'Excellent Work!',
  ratingVi: 'Xuất sắc! Em nắm rất chắc bài học.',
  vocabPerformance: {
    score: 92,
    total: 100,
    percentage: 92,
    masteredCount: 7,
  },
  sentencePatternPerformance: {
    score: 78,
    total: 100,
    percentage: 78,
    masteredCount: 4,
  },
  wordsNeedingPractice: [
    {
      word: 'Malaysian',
      meaning: 'người Malaysia',
      missedCount: 2,
      category: 'Countries & Nationalities',
    },
    {
      word: 'helpful',
      meaning: 'hữu ích, hay giúp đỡ',
      missedCount: 1,
      category: 'Personality',
    },
  ],
  mistakesHistory: [
    {
      id: 'm1',
      category: 'Sentence Patterns',
      questionText: 'What _______ is she? — She’s American.',
      studentAnswer: 'country',
      correctAnswer: 'nationality',
      explanationVi: 'Cần dùng "nationality" khi câu trả lời chỉ quốc tịch (American). Nếu hỏi đất nước sẽ dùng "Where is she from?".',
    },
    {
      id: 'm2',
      category: 'Vocabulary Spelling',
      questionText: 'Điền chữ cái còn thiếu: M _ l _ y s i a n',
      studentAnswer: 'Maleysian',
      correctAnswer: 'Malaysian',
      explanationVi: 'Từ đúng là "Malaysian" (viết hoa chữ M, nguyên âm là a - a).',
    },
    {
      id: 'm3',
      category: 'Sentence Patterns',
      questionText: 'What’s he like? — He’s ________.',
      studentAnswer: 'likes football',
      correctAnswer: 'clever',
      explanationVi: '“What’s he like?” hỏi về tính cách, cần trả lời bằng tính từ (clever/friendly/helpful/active), không nhầm với sở thích.',
    },
  ],
};
