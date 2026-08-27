import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getContent, setContent } from '@/lib/content-store';

const BUCKET  = 'hero-media';
const CONTENT_KEY = 'hero-media';

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdkfmduiftxisifetfmu.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhka2ZtZHVpZnR4aXNpZmV0Zm11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY5MDYyNywiZXhwIjoyMDk0MjY2NjI3fQ.9uiexLgZd-3jvUl1XOi-KxD80Oonw1lTqsRY2kA99y0';
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export interface HeroMedia {
  type:  'video' | 'images';
  items: string[]; // public URLs
}

/* ── GET — return current media config ──────────────────── */
export async function GET() {
  const data = await getContent(CONTENT_KEY) as HeroMedia | null;
  return NextResponse.json(data ?? { type: 'video', items: [] });
}

/* ── POST — upload a file + update config ───────────────── */
export async function POST(req: NextRequest) {
  try {
    const form     = await req.formData();
    const file     = form.get('file') as File | null;
    const mediaType = form.get('mediaType') as 'video' | 'images' | null;

    if (!file || !mediaType) {
      return NextResponse.json({ error: 'Missing file or mediaType' }, { status: 400 });
    }

    /* Validate MIME against declared mediaType */
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (mediaType === 'video' && !isVideo) {
      return NextResponse.json({ error: 'Expected a video file' }, { status: 400 });
    }
    if (mediaType === 'images' && !isImage) {
      return NextResponse.json({ error: 'Expected an image file' }, { status: 400 });
    }

    /* Read current config to enforce rules */
    const current = (await getContent(CONTENT_KEY) as HeroMedia | null) ?? { type: 'images', items: [] };

    if (mediaType === 'video' && current.items.length > 0) {
      return NextResponse.json({ error: 'Remove all existing media before adding a video' }, { status: 409 });
    }
    if (mediaType === 'images' && current.type === 'video' && current.items.length > 0) {
      return NextResponse.json({ error: 'Remove the existing video before adding images' }, { status: 409 });
    }

    /* Upload to Supabase Storage */
    const sb   = adminClient();
    const ext  = file.name.split('.').pop() ?? (isVideo ? 'mp4' : 'jpg');
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buf  = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(path, buf, { contentType: file.type, upsert: false });

    if (upErr) throw new Error(upErr.message);

    const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    /* Update config */
    const next: HeroMedia = {
      type:  mediaType,
      items: mediaType === 'video' ? [publicUrl] : [...current.items, publicUrl],
    };
    await setContent(CONTENT_KEY, next);

    return NextResponse.json({ ok: true, url: publicUrl, config: next });
  } catch (err) {
    console.error('[POST /api/admin/content/home/media]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

/* ── DELETE — remove one item by URL ────────────────────── */
export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json() as { url?: string };
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    /* Derive storage path from public URL */
    const sb   = adminClient();
    const base = sb.storage.from(BUCKET).getPublicUrl('').data.publicUrl;
    const path = url.replace(base, '');

    await sb.storage.from(BUCKET).remove([path]);

    /* Update config */
    const current = (await getContent(CONTENT_KEY) as HeroMedia | null) ?? { type: 'images', items: [] };
    const items   = current.items.filter(u => u !== url);
    const next: HeroMedia = { type: items.length === 0 ? 'images' : current.type, items };
    await setContent(CONTENT_KEY, next);

    return NextResponse.json({ ok: true, config: next });
  } catch (err) {
    console.error('[DELETE /api/admin/content/home/media]', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

/* ── PATCH — reorder images ─────────────────────────────── */
export async function PATCH(req: NextRequest) {
  try {
    const { items } = await req.json() as { items?: string[] };
    if (!Array.isArray(items)) return NextResponse.json({ error: 'Missing items array' }, { status: 400 });

    const current = (await getContent(CONTENT_KEY) as HeroMedia | null) ?? { type: 'images', items: [] };
    const next: HeroMedia = { ...current, items };
    await setContent(CONTENT_KEY, next);

    return NextResponse.json({ ok: true, config: next });
  } catch (err) {
    console.error('[PATCH /api/admin/content/home/media]', err);
    return NextResponse.json({ error: 'Reorder failed' }, { status: 500 });
  }
}
