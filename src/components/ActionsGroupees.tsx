import Link from 'next/link';
import { groupActionsByCategorie } from '@/lib/jardin';
import type { Action } from '@/types/jardin';

export default function ActionsGroupees({ actions }: { actions: Action[] }) {
  const groupes = groupActionsByCategorie(actions);

  return (
    <div className="space-y-6">
      {groupes.map(({ key, categorie, actions: items }) => (
        <div key={key}>
          <div
            className="mb-3 border-l-4 pl-3"
            style={{ borderLeftColor: categorie.color }}
          >
            <h3
              className="text-base font-semibold"
              style={{ color: categorie.color }}
            >
              {categorie.label}
            </h3>
          </div>

          <ul className="space-y-2">
            {items.map((action, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-stone-100 bg-white px-3 py-2.5"
              >
                <div
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: categorie.color }}
                />
                <div className="space-y-0.5">
                  <Link
                    href={`/plantes/${action.plante_id}`}
                    className="text-sm font-medium text-stone-800 hover:underline"
                  >
                    {action.plante}
                  </Link>
                  <p className="text-sm text-stone-500">{action.action}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
