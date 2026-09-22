'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Wrench,
  Zap,
  Server,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  RefreshCw,
  Radio,
  Cpu,
} from 'lucide-react';

export default function MaintenanceView() {
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@betavolt.com.sa');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCheckStatus = () => {
    setIsChecking(true);
    setCheckMessage('جارٍ فحص استجابة الخوادم وتحديثات الصيانة...');
    setTimeout(() => {
      setIsChecking(false);
      setCheckMessage('الأنظمة لا تزال قيد التحديث والترقية الهندسية. يرجى المحاولة لاحقاً.');
      setTimeout(() => setCheckMessage(null), 5000);
    }, 1600);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#080c13] text-[#E5E7EB] overflow-x-hidden flex flex-col justify-between selection:bg-brand-blue/30 selection:text-white">
      {/* ── Background Engineering Grid & Glow Accents ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(75, 163, 227, 0.25) 1.2px, transparent 1.2px),
            linear-gradient(rgba(75, 163, 227, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(75, 163, 227, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top Ambient Glow Blob (Cyan) */}
      <div
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(75, 163, 227, 0.15) 0%, rgba(234, 179, 8, 0.04) 45%, transparent 75%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Bottom Ambient Glow Blob (Gold) */}
      <div
        className="fixed -bottom-40 right-10 w-[500px] h-[400px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(234, 179, 8, 0.08) 0%, rgba(75, 163, 227, 0.05) 50%, transparent 80%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Top Bar / Header ── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D1420]/80 border border-slate-800/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-accent/10 border border-brand-blue/30 shadow-[0_0_15px_rgba(75,163,227,0.3)]">
              <Image
                src="/images/logo-icon.png"
                alt="BetaVolt Logo"
                width={26}
                height={26}
                className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(75,163,227,0.8)]"
                priority
              />
            </div>
            <div>
              <div className="font-orbitron font-black text-xl tracking-wider leading-none">
                <span className="text-white">BETA</span>
                <span className="text-brand-blue drop-shadow-[0_0_12px_rgba(75,163,227,0.6)]">VOLT</span>
              </div>
              <p className="text-[10px] font-orbitron tracking-[0.2em] text-slate-400 uppercase mt-0.5">
                Engineering &amp; Contracting
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-[0_0_12px_rgba(234,179,8,0.2)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="font-cairo">النظام في وضع الصيانة والتطوير</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col items-center text-center my-auto">
        
        {/* Top Mini-Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs font-orbitron tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(75,163,227,0.15)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-brand-blue" />
          <span>HTTP_STATUS_404 // PLATFORM_MAINTENANCE_ACTIVE</span>
        </div>

        {/* ── Giant 404 Visual ── */}
        <div className="relative mb-6 select-none">
          <div className="font-orbitron font-black text-7xl sm:text-9xl md:text-[11rem] leading-none tracking-tighter bg-gradient-to-b from-white via-brand-blue to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(75,163,227,0.4)]">
            404
          </div>
          {/* Subtle Circuit Overlay Line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-60 pointer-events-none shadow-[0_0_12px_rgba(234,179,8,0.8)]" />
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-cairo text-white tracking-tight mb-4 max-w-3xl leading-snug">
          الصفحة غير متاحة حالياً.. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-blue via-[#60b4f0] to-brand-accent bg-clip-text text-transparent">
            المنصة تخضع لأعمال الصيانة والتحديث الدوري
          </span>
        </h1>

        {/* Subtitle Description */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg font-cairo max-w-2xl leading-relaxed mb-8 text-balance">
          نعمل حالياً في <strong className="text-brand-blue font-bold">BetaVolt</strong> على ترقية شاملة للبنية التحتية الرقمية،
          وتحديث أنظمة الطاقة والتيار الخفيف ومراكز البيانات لتقديم تجربة هندسية متكاملة تليق بتطلعاتكم.
          سنعود للعمل بكامل طاقتنا قريباً جداً.
        </p>

        {/* ── Live Technical Diagnostic Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-4xl mb-8 text-right">
          {/* Card 1: Servers */}
          <div className="p-4 rounded-xl bg-[#0D1420]/70 border border-slate-800/90 hover:border-brand-blue/40 transition-all duration-300 backdrop-blur-md group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 group-hover:scale-105 transition-transform">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-orbitron text-brand-blue font-bold px-2 py-0.5 rounded bg-brand-blue/10">
                UPGRADING
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-cairo mb-1">الخوادم والبنية السحابية</h3>
            <p className="text-xs text-slate-400 font-cairo">
              ترقية قواعد البيانات ومزامنة الخوادم السحابية لسرعة وأمان أعلى.
            </p>
          </div>

          {/* Card 2: Systems */}
          <div className="p-4 rounded-xl bg-[#0D1420]/70 border border-slate-800/90 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-md group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-orbitron text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10">
                OPTIMIZING
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-cairo mb-1">الأنظمة الكهروميكانيكية</h3>
            <p className="text-xs text-slate-400 font-cairo">
              تطوير واجهات إدارة المشاريع والخدمات الهندسية والتيار الخفيف.
            </p>
          </div>

          {/* Card 3: Security */}
          <div className="p-4 rounded-xl bg-[#0D1420]/70 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-md group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-orbitron text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10">
                ACTIVE
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-cairo mb-1">الأمان والاعتمادية</h3>
            <p className="text-xs text-slate-400 font-cairo">
              فحص شامل لبروتوكولات التشفير ومعايير السلامة والجودة العالمية.
            </p>
          </div>
        </div>

        {/* ── Progress Bar Simulation ── */}
        <div className="w-full max-w-2xl bg-[#0D1420]/90 border border-slate-800 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between text-xs font-cairo text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Wrench className="w-3.5 h-3.5 text-brand-blue" />
              تقدم أعمال التحديث والصيانة الهندسية
            </span>
            <span className="font-orbitron text-brand-blue font-bold">88%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-brand-blue via-[#60b4f0] to-brand-accent rounded-full relative overflow-hidden transition-all duration-1000 shadow-[0_0_12px_rgba(75,163,227,0.6)]"
              style={{ width: '88%' }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-pulse" />
            </div>
          </div>
        </div>

        {/* ── Contact & Action Section ── */}
        <div className="w-full max-w-xl bg-gradient-to-b from-[#0D1420] to-[#0A0F16] border border-brand-blue/20 rounded-2xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <h2 className="text-base sm:text-lg font-bold font-cairo text-white mb-2 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-brand-accent" />
            هل لديك مشروع عاجل أو استفسار للمهندسين؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-cairo mb-4">
            فريقنا الهندسي متاح دائماً للرد على استفسارات المشاريع والعقود عبر البريد الرسمي:
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {/* Direct Email Button */}
            <a
              href="mailto:info@betavolt.com.sa"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-slate-950 font-bold font-cairo text-sm transition-all duration-200 shadow-[0_0_20px_rgba(75,163,227,0.3)] hover:shadow-[0_0_30px_rgba(75,163,227,0.5)] hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              <span>مراسلتنا عبر البريد</span>
            </a>

            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold font-cairo text-sm transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">تم نسخ البريد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>نسخ: info@betavolt.com.sa</span>
                </>
              )}
            </button>

            {/* Reload Status Check Button */}
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-cairo transition-all disabled:opacity-50"
              title="فحص حالة السيرفر"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-brand-blue' : ''}`} />
              <span>{isChecking ? 'جارٍ الفحص...' : 'فحص الحالة'}</span>
            </button>
          </div>

          {/* Feedback Message */}
          {checkMessage && (
            <div className="mt-3 text-xs text-amber-400/90 font-cairo bg-amber-500/10 border border-amber-500/20 py-1.5 px-3 rounded-lg">
              {checkMessage}
            </div>
          )}
        </div>

      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-cairo text-center sm:text-right">
        <div>
          &copy; {new Date().getFullYear()} <span className="font-orbitron font-bold text-slate-400">BetaVolt</span> للمقاولات الكهروميكانيكية والأنظمة الذكية. جميع الحقوق محفوظة.
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span>المملكة العربية السعودية</span>
          <span>•</span>
          <span>مقاول معتمد للتيار الخفيف والكهرباء ومراكز البيانات</span>
        </div>
      </footer>
    </main>
  );
}
