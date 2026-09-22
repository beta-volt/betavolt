/**
 * SETUP INSTRUCTION:
 * ─────────────────────────────────────────────────────────────────────────────
 * Before using the admin dashboard, create the first admin user manually:
 *   1. Go to Supabase Studio → Authentication → Users → "Add User"
 *   2. Email: admin@betavolt.com.sa  (or your preferred email)
 *   3. Set a strong password and enable "Auto Confirm User"
 *   4. There is NO sign-up or password-reset flow in the app by design.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Cookie-based Supabase client for Server Actions, Route Handlers, and layouts. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTA2MjcsImV4cCI6MjA5NDI2NjYyN30.-TecalPes70OxpA18ut19i9bHd-mOx6jXEw6GDnp-ao';

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components are read-only — writes are a no-op here.
          }
        },
      },
    }
  );
}

/** Service-role client for privileged server-side operations (no auth required). */
export { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
