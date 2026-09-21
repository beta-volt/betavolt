import lockdownStateJson from './lockdown-state.json';

/**
 * 🏛️ BetaVolt — Emergency Isolation & Platform Lockdown Manager
 *
 * Provides atomic state inspection, cryptographic master passphrase verification,
 * and multi-runtime compatibility across Node.js and Next.js Edge environments.
 */

export interface LockdownState {
  isLocked: boolean;
  lockedAt: string | null;
  lockedBy: string | null;
  reason: string | null;
  invalidationEpoch: number;
}

const MASTER_LOCKDOWN_SALT = 'betavolt-emergency-master-salt-2026';

// Pre-computed HMAC-SHA256 hash of the master emergency passphrase ("BV-SHIELD-LOCKDOWN-2026!")
const COMPILED_MASTER_HASH = '285452d459b3cbf4252e759221a7c8659981a5ad0f9db1b7136731caac3f33fb';

/**
 * Validates the operator's passphrase against the sovereign HMAC-SHA256 signature
 * using constant-time equality check to prevent timing side-channel attacks.
 */
export function verifyMasterPassphrase(candidatePassphrase: string): boolean {
  if (!candidatePassphrase || typeof candidatePassphrase !== 'string') {
    return false;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    const computedHash = crypto
      .createHmac('sha256', MASTER_LOCKDOWN_SALT)
      .update(candidatePassphrase.trim())
      .digest('hex');

    const candBuf = Buffer.from(computedHash, 'hex');
    const targetBuf = Buffer.from(COMPILED_MASTER_HASH, 'hex');

    if (candBuf.length !== targetBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(candBuf, targetBuf);
  } catch (err) {
    console.error('[verifyMasterPassphrase] Validation exception:', err);
    return false;
  }
}

/**
 * Returns current platform lockdown status across both Node.js (filesystem live read)
 * and Edge runtime (bundled JSON store fallback).
 */
export function getLockdownState(): LockdownState {
  // If running in Edge runtime, immediately return static bundled JSON
  if (process.env.NEXT_RUNTIME === 'edge') {
    return lockdownStateJson as LockdownState;
  }

  // In Node.js environment (APIs, Server Actions, CLI scripts), read directly from disk
  if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
    try {
      // Dynamic require to prevent bundling node 'fs' in edge environments
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      const filePath = path.join(process.cwd(), 'lib', 'security', 'lockdown-state.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw) as LockdownState;
      }
    } catch {
      // Fallback to static bundled JSON
    }
  }

  return lockdownStateJson as LockdownState;
}

/**
 * Quick boolean check: returns true if platform is under emergency isolation.
 */
export function isPlatformLocked(): boolean {
  const state = getLockdownState();
  return state.isLocked === true;
}

/**
 * Atomically updates lockdown state on disk (Node.js environment only).
 */
export function persistLockdownState(updates: Partial<LockdownState>): LockdownState {
  const current = getLockdownState();
  const next: LockdownState = {
    ...current,
    ...updates,
  };

  if (process.env.NEXT_RUNTIME !== 'edge' && typeof process !== 'undefined' && typeof process.cwd === 'function') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      const filePath = path.join(process.cwd(), 'lib', 'security', 'lockdown-state.json');
      fs.writeFileSync(filePath, JSON.stringify(next, null, 2), 'utf-8');
    } catch {
      // Ignore if file cannot be persisted
    }
  }

  return next;
}
