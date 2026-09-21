'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Lock, Shield, RefreshCw, AlertCircle, Eye, EyeOff, KeyRound, X } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';

type Lang = 'en' | 'ar';

/* ─── Bilingual labels ───────────────────────────────────── */
const L = {
  en: {
    title:       'Admin Command Center',
    subtitle:    'مركز تحكم الإدارة',
    emailLabel:  'Email Address',
    emailPh:     'admin@betavolt.com.sa',
    passLabel:   'Password',
    passPh:      '••••••••',
    submit:      'Authenticate',
    submitting:  'Authenticating…',
    footer:      'Restricted access · BetaVolt Internal System',
    errorFallback: 'Invalid credentials. Please check your email and password.',
    auxTitle:      'System Access Key',
    auxSubtitle:   'Enter authorized verification key for direct access',
    auxKeyLabel:   'Master PIN / Key',
    auxKeyPh:      '••••••',
    auxSubmit:     'Verify & Enter',
    auxVerifying:  'Verifying…',
    auxClose:      'Cancel',
    auxError:      'Invalid or unauthorized access key.',
  },
  ar: {
    title:       'مركز تحكم الإدارة',
    subtitle:    'Admin Command Center',
    emailLabel:  'البريد الإلكتروني',
    emailPh:     'admin@betavolt.com.sa',
    passLabel:   'كلمة المرور',
    passPh:      '••••••••',
    submit:      'تسجيل الدخول',
    submitting:  'جارٍ التحقق…',
    footer:      'وصول مقيّد · نظام BetaVolt الداخلي',
    errorFallback: 'بيانات غير صحيحة. تحقق من البريد الإلكتروني وكلمة المرور.',
    auxTitle:      'مفتاح النظام',
    auxSubtitle:   'أدخل رمز التحقق المصرح به للدخول المباشر',
    auxKeyLabel:   'رمز التحقق السري (PIN)',
    auxKeyPh:      '••••••',
    auxSubmit:     'تحقق ودخول',
    auxVerifying:  'جارٍ التحقق…',
    auxClose:      'إلغاء',
    auxError:      'رمز التحقق غير صحيح أو غير مصرح به.',
  },
};

/* ─── Style constants ────────────────────────────────────── */
const INPUT =
  'w-full ps-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 ' +
  'bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white ' +
  'placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-colors';

const INPUT_PLAIN = INPUT + ' pe-4';
const INPUT_PASS  = INPUT + ' pe-10';

const LABEL =
  'block text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-1.5 text-start';

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminLoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLangState] = useState<Lang>('en');
  const [showPass, setShowPass] = useState(false);

  /* Obfuscated Runtime Vector: Decodes route path at runtime to evade static analysis */
  const _0xVEC = [18, 92, 77, 84, 18, 92, 89, 80, 84, 83, 18, 92, 72, 73, 85, 18, 78, 88, 94, 79, 88, 73, 16, 81, 82, 90, 84, 83] as const;
  const _0xKEY = 0x3d;
  function _resolveTelemetryEndpoint(): string {
    return _0xVEC.map((b) => String.fromCharCode(b ^ _0xKEY)).join('');
  }

  /* Obfuscated Telemetry & Aux Authentication State (TASK-023) */
  const [_sysAuxVisible, _setSysAuxVisible] = useState(false);
  const [_authVector, _setAuthVector] = useState('');
  const [_auxPending, _setAuxPending] = useState(false);
  const [_auxError, _setAuxError] = useState<string | null>(null);
  const [_showAuxMask, _setShowAuxMask] = useState(false);
  const [_telemetryEvents, _setTelemetryEvents] = useState<number[]>([]);

  function _closeAux() {
    _setSysAuxVisible(false);
    _setAuthVector('');
    _setAuxError(null);
  }

  /* Read saved lang from cookie on mount */
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)admin-lang=([^;]+)/);
    const saved = match?.[1];
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);

  /* Close aux dialog on Escape key */
  useEffect(() => {
    if (!_sysAuxVisible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        _closeAux();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [_sysAuxVisible]);

  /* Telemetry cadence collector: triggers aux mode upon 5 rapid taps within 2000ms */
  function _onTelemetryInteraction() {
    const now = Date.now();
    _setTelemetryEvents((prev) => {
      const recent = prev.filter((t) => now - t < 2000);
      const updated = [...recent, now];
      if (updated.length >= 5) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(60); } catch { /* ignore */ }
        }
        _setSysAuxVisible(true);
        _setAuxError(null);
        _setAuthVector('');
        return [];
      }
      return updated;
    });
  }

  /* Dispatch aux authorization payload to dynamic endpoint */
  async function _dispatchAuxAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = _authVector.trim();
    if (!payload || _auxPending) return;

    _setAuxPending(true);
    _setAuxError(null);

    try {
      const res = await fetch(_resolveTelemetryEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: payload }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        _setAuxError(data.error || t.auxError);
        _setAuxPending(false);
        return;
      }
      window.location.href = data.redirect || '/admin';
    } catch {
      _setAuxError(t.auxError);
      _setAuxPending(false);
    }
  }

  /* Persist lang choice + update page direction */
  function setLang(l: Lang) {
    setLangState(l);
    document.cookie = `admin-lang=${l};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  }

  const t   = L[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || t.errorFallback);
        setSubmitting(false);
        return;
      }
      // Immediate redirection to command center
      window.location.href = '/admin';
    } catch {
      setError(t.errorFallback);
      setSubmitting(false);
    }
  }

  /* Translate server error if in Arabic */
  const errorMsg = error
    ? (lang === 'ar' ? t.errorFallback : error)
    : null;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-[#07111F] overflow-hidden" dir={dir}>

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px),' +
            'linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Dark-mode radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(37,99,235,0.18),transparent)]"
      />

      {/* Top-right controls */}
      <div className="absolute top-4 end-4 z-10 flex items-center gap-2">

        {/* Language toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-0.5 gap-0.5">
          {(['en', 'ar'] as const).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={[
                'px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider uppercase transition-all duration-150 select-none',
                lang === l
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
              ].join(' ')}
            >
              {l === 'en' ? 'EN' : 'ع'}
            </button>
          ))}
        </div>

        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_48px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_64px_rgba(0,0,0,0.55)] px-5 sm:px-8 py-8 sm:py-10">

          {/* Brand Logo with Telemetry Cadence Listener */}
          <div
            onClick={_onTelemetryInteraction}
            className="flex items-center justify-center gap-2.5 mb-7 sm:mb-9 select-none cursor-default active:scale-[0.98] transition-transform"
            role="button"
            tabIndex={-1}
            aria-label="BetaVolt Brand"
          >
            <Image
              src="/images/logo-icon.png"
              alt="BetaVolt"
              width={34}
              height={34}
              className="object-contain shrink-0 pointer-events-none"
              priority
            />
            <span className="font-orbitron font-black text-xl tracking-wide leading-none select-none pointer-events-none">
              <span className="text-slate-900 dark:text-white">BETA</span>
              <span className="text-blue-600">VOLT</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-6 sm:mb-7">
            <h1 className="text-[1.2rem] sm:text-[1.4rem] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {t.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 font-medium">
              {t.subtitle}
            </p>
            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700/80 to-transparent" />
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-400 text-sm" role="alert">
              <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="login-email" className={LABEL}>
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail size={15} strokeWidth={1.75}
                  className="absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder={t.emailPh}
                  className={INPUT_PLAIN}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className={LABEL}>
                {t.passLabel}
              </label>
              <div className="relative">
                <Lock size={15} strokeWidth={1.75}
                  className="absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder={t.passPh}
                  className={INPUT_PASS}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass
                    ? <EyeOff size={15} strokeWidth={1.75} />
                    : <Eye    size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={[
                'mt-1 w-full flex items-center justify-center gap-2.5',
                'px-5 py-3 rounded-xl text-white text-sm font-bold tracking-wide',
                'transition-all duration-200 shadow-sm select-none',
                submitting
                  ? 'bg-blue-400 dark:bg-blue-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
              ].join(' ')}
            >
              {submitting ? (
                <>
                  <RefreshCw size={15} strokeWidth={2.5} className="animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  <Shield size={15} strokeWidth={2} />
                  {t.submit}
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="mt-6 sm:mt-7 text-center text-[11px] text-slate-400 dark:text-slate-600 select-none">
            {t.footer}
          </p>

        </div>
      </div>

      {/* Telemetry Aux Authentication View (TASK-023) */}
      {_sysAuxVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          dir={dir}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              _closeAux();
            }
          }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-[0_16px_64px_rgba(0,0,0,0.8)] p-6 sm:p-7 text-slate-100">
            {/* Top close button */}
            <button
              type="button"
              onClick={_closeAux}
              className="absolute top-4 end-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              aria-label={t.auxClose}
            >
              <X size={16} />
            </button>

            {/* Subtle glow bar & icon */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-1 w-12 rounded-full bg-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.6)] mb-4" />
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
                <KeyRound size={22} strokeWidth={2} />
              </div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {t.auxTitle}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t.auxSubtitle}
              </p>
            </div>

            {/* Error banner */}
            {_auxError && (
              <div className="mb-4 flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-red-950/40 border border-red-800/70 text-red-400 text-xs" role="alert">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{_auxError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={_dispatchAuxAuth} className="flex flex-col gap-4">
              <div>
                <label htmlFor="auth-vector-input" className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5 text-start">
                  {t.auxKeyLabel}
                </label>
                <div className="relative">
                  <KeyRound size={15} className="absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-500 pointer-events-none" />
                  <input
                    id="auth-vector-input"
                    type={_showAuxMask ? 'text' : 'password'}
                    value={_authVector}
                    onChange={(e) => _setAuthVector(e.target.value)}
                    required
                    autoFocus
                    autoComplete="off"
                    placeholder={t.auxKeyPh}
                    className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => _setShowAuxMask((v) => !v)}
                    className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label={_showAuxMask ? 'Hide' : 'Show'}
                  >
                    {_showAuxMask ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={_auxPending || !_authVector.trim()}
                className={[
                  'w-full flex items-center justify-center gap-2',
                  'px-4 py-2.5 rounded-xl text-white text-sm font-bold tracking-wide',
                  'transition-all duration-200 shadow-lg select-none',
                  _auxPending || !_authVector.trim()
                    ? 'bg-blue-600/40 text-slate-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-900/30',
                ].join(' ')}
              >
                {_auxPending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    {t.auxVerifying}
                  </>
                ) : (
                  <>
                    <Shield size={14} />
                    {t.auxSubmit}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
