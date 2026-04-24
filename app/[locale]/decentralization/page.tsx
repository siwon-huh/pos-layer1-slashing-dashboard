import { notFound } from 'next/navigation';
import { DecentralizationDashboard } from '@/components/DecentralizationDashboard';
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
    title: isKo ? 'PoS L1 노드 탈중앙화 대시보드' : 'PoS L1 Node Decentralization Dashboard',
    description: isKo
      ? 'Nakamoto Coefficient, 검증자 수, 진입 장벽, 상위 스테이크 점유율 등으로 PoS L1 체인의 노드 탈중앙화 수준을 비교한 대시보드.'
      : 'Dashboard comparing node decentralization across PoS L1 chains via Nakamoto Coefficient, validator counts, entry barriers, and top-stake concentration.',
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main className="min-h-full flex-1 bg-zinc-950 text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.06),transparent_50%)]"
      />
      <DecentralizationDashboard locale={locale} />
    </main>
  );
}
