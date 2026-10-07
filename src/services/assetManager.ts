/**
 * Asset Manager for Unit 3 Learning Media
 *
 * Connects directly to persistent IndexedDB (Unit3TeacherAssetsDB)
 * to restore and serve the 12 PNGs and 10 Audio files.
 *
 * Expected Assets:
 * - 8 Vocabulary PNGs + 8 Vocabulary MP3s
 * - 2 Conversation PNGs (Lesson 1 & 2) + 2 Conversation MP3s (dialogue 1 & 2)
 * - 2 Sentence Pattern Mindmaps (pattern1 & pattern2)
 * Total: 12 PNG • 10 Audio
 */

import { vocabAudio } from '../data/unit3Data';

const DB_NAME = 'Unit3TeacherAssetsDB';
const DB_VERSION = 3;
const STORE_MEDIA_ASSETS = 'media_assets';
const STORE_OVERRIDES = 'teacher_media_overrides';

export interface AssetInfo {
  filename: string;
  type: 'image' | 'audio';
  category: 'Nationalities' | 'Personality' | 'Conversation' | 'Sentence Patterns';
  word: string;
  isAvailable: boolean;
  blobUrl?: string;
  fileSize?: number;
  lastModified?: number;
}

export const REQUIRED_ASSETS: {
  filename: string;
  type: 'image' | 'audio';
  word: string;
  category: 'Nationalities' | 'Personality' | 'Conversation' | 'Sentence Patterns';
}[] = [
  // 8 Vocabulary Images
  { filename: 'Australian.png', type: 'image', word: 'Australian', category: 'Nationalities' },
  { filename: 'Malaysian.png', type: 'image', word: 'Malaysian', category: 'Nationalities' },
  { filename: 'American.png', type: 'image', word: 'American', category: 'Nationalities' },
  { filename: 'Japanese.png', type: 'image', word: 'Japanese', category: 'Nationalities' },
  { filename: 'friendly.png', type: 'image', word: 'friendly', category: 'Personality' },
  { filename: 'helpful.png', type: 'image', word: 'helpful', category: 'Personality' },
  { filename: 'clever.png', type: 'image', word: 'clever', category: 'Personality' },
  { filename: 'active.png', type: 'image', word: 'active', category: 'Personality' },

  // 8 Vocabulary Audio
  { filename: 'Australian.mp3', type: 'audio', word: 'Australian', category: 'Nationalities' },
  { filename: 'Malaysian.mp3', type: 'audio', word: 'Malaysian', category: 'Nationalities' },
  { filename: 'American.mp3', type: 'audio', word: 'American', category: 'Nationalities' },
  { filename: 'Japanese.mp3', type: 'audio', word: 'Japanese', category: 'Nationalities' },
  { filename: 'friendly.mp3', type: 'audio', word: 'friendly', category: 'Personality' },
  { filename: 'helpful.mp3', type: 'audio', word: 'helpful', category: 'Personality' },
  { filename: 'clever.mp3', type: 'audio', word: 'clever', category: 'Personality' },
  { filename: 'active.mp3', type: 'audio', word: 'active', category: 'Personality' },

  // 2 Conversation Images
  { filename: 'Lesson 1.png', type: 'image', word: 'Conversation – Lesson 1', category: 'Conversation' },
  { filename: 'Lesson 2.png', type: 'image', word: 'Conversation – Lesson 2', category: 'Conversation' },

  // 2 Conversation Audio
  { filename: 'dialogue 1.mp3', type: 'audio', word: 'Conversation – Lesson 1', category: 'Conversation' },
  { filename: 'dialogue 2.mp3', type: 'audio', word: 'Conversation – Lesson 2', category: 'Conversation' },

  // 2 Sentence Pattern Mindmaps
  {
    filename: 'pattern1_nationality.png',
    type: 'image',
    word: 'Pattern 1 Mindmap (Quốc tịch)',
    category: 'Sentence Patterns',
  },
  {
    filename: 'pattern2_personality.png',
    type: 'image',
    word: 'Pattern 2 Mindmap (Tính cách)',
    category: 'Sentence Patterns',
  },
];

/**
 * Normalizes canonical filename for alias & case matching
 */
export function normalizeFilename(filename: string): string {
  if (!filename) return '';
  const isAudio = /\.(mp3|wav|ogg|m4a|aac|weba)$/i.test(filename);
  const clean = filename.trim().toLowerCase().replace(/[\s\-_]+/g, '');

  if (clean.includes('australian')) return isAudio ? 'australian.mp3' : 'australian.png';
  if (clean.includes('malaysian')) return isAudio ? 'malaysian.mp3' : 'malaysian.png';
  if (clean.includes('american')) return isAudio ? 'american.mp3' : 'american.png';
  if (clean.includes('japanese')) return isAudio ? 'japanese.mp3' : 'japanese.png';
  if (clean.includes('friendly')) return isAudio ? 'friendly.mp3' : 'friendly.png';
  if (clean.includes('helpful')) return isAudio ? 'helpful.mp3' : 'helpful.png';
  if (clean.includes('clever')) return isAudio ? 'clever.mp3' : 'clever.png';
  if (clean.includes('active')) return isAudio ? 'active.mp3' : 'active.png';

  if (clean.includes('lesson1') || clean.includes('dialogue1')) {
    return isAudio ? 'dialogue 1.mp3' : 'lesson 1.png';
  }
  if (clean.includes('lesson2') || clean.includes('dialogue2')) {
    return isAudio ? 'dialogue 2.mp3' : 'lesson 2.png';
  }

  if (clean.includes('pattern1') || clean.includes('model1') || clean.includes('nationality')) {
    return 'pattern1_nationality.png';
  }
  if (clean.includes('pattern2') || clean.includes('model2') || clean.includes('personality')) {
    return 'pattern2_personality.png';
  }

  return filename.trim().toLowerCase();
}

class AssetManagerService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private blobUrls: Map<string, string> = new Map();
  private listeners: Set<() => void> = new Set();
  private currentAudioElement: HTMLAudioElement | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_MEDIA_ASSETS)) {
          db.createObjectStore(STORE_MEDIA_ASSETS, { keyPath: 'filename' });
        }
        if (!db.objectStoreNames.contains(STORE_OVERRIDES)) {
          db.createObjectStore(STORE_OVERRIDES, { keyPath: 'id' });
        }
      };

      request.onsuccess = async () => {
        const db = request.result;
        await this.loadAllAssetsFromDB(db);
        this.isInitialized = true;
        this.notify();
        resolve(db);
      };

      request.onerror = () => {
        console.warn('Failed opening Unit3TeacherAssetsDB, falling back to static cache:', request.error);
        resolve(null);
      };
    });

    return this.dbPromise;
  }

  /**
   * Reads all stored assets from IndexedDB stores and creates object URLs
   */
  private async loadAllAssetsFromDB(db: IDBDatabase) {
    try {
      // 1. Read from STORE_MEDIA_ASSETS (primary teacher asset store)
      if (db.objectStoreNames.contains(STORE_MEDIA_ASSETS)) {
        await new Promise<void>((resolve) => {
          const tx = db.transaction(STORE_MEDIA_ASSETS, 'readonly');
          const store = tx.objectStore(STORE_MEDIA_ASSETS);
          const req = store.getAll();

          req.onsuccess = () => {
            const records = req.result || [];
            for (const item of records) {
              const filename = item.filename || item.name;
              const blob = item.blob || item.file;
              if (filename && blob instanceof Blob) {
                const norm = normalizeFilename(filename);
                const url = URL.createObjectURL(blob);
                this.blobUrls.set(norm, url);
              }
            }
            resolve();
          };

          req.onerror = () => resolve();
        });
      }

      // 2. Read from STORE_OVERRIDES (if any overrides exist)
      if (db.objectStoreNames.contains(STORE_OVERRIDES)) {
        await new Promise<void>((resolve) => {
          const tx = db.transaction(STORE_OVERRIDES, 'readonly');
          const store = tx.objectStore(STORE_OVERRIDES);
          const req = store.getAll();

          req.onsuccess = () => {
            const records = req.result || [];
            for (const item of records) {
              const filename = item.filename || (item.id ? item.id.split('::').pop() : '');
              const blob = item.blob || item.file;
              if (filename && blob instanceof Blob) {
                const norm = normalizeFilename(filename);
                if (!this.blobUrls.has(norm)) {
                  const url = URL.createObjectURL(blob);
                  this.blobUrls.set(norm, url);
                }
              }
            }
            resolve();
          };

          req.onerror = () => resolve();
        });
      }
    } catch (e) {
      console.warn('Error reading from IndexedDB:', e);
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error notifying asset listener:', err);
      }
    });
  }

  /**
   * Resolves the live asset URL.
   * Priority:
   * 1. IndexedDB Blob URL (from user's previous uploads)
   * 2. Canonical static path (/assets/...)
   * 3. Static audio dictionary in unit3Data
   */
  public getAssetUrl(filename: string): string | null {
    if (!filename) return null;
    const norm = normalizeFilename(filename);

    // 1. IndexedDB persistent Blob URL
    if (this.blobUrls.has(norm)) {
      return this.blobUrls.get(norm)!;
    }

    // 2. Static path fallback
    const rawLower = filename.trim().toLowerCase();
    if (rawLower.endsWith('.png')) {
      if (norm.includes('pattern1')) return '/assets/grammar/pattern1_nationality.png';
      if (norm.includes('pattern2')) return '/assets/grammar/pattern2_personality.png';
      if (norm.includes('lesson 1')) return '/assets/conversation/Lesson 1.png';
      if (norm.includes('lesson 2')) return '/assets/conversation/Lesson 2.png';
      return `/assets/vocab/${filename}`;
    }

    if (rawLower.endsWith('.mp3')) {
      if (norm.includes('dialogue 1')) return '/assets/conversation/dialogue 1.mp3';
      if (norm.includes('dialogue 2')) return '/assets/conversation/dialogue 2.mp3';
      const wordKey = filename.replace(/\.mp3$/i, '');
      const mappedStatic = (vocabAudio as Record<string, string>)[wordKey];
      if (mappedStatic) return mappedStatic;
      return `/assets/audio/${filename}`;
    }

    return null;
  }

  public hasAsset(filename: string): boolean {
    const norm = normalizeFilename(filename);
    return this.blobUrls.has(norm);
  }

  public hasAudioAsset(filename: string): boolean {
    const norm = normalizeFilename(filename);
    return this.blobUrls.has(norm);
  }

  /**
   * Returns complete status list for all 12 images & 10 audio files
   */
  public getAssetStatusList(): AssetInfo[] {
    return REQUIRED_ASSETS.map((item) => {
      const norm = normalizeFilename(item.filename);
      const hasBlob = this.blobUrls.has(norm);
      const url = this.getAssetUrl(item.filename);

      return {
        ...item,
        isAvailable: hasBlob,
        blobUrl: url || undefined,
      };
    });
  }

  /**
   * Runtime media write operations are strictly disabled.
   * All 22 learning assets (12 PNG + 10 Audio) are locked as immutable Master Media.
   */
  public async saveAsset(): Promise<string> {
    throw new Error('Master media is locked. Runtime asset modification is disabled.');
  }

  public async saveMultipleFiles(): Promise<number> {
    throw new Error('Master media is locked. Runtime asset modification is disabled.');
  }

  public async deleteSingleAsset(): Promise<void> {
    throw new Error('Master media is locked. Runtime asset modification is disabled.');
  }

  public async purgeAllMedia(): Promise<void> {
    throw new Error('Master media is locked. Runtime asset modification is disabled.');
  }

  private extractWordOrPhrase(filename: string): string {
    const clean = filename.trim().toLowerCase().replace(/[\s\-_]+/g, '');
    if (clean.includes('australian')) return 'Australian';
    if (clean.includes('malaysian')) return 'Malaysian';
    if (clean.includes('american')) return 'American';
    if (clean.includes('japanese')) return 'Japanese';
    if (clean.includes('friendly')) return 'friendly';
    if (clean.includes('helpful')) return 'helpful';
    if (clean.includes('clever')) return 'clever';
    if (clean.includes('active')) return 'active';
    if (clean.includes('dialogue1') || clean.includes('lesson1')) {
      return "Mum, I have a new foreign friend. Do you? Where's he from? He's from Australia. What nationality is he? He's Australian.";
    }
    if (clean.includes('dialogue2') || clean.includes('lesson2')) {
      return "What's she like? She's friendly and helpful. What's he like? He's clever and active.";
    }
    return filename.replace(/\.(mp3|wav|ogg)$/i, '');
  }

  private speakFallback(text: string, onEnded?: () => void): Promise<boolean> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnded) onEnded();
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.86; // natural tempo for Grade 5 learners

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('US') || v.name.includes('Samantha'))
        );
        if (enVoice) {
          utterance.voice = enVoice;
        }

        utterance.onend = () => {
          if (onEnded) onEnded();
          resolve(true);
        };
        utterance.onerror = () => {
          if (onEnded) onEnded();
          resolve(true); // Don't block flow on utterance error
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis fallback failed:', err);
        if (onEnded) onEnded();
        resolve(false);
      }
    });
  }

  /**
   * Audio Playback with graceful fallback
   */
  public async playAudio(
    filename: string,
    onEnded?: () => void
  ): Promise<boolean> {
    this.stopAudio();

    const audioUrl = this.getAssetUrl(filename);
    const textToSpeak = this.extractWordOrPhrase(filename);

    if (audioUrl) {
      const audioSuccess = await new Promise<boolean>((resolve) => {
        try {
          const audio = new Audio(audioUrl);
          this.currentAudioElement = audio;
          let hasFinished = false;

          audio.onended = () => {
            if (onEnded) onEnded();
            this.currentAudioElement = null;
            if (!hasFinished) {
              hasFinished = true;
              resolve(true);
            }
          };

          audio.onerror = () => {
            this.currentAudioElement = null;
            if (!hasFinished) {
              hasFinished = true;
              resolve(false);
            }
          };

          audio.play().catch(() => {
            this.currentAudioElement = null;
            if (!hasFinished) {
              hasFinished = true;
              resolve(false);
            }
          });
        } catch {
          this.currentAudioElement = null;
          resolve(false);
        }
      });

      if (audioSuccess) {
        return true;
      }
    }

    // Graceful fallback to speech synthesis so students always hear the pronunciation
    return this.speakFallback(textToSpeak, onEnded);
  }

  public stopAudio(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }
  }
}

export const assetManager = new AssetManagerService();
