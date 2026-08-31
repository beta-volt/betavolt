import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getContent, setContent } from '@/lib/content-store';

const messagesDir = join(process.cwd(), 'messages');
const detailsPath = join(process.cwd(), 'data', 'contact-details.json');

interface ContactDetails {
  email_general: string; email_projects: string; email_careers?: string;
  phone: string; whatsapp: string;
}

function staticMessages(locale: 'en' | 'ar') {
  return JSON.parse(readFileSync(join(messagesDir, `${locale}.json`), 'utf-8'));
}

async function getMessages(locale: 'en' | 'ar'): Promise<Record<string, unknown>> {
  return (await getContent(`messages.${locale}`)) ?? staticMessages(locale);
}

async function getDetails(): Promise<ContactDetails> {
  const db = await getContent('contact-details');
  if (db) return db as unknown as ContactDetails;
  return JSON.parse(readFileSync(detailsPath, 'utf-8'));
}

export async function GET() {
  try {
    const [en, ar, details] = await Promise.all([
      getMessages('en'),
      getMessages('ar'),
      getDetails(),
    ]);
    return NextResponse.json({
      pageContent: {
        en: en.contact_page as Record<string, string>,
        ar: ar.contact_page as Record<string, string>,
      },
      details,
    });
  } catch (err) {
    console.error('[GET /api/admin/content/contact]', err);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      pageContent: { en: Record<string, string>; ar: Record<string, string> };
      details: ContactDetails;
    };
    if (!body.pageContent || !body.details) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const [baseEn, baseAr] = await Promise.all([getMessages('en'), getMessages('ar')]);
    await Promise.all([
      setContent('messages.en', { ...baseEn, contact_page: body.pageContent.en }),
      setContent('messages.ar', { ...baseAr, contact_page: body.pageContent.ar }),
      setContent('contact-details', body.details),
    ]);
    revalidateTag('site-messages');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content/contact]', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
