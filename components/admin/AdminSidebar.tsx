'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react'; // useEffect kept for contentOpen sync
import {
  LayoutDashboard,
  Inbox,
  ChevronDown,
  FolderOpen,
  Home,
  Wrench,
  Layers,
  Info,
  PhoneCall,
  PanelTop,
  PanelBottom,
  FileText,
  Shield,
  BarChart2,
} from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { useAdminLang } from './AdminLangProvider';
import { useAdminRole } from './AdminRoleProvider';

/* ─── Nav config ────────────────────────────────────────── */
const CONTENT_CHILDREN = [
  { href: '/admin/content/home',        label: { en: 'Home Page',     ar: 'الصفحة الرئيسية'   }, icon: Home        },
  { href: '/admin/content/services',    label: { en: 'Services Page', ar: 'صفحة الخدمات'       }, icon: Wrench      },
  { href: '/admin/content/projects',    label: { en: 'Projects Page', ar: 'صفحة المشاريع'      }, icon: Layers      },
  { href: '/admin/content/about',       label: { en: 'About Page',    ar: 'صفحة من نحن'        }, icon: Info        },
  { href: '/admin/content/contact',     label: { en: 'Contact Page',  ar: 'صفحة التواصل'      }, icon: PhoneCall   },
  { href: '/admin/content/header',      label: { en: 'Navbar',        ar: 'شريط التنقل'        }, icon: PanelTop    },
  { href: '/admin/content/footer',      label: { en: 'Footer',        ar: 'تذييل الصفحة'      }, icon: PanelBottom },
  { href: '/admin/content/quote-modal', label: { en: 'Quote Modal',   ar: 'نموذج طلب العرض'   }, icon: FileText    },
];

const NAV_L = {
  en: {
    navigation:  'Navigation',
    dashboard:   'Dashboard Overview',
    analytics:   'Analytics & B2B',
    contentMgmt: 'Content Management',
    inquiries:   'Inquiries',
    users:       'Admin Accounts',
    footer:      'BetaVolt Admin · v1.0.0',
  },
  ar: {
    navigation:  'التنقل',
    dashboard:   'لوحة التحكم',
    analytics:   'التحليلات والمبيعات',
    contentMgmt: 'إدارة المحتوى',
    inquiries:   'الاستفسارات',
    users:       'حسابات المدير',
    footer:      'BetaVolt Admin · الإصدار 1.0.0',
  },
};

/* ─── Shared classes ────────────────────────────────────── */
const BASE_ITEM =
  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border';
const ACTIVE_ITEM =
  'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60';
const IDLE_ITEM =
  'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white border-transparent';


/* ─── SidebarContent ────────────────────────────────────── */
function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { lang } = useAdminLang();
  const nav  = NAV_L[lang];
  const role = useAdminRole();

  const isUnderContent = pathname.startsWith('/admin/content');
  const [contentOpen, setContentOpen] = useState(isUnderContent);

  useEffect(() => {
    if (isUnderContent) setContentOpen(true);
  }, [isUnderContent]);

  function navActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const canAnalytics = role === 'super_admin' || role === 'sales';
  const canContent   = role === 'super_admin' || role === 'content_manager';
  const canInquiries = role === 'super_admin' || role === 'sales';
  const canUsers     = role === 'super_admin';

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <Image src="/images/logo-icon.png" alt="" width={24} height={24} className="w-6 h-6 object-contain shrink-0" />
        <span className="font-black text-base tracking-wide leading-none select-none">
          <span className="text-slate-900 dark:text-white">BETA</span>
          <span className="text-blue-500">VOLT</span>
        </span>
        <span className="ms-auto text-[9px] font-black tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 px-2 py-0.5 rounded-md shrink-0">
          Admin
        </span>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400 dark:text-slate-600 px-3 pt-3 pb-2">
          {nav.navigation}
        </p>

        {/* Dashboard — always visible */}
        <Link
          href="/admin"
          onClick={onLinkClick}
          className={[BASE_ITEM, navActive('/admin', true) ? ACTIVE_ITEM : IDLE_ITEM].join(' ')}
        >
          <LayoutDashboard size={17} strokeWidth={1.75} className="shrink-0" />
          <span className="flex-1 min-w-0 truncate">{nav.dashboard}</span>
          {navActive('/admin', true) && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
          )}
        </Link>

        {/* ── Analytics & B2B — super_admin + sales ── */}
        {canAnalytics && (
          <Link
            href="/admin/analytics"
            onClick={onLinkClick}
            className={[BASE_ITEM, navActive('/admin/analytics') ? ACTIVE_ITEM : IDLE_ITEM].join(' ')}
          >
            <BarChart2 size={17} strokeWidth={1.75} className="shrink-0" />
            <span className="flex-1 min-w-0 truncate">{nav.analytics}</span>
            {navActive('/admin/analytics') && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
            )}
          </Link>
        )}

        {/* ── Content Management — super_admin + content_manager ── */}
        {canContent && (
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => setContentOpen(v => !v)}
              className={[
                BASE_ITEM,
                'w-full text-start',
                isUnderContent && !contentOpen ? ACTIVE_ITEM : IDLE_ITEM,
              ].join(' ')}
            >
              <FolderOpen size={17} strokeWidth={1.75} className="shrink-0" />
              <span className="flex-1 min-w-0 truncate">{nav.contentMgmt}</span>
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className={[
                  'shrink-0 transition-transform duration-200',
                  isUnderContent ? 'text-blue-500' : 'text-slate-400 dark:text-slate-600',
                  contentOpen ? 'rotate-180' : 'rotate-0',
                ].join(' ')}
              />
            </button>

            <div
              className="overflow-hidden transition-all duration-200 ease-in-out"
              style={{ maxHeight: contentOpen ? `${CONTENT_CHILDREN.length * 52}px` : '0px' }}
            >
              <div className="ms-3 ps-3 border-s border-slate-200 dark:border-slate-800 flex flex-col gap-0.5 py-0.5">
                {CONTENT_CHILDREN.map(({ href, label, icon: Icon }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onLinkClick}
                      className={[
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                        active
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white',
                      ].join(' ')}
                    >
                      <Icon size={14} strokeWidth={1.75} className="shrink-0" />
                      <span className="flex-1 min-w-0 truncate">{label[lang]}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Inquiries — super_admin + sales ── */}
        {canInquiries && (
          <Link
            href="/admin/inquiries"
            onClick={onLinkClick}
            className={[BASE_ITEM, navActive('/admin/inquiries') ? ACTIVE_ITEM : IDLE_ITEM].join(' ')}
          >
            <Inbox size={17} strokeWidth={1.75} className="shrink-0" />
            <span className="flex-1 min-w-0 truncate">{nav.inquiries}</span>
            {navActive('/admin/inquiries') && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
            )}
          </Link>
        )}

        {/* ── Admin Accounts — super_admin only ── */}
        {canUsers && (
          <Link
            href="/admin/users"
            onClick={onLinkClick}
            className={[BASE_ITEM, navActive('/admin/users') ? ACTIVE_ITEM : IDLE_ITEM].join(' ')}
          >
            <Shield size={17} strokeWidth={1.75} className="shrink-0" />
            <span className="flex-1 min-w-0 truncate">{nav.users}</span>
            {navActive('/admin/users') && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
            )}
          </Link>
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center">
          {nav.footer}
        </p>
      </div>

    </div>
  );
}

/* ─── Export ─────────────────────────────────────────────── */
export default function AdminSidebar() {
  const { open, close } = useSidebar();
  const { lang }        = useAdminLang();
  const isRtl           = lang === 'ar';

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          'fixed inset-0 z-40 lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
      >
        <div
          className={[
            'absolute inset-0 bg-slate-900/50 backdrop-blur-sm',
            'transition-opacity duration-300 ease-in-out',
            open ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          onClick={close}
          aria-hidden="true"
        />
        <aside
          className={[
            'absolute start-0 top-0 bottom-0 w-64',
            'bg-white dark:bg-slate-900',
            'border-e border-slate-200 dark:border-slate-800',
            'shadow-2xl z-10',
            'transition-transform duration-300 ease-in-out',
            open ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full',
          ].join(' ')}
        >
          <SidebarContent onLinkClick={close} />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 start-0 w-64 bg-white dark:bg-slate-900 border-e border-slate-200 dark:border-slate-800 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
