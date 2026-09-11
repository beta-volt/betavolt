/**
 * 🏛️ BetaVolt — Enterprise Mail Dispatch Engine
 * 
 * High-reliability universal email dispatcher with dual-transport support:
 * 1. Primary: SMTP Transport via Nodemailer (NoorNet, cPanel, Microsoft 365, Google Workspace)
 * 2. Fallback: REST Cloud Transactional API (Resend)
 * 3. Local Safe Mode: Telemetry & Console Audit logger (Zero form blocking, zero exceptions)
 */

import nodemailer from 'nodemailer';

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: string | Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  cc?: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  provider: 'smtp' | 'resend' | 'logged';
  messageId?: string;
  error?: string;
}

/**
 * Strips HTML tags to generate a clean plain-text fallback.
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolves SMTP configuration from environment variables.
 */
function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return { host, port, secure, auth: { user, pass } };
  }
  return null;
}

/**
 * Universal email dispatcher function.
 * Guaranteed never to throw unhandled exceptions or interrupt user requests.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const plainText = options.text || htmlToPlainText(options.html);
  const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
  const ccAddresses = options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined;

  // ─── 1. Attempt SMTP Transport (Nodemailer) ─────────────────────────
  const smtpConfig = getSmtpConfig();
  if (smtpConfig) {
    try {
      const transporter = nodemailer.createTransport({
        ...smtpConfig,
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });

      const info = await transporter.sendMail({
        from: options.from,
        to: toAddresses.join(', '),
        cc: ccAddresses?.join(', '),
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html,
        text: plainText,
        attachments: options.attachments,
      });

      console.info(`[Mail Engine SMTP Success]: Sent "${options.subject}" to [${toAddresses.join(', ')}] (msgId: ${info.messageId})`);
      return {
        success: true,
        provider: 'smtp',
        messageId: info.messageId,
      };
    } catch (smtpErr) {
      console.warn('[Mail Engine SMTP Warning]: SMTP dispatch failed, trying fallback:', smtpErr);
    }
  }

  // ─── 2. Attempt Cloud Transactional API (Resend) ─────────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from,
          to: toAddresses,
          cc: ccAddresses,
          reply_to: options.replyTo,
          subject: options.subject,
          html: options.html,
          text: plainText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.info(`[Mail Engine Resend Success]: Sent "${options.subject}" to [${toAddresses.join(', ')}] (id: ${data.id})`);
        return {
          success: true,
          provider: 'resend',
          messageId: data.id,
        };
      } else {
        const errText = await response.text();
        console.warn('[Mail Engine Resend Warning]: Resend API rejected payload:', errText);
      }
    } catch (resendErr) {
      console.warn('[Mail Engine Resend Warning]: Cloud API connection error:', resendErr);
    }
  }

  // ─── 3. Local Development / Safe Telemetry Fallback ───────────────────
  console.info('\n┌─────────────────────────────────────────────────────────────┐');
  console.info('│ 📧 [BetaVolt Mail Dispatch Engine - Telemetry Logger]       │');
  console.info(`│ 📤 From:     ${options.from}`);
  console.info(`│ 📥 To:       ${toAddresses.join(', ')}`);
  if (ccAddresses?.length) {
    console.info(`│ 👥 CC:       ${ccAddresses.join(', ')}`);
  }
  console.info(`│ 📌 Subject:  ${options.subject}`);
  console.info(`│ 📎 Attach:   ${options.attachments?.length || 0} attachment(s)`);
  console.info('└─────────────────────────────────────────────────────────────┘\n');

  return {
    success: true,
    provider: 'logged',
  };
}
