import Link from 'next/link';
import { getAllMois, getCurrentMoisKey } from '@/lib/jardin';

export const metadata = { title: 'Calendrier · Jardin' };

export default function CalendrierPage() {
  const mois = getAllMois();
  const currentKey = getCurrentMoisKey();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-stone-900">Calendrier du jardin</h1>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mois.map(({ key, mois: nom, contexte, actions }) => {
          const isCurrent = key === currentKey;
          const extrait = contexte.length > 120 ? contexte.slice(0, 120).trimEnd() + '…' : contexte;

          return (
            <li key={key}>
              <Link
                href={`/calendrier/${key}`}
                className={[
                  'group flex h-full flex-col rounded-lg border bg-white p-4 transition hover:shadow-sm',
                  isCurrent
                    ? 'border-green-600 ring-1 ring-green-600'
                    : 'border-stone-200 hover:border-stone-300',
                ].join(' ')}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span
                    className={[
                      'text-xl font-bold',
                      isCurrent ? 'text-green-700' : 'text-stone-900',
                    ].join(' ')}
                  >
                    {nom}
                  </span>
                  {isCurrent && (
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Ce mois-ci
                    </span>
                  )}
                </div>

                <p className="grow text-sm leading-relaxed text-stone-500">{extrait}</p>

                <div className="mt-3 text-xs font-medium text-stone-400">
                  {actions.length} action{actions.length !== 1 ? 's' : ''}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
