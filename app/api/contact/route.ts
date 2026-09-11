import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendSalesAlert } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, service, details, utm_source, utm_medium, utm_campaign, utm_content } = body;

    if (!name || !email || !service || !details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase.from('inquiries').insert([{
      full_name: name,
      email,
      company:   company || null,
      phone:     phone   || null,
      subject:   service,
      message:   details,
      status:    'new',
      source:    'contact_form',
    }]);

    if (error) {
      console.error('[Contact API] Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }

    // Trigger instant sales alert (fail-safe)
    await sendSalesAlert({
      type: 'contact_message',
      name,
      company: company || '',
      email,
      phone,
      subject: service,
      service,
      message: details,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
