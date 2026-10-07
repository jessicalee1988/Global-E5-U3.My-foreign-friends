/**
 * Pronunciation Analyzer Service
 * Sends student's current recorded audio blob + targetWord to the server-side
 * AI pronunciation evaluation endpoint.
 *
 * Privacy & Security:
 * - Only sends targetWord + current audio blob.
 * - Does not store raw recordings permanently.
 */

export interface PronunciationScores {
  wordMatch: number; // 0-30
  wordRecognition?: number; // alias for wordMatch
  keySounds: number; // 0-30
  wordStress: number; // 0-20
  clarity: number; // 0-20
}

export interface PronunciationResult {
  targetWord: string;
  audioQuality: 'good' | 'acceptable' | 'poor';
  wordMatch: boolean;
  scores: PronunciationScores;
  totalScore: number; // 0-100
  strengths: string[];
  focusAreas: string[];
  tip: string;
  studentTip?: string;
  confidence: 'high' | 'medium' | 'low';
  recognized?: boolean;
  isLowConfidence?: boolean;
  lowConfidenceMessage?: string;
  lowConfidenceMessageVi?: string;
}

/**
 * Helper to convert Blob to Base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip off the data URL prefix (e.g. "data:audio/webm;base64,")
      const base64Index = result.indexOf(';base64,');
      if (base64Index !== -1) {
        resolve(result.substring(base64Index + 8));
      } else {
        resolve(result);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}

export async function analyzePronunciation(
  audioBlob: Blob,
  targetWord: string
): Promise<PronunciationResult> {
  // Guard check: blob size (empty or corrupt)
  if (!audioBlob || audioBlob.size < 100) {
    return {
      targetWord,
      audioQuality: 'poor',
      wordMatch: false,
      scores: {
        wordMatch: 0,
        wordRecognition: 0,
        keySounds: 0,
        wordStress: 0,
        clarity: 0,
      },
      totalScore: 0,
      strengths: [],
      focusAreas: ['Thu âm to và rõ ràng hơn'],
      tip: 'Em hãy để micro gần hơn và nói to rõ nhé.',
      studentTip: 'Em hãy để micro gần hơn và nói to rõ nhé.',
      confidence: 'low',
      recognized: false,
      isLowConfidence: true,
      lowConfidenceMessage: "I couldn't hear you clearly. Please record again.",
      lowConfidenceMessageVi: 'Mình chưa nghe rõ. Em hãy thu âm lại nhé.',
    };
  }

  const base64Data = await blobToBase64(audioBlob);
  const mimeType = audioBlob.type || 'audio/webm';

  const response = await fetch('/api/pronunciation-feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetWord,
      audioBase64: base64Data,
      mimeType,
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || `Pronunciation check failed with status ${response.status}`);
  }

  const data: PronunciationResult = await response.json();

  // Normalize aliases
  const wordScore = data.scores.wordMatch ?? data.scores.wordRecognition ?? 0;
  data.scores.wordMatch = wordScore;
  data.scores.wordRecognition = wordScore;
  data.tip = data.tip || data.studentTip || '';
  data.studentTip = data.tip;

  // Anti-hallucination rule: poor quality or low confidence
  if (data.audioQuality === 'poor' || data.confidence === 'low') {
    return {
      ...data,
      isLowConfidence: true,
      lowConfidenceMessage: "I couldn't hear you clearly. Please record again.",
      lowConfidenceMessageVi: 'Mình chưa nghe rõ. Em hãy thu âm lại nhé.',
    };
  }

  return data;
}
