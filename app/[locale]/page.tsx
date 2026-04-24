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
      ? 'PoS L1 체인의 합의 메커니즘, 슬래싱 조건, 슬래싱된 토큰 처리 방식을 비교한 대시보드.'
      : 'A dashboard comparing consensus mechanisms, slashable conditions, and slashed-token handling across PoS L1 chains.',
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
