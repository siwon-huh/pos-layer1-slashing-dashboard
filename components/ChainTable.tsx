'use client';

import { Fragment, useState } from 'react';
import {
  formatTvlUsd,
  type Chain,
  type Severity,
  type SlashingStatus,
} from '@/lib/chains';
import {
  CONSENSUS_FAMILY_LABEL,
  SEVERITY_LABEL,
  SLASHING_STATUS_LABEL,
  TOKEN_DESTINATION_LABEL,
  UI,
  pick,
  type Locale,
} from '@/lib/i18n';

interface ChainTableProps {
  chains: readonly Chain[];
  locale: Locale;
}

const severityStyle: Record<Severity, string> = {
  severe: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  moderate: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  mild: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
};

const statusStyle: Record<SlashingStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  inactive: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  none: 'bg-zinc-700/40 text-zinc-400 border-zinc-700',
};

const statusDot: Record<SlashingStatus, string> = {
  active: 'bg-emerald-400',
  inactive: 'bg-amber-400',
  none: 'bg-zinc-500',
};

export function ChainTable({ chains, locale }: ChainTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(chains.map((c) => c.id)));
  const collapseAll = () => setExpanded(new Set());

  if (chains.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-16 text-center text-sm text-zinc-500">
        {pick(UI.empty, locale)}
      </div>
    );
  }

  const countText =
    locale === 'ko'
      ? `${chains.length}${pick(UI.table_count_suffix, locale)}`
      : `${chains.length}${pick(UI.table_count_suffix, locale)}`;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-500">
        <span>{countText}</span>
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
              <th className="px-3 py-3 text-left font-medium">{pick(UI.table_header_chain, locale)}</th>
              <th className="px-3 py-3 text-right font-medium">{pick(UI.table_header_tvl, locale)}</th>
              <th className="hidden px-3 py-3 text-left font-medium md:table-cell">
                {pick(UI.table_header_consensus, locale)}
              </th>
              <th className="px-3 py-3 text-left font-medium">
                {pick(UI.table_header_slashing, locale)}
              </th>
              <th className="hidden px-3 py-3 text-left font-medium lg:table-cell">
                {pick(UI.table_header_token, locale)}
              </th>
              <th className="w-10 px-3 py-3 text-right font-medium" aria-hidden></th>
            </tr>
          </thead>
          <tbody>
            {chains.map((chain) => (
              <Fragment key={chain.id}>
                <TableRow
                  chain={chain}
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
  locale: Locale;
  expanded: boolean;
  onToggle: () => void;
}

function TableRow({ chain, locale, expanded, onToggle }: TableRowProps) {
  const secondaryName = locale === 'ko' ? chain.nameKo : chain.symbol;
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
              {locale === 'ko' && (
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                  {chain.symbol}
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-500">{secondaryName}</div>
          </div>
        </td>
        <td className="px-3 py-3 text-right align-middle font-mono text-xs text-zinc-300">
          {formatTvlUsd(chain.tvlUsd)}
        </td>
        <td className="hidden px-3 py-3 align-middle text-xs text-zinc-400 md:table-cell">
          {pick(CONSENSUS_FAMILY_LABEL[chain.consensusFamily], locale)}
        </td>
        <td className="px-3 py-3 align-middle">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider ${statusStyle[chain.slashingStatus]}`}
          >
            <span aria-hidden className={`size-1.5 rounded-full ${statusDot[chain.slashingStatus]}`} />
            {pick(SLASHING_STATUS_LABEL[chain.slashingStatus], locale)}
          </span>
        </td>
        <td className="hidden px-3 py-3 align-middle text-xs text-zinc-400 lg:table-cell">
          {pick(TOKEN_DESTINATION_LABEL[chain.tokenDestination], locale)}
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
          <td colSpan={7} className="px-6 py-5">
            <ExpandedDetail chain={chain} locale={locale} />
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedDetail({ chain, locale }: { chain: Chain; locale: Locale }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          {pick(UI.detail_consensus, locale)}
        </h4>
        <p className="mt-1 text-sm text-zinc-300">{pick(chain.consensus, locale)}</p>
      </div>

      {chain.slashingNote && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-200 lg:col-span-3">
          ⚠ {pick(chain.slashingNote, locale)}
        </div>
      )}

      <section className="lg:col-span-2">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          {pick(UI.detail_offenses, locale)}
        </h4>
        {chain.offenses.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {chain.offenses.map((offense) => (
              <li
                key={offense.name.en}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-medium text-zinc-200">
                        {pick(offense.name, locale)}
                      </span>
                      {locale === 'ko' && offense.name.ko !== offense.name.en && (
                        <span className="font-mono text-[10px] text-zinc-500">{offense.name.en}</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {pick(offense.description, locale)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded border px-2 py-0.5 text-[10px] ${severityStyle[offense.severity]}`}
                  >
                    {pick(SEVERITY_LABEL[offense.severity], locale)}
                  </span>
                </div>
                <div className="mt-2 border-t border-zinc-800 pt-2 font-mono text-xs text-zinc-300">
                  → {pick(offense.penalty, locale)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-500">
            {pick(UI.detail_no_offenses, locale)}
          </p>
        )}
      </section>

      <section>
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          {pick(UI.detail_token, locale)}
        </h4>
        <div className="mt-2 rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3">
          <div className="mb-2 inline-block rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-200">
            {pick(TOKEN_DESTINATION_LABEL[chain.tokenDestination], locale)}
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            {pick(chain.tokenHandlingDescription, locale)}
          </p>
        </div>
        {chain.docsUrl && (
          <a
            href={chain.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1 text-xs text-zinc-500 transition hover:text-zinc-200"
          >
            {pick(UI.detail_docs, locale)}
            <span aria-hidden>→</span>
          </a>
        )}
      </section>
    </div>
  );
}
