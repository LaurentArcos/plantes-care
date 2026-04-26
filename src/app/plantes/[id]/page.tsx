import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlanteById, getAllPlanteIds, SAISON_LABELS } from '@/lib/jardin';
import { SAISONS } from '@/types/jardin';

export function generateStaticParams() {
  return getAllPlanteIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plante = getPlanteById(id);
  if (!plante) return { title: 'Plante introuvable · Jardin' };
  return { title: `${plante.nom} · Jardin` };
}

// ——— composant local ——————————————————————————————————————
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="border-b border-stone-200 pb-1 text-lg font-semibold text-stone-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Clés arrosage telles qu'elles apparaissent dans le JSON (capitalisées)
const ARROSAGE_SAISONS = ['Printemps', 'Été', 'Automne', 'Hiver'] as const;

// ——— page ——————————————————————————————————————————————————
export default async function PlantePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plante = getPlanteById(id);
  if (!plante) notFound();

  return (
    <div className="space-y-10 pb-16">

      {/* Lien retour */}
      <Link
        href="/plantes"
        className="inline-block text-sm text-stone-500 transition hover:text-stone-800"
      >
        ← Toutes les plantes
      </Link>

      {/* 1. En-tête */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-3xl font-bold text-stone-900">{plante.nom}</h1>
          <span
            className="mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: plante.type === 'outdoor' ? '#5a7a3a' : '#4a7a8a' }}
          >
            {plante.type === 'outdoor' ? 'Extérieur' : 'Intérieur'}
          </span>
        </div>
        <p className="italic text-stone-500">{plante.nom_scientifique}</p>
        <p className="text-sm text-stone-600">Famille : {plante.famille}</p>
        {plante.instances > 1 && (
          <p className="text-sm text-stone-600">× {plante.instances} dans le jardin</p>
        )}
      </header>

      {/* 2. Galerie photos */}
      {plante.photos.length > 0 && (
        <Section title="Photos">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {plante.photos.map((photo) => (
              <li
                key={photo}
                className="relative aspect-square overflow-hidden rounded-lg bg-stone-100"
              >
                <Image
                  src={`/photos/${photo}`}
                  alt={`${plante.nom} — ${photo}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 3. Caractéristiques */}
      {Object.keys(plante.caracteristiques).length > 0 && (
        <Section title="Caractéristiques">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {Object.entries(plante.caracteristiques).map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <dt className="shrink-0 font-medium text-stone-600">{key} :</dt>
                <dd className="text-stone-800">{val}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* 4. Arrosage */}
      <Section title="Arrosage">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ARROSAGE_SAISONS.map((saison) =>
            plante.arrosage[saison] !== undefined ? (
              <div
                key={saison}
                className="space-y-1 rounded-lg border border-stone-200 bg-stone-50 p-3"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {saison}
                </div>
                <div className="text-sm text-stone-800">{plante.arrosage[saison]}</div>
              </div>
            ) : null,
          )}
        </div>
      </Section>

      {/* 5. Caractéristiques décoratives */}
      {Object.keys(plante.caracteristiques_decoratives).length > 0 && (
        <Section title="Caractéristiques décoratives">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {Object.entries(plante.caracteristiques_decoratives).map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <dt className="shrink-0 font-medium text-stone-600">{key} :</dt>
                <dd className="text-stone-800">{val}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* 6. Taille et nettoyage */}
      <Section title="Taille et nettoyage">
        <p className="leading-relaxed text-stone-800">{plante.taille_nettoyage}</p>
      </Section>

      {/* 7. Calendrier saisonnier */}
      <Section title="Calendrier saisonnier">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SAISONS.map((key) => {
            const actions = plante.calendrier_saisonnier[key];
            return (
              <div
                key={key}
                className="space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-3"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {SAISON_LABELS[key]}
                </div>
                {actions.length > 0 ? (
                  <ul className="space-y-1">
                    {actions.map((action, i) => (
                      <li key={i} className="flex gap-1.5 text-sm text-stone-800">
                        <span className="shrink-0 text-stone-400">·</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic text-stone-400">Aucune action</p>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* 8. À surveiller */}
      {plante.a_surveiller.length > 0 && (
        <Section title="À surveiller">
          <ul className="space-y-1.5 rounded-lg border border-orange-100 bg-orange-50 p-4">
            {plante.a_surveiller.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-stone-800">
                <span className="shrink-0 text-orange-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 9. Conseils et spécificités */}
      {plante.specificite_ou_conseils.length > 0 && (
        <Section title="Conseils et spécificités">
          <ul className="space-y-1.5">
            {plante.specificite_ou_conseils.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-stone-800">
                <span className="shrink-0 text-stone-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

    </div>
  );
}
