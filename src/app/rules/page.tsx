// server component

type UIRule = {
  id: number;
  kind: "water"|"fertilize"|"mist"|"prune"|"repot"|"move_in"|"move_out"|"inspect"|"clean_leaves";
  rrule: string | null;
  every_days: number | null;
  month_mask: string | null;
  week_hint: "all"|"1"|"2"|"3"|"4"|"last";
  amount_ml: number | null;
  method: string | null;
  notes: string | null;
  active: 0|1;
  plant_id: number | null;
  plant_label: string | null;
  species_id: number | null;
  species_label: string | null;
};

async function getRules(): Promise<UIRule[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${base}/api/rules`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch rules failed");
  return res.json();
}

export default async function RulesPage() {
  const rules = await getRules();
  return (
    <div className="p-4 md:p-5 bg-white border rounded-2xl">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Règles d’entretien</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-3">Plante / Espèce</th>
              <th className="pr-3">Action</th>
              <th className="pr-3">RRule / Every</th>
              <th className="pr-3">Mois</th>
              <th className="pr-3">Méthode</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(r => {
              const who = r.plant_label ?? r.species_label ?? "—";
              const when = r.rrule ? r.rrule : (r.every_days ? `tous les ${r.every_days} j` : "—");
              return (
                <tr key={r.id} className="border-b align-top">
                  <td className="py-2 pr-3">{who}</td>
                  <td className="pr-3">{label(r.kind)}</td>
                  <td className="pr-3 text-xs">{when}</td>
                  <td className="pr-3">{r.month_mask || "-"}</td>
                  <td className="pr-3 text-xs">{r.method || "-"}</td>
                  <td className="text-xs text-neutral-700">{r.notes || "-"}</td>
                </tr>
              );
            })}
            {rules.length === 0 && (
              <tr><td className="py-3 text-neutral-500" colSpan={6}>Aucune règle.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function label(k: UIRule["kind"]) {
  switch (k) {
    case "water": return "Arroser";
    case "fertilize": return "Engrais";
    case "mist": return "Brumiser";
    case "prune": return "Tailler";
    case "repot": return "Rempoter";
    case "move_in": return "Rentrer";
    case "move_out": return "Sortir";
    case "inspect": return "Inspection";
    case "clean_leaves": return "Nettoyer feuilles";
  }
}
