/**
 * Pronunciation Progress Service
 * Stores session-level best scores for each of the 8 target Unit 3 words.
 *
 * Formative, child-friendly evaluation:
 * - Only retains the BEST score (does not downgrade on lower retries).
 * - Kept separate from academic practice scores.
 */

export const TARGET_PRONUNCIATION_WORDS = [
  'Australian',
  'Malaysian',
  'American',
  'Japanese',
  'friendly',
  'helpful',
  'clever',
  'active',
] as const;

export type TargetPronunciationWord = (typeof TARGET_PRONUNCIATION_WORDS)[number];

const STORAGE_KEY = 'unit3_pronunciation_best_scores_v1';

class PronunciationProgressService {
  private bestScores: Record<string, number | null> = {};
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initScores();
  }

  private initScores() {
    // Initialize all 8 words to null
    TARGET_PRONUNCIATION_WORDS.forEach((word) => {
      this.bestScores[word] = null;
    });

    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          TARGET_PRONUNCIATION_WORDS.forEach((word) => {
            if (typeof parsed[word] === 'number') {
              this.bestScores[word] = parsed[word];
            }
          });
        }
      } catch (e) {
        console.warn('Could not load pronunciation scores from session storage:', e);
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.bestScores));
      } catch (e) {
        console.warn('Could not persist pronunciation scores:', e);
      }
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Error in pronunciation progress listener:', e);
      }
    });
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getBestScores(): Record<string, number | null> {
    return { ...this.bestScores };
  }

  public getBestScore(word: string): number | null {
    return this.bestScores[word] ?? null;
  }

  public saveScore(
    word: string,
    newScore: number
  ): { isNewBest: boolean; previousBest: number | null; newBest: number } {
    const previousBest = this.bestScores[word] ?? null;
    let isNewBest = false;
    let newBest = newScore;

    if (previousBest === null || newScore > previousBest) {
      this.bestScores[word] = newScore;
      isNewBest = true;
      newBest = newScore;
      this.persist();
    } else {
      newBest = previousBest;
    }

    return {
      isNewBest,
      previousBest,
      newBest,
    };
  }

  public getPractisedCount(): number {
    return TARGET_PRONUNCIATION_WORDS.filter((w) => this.bestScores[w] !== null).length;
  }

  public getAverageBestScore(): number | null {
    const scores = TARGET_PRONUNCIATION_WORDS.map((w) => this.bestScores[w]).filter(
      (s): s is number => typeof s === 'number'
    );
    if (scores.length === 0) return null;
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / scores.length);
  }

  public resetSession() {
    TARGET_PRONUNCIATION_WORDS.forEach((word) => {
      this.bestScores[word] = null;
    });
    this.persist();
  }
}

export const pronunciationProgress = new PronunciationProgressService();
