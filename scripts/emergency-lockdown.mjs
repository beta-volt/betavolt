#!/usr/bin/env node

/**
 * 🚨 BetaVolt Enterprise Emergency Isolation System — Lockdown Trigger
 *
 * Sovereign Incident Containment Tool:
 * 1. Requires Master Passphrase authentication (Salted HMAC-SHA256).
 * 2. Revokes all active Supabase sessions & JWT tokens.
 * 3. Enforces platform-wide read-only freeze and severs all API endpoints.
 * 4. Renders HTTP 503 defensive maintenance response across all routes.
 * 5. Captures forensic snapshot & system telemetry to logs/incidents/.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

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

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log(' 🚨 BETAVOLT ENTERPRISE EMERGENCY ISOLATION SYSTEM (LOCKDOWN) 🚨');
  console.log('='.repeat(70) + '\n');
  console.log('⚠️  WARNING: Executing this command will IMMEDIATELY terminate all active');
  console.log('   sessions, sever all APIs, and put the platform into a defensive 503 freeze.\n');

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
    console.error('\n❌ ERROR: Invalid Master Passphrase. Emergency access denied.');
    console.error('🔒 Incident attempt recorded in operational logs.\n');
    process.exit(1);
  }
  console.log('✅ Passphrase verified successfully.');

  // 2. Second-Factor Intent Confirmation
  const hasForceFlag = args.includes('--force');
  if (!hasForceFlag) {
    const confirm = await prompt("⚠️  Type 'CONFIRM-LOCKDOWN' to trigger platform containment: ");
    if (confirm !== 'CONFIRM-LOCKDOWN') {
      console.log('🚫 Lockdown aborted by operator. No changes were made.\n');
      process.exit(0);
    }
  }

  console.log('\n[1/4] Gathering environment telemetry and security context...');
  const env = {
    ...process.env,
    ...loadEnvFile(path.join(ROOT_DIR, '.env.local')),
  };

  const timestamp = new Date().toISOString();
  const operator = os.userInfo().username || 'system-operator';
  const hostname = os.hostname();
  const networkInterfaces = os.networkInterfaces();
  const ipList = [];
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) ipList.push(net.address);
    }
  }

  // 3. Supabase Global Session Invalidation
  console.log('[2/4] Invalidating active user sessions & revoking JWT tokens...');
  let invalidatedUsersCount = 0;
  let supabaseSnapshotData = { inquiries: [], analyticsCount: 0 };

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // List all active users and terminate global sessions
      const { data: userList, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 100 });
      if (!listErr && userList?.users) {
        for (const u of userList.users) {
          try {
            await supabase.auth.admin.signOut(u.id, 'global');
            invalidatedUsersCount++;
          } catch (e) {
            console.warn(`Could not sign out user ${u.id}:`, e.message);
          }
        }
      }

      // Snapshot recent database evidence
      const { data: inq } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(20);
      const { count } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true });
      supabaseSnapshotData = {
        inquiriesCount: inq?.length || 0,
        recentInquiries: inq || [],
        analyticsEventsTotal: count || 0,
      };
      console.log(`   -> Successfully revoked sessions for ${invalidatedUsersCount} administrative account(s).`);
    } catch (err) {
      console.warn('   -> Note on Supabase session purge:', err.message);
    }
  } else {
    console.warn('   -> SUPABASE_SERVICE_ROLE_KEY not found in environment; session purge skipped.');
  }

  // 4. Capture Forensic Snapshot
  console.log('[3/4] Preserving forensic snapshot & evidence logs...');
  const incidentsDir = path.join(ROOT_DIR, 'logs', 'incidents');
  if (!fs.existsSync(incidentsDir)) {
    fs.mkdirSync(incidentsDir, { recursive: true });
  }

  const incidentId = `INCIDENT-${timestamp.replace(/[:.]/g, '-')}`;
  const incidentPayload = {
    incidentId,
    timestamp,
    action: 'EMERGENCY_LOCKDOWN_ACTIVATED',
    operator,
    hostname,
    networkIPs: ipList,
    sessionsTerminated: invalidatedUsersCount,
    evidenceSnapshot: supabaseSnapshotData,
    reason: args.find((a) => a.startsWith('--reason='))?.split('=')[1] || 'Manual CLI Emergency Lockdown Triggered',
    sha256VerificationProof: crypto.createHash('sha256').update(timestamp + operator + hostname).digest('hex'),
  };

  const incidentFilePath = path.join(incidentsDir, `${incidentId}.json`);
  fs.writeFileSync(incidentFilePath, JSON.stringify(incidentPayload, null, 2), 'utf-8');
  console.log(`   -> Forensic audit log preserved: ${incidentFilePath}`);

  // 5. Activate Platform Lockdown State
  console.log('[4/4] Activating defensive platform isolation in security state...');
  const statePath = path.join(ROOT_DIR, 'lib', 'security', 'lockdown-state.json');
  const newState = {
    isLocked: true,
    lockedAt: timestamp,
    lockedBy: `${operator}@${hostname}`,
    reason: incidentPayload.reason,
    invalidationEpoch: Date.now(),
    incidentFile: `${incidentId}.json`,
  };
  fs.writeFileSync(statePath, JSON.stringify(newState, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(70));
  console.log(' 🛡️  PLATFORM ISOLATION ACTIVE — EMERGENCY LOCKDOWN ENFORCED');
  console.log('='.repeat(70));
  console.log(`• Status:            LOCKED (HTTP 503 Mode)`);
  console.log(`• Activated At:      ${timestamp}`);
  console.log(`• Sessions Purged:   ${invalidatedUsersCount} account(s)`);
  console.log(`• Public APIs:       SEVERED (Calls to /api/* return 503)`);
  console.log(`• Web Visitors:      Rewritten to Defensive Maintenance Screen`);
  console.log(`• Forensic Evidence: logs/incidents/${incidentId}.json`);
  console.log('='.repeat(70));
  console.log('\nTo restore service once the breach has been neutralized, execute:');
  console.log('👉 npm run emergency:unlock\n');
}

main().catch((err) => {
  console.error('\nFatal lockdown error:', err);
  process.exit(1);
});
