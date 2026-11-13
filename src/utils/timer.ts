import { Difficulty } from '../types/game';

/**
 * Returns the maximum time limit in seconds for a given difficulty and day.
 * - EASY: null (no time limit)
 * - NORMAL: 6 minutes (360s) base + 10s per next day (Day 2: 370s = 6m10s, Day 3: 380s = 6m20s)
 * - HARD: 3 minutes (180s) base + 10s per next day (Day 2: 190s = 3m10s, Day 3: 200s = 3m20s)
 */
export function getDayTimeLimit(difficulty: Difficulty, day: number): number | null {
  if (difficulty === 'EASY') return null;
  const bonusSeconds = Math.max(0, day - 1) * 10;
  if (difficulty === 'HARD') {
    return 180 + bonusSeconds; // 3 min + 10s per day after day 1
  }
  if (difficulty === 'NORMAL') {
    return 360 + bonusSeconds; // 6 min + 10s per day after day 1
  }
  return null;
}

/**
 * Formats seconds into MM:SS string (e.g., 05:42)
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Formats seconds into Japanese text (e.g., 6分10秒)
 */
export function formatTimeJapanese(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}秒`;
  if (secs === 0) return `${mins}分`;
  return `${mins}分${secs}秒`;
}
