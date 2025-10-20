"use client";

import { useMemo } from "react";
import { useTasksStore } from "@/store/tasks";
import { startOfWeek, addDays, formatISO, format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Page() {
  const { tasksForRange, toggleDone } = useTasksStore();

  const start = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  const tasks = tasksForRange(days[0], days[6]);

  return (
    <div className="grid gap-6">
      <section className="card p-5">
        <h2 className="text-xl font-semibold mb-4">Cette semaine</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {days.map((d) => {
            const iso = formatISO(d, { representation: "date" });
            const dayTasks = tasks.filter(t => t.date.startsWith(iso));
            return (
              <div key={iso} className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{format(d, "EEEE d MMM", { locale: fr })}</div>
                  <span className="badge">{dayTasks.length} tâche(s)</span>
                </div>
                <ul className="space-y-2">
                  {dayTasks.length === 0 && <li className="text-sm text-neutral-500">Rien à faire.</li>}
                  {dayTasks.map(t => (
                    <li key={t.id} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm">
                          <span className="font-semibold">{t.actionLabel}</span> — {t.plantName}
                        </div>
                        <div className="text-xs text-neutral-600">{t.method}</div>
                      </div>
                      <button
                        onClick={() => toggleDone(t.id)}
                        className={"btn " + (t.status === "done" ? "bg-green-100 border-green-300" : "")}
                      >
                        {t.status === "done" ? "✅ Fait" : "Marquer fait"}
                      </button>
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
