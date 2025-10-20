"use client";
import { create } from "zustand";
import { db, TaskInstance, CareRule } from "./db";
import { RRule } from "rrule";
import { addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { nanoid } from "@/lib/nanoid";
import { usePlantsStore } from "./plants";
import { useRulesStore } from "./rules";

function ruleToDates(rule: CareRule, start: Date, end: Date): Date[] {
  const options = RRule.parseString(rule.rrule);
  options.dtstart = options.dtstart || new Date(start.getFullYear(), 0, 1);
  const r = new RRule(options);
  const dates = r.between(start, end, true);
  if (rule.seasonMonths?.length) {
    return dates.filter(d => rule.seasonMonths!.includes(d.getMonth() + 1));
  }
  return dates;
}

type TasksState = {
  tasksForRange: (from: Date, to: Date) => TaskInstance[];
  toggleDone: (id: string) => Promise<void>;
  _cache: TaskInstance[];
  _ensureGenerated: () => Promise<void>;
};

export const useTasksStore = create<TasksState>((set, get) => ({
  _cache: [],
  tasksForRange: (from, to) => {
    const all = get()._cache.filter(t => {
      const d = new Date(t.date);
      return d >= from && d <= to;
    });
    return all.sort((a,b) => a.date.localeCompare(b.date));
  },
  toggleDone: async (id) => {
    const t = await db.tasks.get(id);
    if (!t) return;
    const updated: TaskInstance = {
      ...t,
      status: t.status === "done" ? "todo" : "done",
      completedAt: t.status === "done" ? undefined : new Date().toISOString()
    };
    await db.tasks.put(updated);
    set({ _cache: await db.tasks.toArray() });
  },
  _ensureGenerated: async () => {
    const plants = usePlantsStore.getState().plants;
    const rules = useRulesStore.getState().rules;
    if (!plants.length || !rules.length) {
      setTimeout(get()._ensureGenerated, 200);
      return;
    }

    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(addWeeks(start, 6), { weekStartsOn: 1 });

    const existing = await db.tasks
      .where("date")
      .between(start.toISOString(), end.toISOString(), true, true)
      .toArray();

    if (existing.length > 0) {
      set({ _cache: await db.tasks.toArray() });
      return;
    }

    const toAdd: TaskInstance[] = [];
    for (const r of rules) {
      const dates = ruleToDates(r, start, end);
      for (const d of dates) {
        const plant = r.plantId
          ? plants.find(p => p.id === r.plantId)
          : plants.find(p => p.species === r.species);
        if (!plant) continue;
        const id = nanoid();
        toAdd.push({
          id,
          plantId: plant.id,
          plantName: plant.name,
          date: d.toISOString(),
          action: r.action,
          actionLabel: actionLabel(r.action),
          method: r.method,
          status: "todo",
          createdAt: new Date().toISOString()
        });
      }
    }
    if (toAdd.length) await db.tasks.bulkAdd(toAdd);
    set({ _cache: await db.tasks.toArray() });
  }
}));

function actionLabel(a: string) {
  switch (a) {
    case "water": return "Arroser";
    case "fertilize": return "Engrais";
    case "repot": return "Rempoter";
    case "move_out": return "Sortir";
    case "move_in": return "Rentrer";
    case "mist": return "Brumiser";
    case "clean": return "Nettoyer";
    default: return a;
  }
}

if (typeof window !== "undefined") {
  // bootstrap génération
  useTasksStore.getState()._ensureGenerated();
}
