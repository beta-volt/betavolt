import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = String(body.email || '').trim();
    const rawPassword = String(body.password || '');
    const cleanPassword = rawPassword.trim();

    if (!rawEmail || !cleanPassword) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const res = NextResponse.json({ success: true }, { status: 200 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTA2MjcsImV4cCI6MjA5NDI2NjYyN30.-TecalPes70OxpA18ut19i9bHd-mOx6jXEw6GDnp-ao';

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

    // Candidates to attempt: exact email + trimmed password, exact email + raw password, and dual-domain fallback
    const emailLower = rawEmail.toLowerCase();
    const emailCandidates = [emailLower];
    if (emailLower === 'admin@betavolt.com') {
      emailCandidates.push('admin@betavolt.com.sa');
    } else if (emailLower === 'admin@betavolt.com.sa') {
      emailCandidates.push('admin@betavolt.com');
    }

    const passwordCandidates = [cleanPassword];
    if (rawPassword !== cleanPassword && rawPassword.length > 0) {
      passwordCandidates.push(rawPassword);
    }

    let authData = null;
    let authError = null;

    for (const em of emailCandidates) {
      for (const pw of passwordCandidates) {
        const { data, error } = await supabase.auth.signInWithPassword({ email: em, password: pw });
        if (!error && data.user) {
          authData = data;
          authError = null;
          break;
        }
        authError = error;
      }
      if (authData) break;
    }

    if (!authData || authError) {
      console.warn(`[POST /api/admin/auth/login] Auth failed for "${rawEmail}": ${authError?.message}`);
      return NextResponse.json(
        { error: authError?.message || 'Invalid credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    console.info(`[POST /api/admin/auth/login] Successfully authenticated: ${authData.user.email} (UID: ${authData.user.id})`);

    return res;
  } catch (err) {
    console.error('[POST /api/admin/auth/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
