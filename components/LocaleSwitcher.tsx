import Link from 'next/link';
import { LOCALES, type Locale } from '@/lib/i18n';

interface LocaleSwitcherProps {
  current: Locale;
}

const LABEL: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export function LocaleSwitcher({ current }: LocaleSwitcherProps) {
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
            href={`/${locale}`}
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
