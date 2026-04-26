'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Plante } from '@/types/jardin';

function PlanteCard({ p }: { p: Plante }) {
  return (
    <Link
      href={`/plantes/${p.id}`}
      className="group block overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-sm"
    >
      <div className="relative aspect-square bg-stone-100">
        <Image
          src={`/photos/${p.photos[0]}`}
          alt={p.nom}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-3">
        <div className="font-medium leading-tight">{p.nom}</div>
        <div className="text-xs italic text-stone-500">{p.nom_scientifique}</div>
      </div>
    </Link>
  );
}

function Section({ title, plantes }: { title: string; plantes: Plante[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-stone-700">
        {title} <span className="font-normal text-stone-400">({plantes.length})</span>
      </h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {plantes.map((p) => (
          <li key={p.id}>
            <PlanteCard p={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PlantesGrid({ plantes }: { plantes: Plante[] }) {
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();
  const filtered = q
    ? plantes.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.nom_scientifique.toLowerCase().includes(q) ||
          p.famille.toLowerCase().includes(q),
      )
    : plantes;

  const outdoor = filtered.filter((p) => p.type === 'outdoor');
  const indoor = filtered.filter((p) => p.type === 'indoor');

  return (
    <div className="space-y-10">
      {/* Barre de recherche sticky sous le header (header ≈ 44 px) */}
      <div className="sticky top-[44px] z-10 -mx-4 bg-stone-50/95 px-4 py-3 backdrop-blur">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, nom scientifique ou famille…"
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone-500">
          Aucune plante ne correspond à &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <>
          {outdoor.length > 0 && <Section title="Extérieur" plantes={outdoor} />}
          {indoor.length > 0 && <Section title="Intérieur" plantes={indoor} />}
        </>
      )}
    </div>
  );
}
