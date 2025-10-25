"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  addMonths, addWeeks, eachDayOfInterval,
  endOfMonth, endOfWeek, format, formatISO, isSameDay,
  startOfMonth, startOfWeek
} from "date-fns";
import { fr } from "date-fns/locale";

type UIEvent = {
  id: number;
  plant_id: number;
  kind: "water"|"fertilize"|"mist"|"prune"|"repot"|"move_in"|"move_out"|"inspect"|"clean_leaves";
  due_date: string; // YYYY-MM-DD
  notes: string | null;
  action_icon: string | null;
};

type Mode = "week" | "month";

function label(kind: UIEvent["kind"]) {
  switch (kind) {
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

export default function Page() {
  const [mode, setMode] = useState<Mode>("week");
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState<Date>(() =>
    startOfWeek(today, { weekStartsOn: 1 })
  );

  const { rangeStart, rangeEnd, title } = useMemo(() => {
    if (mode === "week") {
      const rs = startOfWeek(cursor, { weekStartsOn: 1 });
      const re = endOfWeek(cursor, { weekStartsOn: 1 });
      const t = `${format(rs, "d MMM", { locale: fr })} – ${format(re, "d MMM yyyy", { locale: fr })}`;
      return { rangeStart: rs, rangeEnd: re, title: t };
    } else {
      const rs = startOfMonth(cursor);
      const re = endOfMonth(cursor);
      const t = format(rs, "MMMM yyyy", { locale: fr });
      return { rangeStart: rs, rangeEnd: re, title: t };
    }
  }, [mode, cursor]);

  const days = useMemo(
    () => eachDayOfInterval({ start: rangeStart, end: rangeEnd }),
    [rangeStart, rangeEnd]
  );

  const [events, setEvents] = useState<UIEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const from = formatISO(rangeStart, { representation: "date" });
    const to   = formatISO(rangeEnd, { representation: "date" });
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events?from=${from}&to=${to}`, { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error("fetch events failed");
        return r.json();
      })
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [rangeStart, rangeEnd]);

  function prev() {
    setCursor(c => mode === "week" ? addWeeks(c, -1) : addMonths(c, -1));
  }
  function next() {
    setCursor(c => mode === "week" ? addWeeks(c, +1) : addMonths(c, +1));
  }
  function goToday() {
    const base = new Date();
    setCursor(mode === "week"
      ? startOfWeek(base, { weekStartsOn: 1 })
      : startOfMonth(base)
    );
  }

  return (
    <div className="grid gap-6">
      <section className="p-4 md:p-5 bg-white border rounded-2xl">
        {/* barre de contrôle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button onClick={prev} className="px-3 py-1.5 border rounded-lg">◀</button>
            <div className="min-w-40 text-center font-semibold">{title}</div>
            <button onClick={next} className="px-3 py-1.5 border rounded-lg">▶</button>
            <button onClick={goToday} className="ml-2 px-3 py-1.5 border rounded-lg">Aujourd’hui</button>
          </div>

          <div className="inline-flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setMode("week")}
              className={`px-3 py-1.5 text-sm ${mode==="week"?"bg-gray-900 text-white":"bg-white"}`}
            >
              Semaine
            </button>
            <button
              onClick={() => setMode("month")}
              className={`px-3 py-1.5 text-sm border-l ${mode==="month"?"bg-gray-900 text-white":"bg-white"}`}
            >
              Mois
            </button>
          </div>
        </div>

        {/* grille des jours */}
        {mode === "week" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {days.map(d => {
              const iso = formatISO(d, { representation: "date" });
              const dayEvents = events.filter(e => e.due_date === iso);
              return (
                <div key={iso} className="border rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {format(d, "EEEE d MMM", { locale: fr })}
                      {isSameDay(d, today) && <span className="ml-2 text-xs text-green-700">• aujourd’hui</span>}
                    </div>
                    <span className="text-xs bg-gray-100 border rounded px-2 py-0.5">{dayEvents.length}</span>
                  </div>
                  <ul className="space-y-2">
                    {dayEvents.length === 0 && (
                      <li className="text-sm text-neutral-500">Rien à faire.</li>
                    )}
                    {dayEvents.map(ev => (
                      <li key={ev.id} className="flex items-start gap-2">
                        {ev.action_icon && (
                          <Image
                            src={ev.action_icon}
                            alt=""
                            width={16}
                            height={16}
                            unoptimized
                            className="mt-0.5"
                          />
                        )}
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {days.map(d => {
              const iso = formatISO(d, { representation: "date" });
              const dayEvents = events.filter(e => e.due_date === iso);
              return (
                <div key={iso} className="border rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{format(d, "EEE d", { locale: fr })}</div>
                    <span className="text-xs bg-gray-100 border rounded px-2 py-0.5">{dayEvents.length}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {dayEvents.length === 0 && (
                      <li className="text-xs text-neutral-500">—</li>
                    )}
                    {dayEvents.map(ev => (
                      <li key={ev.id} className="flex items-start gap-2">
                        {ev.action_icon && (
                          <Image
                            src={ev.action_icon}
                            alt=""
                            width={16}
                            height={16}
                            unoptimized
                            className="mt-0.5"
                          />
                        )}
                        <div className="text-xs">
                          <span className="font-medium">{label(ev.kind)}</span>
                          {ev.notes ? <span className="text-neutral-600"> — {ev.notes}</span> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {loading && <div className="mt-3 text-sm text-neutral-500">Chargement…</div>}
      </section>
    </div>
  );
}
