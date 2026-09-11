import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
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

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    return res;
  } catch (err) {
    console.error('[POST /api/admin/auth/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
