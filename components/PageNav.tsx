import Link from 'next/link';
import { UI, pick, type Locale } from '@/lib/i18n';

interface PageNavProps {
  locale: Locale;
  active: 'slashing' | 'decentralization';
}

export function PageNav({ locale, active }: PageNavProps) {
  const tabs: { key: 'slashing' | 'decentralization'; href: string; uiKey: 'nav_slashing' | 'nav_decentralization' }[] = [
    { key: 'slashing', href: `/${locale}`, uiKey: 'nav_slashing' },
    { key: 'decentralization', href: `/${locale}/decentralization`, uiKey: 'nav_decentralization' },
  ];
  return (
    <nav
      role="tablist"
      aria-label="Sections"
      className="inline-flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            role="tab"
            aria-selected={isActive}
            className={`px-3 py-1.5 transition ${
              isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {pick(UI[tab.uiKey], locale)}
          </Link>
        );
      })}
    </nav>
  );
}
