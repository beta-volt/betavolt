'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, RefreshCw, LogOut } from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { useAdminLang } from './AdminLangProvider';
import { useAdminRefresh } from './AdminRefreshProvider';
import ThemeToggle from '@/components/layout/ThemeToggle';

const TITLES: Record<string, { en: string; ar: string }> = {
  '/admin':                         { en: 'Dashboard Overview',    ar: 'لوحة التحكم'               },
  '/admin/content/home':            { en: 'Home Page Content',     ar: 'محتوى الصفحة الرئيسية'     },
  '/admin/content/services':        { en: 'Services Page Content', ar: 'محتوى صفحة الخدمات'       },
  '/admin/content/projects':        { en: 'Projects Management',   ar: 'إدارة المشاريع'            },
  '/admin/content/about':           { en: 'About Page Content',    ar: 'محتوى صفحة من نحن'         },
  '/admin/content/contact':         { en: 'Contact Page Content',  ar: 'محتوى صفحة التواصل'       },
  '/admin/content/header':          { en: 'Navbar Content',        ar: 'محتوى شريط التنقل'        },
  '/admin/content/footer':          { en: 'Footer Content',        ar: 'محتوى تذييل الصفحة'       },
  '/admin/content/quote-modal':     { en: 'Quote Modal Content',   ar: 'محتوى نموذج طلب العرض'    },
  '/admin/inquiries':               { en: 'Inquiries',             ar: 'الاستفسارات'               },
};

export default function AdminHeader() {
  const { toggle }           = useSidebar();
  const { lang, setLang }    = useAdminLang();
  const { triggerRefresh }   = useAdminRefresh();
  const pathname             = usePathname();
  const [spinning, setSpinning] = useState(false);

  function handleRefresh() {
    setSpinning(true);
    triggerRefresh();
    setTimeout(() => setSpinning(false), 700);
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // Proceed to login redirect even on network error
    }
    window.location.href = '/admin/login';
  }

  const titleObj = Object.entries(TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1];

  const title = titleObj?.[lang] ?? 'Admin';

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">

      {/* Mobile hamburger */}
      <button
        onClick={toggle}
        aria-label="Toggle sidebar"
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 shrink-0"
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      {/* Page title */}
      <h1 className="text-base font-bold text-slate-900 dark:text-white truncate flex-1">
        {title}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Bilingual toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-0.5 gap-0.5">
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

        {/* Refresh button */}
        <button
          type="button"
          onClick={handleRefresh}
          aria-label="Refresh page"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-150 shrink-0"
        >
          <RefreshCw size={15} strokeWidth={2.2} className={spinning ? 'animate-spin' : 'transition-transform duration-150'} />
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
        <ThemeToggle />
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-black select-none shrink-0">
            A
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">Admin</span>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          title="Sign out"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-150 shrink-0"
        >
          <LogOut size={15} strokeWidth={2} />
        </button>
      </div>

    </header>
  );
}
