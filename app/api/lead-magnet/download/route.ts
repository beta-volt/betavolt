import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SUPABASE_STORAGE_URL = 'https://xdkfmduiftxisifetfmu.supabase.co/storage/v1/object/public/attachments/documents/BetaVolt-Company-Pre-Qualification.pdf';

export async function GET() {
  try {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'downloads', 'BetaVolt-Company-Pre-Qualification.pdf'),
      path.join(process.cwd(), 'public', 'downloads', 'betavolt-profile.pdf'),
    ];

    for (const filePath of candidatePaths) {
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="BetaVolt-Company-Pre-Qualification.pdf"',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          },
        });
      }
    }

    // High-availability fallback to Supabase Storage CDN
    return NextResponse.redirect(SUPABASE_STORAGE_URL, 302);
  } catch (error) {
    console.error('[Download Lead Magnet API Error]:', error);
    return NextResponse.redirect(SUPABASE_STORAGE_URL, 302);
  }
}
