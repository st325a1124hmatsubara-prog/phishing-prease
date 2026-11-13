/**
 * Client-side security utilities:
 * - Prototype-pollution-safe JSON parsing
 * - Deterministic integrity sealing for client storage
 * - Safe string/URL sanitization against injection & spoofing controls
 */

const INTEGRITY_SALT = 'PHISHING_PLEASE_SOC_V2_INTEGRITY_SEAL';

/**
 * Computes a deterministic 64-bit hex integrity digest (dual FNV-1a)
 * to detect casual/malicious tampering of persisted client state.
 */
export function computeIntegrityDigest(serializedPayload: string): string {
  const input = `${INTEGRITY_SALT}:${serializedPayload}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;

  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c + (i & 0xff);
    h2 = Math.imul(h2, 0x85ebca6b);
  }

  return `${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

/**
 * Prototype-pollution-safe JSON.parse wrapper.
 * Strips dangerous keys (__proto__, constructor, prototype) during parsing.
 */
export function safeJsonParse<T>(raw: string): T | null {
  try {
    const parsed = JSON.parse(raw, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined;
      }
      return value;
    });
    return parsed as T;
  } catch {
    return null;
  }
}

/**
 * Validates that a URL uses only http/https schemes and contains no script schemes.
 */
export function isSafeHttpUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Strips invisible bidirectional override / null-byte control characters
 * that could be used to spoof UI text or break rendering.
 */
export function sanitizeDisplayText(input: string, maxLength = 20000): string {
  if (typeof input !== 'string') return '';
  return input
    // Remove null bytes, non-printable C0 controls (preserve \n, \r, \t), and Bidi RLO/LRO overrides
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g, '')
    .slice(0, maxLength);
}

/**
 * Clamps a numeric value to an integer within [min, max].
 */
export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}
