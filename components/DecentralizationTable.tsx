'use client';

import { Fragment, useState } from 'react';
import type { Chain } from '@/lib/chains';
import {
  CLIENT_DIVERSITY_LABEL,
  CONSENSUS_FAMILY_LABEL,
  PERMISSIONING_LABEL,
  UI,
  pick,
  type Locale,
} from '@/lib/i18n';
import type { DecentralizationData, Permissioning } from '@/lib/decentralization';

export interface ChainWithDec {
  chain: Chain;
  dec: DecentralizationData | undefined;
}

interface DecentralizationTableProps {
  rows: readonly ChainWithDec[];
  locale: Locale;
}

const permissionStyle: Record<Permissioning, string> = {
  permissionless: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  hybrid: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  permissioned: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  'n/a': 'bg-zinc-700/40 text-zinc-400 border-zinc-700',
};

const clientStyle: Record<'single' | 'multi' | 'n/a', string> = {
  multi: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  single: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  'n/a': 'bg-zinc-700/40 text-zinc-400 border-zinc-700',
};

function ncColor(nc: number | null): string {
  if (nc === null) return 'text-zinc-500';
  if (nc <= 5) return 'text-rose-400';
  if (nc <= 15) return 'text-amber-400';
  return 'text-emerald-400';
}

function formatNc(nc: number): string {
  if (nc >= 1_000_000) return `${(nc / 1_000_000).toFixed(1)}M`;
  if (nc >= 10_000) return `${Math.round(nc / 1_000)}K`;
  if (nc >= 1_000) return `${(nc / 1_000).toFixed(1)}K`;
  return String(nc);
}

function formatValidators(active: number | null, cap: number | null, locale: Locale): string {
  if (active === null && cap === null) return pick(UI.no_data, locale);
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);
  if (cap === null) return active !== null ? `${fmt(active)} / ${pick(UI.uncapped, locale)}` : pick(UI.no_data, locale);
  if (active === null) return `— / ${fmt(cap)}`;
  return `${fmt(active)} / ${fmt(cap)}`;
}

export function DecentralizationTable({ rows, locale }: DecentralizationTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(rows.map((r) => r.chain.id)));
  const collapseAll = () => setExpanded(new Set());

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-16 text-center text-sm text-zinc-500">
        {pick(UI.empty, locale)}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-500">
        <span>
          {rows.length}
          {pick(UI.table_count_suffix, locale)}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="rounded border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-zinc-400 transition hover:text-zinc-200"
          >
            {pick(UI.expand_all, locale)}
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-zinc-400 transition hover:text-zinc-200"
          >
            {pick(UI.collapse_all, locale)}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="w-10 px-3 py-3 text-right font-medium">
                {pick(UI.table_header_rank, locale)}
              </th>
              <th className="px-3 py-3 text-left font-medium">
                {pick(UI.table_header_chain, locale)}
              </th>
              <th className="px-3 py-3 text-right font-medium">
                {pick(UI.dec_col_nakamoto, locale)}
              </th>
              <th className="hidden px-3 py-3 text-right font-medium md:table-cell">
                {pick(UI.dec_col_validators, locale)}
              </th>
              <th className="px-3 py-3 text-left font-medium">
                {pick(UI.dec_col_permission, locale)}
              </th>
              <th className="hidden px-3 py-3 text-right font-medium lg:table-cell">
                {pick(UI.dec_col_top33, locale)}
              </th>
              <th className="hidden px-3 py-3 text-left font-medium md:table-cell">
                {pick(UI.dec_col_client, locale)}
              </th>
              <th className="w-10 px-3 py-3 text-right font-medium" aria-hidden></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ chain, dec }) => (
              <Fragment key={chain.id}>
                <TableRow
                  chain={chain}
                  dec={dec}
                  locale={locale}
                  expanded={expanded.has(chain.id)}
                  onToggle={() => toggle(chain.id)}
                />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TableRowProps {
  chain: Chain;
  dec: DecentralizationData | undefined;
  locale: Locale;
  expanded: boolean;
  onToggle: () => void;
}

function TableRow({ chain, dec, locale, expanded, onToggle }: TableRowProps) {
  const nc = dec?.nakamotoCoefficient ?? null;
  const permissioning: Permissioning = dec?.permissioning ?? 'n/a';
  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer border-b border-zinc-800/60 transition ${
          expanded ? 'bg-zinc-900/60' : 'hover:bg-zinc-900/40'
        }`}
      >
        <td className="px-3 py-3 text-right align-middle font-mono text-xs text-zinc-500">
          {chain.tvlRank}
        </td>
        <td className="px-3 py-3 align-middle">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-100">{chain.name}</span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                {chain.symbol}
              </span>
            </div>
            <div className="text-xs text-zinc-500">
              {locale === 'ko' ? `${chain.nameKo}, ` : ''}
              {pick(CONSENSUS_FAMILY_LABEL[chain.consensusFamily], locale)}
            </div>
          </div>
        </td>
        <td className={`px-3 py-3 text-right align-middle font-mono text-lg font-semibold ${ncColor(nc)}`}>
          {nc !== null ? formatNc(nc) : '-'}
        </td>
        <td className="hidden px-3 py-3 text-right align-middle font-mono text-xs text-zinc-300 md:table-cell">
          {formatValidators(dec?.activeValidators ?? null, dec?.validatorCap ?? null, locale)}
        </td>
        <td className="px-3 py-3 align-middle">
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${permissionStyle[permissioning]}`}
          >
            {pick(PERMISSIONING_LABEL[permissioning], locale)}
          </span>
        </td>
        <td className="hidden px-3 py-3 text-right align-middle font-mono text-xs text-zinc-300 lg:table-cell">
          {dec?.top33SharePct != null ? `${dec.top33SharePct.toFixed(1)}%` : '-'}
        </td>
        <td className="hidden px-3 py-3 align-middle md:table-cell">
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${clientStyle[dec?.clientDiversity ?? 'n/a']}`}
          >
            {pick(CLIENT_DIVERSITY_LABEL[dec?.clientDiversity ?? 'n/a'], locale)}
          </span>
        </td>
        <td className="px-3 py-3 text-right align-middle">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className={`inline-block size-4 text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-zinc-800 bg-zinc-950/60">
          <td colSpan={8} className="px-6 py-5">
            <ExpandedDetail chain={chain} dec={dec} locale={locale} />
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedDetail({
  chain,
  dec,
  locale,
}: {
  chain: Chain;
  dec: DecentralizationData | undefined;
  locale: Locale;
}) {
  if (!dec) {
    return (
      <p className="text-xs text-zinc-500">
        {pick(UI.no_data, locale)} ({chain.name})
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <DetailItem
        label={pick(UI.dec_detail_nakamoto, locale)}
        value={
          dec.nakamotoCoefficient !== null
            ? formatNc(dec.nakamotoCoefficient)
            : pick(UI.no_data, locale)
        }
        description={
          dec.nakamotoNote ? pick(dec.nakamotoNote, locale) : pick(UI.dec_detail_nakamoto_desc, locale)
        }
      />
      <DetailItem
        label={pick(UI.dec_detail_validators, locale)}
        value={formatValidators(dec.activeValidators, dec.validatorCap, locale)}
      />
      <DetailItem
        label={pick(UI.dec_detail_permission, locale)}
        value={pick(PERMISSIONING_LABEL[dec.permissioning], locale)}
      />
      <DetailItem
        label={pick(UI.dec_detail_entry, locale)}
        value={pick(dec.minStake, locale)}
      />
      <DetailItem
        label={pick(UI.dec_detail_top33, locale)}
        value={dec.top33SharePct != null ? `${dec.top33SharePct.toFixed(1)}%` : pick(UI.no_data, locale)}
      />
      <DetailItem
        label={pick(UI.dec_detail_client, locale)}
        value={pick(CLIENT_DIVERSITY_LABEL[dec.clientDiversity], locale)}
        description={dec.clientDiversityNote ? pick(dec.clientDiversityNote, locale) : undefined}
      />
      {dec.notes && (
        <p className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs leading-relaxed text-zinc-400 lg:col-span-3">
          {pick(dec.notes, locale)}
        </p>
      )}
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-3 text-xs text-zinc-500 lg:col-span-3">
        <span>
          {pick(UI.dec_detail_last_updated, locale)}: {dec.lastUpdated}
        </span>
        {dec.sourceUrls && dec.sourceUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span>{pick(UI.dec_detail_sources, locale)}:</span>
            {dec.sourceUrls.map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
              >
                [{i + 1}]
              </a>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
}

function DetailItem({ label, value, description }: { label: string; value: string; description?: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-zinc-100">{value}</div>
      {description && <div className="mt-1 text-xs leading-relaxed text-zinc-400">{description}</div>}
    </div>
  );
}
