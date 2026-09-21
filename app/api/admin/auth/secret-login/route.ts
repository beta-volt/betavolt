import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { verifySecretToken } from '@/lib/security/secret-vault';

// In-memory rate limiting for stealth trigger (sliding window: 5 attempts per 5 minutes per IP)
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) return false;
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string, success: boolean) {
  if (success) {
    rateLimitMap.delete(ip);
    return;
  }
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown-ip';

    if (isRateLimited(clientIp)) {
      console.warn(`[POST /api/admin/auth/secret-login] Rate limited client: ${clientIp}`);
      return NextResponse.json(
        { error: 'Security threshold reached. Please wait 5 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const pin = typeof body.pin === 'string' ? body.pin.trim() : '';

    if (!pin) {
      return NextResponse.json({ error: 'Key required.' }, { status: 400 });
    }

    // Validate candidate PIN via timing-safe HMAC-SHA256 signature verification
    if (!verifySecretToken(pin)) {
      recordAttempt(clientIp, false);
      console.warn(`[POST /api/admin/auth/secret-login] Cryptographic signature check failed from ${clientIp}`);
      return NextResponse.json(
        { error: 'Invalid authentication key.' },
        { status: 401 }
      );
    }

    // PIN is valid — clear rate limits
    recordAttempt(clientIp, true);

    const targetEmail = process.env.ADMIN_SECRET_EMAIL || 'admin@betavolt.com.sa';
    const targetPassword = process.env.ADMIN_SECRET_PASSWORD || 'BetaVolt@2026';

    const res = NextResponse.json({ success: true, redirect: '/admin' }, { status: 200 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTA2MjcsImV4cCI6MjA5NDI2NjYyN30.-TecalPes70OxpA18ut19i9bHd-mOx6jXEw6GDnp-ao';

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    });

    let authData = null;
    let authError = null;

    const emailAttempts = [targetEmail, targetEmail.endsWith('.sa') ? 'admin@betavolt.com' : 'admin@betavolt.com.sa'];
    for (const em of emailAttempts) {
      const resAttempt = await supabase.auth.signInWithPassword({
        email: em,
        password: targetPassword,
      });
      if (!resAttempt.error && resAttempt.data.user) {
        authData = resAttempt.data;
        authError = null;
        break;
      }
      authError = resAttempt.error;
    }

    if (!authData || !authData.user) {
      console.error(`[POST /api/admin/auth/secret-login] Supabase auth error:`, authError);
      return NextResponse.json(
        { error: 'Authentication engine unavailable. Please use standard login.' },
        { status: 500 }
      );
    }

    console.info(`[POST /api/admin/auth/secret-login] Stealth login granted for ${authData.user.email} from ${clientIp}`);

    return res;
  } catch (err) {
    console.error('[POST /api/admin/auth/secret-login] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
  }
}
