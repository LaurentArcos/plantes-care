"use client";
import { create } from "zustand";
import { db, CareRule } from "./db";
import seed from "@/data/seed.json";
import { nanoid } from "@/lib/nanoid";

type RulesState = {
  rules: CareRule[];
  init: () => Promise<void>;
};

export const useRulesStore = create<RulesState>((set) => ({
  rules: [],
  init: async () => {
    const count = await db.rules.count();
    if (count === 0) {
      const toAdd = seed.rules.map((r: any) => ({ ...r, id: nanoid() }));
      await db.rules.bulkAdd(toAdd);
    }
    const rules = await db.rules.toArray();
    set({ rules });
  }
}));

if (typeof window !== "undefined") {
  useRulesStore.getState().init();
}
