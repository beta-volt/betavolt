'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const SESSION_KEY = 'bv_sid';
const UTM_STORAGE_KEY = 'bv_utm';

interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
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
 * Saves active UTM parameters into sessionStorage to preserve campaign attribution
 * across subsequent page navigations and conversion actions.
 */
export function storeUtm(utm: UtmData): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredUtm();
    const updated = { ...existing, ...utm };
    // Only save if at least one parameter is present
    if (Object.values(updated).some(Boolean)) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {
    // Ignore sessionStorage quota / privacy mode exceptions
  }
}

/**
 * Universal telemetry event dispatcher. Can be invoked from any client component.
 */
export function trackEvent(eventType: string, metadata?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const sessionId = getOrCreateSessionId();
  const utm = getStoredUtm();
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
    metadata,
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

  // 1. UTM Extraction & Retention
  useEffect(() => {
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
  }, [searchParams]);

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
