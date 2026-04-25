import Image from 'next/image';
import Link from 'next/link';
import { getAllPlantes } from '@/lib/jardin';

export const metadata = { title: 'Plantes · Jardin' };

export default function PlantesPage() {
  const plantes = getAllPlantes();
  const outdoor = plantes.filter((p) => p.type === 'outdoor');
  const indoor = plantes.filter((p) => p.type === 'indoor');

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Plantes</h1>

      <Section title="Extérieur" plantes={outdoor} />
      <Section title="Intérieur" plantes={indoor} />
    </div>
  );
}

function Section({ title, plantes }: { title: string; plantes: ReturnType<typeof getAllPlantes> }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-stone-700">
        {title} <span className="font-normal text-stone-400">({plantes.length})</span>
      </h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {plantes.map((p) => (
          <li key={p.id}>
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
          </li>
        ))}
      </ul>
    </section>
  );
}