"use client";

import { useRulesStore } from "@/store/rules";

export default function RulesPage() {
  const { rules } = useRulesStore();
  return (
    <div className="card p-5">
      <h2 className="text-xl font-semibold mb-4">Règles d’entretien</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Plante/Espèce</th>
            <th>Action</th>
            <th>RRule</th>
            <th>Mois</th>
            <th>Méthode</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.plantId || r.species}</td>
              <td>{r.action}</td>
              <td className="text-xs">{r.rrule}</td>
              <td>{r.seasonMonths?.join(",") || "-"}</td>
              <td className="text-xs">{r.method}</td>
            </tr>
          ))}
          {rules.length === 0 && (
            <tr><td className="py-3 text-neutral-500" colSpan={5}>Aucune règle (seed au premier lancement).</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
