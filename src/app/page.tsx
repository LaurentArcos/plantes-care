// server component
import { startOfWeek, addDays, formatISO, format } from "date-fns";
import { fr } from "date-fns/locale";

type UIEvent = {
  id: number;
  plant_id: number;
  kind: "water"|"fertilize"|"mist"|"prune"|"repot"|"move_in"|"move_out"|"inspect"|"clean_leaves";
  due_date: string;
  notes: string | null;
  action_icon: string | null;
};

async function getEvents(from: string, to: string): Promise<UIEvent[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${base}/api/events?from=${from}&to=${to}`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch events failed");
  return res.json();
}

export default async function Page() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const from = formatISO(days[0], { representation: "date" });
  const to   = formatISO(days[6], { representation: "date" });
  const events = await getEvents(from, to);

  return (
    <div className="grid gap-6">
      <section className="p-4 md:p-5 bg-white border rounded-2xl">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Cette semaine</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {days.map((d) => {
            const iso = formatISO(d, { representation: "date" });
            const dayEvents = events.filter(e => e.due_date === iso);
            return (
              <div key={iso} className="border rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{format(d, "EEEE d MMM", { locale: fr })}</div>
                  <span className="text-xs bg-gray-100 border rounded px-2 py-0.5">{dayEvents.length}</span>
                </div>
                <ul className="space-y-2">
                  {dayEvents.length === 0 && <li className="text-sm text-neutral-500">Rien à faire.</li>}
                  {dayEvents.map(ev => (
                    <li key={ev.id} className="flex items-start gap-2">
                      {ev.action_icon && <img src={ev.action_icon} className="w-4 h-4 mt-0.5" alt="" />}
                      <div className="text-sm">
                        <span className="font-semibold">{label(ev.kind)}</span>
                        {ev.notes ? <span className="text-neutral-600"> — {ev.notes}</span> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function label(k: UIEvent["kind"]) {
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
