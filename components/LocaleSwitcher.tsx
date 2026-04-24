'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/i18n';

interface LocaleSwitcherProps {
  current: Locale;
}

const LABEL: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

function swapLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${locale}`;
  segments[0] = locale;
  return `/${segments.join('/')}`;
}

export function LocaleSwitcher({ current }: LocaleSwitcherProps) {
  const pathname = usePathname();
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs"
    >
      {LOCALES.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={swapLocale(pathname, locale)}
            aria-current={active ? 'page' : undefined}
            className={`px-3 py-1.5 transition ${
              active
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {LABEL[locale]}
          </Link>
        );
      })}
    </div>
  );
}
