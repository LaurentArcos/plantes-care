"use client";
import { db } from "@/store/db";

export function useDataIO() {
  async function exportAll() {
    const [plants, rules, tasks] = await Promise.all([
      db.plants.toArray(),
      db.rules.toArray(),
      db.tasks.toArray()
    ]);
    const blob = new Blob([JSON.stringify({ plants, rules, tasks }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plantes-care-export.json"; a.click();
    URL.revokeObjectURL(url);
  }

  async function importAll(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const text = await f.text();
    const data = JSON.parse(text);
    await db.transaction("rw", db.plants, db.rules, db.tasks, async () => {
      await db.plants.clear(); await db.rules.clear(); await db.tasks.clear();
      if (data.plants?.length) await db.plants.bulkAdd(data.plants);
      if (data.rules?.length) await db.rules.bulkAdd(data.rules);
      if (data.tasks?.length) await db.tasks.bulkAdd(data.tasks);
    });
    location.reload();
  }

  return { exportAll, importAll };
}
