import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getContent, setContent } from '@/lib/content-store';

const BUCKET         = 'hero-media';
const FAVICON_PREFIX = 'site-favicon/';
const CONTENT_KEY    = 'favicon';

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY5MDYyNywiZXhwIjoyMDk0MjY2NjI3fQ.9uiexLgZd-3jvUl1XOi-KxD80Oonw1lTqsRY2kA99y0';
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/* ── GET — return current favicon URL ──────────────────── */
export async function GET() {
  const url = await getContent(CONTENT_KEY) as string | null;
  return NextResponse.json({ url: url ?? null });
}

/* ── POST — upload new favicon ─────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Expected an image file' }, { status: 400 });
    }
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 1 MB)' }, { status: 400 });
    }

    const sb  = adminClient();
    const ext = file.name.split('.').pop() ?? 'png';
    const path = `${FAVICON_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buf  = Buffer.from(await file.arrayBuffer());

    /* Remove old favicon from storage */
    const oldUrl = await getContent(CONTENT_KEY) as string | null;
    if (oldUrl) {
      const base    = sb.storage.from(BUCKET).getPublicUrl('').data.publicUrl;
      const oldPath = oldUrl.replace(base, '');
      await sb.storage.from(BUCKET).remove([oldPath]).catch(() => {});
    }

    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(path, buf, { contentType: file.type, upsert: false });

    if (upErr) throw new Error(upErr.message);

    const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    await setContent(CONTENT_KEY, publicUrl);
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (err) {
    console.error('[POST /api/admin/content/favicon]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

/* ── DELETE — remove favicon ───────────────────────────── */
export async function DELETE() {
  try {
    const sb     = adminClient();
    const oldUrl = await getContent(CONTENT_KEY) as string | null;

    if (oldUrl) {
      const base    = sb.storage.from(BUCKET).getPublicUrl('').data.publicUrl;
      const oldPath = oldUrl.replace(base, '');
      await sb.storage.from(BUCKET).remove([oldPath]).catch(() => {});
    }

    await setContent(CONTENT_KEY, null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/admin/content/favicon]', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
