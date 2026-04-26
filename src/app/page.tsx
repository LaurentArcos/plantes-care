import Link from 'next/link';
import {
  getCurrentMoisKey,
  getCurrentSaisonKey,
  getCategorie,
  getMois,
  getSaison,
  groupActionsByCategorie,
  metadata,
  SAISON_LABELS,
} from '@/lib/jardin';
import type { Action, CategorieKey } from '@/types/jardin';

// Catégories à remonter en priorité dans l'aperçu mensuel
const PRIORITY_CATS: CategorieKey[] = ['TAILLE', 'TRAITEMENT', 'RÉCOLTE', 'PROTECTION'];

function selectActionsPhares(actions: Action[], max = 5): Action[] {
  const hi = actions.filter((a) => PRIORITY_CATS.includes(a.categorie as CategorieKey));
  const lo = actions.filter((a) => !PRIORITY_CATS.includes(a.categorie as CategorieKey));
  return [...hi, ...lo].slice(0, max);
}

// ——— composant compact pour l'aperçu home ———————————————
function ActionsCompactes({ actions }: { actions: Action[] }) {
  const groupes = groupActionsByCategorie(actions);
  return (
    <div className="space-y-3">
      {groupes.map(({ key, categorie, actions: items }) => (
        <div key={key}>
          <div className="mb-1 flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: categorie.color }}
            />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: categorie.color }}>
              {categorie.label}
            </span>
          </div>
          <ul className="space-y-1 pl-4">
            {items.map((action, i) => (
              <li key={i} className="flex flex-wrap gap-x-1.5 text-sm text-stone-700">
                <Link
                  href={`/plantes/${action.plante_id}`}
                  className="font-medium text-stone-900 hover:underline"
                >
                  {action.plante}
                </Link>
                <span className="text-stone-400">—</span>
                <span>{action.action}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ——— page ——————————————————————————————————————————————
export default function Home() {
  const moisKey = getCurrentMoisKey();
  const saisonKey = getCurrentSaisonKey();
  const mois = getMois(moisKey)!;
  const saison = getSaison(saisonKey)!;
  const actionsPhares = selectActionsPhares(mois.actions);
  const actionsSaisonApercu = saison.actions.slice(0, 3);

  return (
    <div className="space-y-8 pb-16">

      {/* 1. Hero */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-stone-900">{metadata.jardin.nom}</h1>
        <p className="text-stone-500">
          {metadata.jardin.lieu} · climat {metadata.jardin.climat}
        </p>
        <ul className="flex flex-wrap gap-2 pt-1">
          {metadata.jardin.specificites.map((s) => (
            <li
              key={s}
              className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
            >
              {s}
            </li>
          ))}
        </ul>
      </header>

      {/* 2. Ce mois-ci */}
      <section className="rounded-lg border border-stone-200 bg-white p-5 space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Ce mois-ci ·{' '}
            <span className="text-green-700">{mois.mois}</span>
          </h2>
          <Link
            href={`/calendrier/${moisKey}`}
            className="shrink-0 py-2 -my-2 text-sm text-stone-500 hover:text-stone-800 transition"
          >
            Voir tout le mois →
          </Link>
        </div>

        <p className="text-sm leading-relaxed text-stone-600">{mois.contexte}</p>

        <ActionsCompactes actions={actionsPhares} />

        {mois.actions.length > actionsPhares.length && (
          <p className="text-xs text-stone-500">
            + {mois.actions.length - actionsPhares.length} autres actions ce mois-ci
          </p>
        )}
      </section>

      {/* 3. Saison intérieur */}
      <section className="rounded-lg border border-stone-200 bg-white p-5 space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Intérieur ·{' '}
            <span className="text-green-700">{SAISON_LABELS[saisonKey]}</span>
          </h2>
          <Link
            href="/interieur"
            className="shrink-0 py-2 -my-2 text-sm text-stone-500 hover:text-stone-800 transition"
          >
            Voir toutes les saisons →
          </Link>
        </div>

        <p className="text-sm leading-relaxed text-stone-600">{saison.contexte}</p>

        <ul className="space-y-2">
          {actionsSaisonApercu.map((action, i) => {
            const cat = getCategorie(action.categorie as CategorieKey);
            return (
              <li key={i} className="flex gap-3 text-sm text-stone-700">
                {cat && (
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                )}
                <span>
                  <Link
                    href={`/plantes/${action.plante_id}`}
                    className="font-medium text-stone-900 hover:underline"
                  >
                    {action.plante}
                  </Link>
                  {' — '}
                  {action.action}
                </span>
              </li>
            );
          })}
        </ul>

        {saison.actions.length > 3 && (
          <p className="text-xs text-stone-500">
            + {saison.actions.length - 3} autres actions cette saison
          </p>
        )}
      </section>

      {/* 4. Stats */}
      <footer className="text-center text-sm text-stone-500">
        {metadata.plantes_count.total} plantes · {metadata.plantes_count.outdoor} extérieur · {metadata.plantes_count.indoor} intérieur
      </footer>

    </div>
  );
}
