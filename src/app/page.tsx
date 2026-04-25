import Link from 'next/link';
import { getCurrentMoisKey, getMois, metadata } from '@/lib/jardin';

export default function Home() {
  const mois = getMois(getCurrentMoisKey())!;
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold">{metadata.jardin.nom}</h1>
        <p className="mt-1 text-stone-600">
          {metadata.jardin.lieu} · climat {metadata.jardin.climat}
        </p>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Ce mois-ci · {mois.mois}</h2>
        <p className="mt-2 text-stone-700">{mois.contexte}</p>
        <p className="mt-3 text-sm text-stone-500">
          {mois.actions.length} action(s) au programme.{' '}
          <Link href="/calendrier" className="underline">Voir le calendrier</Link>
        </p>
      </section>

      <section>
        <Link
          href="/plantes"
          className="inline-block rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
        >
          Parcourir les plantes →
        </Link>
      </section>
    </div>
  );
}