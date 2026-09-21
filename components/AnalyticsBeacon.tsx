'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const SESSION_KEY = 'bv_sid';
const UTM_STORAGE_KEY = 'bv_utm';
const SEARCH_INTENT_KEY = 'bv_search_intent';

interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

export interface SearchIntentData {
  search_engine?: string;
  search_intent_cluster?: 'data_centers' | 'bms_automation' | 'low_current' | 'pif_prequalification' | 'general_mep';
  search_query?: string;
  landing_path?: string;
  entry_timestamp?: string;
}

/**
 * Retrieves the existing anonymous session ID from sessionStorage or generates a new one.
 * Complies 100% with Saudi PDPL (cookieless, ephemeral, non-PII).
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = window.sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `bv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      window.sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `bv_ephemeral_${Date.now()}`;
  }
}

/**
 * Retrieves preserved UTM parameters from sessionStorage.
 */
export function getStoredUtm(): UtmData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}

/**
 * Retrieves preserved organic search intent data from sessionStorage.
 */
export function getStoredSearchIntent(): SearchIntentData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(SEARCH_INTENT_KEY);
    return raw ? (JSON.parse(raw) as SearchIntentData) : {};
  } catch {
    return {};
  }
}

/**
 * Saves active UTM parameters into sessionStorage to preserve campaign attribution
 * across subsequent page navigations and conversion actions.
 */
export function storeUtm(utm: UtmData): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredUtm();
    const updated = { ...existing, ...utm };
    if (Object.values(updated).some(Boolean)) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {
    // Ignore sessionStorage quota / privacy mode exceptions
  }
}

/**
 * Saves organic search intent attribution into sessionStorage.
 */
export function storeSearchIntent(intent: SearchIntentData): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredSearchIntent();
    const updated = { ...existing, ...intent };
    window.sessionStorage.setItem(SEARCH_INTENT_KEY, JSON.stringify(updated));
  } catch {
    // Ignore sessionStorage exceptions
  }
}

/**
 * Detects whether the visitor arrived from an organic search engine (Google, Bing, Yahoo, etc.)
 * and maps the landing path to high-intent B2B contracting clusters.
 */
export function detectSearchIntent(
  referrerUrl: string,
  pathname: string,
  searchParams?: URLSearchParams | null
): SearchIntentData | null {
  if (!referrerUrl) return null;

  try {
    const ref = referrerUrl.toLowerCase();
    let engine: string | null = null;

    if (ref.includes('google.com.sa')) engine = 'google_sa';
    else if (ref.includes('google.')) engine = 'google';
    else if (ref.includes('bing.com')) engine = 'bing';
    else if (ref.includes('yahoo.com')) engine = 'yahoo';
    else if (ref.includes('duckduckgo.com')) engine = 'duckduckgo';
    else if (ref.includes('yandex.')) engine = 'yandex';

    if (!engine) return null;

    // Check for query keyword in searchParams or referrer
    let query = searchParams?.get('utm_term') || searchParams?.get('q') || '';
    if (!query && ref.includes('q=')) {
      try {
        const u = new URL(referrerUrl);
        query = u.searchParams.get('q') || '';
      } catch {
        // url parse exception
      }
    }

    // Determine Intent Cluster based on landing pathname
    const p = pathname.toLowerCase();
    let cluster: SearchIntentData['search_intent_cluster'] = 'general_mep';

    if (p.includes('data-center') || p.includes('datacenter')) {
      cluster = 'data_centers';
    } else if (p.includes('bms') || p.includes('automation') || p.includes('control')) {
      cluster = 'bms_automation';
    } else if (p.includes('low-current') || p.includes('light-current') || p.includes('cctv') || p.includes('fire')) {
      cluster = 'low_current';
    } else if (p.includes('project') || p.includes('lead-magnet') || p.includes('pre-qualification') || p.includes('profile')) {
      cluster = 'pif_prequalification';
    }

    return {
      search_engine: engine,
      search_intent_cluster: cluster,
      search_query: query ? query.slice(0, 100) : undefined,
      landing_path: pathname,
      entry_timestamp: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Universal telemetry event dispatcher. Can be invoked from any client component.
 */
export function trackEvent(eventType: string, metadata?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const sessionId = getOrCreateSessionId();
  const utm = getStoredUtm();
  const searchIntent = getStoredSearchIntent();
  const path = window.location.pathname;
  const locale = path.startsWith('/en') ? 'en' : 'ar';

  const payload = {
    session_id: sessionId,
    event_type: eventType,
    path,
    locale,
    referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    search_engine: searchIntent.search_engine,
    search_intent_cluster: searchIntent.search_intent_cluster,
    search_query: searchIntent.search_query,
    metadata: {
      ...(metadata || {}),
      ...(searchIntent.search_engine && {
        search_engine: searchIntent.search_engine,
        search_intent_cluster: searchIntent.search_intent_cluster,
        search_query: searchIntent.search_query,
      }),
    },
  };

  const payloadString = JSON.stringify(payload);

  // Use sendBeacon if available for non-blocking transport
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([payloadString], { type: 'application/json' });
    const success = navigator.sendBeacon('/api/analytics/track', blob);
    if (success) return;
  }

  // Fallback to fetch with keepalive: true
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payloadString,
    keepalive: true,
  }).catch(() => {
    // Fail silently to safeguard user experience
  });
}

/**
 * Internal Telemetry Core: Tracks page views, dwell duration, and delegated click events.
 */
export default function AnalyticsBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageStartTimeRef = useRef<number>(Date.now());
  const currentPathRef = useRef<string>(pathname);

  // 1. Organic Search Intent & UTM Detection & Retention
  useEffect(() => {
    // Check search engine referrer on landing
    if (typeof document !== 'undefined' && document.referrer) {
      const detected = detectSearchIntent(document.referrer, pathname, searchParams);
      if (detected) {
        storeSearchIntent(detected);
      }
    }

    if (!searchParams) return;

    const source = searchParams.get('utm_source');
    const medium = searchParams.get('utm_medium');
    const campaign = searchParams.get('utm_campaign');
    const content = searchParams.get('utm_content');

    if (source || medium || campaign || content) {
      const newUtm: UtmData = {};
      if (source) newUtm.utm_source = source;
      if (medium) newUtm.utm_medium = medium;
      if (campaign) newUtm.utm_campaign = campaign;
      if (content) newUtm.utm_content = content;
      storeUtm(newUtm);
    }
  }, [pathname, searchParams]);

  // 2. Page View & Dwell Duration Tracking
  useEffect(() => {
    const now = Date.now();
    const previousPath = currentPathRef.current;
    const previousDuration = Math.round((now - pageStartTimeRef.current) / 1000);

    // If path changed and previous duration was meaningful (> 1s), record duration
    if (previousPath && previousPath !== pathname && previousDuration > 1) {
      const sessionId = getOrCreateSessionId();
      const utm = getStoredUtm();
      const locale = previousPath.startsWith('/en') ? 'en' : 'ar';

      const durationPayload = JSON.stringify({
        session_id: sessionId,
        event_type: 'page_duration',
        path: previousPath,
        locale,
        duration_seconds: previousDuration,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/analytics/track', new Blob([durationPayload], { type: 'application/json' }));
      }
    }

    // Reset timer and path ref
    pageStartTimeRef.current = Date.now();
    currentPathRef.current = pathname;

    // Send page_view event for current route
    trackEvent('page_view');
  }, [pathname]);

  // 3. Page Unload / Visibility Change Duration Telemetry
  useEffect(() => {
    const sendFinalDuration = () => {
      const duration = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      if (duration < 1) return;

      const sessionId = getOrCreateSessionId();
      const utm = getStoredUtm();
      const path = currentPathRef.current;
      const locale = path.startsWith('/en') ? 'en' : 'ar';

      const payload = JSON.stringify({
        session_id: sessionId,
        event_type: 'page_duration',
        path,
        locale,
        duration_seconds: duration,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/analytics/track', new Blob([payload], { type: 'application/json' }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendFinalDuration();
      }
    };

    window.addEventListener('beforeunload', sendFinalDuration);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', sendFinalDuration);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 4. Global Event Delegation for Key Conversions (WhatsApp, Phone, Careers)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest anchor tag
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';

      // Check WhatsApp links
      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        trackEvent('whatsapp_click', {
          destination: href,
          label: anchor.innerText?.trim() || anchor.getAttribute('aria-label') || 'whatsapp',
        });
        return;
      }

      // Check Phone links
      if (href.startsWith('tel:')) {
        trackEvent('phone_click', {
          phone_number: href.replace('tel:', ''),
          label: anchor.innerText?.trim() || 'phone',
        });
        return;
      }

      // Check Careers links
      if (href.includes('/careers') || href.includes('careers@')) {
        trackEvent('careers_click', {
          destination: href,
          label: anchor.innerText?.trim() || 'careers',
        });
        return;
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  return null; // Headless component
}
