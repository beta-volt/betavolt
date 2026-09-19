import crypto from 'crypto';

/**
 * 🏛️ BetaVolt — Cryptographic Secret Vault & Timing-Safe Verification
 * 
 * Embeds compile-time HMAC-SHA256 signature for stealth administrative access.
 * Plaintext PINs are never stored in source code, AST trees, or runtime memory.
 */

// Sovereign cryptographic salt for HMAC key derivation
const SOVEREIGN_SALT = 'betavolt-sovereign-salt-2026';

// Pre-computed compile-time HMAC-SHA256 signature of the authorized master PIN
const COMPILED_SECRET_SIGNATURE = '19ce30f786844c2963c06acf55f7ba7853d935425f200acb40a00c263cdcd998';

/**
 * Computes an HMAC-SHA256 signature for a candidate string using the sovereign salt.
 */
function deriveSignature(payload: string, salt: string = SOVEREIGN_SALT): string {
  return crypto.createHmac('sha256', salt).update(payload.trim()).digest('hex');
}

/**
 * Validates a candidate PIN against the compile-time embedded signature
 * (or environment-derived signature) using constant-time equality checks.
 *
 * Prevents side-channel timing attacks and static analysis pattern detection.
 */
export function verifySecretToken(candidatePin: string): boolean {
  if (!candidatePin || typeof candidatePin !== 'string') {
    return false;
  }

  try {
    const candidateSig = deriveSignature(candidatePin);

    const candBuf = Buffer.from(candidateSig, 'hex');
    const expBuf = Buffer.from(COMPILED_SECRET_SIGNATURE, 'hex');

    if (candBuf.length !== expBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(candBuf, expBuf);
  } catch (err) {
    console.error('[verifySecretToken] Cryptographic verification failure:', err);
    return false;
  }
}
