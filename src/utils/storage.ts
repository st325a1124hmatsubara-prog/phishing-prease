import { Difficulty, GameStats, EmailAuditRecord, DaySummary, Verdict } from '../types/game';
import { clampInt, computeIntegrityDigest, safeJsonParse } from './security';

const STORAGE_KEY = 'phishing_please_state_v2';
const AUDIT_KEY = 'phishing_please_audits_v2';
const LEGACY_STORAGE_KEY = 'phishing_please_state_v1';
const LEGACY_AUDIT_KEY = 'phishing_please_audits_v1';

interface SignedEnvelope<T> {
  v: 2;
  payload: T;
  sig: string;
}

export const INITIAL_GAME_STATS: GameStats = {
  totalReviewed: 0,
  totalCorrect: 0,
  totalThreatsBlocked: 0,
  totalFalseNegatives: 0,
  totalFalsePositives: 0,
  currentStreak: 0,
  bestStreak: 0,
  salary: 50000, // Initial starting salary (JPY)
  companySecurityRating: 100, // Initial company health 100%
  currentDay: 1,
  difficulty: 'NORMAL',
  unlockedManualTopics: ['display-name-spoof', 'typosquatting'],
  history: []
};

const VALID_DIFFICULTIES: readonly Difficulty[] = ['EASY', 'NORMAL', 'HARD'];
const VALID_VERDICTS: readonly Verdict[] = ['SAFE', 'THREAT'];

function sanitizeDaySummary(raw: unknown): DaySummary | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const difficulty = VALID_DIFFICULTIES.includes(obj.difficulty as Difficulty)
    ? (obj.difficulty as Difficulty)
    : 'NORMAL';

  return {
    day: clampInt(obj.day, 1, 9999, 1),
    difficulty,
    totalReviewed: clampInt(obj.totalReviewed, 0, 1000, 0),
    correctCount: clampInt(obj.correctCount, 0, 1000, 0),
    incorrectCount: clampInt(obj.incorrectCount, 0, 1000, 0),
    accuracyRate: clampInt(obj.accuracyRate, 0, 100, 0),
    threatsBlocked: clampInt(obj.threatsBlocked, 0, 1000, 0),
    threatsPassed: clampInt(obj.threatsPassed, 0, 1000, 0),
    safeBlocked: clampInt(obj.safeBlocked, 0, 1000, 0),
    daySalary: clampInt(obj.daySalary, 0, 100_000_000, 0),
    securityChange: clampInt(obj.securityChange, -1000, 1000, 0),
    finalSecurityRating: clampInt(obj.finalSecurityRating, 0, 100, 0),
    learnedPoints: Array.isArray(obj.learnedPoints)
      ? obj.learnedPoints.filter((p): p is string => typeof p === 'string').slice(0, 20)
      : [],
    ...(typeof obj.isTimeout === 'boolean' ? { isTimeout: obj.isTimeout } : {}),
    ...(typeof obj.unreviewedCount === 'number'
      ? { unreviewedCount: clampInt(obj.unreviewedCount, 0, 100, 0) }
      : {}),
    ...(typeof obj.unreviewedPenalty === 'number'
      ? { unreviewedPenalty: clampInt(obj.unreviewedPenalty, -1000, 0, 0) }
      : {})
  };
}

function sanitizeGameStats(raw: unknown): GameStats {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return INITIAL_GAME_STATS;
  }
  const obj = raw as Record<string, unknown>;

  const difficulty: Difficulty = VALID_DIFFICULTIES.includes(obj.difficulty as Difficulty)
    ? (obj.difficulty as Difficulty)
    : INITIAL_GAME_STATS.difficulty;

  const unlockedManualTopics = Array.isArray(obj.unlockedManualTopics)
    ? Array.from(
        new Set(
          obj.unlockedManualTopics
            .filter((t): t is string => typeof t === 'string' && /^[a-z0-9-]+$/i.test(t))
            .slice(0, 50)
        )
      )
    : INITIAL_GAME_STATS.unlockedManualTopics;

  const history = Array.isArray(obj.history)
    ? obj.history
        .map(sanitizeDaySummary)
        .filter((item): item is DaySummary => item !== null)
        .slice(0, 365)
    : [];

  return {
    totalReviewed: clampInt(obj.totalReviewed, 0, 100_000, 0),
    totalCorrect: clampInt(obj.totalCorrect, 0, 100_000, 0),
    totalThreatsBlocked: clampInt(obj.totalThreatsBlocked, 0, 100_000, 0),
    totalFalseNegatives: clampInt(obj.totalFalseNegatives, 0, 100_000, 0),
    totalFalsePositives: clampInt(obj.totalFalsePositives, 0, 100_000, 0),
    currentStreak: clampInt(obj.currentStreak, 0, 100_000, 0),
    bestStreak: clampInt(obj.bestStreak, 0, 100_000, 0),
    salary: clampInt(obj.salary, 0, 1_000_000_000, INITIAL_GAME_STATS.salary),
    companySecurityRating: clampInt(obj.companySecurityRating, 0, 100, INITIAL_GAME_STATS.companySecurityRating),
    currentDay: clampInt(obj.currentDay, 1, 9999, INITIAL_GAME_STATS.currentDay),
    difficulty,
    unlockedManualTopics,
    history
  };
}

function sanitizeAuditRecords(raw: unknown): Record<string, EmailAuditRecord> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  const clean: Record<string, EmailAuditRecord> = {};
  const entries = Object.entries(raw as Record<string, unknown>);

  for (const [key, val] of entries) {
    // Reject prototype-polluting or invalid keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (!/^[a-z0-9_-]{1,64}$/i.test(key)) continue;
    if (!val || typeof val !== 'object' || Array.isArray(val)) continue;

    const rec = val as Record<string, unknown>;
    if (
      typeof rec.emailId !== 'string' ||
      !VALID_VERDICTS.includes(rec.playerVerdict as Verdict) ||
      !VALID_VERDICTS.includes(rec.actualVerdict as Verdict) ||
      typeof rec.isCorrect !== 'boolean'
    ) {
      continue;
    }

    clean[key] = {
      emailId: rec.emailId.slice(0, 64),
      day: clampInt(rec.day, 1, 9999, 1),
      playerVerdict: rec.playerVerdict as Verdict,
      actualVerdict: rec.actualVerdict as Verdict,
      isCorrect: rec.isCorrect,
      inspectedCount: clampInt(rec.inspectedCount, 0, 100, 0),
      earnedSalary: clampInt(rec.earnedSalary, -10_000_000, 10_000_000, 0),
      securityImpact: clampInt(rec.securityImpact, -100, 100, 0),
      timestamp: typeof rec.timestamp === 'string' ? rec.timestamp.slice(0, 40) : ''
    };
  }
  return clean;
}

function unwrapSignedEnvelope<T>(raw: string | null): T | null {
  if (!raw) return null;
  const parsed = safeJsonParse<SignedEnvelope<T>>(raw);
  if (!parsed || typeof parsed !== 'object' || parsed.v !== 2 || typeof parsed.sig !== 'string') {
    return null;
  }
  const expectedSig = computeIntegrityDigest(JSON.stringify(parsed.payload));
  if (parsed.sig !== expectedSig) {
    console.warn('[SOC Security] Storage integrity check failed. Tampered or corrupted state rejected.');
    return null;
  }
  return parsed.payload;
}

function wrapSignedEnvelope<T>(payload: T): string {
  const serializedPayload = JSON.stringify(payload);
  const envelope: SignedEnvelope<T> = {
    v: 2,
    payload,
    sig: computeIntegrityDigest(serializedPayload)
  };
  return JSON.stringify(envelope);
}

export function loadGameStats(): GameStats {
  if (typeof window === 'undefined') return INITIAL_GAME_STATS;
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const verified = unwrapSignedEnvelope<unknown>(rawV2);
      if (!verified) {
        localStorage.removeItem(STORAGE_KEY);
        return INITIAL_GAME_STATS;
      }
      return sanitizeGameStats(verified);
    }

    // One-time safe migration from legacy v1 storage
    const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawV1) {
      const parsedV1 = safeJsonParse<unknown>(rawV1);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (parsedV1) {
        const sanitized = sanitizeGameStats(parsedV1);
        saveGameStats(sanitized);
        return sanitized;
      }
    }

    return INITIAL_GAME_STATS;
  } catch (e) {
    console.error('Failed to load game stats from storage', e);
    return INITIAL_GAME_STATS;
  }
}

export function saveGameStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizeGameStats(stats);
    localStorage.setItem(STORAGE_KEY, wrapSignedEnvelope(sanitized));
  } catch (e) {
    console.error('Failed to save game stats to storage', e);
  }
}

export function loadAuditRecords(): Record<string, EmailAuditRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const rawV2 = localStorage.getItem(AUDIT_KEY);
    if (rawV2) {
      const verified = unwrapSignedEnvelope<unknown>(rawV2);
      if (!verified) {
        localStorage.removeItem(AUDIT_KEY);
        return {};
      }
      return sanitizeAuditRecords(verified);
    }

    // One-time safe migration from legacy v1 storage
    const rawV1 = localStorage.getItem(LEGACY_AUDIT_KEY);
    if (rawV1) {
      const parsedV1 = safeJsonParse<unknown>(rawV1);
      localStorage.removeItem(LEGACY_AUDIT_KEY);
      if (parsedV1) {
        const sanitized = sanitizeAuditRecords(parsedV1);
        saveAuditRecords(sanitized);
        return sanitized;
      }
    }

    return {};
  } catch {
    return {};
  }
}

export function saveAuditRecords(records: Record<string, EmailAuditRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizeAuditRecords(records);
    localStorage.setItem(AUDIT_KEY, wrapSignedEnvelope(sanitized));
  } catch (e) {
    console.error('Failed to save audits', e);
  }
}

export function resetGameStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(AUDIT_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.removeItem(LEGACY_AUDIT_KEY);
}
