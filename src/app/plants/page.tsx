"use client";

import { usePlantsStore } from "@/store/plants";

export default function PlantsPage() {
  const { plants } = usePlantsStore();
  return (
    <div className="grid gap-6">
      <section className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Plantes</h2>
          {/* Ajoute plus tard: bouton "Ajouter une plante" */}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {plants.map(p => (
            <div key={p.id} className="border rounded-xl p-4">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-neutral-600">{p.species}</div>
              <div className="text-xs text-neutral-500 mt-1">{p.notes}</div>
            </div>
          ))}
          {plants.length === 0 && <div className="text-neutral-500 text-sm">Aucune plante (seed au premier lancement).</div>}
        </div>
      </section>
    </div>
  );
}
