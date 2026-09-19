#!/usr/bin/env node

/**
 * 🔓 BetaVolt Enterprise Emergency Recovery System — Platform Unlock Tool
 *
 * Sovereign Recovery Engine:
 * 1. Requires Master Passphrase authentication (Salted HMAC-SHA256).
 * 2. Clears platform isolation state (isLocked: false).
 * 3. Restores all mutating APIs and web traffic routing.
 * 4. Logs the restoration event to logs/incidents/.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MASTER_SALT = 'betavolt-emergency-master-salt-2026';
const COMPILED_MASTER_HASH = '285452d459b3cbf4252e759221a7c8659981a5ad0f9db1b7136731caac3f33fb';

function verifyPassphrase(passphrase) {
  if (!passphrase || typeof passphrase !== 'string') return false;
  const hash = crypto.createHmac('sha256', MASTER_SALT).update(passphrase.trim()).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(COMPILED_MASTER_HASH, 'hex'));
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log(' 🔓 BETAVOLT ENTERPRISE EMERGENCY RECOVERY SYSTEM (UNLOCK) 🔓');
  console.log('='.repeat(70) + '\n');

  // 1. Argument or Interactive Passphrase Check
  const args = process.argv.slice(2);
  let passphrase = '';
  const passArg = args.find((a) => a.startsWith('--passphrase='));
  if (passArg) {
    passphrase = passArg.split('=')[1];
  } else {
    passphrase = await prompt('🔑 Enter Master Emergency Passphrase: ');
  }

  if (!verifyPassphrase(passphrase)) {
    console.error('\n❌ ERROR: Invalid Master Passphrase. Recovery authorization rejected.');
    process.exit(1);
  }
  console.log('✅ Passphrase verified successfully.');

  // 2. Second-Factor Confirmation
  const hasForceFlag = args.includes('--force');
  if (!hasForceFlag) {
    const confirm = await prompt("⚠️  Type 'CONFIRM-UNLOCK' to restore public platform operations: ");
    if (confirm !== 'CONFIRM-UNLOCK') {
      console.log('🚫 Recovery aborted by operator. Platform remains under lockdown.\n');
      process.exit(0);
    }
  }

  console.log('\n[1/2] Logging recovery audit event...');
  const timestamp = new Date().toISOString();
  const operator = os.userInfo().username || 'system-operator';
  const hostname = os.hostname();

  const incidentsDir = path.join(ROOT_DIR, 'logs', 'incidents');
  if (!fs.existsSync(incidentsDir)) {
    fs.mkdirSync(incidentsDir, { recursive: true });
  }

  const recoveryId = `RECOVERY-${timestamp.replace(/[:.]/g, '-')}`;
  const recoveryPayload = {
    recoveryId,
    timestamp,
    action: 'EMERGENCY_LOCKDOWN_LIFTED',
    operator,
    hostname,
    sha256VerificationProof: crypto.createHash('sha256').update(timestamp + operator + hostname).digest('hex'),
  };

  const recoveryFilePath = path.join(incidentsDir, `${recoveryId}.json`);
  fs.writeFileSync(recoveryFilePath, JSON.stringify(recoveryPayload, null, 2), 'utf-8');
  console.log(`   -> Recovery log recorded: ${recoveryFilePath}`);

  // 3. Reset Platform Lockdown State
  console.log('[2/2] Resetting lockdown state and restoring services...');
  const statePath = path.join(ROOT_DIR, 'lib', 'security', 'lockdown-state.json');
  const restoredState = {
    isLocked: false,
    lockedAt: null,
    lockedBy: null,
    reason: null,
    invalidationEpoch: 0,
    lastRestoredAt: timestamp,
    restoredBy: `${operator}@${hostname}`,
  };
  fs.writeFileSync(statePath, JSON.stringify(restoredState, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(70));
  console.log(' ✅ PLATFORM SUCCESSFULLY RESTORED — LOCKDOWN LIFTED');
  console.log('='.repeat(70));
  console.log(`• Status:            OPERATIONAL (Online)`);
  console.log(`• Restored At:       ${timestamp}`);
  console.log(`• Operators Restored: ${operator}@${hostname}`);
  console.log(`• Public APIs:       ACTIVE (/api/* endpoints resumed)`);
  console.log(`• Web Pages:         NORMAL ROUTING RESUMED`);
  console.log('='.repeat(70) + '\n');
}

main().catch((err) => {
  console.error('\nFatal recovery error:', err);
  process.exit(1);
});
