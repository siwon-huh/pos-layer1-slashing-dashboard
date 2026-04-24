'use client';

import { useEffect, useMemo, useState } from 'react';
import { CHAINS } from '@/lib/chains';
import { DECENTRALIZATION, getDecentralization } from '@/lib/decentralization';
import { UI, pick, type Locale } from '@/lib/i18n';
import { DecentralizationTable, type ChainWithDec } from './DecentralizationTable';
import { LocaleSwitcher } from './LocaleSwitcher';
import { PageNav } from './PageNav';

interface DecentralizationDashboardProps {
  locale: Locale;
}

export function DecentralizationDashboard({ locale }: DecentralizationDashboardProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const rows: ChainWithDec[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHAINS.map((chain) => ({ chain, dec: getDecentralization(chain.id) }))
      .filter(
        ({ chain }) =>
          !q ||
          chain.name.toLowerCase().includes(q) ||
          chain.nameKo.includes(q) ||
          chain.symbol.toLowerCase().includes(q),
      )
      .slice()
      .sort((a, b) => a.chain.tvlRank - b.chain.tvlRank);
  }, [query]);

  const stats = useMemo(() => {
    const ncValues = DECENTRALIZATION.filter((d) => d.nakamotoCoefficient !== null)
      .map((d) => d.nakamotoCoefficient!)
      .sort((a, b) => a - b);
    const median =
      ncValues.length === 0 ? null : ncValues[Math.floor(ncValues.length / 2)];
    const permissionless = DECENTRALIZATION.filter((d) => d.permissioning === 'permissionless').length;
    const hybrid = DECENTRALIZATION.filter((d) => d.permissioning === 'hybrid').length;
    const permissioned = DECENTRALIZATION.filter((d) => d.permissioning === 'permissioned').length;
    return { median, permissionless, hybrid, permissioned };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:py-16">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageNav locale={locale} active="decentralization" />
          <LocaleSwitcher current={locale} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-5xl">
          PoS L1 {pick(UI.decentralization_title_main, locale)}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
          {pick(UI.decentralization_subtitle, locale)}
        </p>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard
          label={pick(UI.dec_stat_median_nc, locale)}
          value={stats.median !== null ? String(stats.median) : '-'}
        />
        <StatCard
          label={pick(UI.dec_stat_permissionless, locale)}
          value={String(stats.permissionless)}
          suffix={pick(UI.stat_suffix, locale)}
          accent="emerald"
        />
        <StatCard
          label={pick(UI.dec_stat_hybrid, locale)}
          value={String(stats.hybrid)}
          suffix={pick(UI.stat_suffix, locale)}
          accent="amber"
        />
        <StatCard
          label={pick(UI.dec_stat_permissioned, locale)}
          value={String(stats.permissioned)}
          suffix={pick(UI.stat_suffix, locale)}
          accent="rose"
        />
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {pick(UI.dec_legend_title, locale)}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          {pick(UI.dec_legend_body, locale)}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-rose-300">
            <span aria-hidden className="size-1.5 rounded-full bg-rose-400" />
            {pick(UI.dec_legend_color_low, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-300">
            <span aria-hidden className="size-1.5 rounded-full bg-amber-400" />
            {pick(UI.dec_legend_color_mid, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
            <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
            {pick(UI.dec_legend_color_high, locale)}
          </span>
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={pick(UI.search_placeholder, locale)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 transition focus:border-zinc-500 focus:outline-none md:w-72"
        />
      </section>

      <section className="mt-6">
        <DecentralizationTable rows={rows} locale={locale} />
      </section>

      <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-500">
        <p>{pick(UI.footer, locale)}</p>
      </footer>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
  accent?: 'zinc' | 'emerald' | 'amber' | 'rose';
}

function StatCard({ label, value, suffix, accent = 'zinc' }: StatCardProps) {
  const accentColor = {
    zinc: 'text-zinc-100',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
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
