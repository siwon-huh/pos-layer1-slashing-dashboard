'use client';

import { useEffect, useMemo, useState } from 'react';
import { CHAINS, type Chain } from '@/lib/chains';
import { UI, pick, type Locale } from '@/lib/i18n';
import { ChainTable } from './ChainTable';
import { Credits } from './Credits';
import { LocaleSwitcher } from './LocaleSwitcher';
import { PageNav } from './PageNav';

type FilterKey =
  | 'all'
  | 'active'
  | 'inactive'
  | 'tendermint'
  | 'evm-related'
  | 'substrate'
  | 'other';

const FILTER_KEYS: readonly { key: FilterKey; uiKey: keyof typeof UI }[] = [
  { key: 'all', uiKey: 'filter_all' },
  { key: 'active', uiKey: 'filter_active' },
  { key: 'inactive', uiKey: 'filter_inactive' },
  { key: 'tendermint', uiKey: 'filter_tendermint' },
  { key: 'substrate', uiKey: 'filter_substrate' },
  { key: 'evm-related', uiKey: 'filter_evm' },
  { key: 'other', uiKey: 'filter_other' },
];

function matchesFilter(chain: Chain, filter: FilterKey): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'active':
      return chain.slashingStatus === 'active';
    case 'inactive':
      return chain.slashingStatus !== 'active';
    case 'tendermint':
      return chain.consensusFamily === 'Tendermint';
    case 'substrate':
      return chain.consensusFamily === 'NPoS';
    case 'evm-related':
      return (
        chain.consensusFamily === 'Gasper' ||
        chain.consensusFamily === 'PoSA' ||
        chain.id === 'polygon'
      );
    case 'other':
      return (
        chain.consensusFamily !== 'Tendermint' &&
        chain.consensusFamily !== 'Gasper' &&
        chain.consensusFamily !== 'PoSA' &&
        chain.consensusFamily !== 'NPoS' &&
        chain.id !== 'polygon'
      );
  }
}

interface DashboardProps {
  locale: Locale;
  chains?: readonly Chain[];
}

export function Dashboard({ locale, chains = CHAINS }: DashboardProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chains
      .filter((c) => matchesFilter(c, filter))
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.nameKo.includes(q) ||
          c.symbol.toLowerCase().includes(q),
      )
      .slice()
      .sort((a, b) => a.tvlRank - b.tvlRank);
  }, [chains, filter, query]);

  const stats = useMemo(() => {
    const active = chains.filter((c) => c.slashingStatus === 'active').length;
    const inactive = chains.filter((c) => c.slashingStatus === 'inactive').length;
    const none = chains.filter((c) => c.slashingStatus === 'none').length;
    return { total: chains.length, active, inactive, none };
  }, [chains]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:py-16">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageNav locale={locale} active="slashing" />
          <LocaleSwitcher current={locale} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-5xl">
          {pick(UI.title_prefix, locale)}
          {pick(UI.title_main, locale)}
          {pick(UI.title_suffix, locale)}
        </h1>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard label={pick(UI.stat_total, locale)} value={stats.total} suffix={pick(UI.stat_suffix, locale)} />
        <StatCard
          label={pick(UI.stat_active, locale)}
          value={stats.active}
          suffix={pick(UI.stat_suffix, locale)}
          accent="emerald"
        />
        <StatCard
          label={pick(UI.stat_inactive, locale)}
          value={stats.inactive}
          suffix={pick(UI.stat_suffix, locale)}
          accent="amber"
        />
        <StatCard label={pick(UI.stat_none, locale)} value={stats.none} suffix={pick(UI.stat_suffix, locale)} accent="zinc" />
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {pick(UI.legend_title, locale)}
        </h2>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-xs text-zinc-400 md:grid-cols-3">
          <LegendItem
            color="#F43F5E"
            title={pick(UI.legend_burn_title, locale)}
            desc={pick(UI.legend_burn_desc, locale)}
          />
          <LegendItem
            color="#3B82F6"
            title={pick(UI.legend_treasury_title, locale)}
            desc={pick(UI.legend_treasury_desc, locale)}
          />
          <LegendItem
            color="#F59E0B"
            title={pick(UI.legend_validator_title, locale)}
            desc={pick(UI.legend_validator_desc, locale)}
          />
        </dl>
      </section>

      <section className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTER_KEYS.map(({ key, uiKey }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                filter === key
                  ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {pick(UI[uiKey], locale)}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={pick(UI.search_placeholder, locale)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 transition focus:border-zinc-500 focus:outline-none md:w-72"
        />
      </section>

      <section className="mt-6">
        <ChainTable chains={filtered} locale={locale} />
      </section>

      <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-500">
        <p>{pick(UI.footer, locale)}</p>
        <Credits locale={locale} />
      </footer>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  accent?: 'zinc' | 'emerald' | 'amber';
}

function StatCard({ label, value, suffix, accent = 'zinc' }: StatCardProps) {
  const accentColor = {
    zinc: 'text-zinc-100',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
  }[accent];
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold md:text-3xl ${accentColor}`}>{value}</span>
        {suffix && <span className="text-xs text-zinc-500">{suffix}</span>}
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: string;
  title: string;
  desc: string;
}

function LegendItem({ color, title, desc }: LegendItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-1 size-2 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <div>
        <div className="text-xs font-medium text-zinc-200">{title}</div>
        <div className="mt-0.5 text-xs text-zinc-500">{desc}</div>
      </div>
    </div>
  );
}
