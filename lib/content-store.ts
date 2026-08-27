/**
 * Server-side only — uses service role key to bypass RLS.
 * Never import this in client components.
 *
 * Keys:
 *   messages.en          → full en.json translations object
 *   messages.ar          → full ar.json translations object
 *   services-cards       → data/services-cards.json
 *   about-content        → data/about-content.json
 *   contact-details      → data/contact-details.json
 *   footer-content       → data/footer-content.json
 *   quote-modal-options  → data/quote-modal-options.json
 */

import { createClient } from '@supabase/supabase-js';

const TABLE = 'site_content';

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY5MDYyNywiZXhwIjoyMDk0MjY2NjI3fQ.9uiexLgZd-3jvUl1XOi-KxD80Oonw1lTqsRY2kA99y0';
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Read a content blob by key. Returns null if not found or on error. */
export async function getContent(key: string): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await client()
      .from(TABLE)
      .select('content')
      .eq('key', key)
      .single();
    if (error) return null;
    return (data?.content as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}

/** Write (upsert) a content blob by key. Throws on Supabase error. */
export async function setContent(key: string, content: unknown): Promise<void> {
  const { error } = await client()
    .from(TABLE)
    .upsert(
      { key, content, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    );
  if (error) throw new Error(`setContent("${key}"): ${error.message}`);
}
