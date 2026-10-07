import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import geminiHandler from './api/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser with 20MB limit for base64 audio payloads
app.use(express.json({ limit: '20mb' }));

const ALLOWED_TARGET_WORDS = [
  'Australian',
  'Malaysian',
  'American',
  'Japanese',
  'friendly',
  'helpful',
  'clever',
  'active',
];

// Initialize GoogleGenAI client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Mount Vercel Serverless Function locally for /api/gemini
app.all('/api/gemini', async (req, res) => {
  return geminiHandler(req, res);
});

// AI Pronunciation Feedback Endpoint
app.post('/api/pronunciation-feedback', async (req, res) => {
  try {
    const { targetWord, audioBase64, mimeType } = req.body;

    // Validation
    if (!targetWord || typeof targetWord !== 'string') {
      return res.status(400).json({ error: 'Missing targetWord' });
    }

    const matchedWord = ALLOWED_TARGET_WORDS.find(
      (w) => w.toLowerCase() === targetWord.trim().toLowerCase()
    );

    if (!matchedWord) {
      return res.status(400).json({
        error: `Target word must be one of the 8 Unit 3 vocabulary words: ${ALLOWED_TARGET_WORDS.join(', ')}`,
      });
    }

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing audio data' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not configured in environment');
      return res.status(500).json({
        error: "We couldn't check your pronunciation this time. Please try again.",
      });
    }

    // Prepare audio inlineData part
    // Clean mimeType if it contains codec parameters (e.g. "audio/webm;codecs=opus" -> "audio/webm")
    const cleanMimeType = (mimeType || 'audio/webm').split(';')[0].trim();

    const audioPart = {
      inlineData: {
        mimeType: cleanMimeType,
        data: audioBase64,
      },
    };

    const promptText = `
You are a formative pronunciation coach for Vietnamese Grade 5 English learners (ages 10-11) studying English 5 – Global Success, Unit 3: My foreign friends.
Your task is to analyze the student's recorded audio attempting to say the target English vocabulary word: "${matchedWord}".

EVALUATION TASK:
"How clearly did the student pronounce THIS target word: '${matchedWord}'?"
This is NOT an open-ended speech recognition task. You already know the intended word is "${matchedWord}".

ASSESSMENT PRINCIPLES:
- Formative practice for Grade 5 learners (ages 10-11), not a formal pronunciation examination.
- FAIRNESS RULE:
  * Do NOT assess whether the student sounds like a native speaker.
  * Do NOT penalize a Vietnamese accent by itself.
  * Focus strictly on: INTELLIGIBILITY, KEY SOUNDS, SYLLABLES, WORD STRESS, and OVERALL CLARITY.
  * Be positive, constructive, and child-friendly.

ANTI-HALLUCINATION RULE:
- If the recording is silent, extremely quiet, mostly noise/static, too short (< 0.4s), speech cannot be identified, or recording is corrupted:
  * Set audioQuality: "poor"
  * Set confidence: "low"
  * Set wordMatch: false
  * Set scores to 0
  * Set totalScore to 0
  * Do not invent a numerical pronunciation score.

WRONG-WORD DETECTION:
- If the student clearly says a different word (for example, target is "${matchedWord}" but the student says another word like "Japanese" or something completely unrelated):
  * Set wordMatch: false
  * Set scores.wordMatch to a low score (0 to 10)
  * Set totalScore appropriately reduced
  * In strengths, do not give false praise for the wrong word.
  * In focusAreas: ["Nghe lại từ mẫu và thử lại nhé (Listen to the target word and try again)"]
  * In tip: "Em hãy nghe lại phát âm mẫu của từ '${matchedWord}' rồi đọc lại nhé."

PRONUNCIATION RUBRIC (Total: 100 points):
1. wordMatch (0 to 30 points):
   Does the recording correspond clearly to the intended target word "${matchedWord}"?
2. keySounds (0 to 30 points):
   Are the important sounds and syllables sufficiently clear for "${matchedWord}" to be understood?
3. wordStress (0 to 20 points):
   Is the main word stress reasonably placed?
   - Australian: Aus-TRA-li-an (2nd syllable)
   - Malaysian: Ma-LAY-sian (2nd syllable)
   - American: A-ME-ri-can (2nd syllable)
   - Japanese: Ja-pa-NESE (3rd syllable)
   - friendly: FRIEND-ly (1st syllable)
   - helpful: HELP-ful (1st syllable)
   - clever: CLE-ver (1st syllable)
   - active: AC-tive (1st syllable)
4. clarity (0 to 20 points):
   Is the overall word understandable and clear?

TOTAL SCORE:
totalScore = wordMatch + keySounds + wordStress + clarity (integer 0 to 100).

FEEDBACK GUIDELINES (Tiếng Việt dễ hiểu, khuyến khích cho học sinh lớp 5):
- strengths: Tối đa 2 lời khen ngắn gọn bằng tiếng Việt (ví dụ: "Phát âm rõ ràng, dễ nghe.", "Nhấn trọng âm rất tốt.", "Đọc đủ các âm tiết của từ.").
- focusAreas: Tối đa 2 điểm cần cải thiện ngắn gọn bằng tiếng Việt (ví dụ: "Em chú ý phát âm rõ âm đuôi hơn.", "Em nhớ nhấn trọng âm vào âm tiết thứ 2 nhé.", "Hãy đọc tròn vành rõ chữ hơn.").
- tip: Đúng 1 mẹo nhỏ ngắn gọn bằng tiếng Việt (ví dụ: "Em hãy nghe lại phát âm mẫu của cô và đọc theo nhịp nhé!"). Do NOT give long phonetic explanations or technical IPA jargon.

Return strictly the structured JSON according to the schema.
`;

    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-3.8-flash',
    ];

    const responseSchemaObj = {
      type: Type.OBJECT,
      properties: {
        targetWord: { type: Type.STRING },
        audioQuality: {
          type: Type.STRING,
          enum: ['good', 'acceptable', 'poor'],
        },
        wordMatch: { type: Type.BOOLEAN },
        scores: {
          type: Type.OBJECT,
          properties: {
            wordMatch: { type: Type.INTEGER },
            keySounds: { type: Type.INTEGER },
            wordStress: { type: Type.INTEGER },
            clarity: { type: Type.INTEGER },
          },
          required: ['wordMatch', 'keySounds', 'wordStress', 'clarity'],
        },
        totalScore: { type: Type.INTEGER },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        focusAreas: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        tip: { type: Type.STRING },
        confidence: {
          type: Type.STRING,
          enum: ['high', 'medium', 'low'],
        },
      },
      required: [
        'targetWord',
        'audioQuality',
        'wordMatch',
        'scores',
        'totalScore',
        'strengths',
        'focusAreas',
        'tip',
        'confidence',
      ],
    };

    let responseText = '';
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [audioPart, { text: promptText }],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchemaObj,
          },
        });

        const text = response.text?.trim();
        if (text) {
          responseText = text;
          break;
        }
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate:`, err instanceof Error ? err.message : err);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(responseText);

    // Bound and validate scores
    const sWordMatch = Math.min(30, Math.max(0, parsed.scores?.wordMatch ?? 0));
    const sKeySounds = Math.min(30, Math.max(0, parsed.scores?.keySounds ?? 0));
    const sWordStress = Math.min(20, Math.max(0, parsed.scores?.wordStress ?? 0));
    const sClarity = Math.min(20, Math.max(0, parsed.scores?.clarity ?? 0));

    parsed.scores = {
      wordMatch: sWordMatch,
      keySounds: sKeySounds,
      wordStress: sWordStress,
      clarity: sClarity,
    };

    const calculatedTotal = sWordMatch + sKeySounds + sWordStress + sClarity;
    parsed.targetWord = matchedWord;
    parsed.totalScore = Math.min(100, Math.max(0, parsed.totalScore ?? calculatedTotal));

    // Limit feedback count to max 2 strengths, max 2 focus areas
    if (Array.isArray(parsed.strengths) && parsed.strengths.length > 2) {
      parsed.strengths = parsed.strengths.slice(0, 2);
    }
    if (Array.isArray(parsed.focusAreas) && parsed.focusAreas.length > 2) {
      parsed.focusAreas = parsed.focusAreas.slice(0, 2);
    }

    // Provide studentTip alias for frontend compatibility
    parsed.studentTip = parsed.tip || '';
    parsed.recognized = parsed.wordMatch;

    return res.json(parsed);
  } catch (err: unknown) {
    const errorDetails = err instanceof Error ? err.message : String(err);
    console.error('Error analyzing pronunciation:', errorDetails, err);
    return res.status(500).json({
      error: "We couldn't check your pronunciation this time. Please try again.",
      details: errorDetails,
    });
  }
});

// Vite middleware mounting in development or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unit 3 server running on http://0.0.0.0:${PORT} (mode: ${isDev ? 'dev' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
