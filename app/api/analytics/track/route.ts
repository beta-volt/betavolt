import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side privileged Supabase client for analytics ingestion
function getAnalyticsDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY5MDYyNywiZXhwIjoyMDk0MjY2NjI3fQ.9uiexLgZd-3jvUl1XOi-KxD80Oonw1lTqsRY2kA99y0';
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

interface AnalyticsPayload {
  session_id?: string;
  event_type?: string;
  path?: string;
  locale?: string;
  duration_seconds?: number;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  search_engine?: string;
  search_intent_cluster?: string;
  search_query?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
    }

    const payload: AnalyticsPayload = JSON.parse(rawBody);

    if (!payload.session_id || !payload.event_type || !payload.path) {
      return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
    }

    // Extract Edge Geolocation Headers (Vercel Edge / Cloudflare fallbacks)
    const rawCountry =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      'SA';
    const rawCityHeader =
      request.headers.get('x-vercel-ip-city') ||
      request.headers.get('cf-ipcity') ||
      '';

    let city: string | null = null;
    try {
      city = rawCityHeader ? decodeURIComponent(rawCityHeader) : null;
    } catch {
      city = rawCityHeader || null;
    }

    const supabase = getAnalyticsDb();

    const { error } = await supabase.from('analytics_events').insert({
      session_id: payload.session_id,
      event_type: payload.event_type,
      path: payload.path,
      locale: payload.locale || 'ar',
      duration_seconds: Math.max(0, Math.floor(payload.duration_seconds || 0)),
      country: rawCountry,
      city: city || null,
      referrer: payload.referrer || null,
      utm_source: payload.utm_source || null,
      utm_medium: payload.utm_medium || null,
      utm_campaign: payload.utm_campaign || null,
      utm_content: payload.utm_content || null,
      metadata: {
        ...(payload.metadata || {}),
        ...(payload.search_engine && { search_engine: payload.search_engine }),
        ...(payload.search_intent_cluster && { search_intent_cluster: payload.search_intent_cluster }),
        ...(payload.search_query && { search_query: payload.search_query }),
      },
    });

    if (error) {
      // Non-blocking telemetry warning: table may not be created yet in dev/staging
      console.warn('[Analytics Ingest Warning]:', error.message);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // Fail-safe: Always return ok so client beacon never degrades UX
    console.error('[Analytics Ingest Error]:', err);
    return NextResponse.json({ ok: true, error: 'fail-safe' }, { status: 200 });
  }
}
