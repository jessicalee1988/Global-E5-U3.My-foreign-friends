export type UnscrambleActivityId = 'question-formation' | 'answer-formation';

export interface UnscrambleSentenceQuestion {
  id: string;
  activityId: UnscrambleActivityId;
  instruction: string;
  instructionVi: string;
  prompt: string;
  contextVi?: string;
  shuffledWords: string[];
  correctSentence: string;
  feedback: string;
  patternFormula: string;
}

export interface UnscrambleActivityMeta {
  id: UnscrambleActivityId;
  code: string;
  title: string;
  titleVi: string;
  plannedQuestions: number;
  description: string;
  colorTheme: 'amber' | 'emerald';
}

export const UNSCRAMBLE_ACTIVITIES: UnscrambleActivityMeta[] = [
  {
    id: 'question-formation',
    code: 'A',
    title: 'QUESTION FORMATION',
    titleVi: 'Sắp xếp câu hỏi',
    plannedQuestions: 10,
    description: 'Chạm chọn các thẻ từ để tạo thành câu hỏi hỏi về quốc tịch và tính cách chuẩn xác.',
    colorTheme: 'amber',
  },
  {
    id: 'answer-formation',
    code: 'B',
    title: 'ANSWER FORMATION',
    titleVi: 'Sắp xếp câu trả lời',
    plannedQuestions: 10,
    description: 'Chạm chọn các thẻ từ để tạo thành câu trả lời về quốc tịch và tính cách người bạn nước ngoài.',
    colorTheme: 'emerald',
  },
];

export const OFFICIAL_UNSCRAMBLE_SENTENCE_QUESTIONS: Record<UnscrambleActivityId, UnscrambleSentenceQuestion[]> = {
  'question-formation': [
    // 1
    {
      id: 'us-q1',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi về quốc tịch của một bạn nam:',
      contextVi: 'Cậu ấy mang quốc tịch nước nào?',
      shuffledWords: ['nationality', 'is', 'he?', 'What'],
      correctSentence: 'What nationality is he?',
      feedback: 'Cấu trúc hỏi quốc tịch của bạn nam: What nationality is he?',
      patternFormula: 'What nationality is he?',
    },
    // 2
    {
      id: 'us-q2',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi về quốc tịch của một bạn nữ:',
      contextVi: 'Bạn nữ ấy là người nước nào?',
      shuffledWords: ['she?', 'What', 'is', 'nationality'],
      correctSentence: 'What nationality is she?',
      feedback: 'Cấu trúc hỏi quốc tịch của bạn nữ: What nationality is she?',
      patternFormula: 'What nationality is she?',
    },
    // 3
    {
      id: 'us-q3',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi về tính cách của một bạn nam:',
      contextVi: 'Cậu ấy là người như thế nào?',
      shuffledWords: ['like?', 'What’s', 'he'],
      correctSentence: 'What’s he like?',
      feedback: 'Cấu trúc hỏi tính cách bạn nam: What’s he like? (What’s = What is).',
      patternFormula: 'What’s he like?',
    },
    // 4
    {
      id: 'us-q4',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi về tính cách của một bạn nữ:',
      contextVi: 'Cô ấy tính tình như thế nào?',
      shuffledWords: ['she', 'like?', 'What’s'],
      correctSentence: 'What’s she like?',
      feedback: 'Cấu trúc hỏi tính cách bạn nữ: What’s she like? (What’s = What is).',
      patternFormula: 'What’s she like?',
    },
    // 5
    {
      id: 'us-q5',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi về nơi xuất thân/quốc gia của bạn nữ:',
      contextVi: 'Cô ấy đến từ đâu?',
      shuffledWords: ['from?', 'she', 'Where', 'is'],
      correctSentence: 'Where is she from?',
      feedback: 'Cấu trúc hỏi quốc gia xuất xứ: Where is she from?',
      patternFormula: 'Where is she from?',
    },
    // 6
    {
      id: 'us-q6',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi về nơi xuất thân/quốc gia của bạn nam:',
      contextVi: 'Cậu ấy đến từ nước nào?',
      shuffledWords: ['he', 'Where', 'from?', 'is'],
      correctSentence: 'Where is he from?',
      feedback: 'Cấu trúc hỏi quốc gia xuất xứ: Where is he from?',
      patternFormula: 'Where is he from?',
    },
    // 7
    {
      id: 'us-q7',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi quốc tịch của Tony:',
      contextVi: 'Tony là người nước nào?',
      shuffledWords: ['Tony?', 'is', 'nationality', 'What'],
      correctSentence: 'What nationality is Tony?',
      feedback: 'Cấu trúc hỏi quốc tịch của danh từ riêng: What nationality is Tony?',
      patternFormula: 'What nationality is + Name?',
    },
    // 8
    {
      id: 'us-q8',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi tính cách của Mary:',
      contextVi: 'Mary là người như thế nào?',
      shuffledWords: ['like?', 'Mary', 'What’s'],
      correctSentence: 'What’s Mary like?',
      feedback: 'Cấu trúc hỏi tính cách của danh từ riêng: What’s Mary like?',
      patternFormula: 'What’s + Name + like?',
    },
    // 9
    {
      id: 'us-q9',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi xem cậu ấy có phải là người Úc không:',
      contextVi: 'Cậu ấy có phải người Úc không?',
      shuffledWords: ['Australian?', 'he', 'Is'],
      correctSentence: 'Is he Australian?',
      feedback: 'Câu hỏi Yes/No với quốc tịch: Is he Australian?',
      patternFormula: 'Is he + nationality?',
    },
    // 10
    {
      id: 'us-q10',
      activityId: 'question-formation',
      instruction: 'Put the words in the correct order to make a question.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu hỏi đúng.',
      prompt: 'Hỏi xem cô ấy có thân thiện không:',
      contextVi: 'Bạn ấy có thân thiện không?',
      shuffledWords: ['she', 'friendly?', 'Is'],
      correctSentence: 'Is she friendly?',
      feedback: 'Câu hỏi Yes/No với tính từ tính cách: Is she friendly?',
      patternFormula: 'Is she + adjective?',
    },
  ],
  'answer-formation': [
    // 1
    {
      id: 'us-a1',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cậu ấy là người nước Úc:',
      contextVi: 'Cậu ấy là người Úc.',
      shuffledWords: ['Australian.', 'He’s'],
      correctSentence: 'He’s Australian.',
      feedback: 'Cấu trúc trả lời quốc tịch: He’s + nationality (He’s Australian).',
      patternFormula: 'He’s + nationality.',
    },
    // 2
    {
      id: 'us-a2',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cô ấy là người Malaysia:',
      contextVi: 'Bạn ấy là người Malaysia.',
      shuffledWords: ['Malaysian.', 'She’s'],
      correctSentence: 'She’s Malaysian.',
      feedback: 'Cấu trúc trả lời quốc tịch: She’s + nationality (She’s Malaysian).',
      patternFormula: 'She’s + nationality.',
    },
    // 3
    {
      id: 'us-a3',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cậu ấy là người Mỹ:',
      contextVi: 'Cậu ấy là người Mỹ.',
      shuffledWords: ['American.', 'He’s'],
      correctSentence: 'He’s American.',
      feedback: 'Cấu trúc trả lời quốc tịch: He’s + nationality (He’s American).',
      patternFormula: 'He’s + nationality.',
    },
    // 4
    {
      id: 'us-a4',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cô ấy là người Nhật Bản:',
      contextVi: 'Cô ấy là người Nhật Bản.',
      shuffledWords: ['Japanese.', 'She’s'],
      correctSentence: 'She’s Japanese.',
      feedback: 'Cấu trúc trả lời quốc tịch: She’s + nationality (She’s Japanese).',
      patternFormula: 'She’s + nationality.',
    },
    // 5
    {
      id: 'us-a5',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Bạn ấy rất thân thiện:',
      contextVi: 'Cô ấy rất thân thiện.',
      shuffledWords: ['friendly.', 'She’s'],
      correctSentence: 'She’s friendly.',
      feedback: 'Cấu trúc trả lời tính cách: She’s + adjective (She’s friendly).',
      patternFormula: 'She’s + adjective.',
    },
    // 6
    {
      id: 'us-a6',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cậu ấy rất hay giúp đỡ mọi người:',
      contextVi: 'Cậu ấy rất tốt bụng, hay giúp đỡ.',
      shuffledWords: ['helpful.', 'He’s'],
      correctSentence: 'He’s helpful.',
      feedback: 'Cấu trúc trả lời tính cách: He’s + adjective (He’s helpful).',
      patternFormula: 'He’s + adjective.',
    },
    // 7
    {
      id: 'us-a7',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cô ấy rất thông minh:',
      contextVi: 'Cô ấy rất thông minh, nhanh trí.',
      shuffledWords: ['clever.', 'She’s'],
      correctSentence: 'She’s clever.',
      feedback: 'Cấu trúc trả lời tính cách: She’s + adjective (She’s clever).',
      patternFormula: 'She’s + adjective.',
    },
    // 8
    {
      id: 'us-a8',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cậu ấy rất năng động:',
      contextVi: 'Cậu ấy rất năng động, hoạt bát.',
      shuffledWords: ['active.', 'He’s'],
      correctSentence: 'He’s active.',
      feedback: 'Cấu trúc trả lời tính cách: He’s + adjective (He’s active).',
      patternFormula: 'He’s + adjective.',
    },
    // 9
    {
      id: 'us-a9',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cô ấy đến từ nước Úc:',
      contextVi: 'Cô ấy đến từ nước Úc.',
      shuffledWords: ['from', 'She’s', 'Australia.'],
      correctSentence: 'She’s from Australia.',
      feedback: 'Cấu trúc trả lời quốc gia xuất thân: She’s from + country (Australia).',
      patternFormula: 'She’s from + country.',
    },
    // 10
    {
      id: 'us-a10',
      activityId: 'answer-formation',
      instruction: 'Put the words in the correct order to make a sentence.',
      instructionVi: 'Sắp xếp các từ để tạo thành câu trả lời đúng.',
      prompt: 'Cậu ấy vừa thân thiện vừa thông minh:',
      contextVi: 'Cậu ấy thân thiện và thông minh.',
      shuffledWords: ['friendly', 'He’s', 'and', 'clever.'],
      correctSentence: 'He’s friendly and clever.',
      feedback: 'Cấu trúc nối hai tính từ tính cách: He’s + adj + and + adj.',
      patternFormula: 'He’s + adj + and + adj.',
    },
  ],
};

export function getUnscrambleSentenceQuestions(
  activityId: UnscrambleActivityId,
  randomize = true
): UnscrambleSentenceQuestion[] {
  const list = OFFICIAL_UNSCRAMBLE_SENTENCE_QUESTIONS[activityId] || [];

  if (!randomize) {
    return [...list];
  }

  // 1. Shuffle questions
  const shuffledQuestions = [...list].sort(() => Math.random() - 0.5);

  // 2. Ensure words within each question are genuinely shuffled so they are not already solved
  return shuffledQuestions.map((q) => {
    let words = [...q.shuffledWords];
    // if words accidentally match the correct sentence, shuffle again
    let attempts = 0;
    while (words.join(' ') === q.correctSentence && attempts < 5) {
      words = words.sort(() => Math.random() - 0.5);
      attempts++;
    }
    return {
      ...q,
      shuffledWords: words,
    };
  });
}
