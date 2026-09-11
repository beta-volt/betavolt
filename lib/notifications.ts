/**
 * 🏛️ BetaVolt — Instant Sales Alert & Notification Engine
 * 
 * Delivers immediate alerts to sales directors and executive leadership
 * upon quotation requests, pre-qualification downloads, and contact submissions.
 * Designed with a strict fail-safe architecture to ensure customer interactions
 * are never blocked by upstream notification providers.
 */

export interface SalesAlertPayload {
  type: 'quote_request' | 'lead_magnet' | 'contact_message';
  name: string;
  company: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  service?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  city?: string | null;
}

const TYPE_CONFIG = {
  quote_request: {
    badgeAr: '⚡ طلب عرض سعر جديد (RFP)',
    badgeEn: '⚡ New RFP Quote Request',
    color: '#2563eb',
    bgLight: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  lead_magnet: {
    badgeAr: '📥 تحميل الملف التعريفي وسابقة الأعمال',
    badgeEn: '📥 Pre-Qualification Profile Download',
    color: '#0d9488',
    bgLight: '#f0fdfa',
    borderColor: '#99f6e4',
  },
  contact_message: {
    badgeAr: '💬 استفسار تواصل جديد',
    badgeEn: '💬 New Contact Message',
    color: '#d97706',
    bgLight: '#fffbeb',
    borderColor: '#fde68a',
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
 * Generates high-end HTML email body with official BetaVolt Dark Cyber styling.
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
    .card { max-width: 600px; margin: 0 auto; background: #0E1524; border: 1px solid #1E2D4A; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0A101D 0%, #131D31 100%); padding: 24px; border-bottom: 1px solid #1E2D4A; text-align: center; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: 2px; color: #FFFFFF; margin-bottom: 8px; }
    .logo span { color: #38BDF8; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 700; background: ${cfg.color}; color: #FFFFFF; }
    .content { padding: 24px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #1E2D4A; font-size: 14px; }
    .info-label { color: #94A3B8; font-weight: 600; width: 35%; }
    .info-value { color: #F1F5F9; font-weight: 700; }
    .actions { margin-top: 24px; display: flex; gap: 12px; justify-content: center; }
    .btn { display: inline-block; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; text-align: center; margin: 0 6px; }
    .btn-wa { background: #22c55e; color: #FFFFFF; }
    .btn-call { background: #2563eb; color: #FFFFFF; }
    .utm-box { margin-top: 20px; padding: 12px; border-radius: 8px; background: #070B14; border: 1px dashed #1E2D4A; font-size: 12px; color: #64748B; }
    .footer { background: #070B14; padding: 16px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1E2D4A; }
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
          <td class="info-value" dir="ltr" style="text-align: right;">${payload.email}</td>
        </tr>` : ''}
        ${payload.service ? `
        <tr>
          <td class="info-label">🎯 مجال الاهتمام:</td>
          <td class="info-value">${payload.service}</td>
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
        ${payload.message ? `
        <tr>
          <td class="info-label">📝 الملاحظات / التفاصيل:</td>
          <td class="info-value">${payload.message}</td>
        </tr>` : ''}
      </table>

      ${(telUrl || waUrl) ? `
      <div class="actions" style="text-align: center; margin-top: 24px;">
        ${telUrl ? `<a href="${telUrl}" class="btn btn-call">📞 اتصال فوري بالعميل</a>` : ''}
        ${waUrl ? `<a href="${waUrl}" class="btn btn-wa" target="_blank">💬 محادثة واتساب فورية</a>` : ''}
      </div>` : ''}

      ${(payload.utm_source || payload.utm_campaign) ? `
      <div class="utm-box">
        <strong>بيانات الحملة الإعلانية (UTM Attribution):</strong><br>
        • المصدر (Source): ${payload.utm_source || 'مباشر'}<br>
        • الحملة (Campaign): ${payload.utm_campaign || 'غير محدد'}<br>
        • الوسيط (Medium): ${payload.utm_medium || 'غير محدد'}
      </div>` : ''}
    </div>
    <div class="footer">
      تم إرسال هذا التنبيه آلياً بواسطة محرك مبيعات BetaVolt اللحظي • ${timestamp}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatches the sales alert across configured communication channels.
 * Guarantees zero unhandled exceptions.
 */
export async function sendSalesAlert(payload: SalesAlertPayload): Promise<void> {
  const cfg = TYPE_CONFIG[payload.type] || TYPE_CONFIG.contact_message;
  const alertTitle = `[BetaVolt Sales Alert] ${cfg.badgeEn}: ${payload.company} (${payload.name})`;

  // 1. Console Fallback / Telemetry Audit
  console.log(`\n======================================================`);
  console.log(`🚨 [SALES ALERT ENGINE] ${cfg.badgeEn}`);
  console.log(`   🏢 Company:  ${payload.company}`);
  console.log(`   👤 Contact:  ${payload.name}`);
  console.log(`   📞 Phone:    ${payload.phone || 'N/A'}`);
  console.log(`   ✉️ Email:    ${payload.email || 'N/A'}`);
  console.log(`   🎯 Service:  ${payload.service || payload.subject || 'N/A'}`);
  if (payload.utm_source || payload.utm_campaign) {
    console.log(`   📊 UTM:      source=${payload.utm_source}, campaign=${payload.utm_campaign}`);
  }
  console.log(`======================================================\n`);

  // 2. Resend API Email Dispatch (if RESEND_API_KEY is present)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const recipientEmail = process.env.SALES_ALERT_EMAIL || 'sales@betavolt.com.sa';
      const senderEmail = process.env.RESEND_FROM_EMAIL || 'BetaVolt Alerts <onboarding@resend.dev>';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [recipientEmail],
          subject: alertTitle,
          html: generateHtmlEmail(payload),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn('[Sales Alert Resend Warning]: Failed to dispatch email:', errText);
      } else {
        console.log('[Sales Alert Resend Success]: Delivered alert to', recipientEmail);
      }
    } catch (emailErr) {
      console.warn('[Sales Alert Resend Error]: Network or configuration error:', emailErr);
    }
  }

  // 3. Webhook Dispatch (Slack / Discord / Teams / WhatsApp Gateway)
  const webhookUrl = process.env.SALES_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const waUrl = getWhatsAppUrl(payload.phone);
      const telUrl = getTelUrl(payload.phone);

      const webhookBody = {
        text: `*${alertTitle}*\n*Company:* ${payload.company}\n*Contact:* ${payload.name}\n*Phone:* ${payload.phone || 'N/A'}\n*Email:* ${payload.email || 'N/A'}\n*Interest:* ${payload.service || payload.subject || 'N/A'}\n*Campaign:* ${payload.utm_campaign || 'N/A'}${waUrl ? `\n*WhatsApp:* <${waUrl}|Chat Now>` : ''}`,
        type: payload.type,
        company: payload.company,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        service: payload.service,
        utm_source: payload.utm_source,
        utm_campaign: payload.utm_campaign,
        whatsapp_url: waUrl,
        tel_url: telUrl,
        timestamp: new Date().toISOString(),
      };

      const whRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody),
      });

      if (!whRes.ok) {
        console.warn('[Sales Alert Webhook Warning]: Webhook responded with status', whRes.status);
      }
    } catch (whErr) {
      console.warn('[Sales Alert Webhook Error]: Failed to post to webhook:', whErr);
    }
  }
}
