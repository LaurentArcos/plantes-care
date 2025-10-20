"use client";
import { create } from "zustand";
import { db, Plant } from "./db";
import { nanoid } from "@/lib/nanoid";
import seed from "@/data/seed.json";

type PlantsState = {
  plants: Plant[];
  init: () => Promise<void>;
  addPlant: (p: Omit<Plant, "id"|"createdAt"|"updatedAt">) => Promise<void>;
};

export const usePlantsStore = create<PlantsState>((set, get) => ({
  plants: [],
  init: async () => {
    const count = await db.plants.count();
    if (count === 0) {
      const now = new Date().toISOString();
      const toAdd = seed.plants.map((p: any) => ({ ...p, id: nanoid(), createdAt: now, updatedAt: now }));
      await db.plants.bulkAdd(toAdd);
    }
    const plants = await db.plants.toArray();
    set({ plants });
  },
  addPlant: async (p) => {
    const now = new Date().toISOString();
    const rec: Plant = { ...p, id: nanoid(), createdAt: now, updatedAt: now };
    await db.plants.add(rec);
    set({ plants: await db.plants.toArray() });
  }
}));

// init auto côté client
if (typeof window !== "undefined") {
  usePlantsStore.getState().init();
}
