import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { Role } from './lib/admin-roles';

/**
 * ══ Global Maintenance Mode Switch ═════════════════════════
 * When set to `true`, ALL incoming traffic (public pages,
 * localized routes, and admin dashboard pages) is intercepted
 * and served the dedicated 404 / Maintenance page.
 *
 * Set to `false` to restore normal production platform operation.
 */
export const MAINTENANCE_MODE = false;

const handleI18n = createIntlMiddleware(routing);

/* ─── Domain guard ───────────────────────────────────────────
   Visitors landing on the wrong (typo-squatted) domains get
   redirected to the official site before anything renders.    */
const WRONG_DOMAINS = new Set(['betavoltt.com', 'www.betavoltt.com', 'wwbetavoltt.com']);
const OFFICIAL_DOMAIN = 'https://www.betavolt.com.sa';

/* ─── Route permission rules ───────────────────────────────
   Prefixes use the /admin/... form.
   API routes strip the leading /api before matching.
   Order matters: most specific first.                       */
const ROUTE_RULES: Array<{ prefix: string; allow: Role[] }> = [
  { prefix: '/admin/users',     allow: ['super_admin'] },
  { prefix: '/admin/content',   allow: ['super_admin', 'content_manager'] },
  { prefix: '/admin/inquiries', allow: ['super_admin', 'sales'] },
];

/** Returns true when `role` is allowed to access `pathname`. */
function isAllowed(pathname: string, role: Role): boolean {
  // Normalize API paths → /admin/... so rules apply uniformly
  const normalized = pathname.startsWith('/api/admin')
    ? pathname.slice('/api'.length)
    : pathname;

  for (const rule of ROUTE_RULES) {
    if (normalized.startsWith(rule.prefix)) {
      return (rule.allow as string[]).includes(role);
    }
  }
  return true; // no matching rule → open to all authenticated users
}

/* ─── Middleware ─────────────────────────────────────────── */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ══ 0. Domain guard — runs before everything else ═════════ */
  if (WRONG_DOMAINS.has(request.nextUrl.hostname.toLowerCase())) {
    return NextResponse.redirect(OFFICIAL_DOMAIN, 308);
  }

  /* ══ 0.1 Static assets and internal paths passthrough ══════ */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/img') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  /* ══ Global Maintenance Mode Interceptor ═══════════════════
     Overrides ALL routes including admin dashboard & user pages */
  if (MAINTENANCE_MODE) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        {
          error: 'Platform Under Maintenance',
          code: '404_MAINTENANCE',
          message: 'The BetaVolt platform is currently undergoing scheduled maintenance and system upgrades.',
        },
        { status: 404 }
      );
    }

    if (pathname === '/maintenance') {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.rewrite(url);
  }

  /* ══ 1. Admin API routes — /api/admin/* ════════════════════
     These are completely separate from the page routes.
     Unauthenticated → 401 JSON.
     Wrong role      → 403 JSON.                              */
  if (pathname.startsWith('/api/admin')) {
    const res     = NextResponse.next();
    const supabase = buildClient(request, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = resolveRole(user);

    if (!isAllowed(pathname, role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return res;
  }

  /* ══ 2. Admin UI routes — /admin/* ═════════════════════════ */
  if (pathname.startsWith('/admin')) {
    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set('x-pathname', pathname);

    /* /admin/login — pass through, redirect if already authed */
    if (pathname === '/admin/login') {
      const res     = NextResponse.next({ request: { headers: forwardHeaders } });
      const supabase = buildClient(request, res);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) return redirect(request, '/admin');
      return res;
    }

    /* All other /admin/* pages — require valid session */
    const res     = NextResponse.next({ request: { headers: forwardHeaders } });
    const supabase = buildClient(request, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect(request, '/admin/login');

    const role = resolveRole(user);

    /* Role guard — redirect unauthorized users to the dashboard */
    if (!isAllowed(pathname, role)) {
      return redirect(request, '/admin');
    }

    /* Stamp the resolved role into a readable cookie so the
       client-side sidebar can read it synchronously without
       any additional network round-trip.                     */
    res.cookies.set('x-admin-role', role, {
      httpOnly: false,
      sameSite: 'strict',
      path:     '/admin',
      maxAge:   60 * 60 * 8, // 8 h — matches typical session lifetime
    });

    return res;
  }

  /* ══ 3. Public routes → next-intl locale routing ═══════════ */
  return handleI18n(request);
}

/* ─── Helpers ────────────────────────────────────────────── */

/** Read role from user_metadata. Falls back to 'super_admin' for
 *  accounts created before RBAC was introduced.                  */
function resolveRole(user: { user_metadata?: Record<string, unknown> }): Role {
  return ((user.user_metadata?.role as Role | undefined) ?? 'super_admin');
}

function redirect(request: NextRequest, to: string) {
  const url = request.nextUrl.clone();
  url.pathname = to;
  return NextResponse.redirect(url);
}

function buildClient(request: NextRequest, response: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTA2MjcsImV4cCI6MjA5NDI2NjYyN30.-TecalPes70OxpA18ut19i9bHd-mOx6jXEw6GDnp-ao';
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
}

/* ─── Matcher ────────────────────────────────────────────────
   Explicitly include /api/admin/* so API routes are guarded.
   Keep static exclusions intact.                              */
export const config = {
  matcher: [
    '/api/admin/:path*',
    '/((?!_next|_vercel|images|img|favicon\\.ico|.*\\..*).*)',
  ],
};
