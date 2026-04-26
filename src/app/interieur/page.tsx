import { getAllSaisons, getCurrentSaisonKey, SAISON_LABELS } from '@/lib/jardin';
import ActionsGroupees from '@/components/ActionsGroupees';

export const metadata = { title: "Plantes d'intérieur · Jardin" };

export default function InterieurPage() {
  const saisons = getAllSaisons();
  const currentKey = getCurrentSaisonKey();

  // Saison courante en premier, puis les 3 autres dans leur ordre naturel
  const ordered = [
    ...saisons.filter((s) => s.key === currentKey),
    ...saisons.filter((s) => s.key !== currentKey),
  ];

  return (
    <div className="space-y-12 pb-16">
      <h1 className="text-3xl font-bold text-stone-900">Plantes d'intérieur</h1>

      {ordered.map(({ key, contexte, actions }) => {
        const isCurrent = key === currentKey;

        return (
          <section
            key={key}
            id={key}
            className={[
              'scroll-mt-6 space-y-5 rounded-lg border p-5',
              isCurrent
                ? 'border-green-600 bg-green-50/40 ring-1 ring-green-600'
                : 'border-stone-200 bg-white',
            ].join(' ')}
          >
            {/* H2 + badge */}
            <div className="flex flex-wrap items-center gap-3">
              <h2
                className={[
                  'text-xl font-bold',
                  isCurrent ? 'text-green-800' : 'text-stone-900',
                ].join(' ')}
              >
                {SAISON_LABELS[key]}
              </h2>
              {isCurrent && (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  Saison actuelle
                </span>
              )}
            </div>

            {/* Contexte */}
            <p className="rounded-md bg-stone-50 p-3 text-sm leading-relaxed text-stone-700 border border-stone-200">
              {contexte}
            </p>

            {/* Actions */}
            <ActionsGroupees actions={actions} />
          </section>
        );
      })}
    </div>
  );
}
