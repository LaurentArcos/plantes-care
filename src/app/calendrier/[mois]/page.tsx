import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMois } from '@/lib/jardin';
import { MOIS_KEYS } from '@/types/jardin';
import type { MoisKey } from '@/types/jardin';
import ActionsGroupees from '@/components/ActionsGroupees';

export function generateStaticParams() {
  return MOIS_KEYS.map((mois) => ({ mois }));
}

export async function generateMetadata({ params }: { params: Promise<{ mois: string }> }) {
  const { mois } = await params;
  const data = getMois(mois as MoisKey);
  if (!data) return { title: 'Mois introuvable · Jardin' };
  return { title: `${data.mois} · Calendrier · Jardin` };
}

export default async function MoisPage({ params }: { params: Promise<{ mois: string }> }) {
  const { mois } = await params;
  const data = getMois(mois as MoisKey);
  if (!data) notFound();

  // Navigation précédent / suivant (wrap circulaire sur MOIS_KEYS ordonné 01…12)
  const idx = MOIS_KEYS.indexOf(mois as MoisKey);
  const prevKey = MOIS_KEYS[(idx - 1 + MOIS_KEYS.length) % MOIS_KEYS.length];
  const nextKey = MOIS_KEYS[(idx + 1) % MOIS_KEYS.length];
  const prevData = getMois(prevKey)!;
  const nextData = getMois(nextKey)!;

  return (
    <div className="space-y-8 pb-16">

      {/* Lien retour */}
      <Link
        href="/calendrier"
        className="inline-block py-2 -my-2 text-sm text-stone-500 transition hover:text-stone-800"
      >
        ← Calendrier
      </Link>

      {/* H1 */}
      <h1 className="text-3xl font-bold text-stone-900">{data.mois}</h1>

      {/* Contexte */}
      <p className="rounded-lg bg-stone-50 p-4 text-stone-700 leading-relaxed border border-stone-200">
        {data.contexte}
      </p>

      {/* Actions groupées par catégorie */}
      <ActionsGroupees actions={data.actions} />

      {/* Navigation mois précédent / suivant */}
      <nav className="flex items-center justify-between border-t border-stone-200 pt-6">
        <Link
          href={`/calendrier/${prevKey}`}
          className="flex flex-col rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition hover:border-stone-300 hover:bg-stone-50"
        >
          <span className="text-xs text-stone-500">Mois précédent</span>
          <span className="font-medium text-stone-700">← {prevData.mois}</span>
        </Link>

        <Link
          href={`/calendrier/${nextKey}`}
          className="flex flex-col items-end rounded-lg border border-stone-200 px-4 py-2.5 text-sm transition hover:border-stone-300 hover:bg-stone-50"
        >
          <span className="text-xs text-stone-500">Mois suivant</span>
          <span className="font-medium text-stone-700">{nextData.mois} →</span>
        </Link>
      </nav>

    </div>
  );
}
