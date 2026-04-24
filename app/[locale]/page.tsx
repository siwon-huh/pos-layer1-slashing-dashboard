import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';
import { isLocale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isKo = locale === 'ko';
  return {
    title: isKo ? 'PoS L1 슬래싱 대시보드' : 'PoS L1 Slashing Dashboard',
    description: isKo
      ? '시가총액 상위 100 L1 블록체인 중 Proof-of-Stake 체인의 합의 메커니즘, 슬래싱 조건, 슬래싱된 토큰 처리 방식을 정리한 대시보드.'
      : 'Dashboard summarizing consensus mechanisms, slashable conditions, and slashed-token handling for PoS L1 blockchains in the top 100 by market cap.',
  };
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main className="min-h-full flex-1 bg-zinc-950 text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.06),transparent_50%)]"
      />
      <Dashboard locale={locale} />
    </main>
  );
}
