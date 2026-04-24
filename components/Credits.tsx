import { UI, pick, type Locale } from '@/lib/i18n';

interface CreditsProps {
  locale: Locale;
}

export function Credits({ locale }: CreditsProps) {
  return (
    <p className="mt-3 text-zinc-500">
      {pick(UI.credits_prefix, locale)}
      <a
        href="https://research.4pillars.io/en/researchers/c4lvin"
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-300 underline-offset-2 hover:text-zinc-100 hover:underline"
      >
        {pick(UI.credits_author, locale)}
      </a>
      {pick(UI.credits_role, locale)}
    </p>
  );
}
