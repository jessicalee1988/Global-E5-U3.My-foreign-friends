/**
 * MASTER_MEDIA — Authoritative, Fixed Learning Assets
 *
 * Implements the single immutable master media source for Grade 5 Unit 3.
 * Runtime mutation is strictly disabled.
 *
 * Expected Total:
 * - 12 Images (8 Vocab Flashcards, 2 Conversation, 2 Sentence Pattern Mindmaps)
 * - 10 Audio Files (8 Vocab Pronunciation, 2 Conversation Dialogues)
 */

export const MASTER_MEDIA: Readonly<Record<string, string>> = Object.freeze({
  // 8 Vocabulary Flashcard Images
  'Australian.png': '/assets/vocab/Australian.png',
  'Malaysian.png': '/assets/vocab/Malaysian.png',
  'American.png': '/assets/vocab/American.png',
  'Japanese.png': '/assets/vocab/Japanese.png',
  'friendly.png': '/assets/vocab/friendly.png',
  'helpful.png': '/assets/vocab/helpful.png',
  'clever.png': '/assets/vocab/clever.png',
  'active.png': '/assets/vocab/active.png',

  // 8 Vocabulary Audio Files
  'Australian.mp3': '/assets/audio/Australian.mp3',
  'Malaysian.mp3': '/assets/audio/Malaysian.mp3',
  'American.mp3': '/assets/audio/American.mp3',
  'Japanese.mp3': '/assets/audio/Japanese.mp3',
  'friendly.mp3': '/assets/audio/friendly.mp3',
  'helpful.mp3': '/assets/audio/helpful.mp3',
  'clever.mp3': '/assets/audio/clever.mp3',
  'active.mp3': '/assets/audio/active.mp3',

  // 2 Conversation Images
  'Lesson 1.png': '/assets/conversation/Lesson 1.png',
  'Lesson 2.png': '/assets/conversation/Lesson 2.png',

  // 2 Conversation Audio Files
  'dialogue 1.mp3': '/assets/conversation/dialogue 1.mp3',
  'dialogue 2.mp3': '/assets/conversation/dialogue 2.mp3',

  // 2 Sentence Pattern Mindmaps
  'pattern1_nationality.png': '/assets/grammar/pattern1_nationality.png',
  'pattern2_personality.png': '/assets/grammar/pattern2_personality.png',
});

/**
 * Resolves effective media asset from MASTER_MEDIA.
 * Resolution formula: effectiveAsset = MASTER_MEDIA[assetId]
 */
export function getMasterAssetUrl(assetId: string): string | null {
  if (!assetId) return null;
  const clean = assetId.trim();

  // Direct exact match
  if (MASTER_MEDIA[clean]) {
    return MASTER_MEDIA[clean];
  }

  // Case-insensitive match & known canonical aliases
  const lower = clean.toLowerCase();
  for (const [key, path] of Object.entries(MASTER_MEDIA)) {
    if (key.toLowerCase() === lower) {
      return path;
    }
  }

  if (
    lower === 'pattern1_mindmap.png' ||
    lower === 'model 1.png' ||
    lower === 'model1.png'
  ) {
    return MASTER_MEDIA['pattern1_nationality.png'];
  }

  if (
    lower === 'pattern2_mindmap.png' ||
    lower === 'model 2.png' ||
    lower === 'model2.png'
  ) {
    return MASTER_MEDIA['pattern2_personality.png'];
  }

  return null;
}
