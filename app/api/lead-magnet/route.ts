import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { sendSalesAlert } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      company: string;
      full_name: string;
      phone: string;
      email: string;
      service_interest?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
    };

    const {
      company,
      full_name,
      phone,
      email,
      service_interest,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    } = body;

    if (!company?.trim() || !full_name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const serviceName = service_interest?.trim() || 'عام / كافة التخصصات';
    const subject = `طلب تحميل الملف التعريفي وسابقة الأعمال — ${serviceName}`;

    let messageContent = `مجال الاهتمام الرئيسي: ${serviceName}`;
    if (utm_source || utm_campaign || utm_medium) {
      messageContent += `\n\n[بيانات الحملة الإعلانية / UTM Attribution]\nالمصدر: ${utm_source || 'مباشر'}\nالحملة: ${utm_campaign || 'غير محدد'}\nالوسيط: ${utm_medium || 'غير محدد'}`;
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('inquiries').insert({
      full_name: full_name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject,
      message: messageContent,
      source: 'lead_magnet',
      status: 'new',
    });

    if (error) {
      console.error('[POST /api/lead-magnet] Supabase insert error:', error);
      throw error;
    }

    // Trigger instant sales alert (fail-safe)
    await sendSalesAlert({
      type: 'lead_magnet',
      name: full_name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject,
      service: serviceName,
      message: messageContent,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    });

    return NextResponse.json({
      success: true,
      downloadUrl: '/api/lead-magnet/download',
    }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/lead-magnet] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
