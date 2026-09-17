/**
 * 🏛️ BetaVolt — Automated Dual-Stream Notification Engine
 * 
 * Delivers immediate, high-fidelity email and webhook alerts for:
 * 1. Analytics & High-Intent Sales Alerts:
 *    From: noreply@betavolt.com.sa -> To: sales@betavolt.com.sa
 * 2. Inquiries & Quotation RFPs:
 *    From: inquiries@betavolt.com.sa -> To: info@betavolt.com.sa (CC: sales@betavolt.com.sa)
 * 
 * Built with a non-blocking, fail-safe architecture to ensure customer form
 * submissions are never delayed or interrupted.
 */

import { sendEmail } from '@/lib/mail';

export interface SalesAlertPayload {
  type: 'quote_request' | 'lead_magnet' | 'contact_message';
  name: string;
  company: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  service?: string | null;
  timeline?: string | null;
  file_name?: string | null;
  file_url?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  city?: string | null;
}

const TYPE_CONFIG = {
  quote_request: {
    badgeAr: '⚡ طلب عرض سعر رسمي ومناقصة (RFP)',
    badgeEn: '⚡ Official RFP Quotation Request',
    color: '#2563EB',
    fromDefault: 'BetaVolt Inquiries <inquiries@betavolt.com.sa>',
  },
  lead_magnet: {
    badgeAr: '🎯 تنبيه مبيعات وتسويق: تحميل الملف التعريفي وسابقة الأعمال',
    badgeEn: '🎯 Sales & Marketing Alert: Pre-Qualification Download',
    color: '#059669',
    fromDefault: 'BetaVolt System <noreply@betavolt.com.sa>',
  },
  contact_message: {
    badgeAr: '📩 رسالة استفسار وتواصل عام',
    badgeEn: '📩 General Contact Inquiry',
    color: '#D97706',
    fromDefault: 'BetaVolt Inquiries <inquiries@betavolt.com.sa>',
  },
};

/**
 * Normalizes a Saudi phone number into a direct WhatsApp click-to-chat URL.
 */
function getWhatsAppUrl(phone?: string | null): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('00966')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('05')) {
    digits = '966' + digits.slice(1);
  } else if (digits.startsWith('5') && digits.length === 9) {
    digits = '966' + digits;
  }

  return `https://wa.me/${digits}`;
}

/**
 * Formats a clean tel: link.
 */
function getTelUrl(phone?: string | null): string | null {
  if (!phone) return null;
  const clean = phone.replace(/[^\d+]/g, '');
  return clean ? `tel:${clean}` : null;
}

/**
 * Generates an executive HTML email body tailored to the alert stream.
 */
function generateHtmlEmail(payload: SalesAlertPayload): string {
  const cfg = TYPE_CONFIG[payload.type] || TYPE_CONFIG.contact_message;
  const waUrl = getWhatsAppUrl(payload.phone);
  const telUrl = getTelUrl(payload.phone);
  const timestamp = new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' });

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #070B14; color: #E2E8F0; margin: 0; padding: 24px; direction: rtl; }
    .card { max-width: 620px; margin: 0 auto; background: #0E1524; border: 1px solid #1E2D4A; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0A101D 0%, #131D31 100%); padding: 26px; border-bottom: 1px solid #1E2D4A; text-align: center; }
    .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #FFFFFF; margin-bottom: 10px; }
    .logo span { color: #38BDF8; }
    .badge { display: inline-block; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; background: ${cfg.color}; color: #FFFFFF; }
    .content { padding: 26px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 18px; }
    .info-table td { padding: 12px 14px; border-bottom: 1px solid #1E2D4A; font-size: 14px; }
    .info-label { color: #94A3B8; font-weight: 600; width: 34%; }
    .info-value { color: #F1F5F9; font-weight: 700; }
    .actions { margin-top: 26px; text-align: center; }
    .btn { display: inline-block; padding: 12px 22px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; margin: 4px 6px; }
    .btn-wa { background: #22c55e; color: #FFFFFF; }
    .btn-call { background: #2563eb; color: #FFFFFF; }
    .btn-file { background: #0284c7; color: #FFFFFF; }
    .utm-box { margin-top: 22px; padding: 14px; border-radius: 8px; background: #070B14; border: 1px dashed #1E2D4A; font-size: 12px; color: #64748B; }
    .footer { background: #070B14; padding: 18px; text-align: center; font-size: 12px; color: #475569; border-top: 1px solid #1E2D4A; }
    .admin-link { color: #38BDF8; text-decoration: underline; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">BETA<span>VOLT</span></div>
      <div class="badge">${cfg.badgeAr}</div>
    </div>
    <div class="content">
      <table class="info-table">
        <tr>
          <td class="info-label">🏢 الجهة / الشركة:</td>
          <td class="info-value">${payload.company || 'غير محدد'}</td>
        </tr>
        <tr>
          <td class="info-label">👤 المسؤول / المهندس:</td>
          <td class="info-value">${payload.name}</td>
        </tr>
        ${payload.phone ? `
        <tr>
          <td class="info-label">📞 رقم الاتصال:</td>
          <td class="info-value" dir="ltr" style="text-align: right;">${payload.phone}</td>
        </tr>` : ''}
        ${payload.email ? `
        <tr>
          <td class="info-label">✉️ البريد الإلكتروني:</td>
          <td class="info-value" dir="ltr" style="text-align: right;"><a href="mailto:${payload.email}" style="color: #38BDF8; text-decoration: none;">${payload.email}</a></td>
        </tr>` : ''}
        ${payload.service ? `
        <tr>
          <td class="info-label">🎯 نوع المشروع / التخصص:</td>
          <td class="info-value">${payload.service}</td>
        </tr>` : ''}
        ${payload.timeline ? `
        <tr>
          <td class="info-label">⏱️ الجدول الزمني المطلوب:</td>
          <td class="info-value">${payload.timeline}</td>
        </tr>` : ''}
        ${payload.subject ? `
        <tr>
          <td class="info-label">📌 الموضوع:</td>
          <td class="info-value">${payload.subject}</td>
        </tr>` : ''}
        ${payload.city ? `
        <tr>
          <td class="info-label">📍 المدينة / الموقع:</td>
          <td class="info-value">${payload.city}</td>
        </tr>` : ''}
        ${payload.file_url ? `
        <tr>
          <td class="info-label">📎 كراسة الشروط / الملف:</td>
          <td class="info-value"><a href="${payload.file_url}" target="_blank" style="color: #38BDF8; text-decoration: underline;">📄 ${payload.file_name || 'تحميل كراسة المشروع المرفقة'}</a></td>
        </tr>` : ''}
        ${payload.message ? `
        <tr>
          <td class="info-label">📝 التفاصيل والمتطلبات:</td>
          <td class="info-value" style="white-space: pre-wrap; line-height: 1.6;">${payload.message}</td>
        </tr>` : ''}
      </table>

      ${(telUrl || waUrl || payload.file_url) ? `
      <div class="actions">
        ${waUrl ? `<a href="${waUrl}" class="btn btn-wa" target="_blank">💬 بدء محادثة واتساب فورية</a>` : ''}
        ${telUrl ? `<a href="${telUrl}" class="btn btn-call">📞 اتصال هاتفي بالعميل</a>` : ''}
        ${payload.file_url ? `<a href="${payload.file_url}" class="btn btn-file" target="_blank">📥 معاينة ملف المناقصة</a>` : ''}
      </div>` : ''}

      ${(payload.utm_source || payload.utm_campaign) ? `
      <div class="utm-box">
        <strong>بيانات الحملة الإعلانية والتسويقية (Campaign Attribution):</strong><br>
        • المصدر (Source): ${payload.utm_source || 'مباشر'}<br>
        • الحملة (Campaign): ${payload.utm_campaign || 'غير محدد'}<br>
        • الوسيط (Medium): ${payload.utm_medium || 'غير محدد'}
      </div>` : ''}
    </div>
    <div class="footer">
      تم إرسال هذا الإشعار آلياً عبر محرك إشعارات BetaVolt • ${timestamp}<br>
      <a href="https://betavolt.com.sa/admin/inquiries" class="admin-link">مراجعة الطلب في لوحة التحكم الإدارية</a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Safely parses comma-delimited email lists from environment variables.
 */
function parseRecipientList(envVal?: string, fallback: string[] = []): string[] {
  if (!envVal) return fallback;
  const parsed = envVal.split(',').map(e => e.trim()).filter(Boolean);
  return parsed.length > 0 ? parsed : fallback;
}

/**
 * Dispatches the notification across configured communication streams:
 * - Lead Magnet & Marketing Alerts -> From: noreply@betavolt.com.sa -> To: sales@betavolt.com.sa (ONLY)
 * - Quotations (RFPs) & Inquiries  -> From: inquiries@betavolt.com.sa -> To: info@betavolt.com.sa & inquiries@betavolt.com.sa
 * 
 * Non-blocking, completely fail-safe.
 */
export async function sendSalesAlert(payload: SalesAlertPayload): Promise<void> {
  const isLeadMagnet = payload.type === 'lead_magnet';

  // 1. Resolve Senders & Recipients dynamically
  let fromAddress: string;
  let toAddress: string | string[];
  let ccAddress: string | string[] | undefined = undefined;
  let subject: string;

  if (isLeadMagnet) {
    // 1. Pre-Qualification Profile Download Alert: From noreply -> To inquiries
    fromAddress = process.env.SALES_ALERT_FROM_EMAIL || 'BetaVolt System <noreply@betavolt.com.sa>';
    toAddress = parseRecipientList(process.env.SALES_ALERT_EMAIL, ['inquiries@betavolt.com.sa']);
    subject = `🎯 [تنبيه مبيعات وتسويق] تحميل الملف التعريفي وسابقة الأعمال — ${payload.company} (${payload.name})`;
  } else if (payload.type === 'quote_request') {
    // 2. Official RFP Quotation Request: From noreply -> To inquiries
    fromAddress = process.env.QUOTE_FROM_EMAIL || 'BetaVolt System <noreply@betavolt.com.sa>';
    toAddress = parseRecipientList(process.env.QUOTE_TARGET_EMAIL, ['inquiries@betavolt.com.sa']);
    subject = `⚡ [طلب عرض سعر رسمي — RFP] ${payload.company} | مشروع: ${payload.service || 'مشروع جديد'} (${payload.name})`;
    if (process.env.INQUIRIES_CC_EMAIL) {
      ccAddress = parseRecipientList(process.env.INQUIRIES_CC_EMAIL);
    }
  } else {
    // 3. Website Contact Inquiries: From noreply -> To inquiries
    fromAddress = process.env.CONTACT_FROM_EMAIL || 'BetaVolt System <noreply@betavolt.com.sa>';
    toAddress = parseRecipientList(process.env.CONTACT_TARGET_EMAIL, ['inquiries@betavolt.com.sa']);
    subject = `📩 [استفسار وتواصل عام] ${payload.name} (${payload.company || 'جهة عامة'}) — ${payload.subject || 'عام'}`;
    if (process.env.INQUIRIES_CC_EMAIL) {
      ccAddress = parseRecipientList(process.env.INQUIRIES_CC_EMAIL);
    }
  }

  // 2. Dispatch via Universal Mail Engine (SMTP / Resend / Safe Logger)
  try {
    const htmlBody = generateHtmlEmail(payload);
    await sendEmail({
      from: fromAddress,
      to: toAddress,
      cc: ccAddress,
      replyTo: payload.email || undefined,
      subject,
      html: htmlBody,
    });
  } catch (emailErr) {
    console.warn('[Notifications Engine Warning]: Email dispatch encountered safe non-blocking error:', emailErr);
  }

  // 3. Optional Webhook Dispatch (Slack / Teams / WhatsApp Gateway)
  const webhookUrl = process.env.SALES_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const waUrl = getWhatsAppUrl(payload.phone);
      const telUrl = getTelUrl(payload.phone);

      const webhookBody = {
        text: `*${subject}*\n*Company:* ${payload.company}\n*Contact:* ${payload.name}\n*Phone:* ${payload.phone || 'N/A'}\n*Email:* ${payload.email || 'N/A'}\n*Interest:* ${payload.service || payload.subject || 'N/A'}${payload.file_url ? `\n*File:* <${payload.file_url}|Download RFP Document>` : ''}${waUrl ? `\n*WhatsApp:* <${waUrl}|Chat Now>` : ''}`,
        type: payload.type,
        company: payload.company,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        service: payload.service,
        timeline: payload.timeline,
        file_url: payload.file_url,
        utm_source: payload.utm_source,
        utm_campaign: payload.utm_campaign,
        whatsapp_url: waUrl,
        tel_url: telUrl,
        timestamp: new Date().toISOString(),
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody),
      });
    } catch (whErr) {
      console.warn('[Notifications Webhook Warning]: Failed to post to webhook:', whErr);
    }
  }
}
