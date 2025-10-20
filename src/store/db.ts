import Dexie, { Table } from "dexie";

export type ActionType = "water"|"fertilize"|"repot"|"move_out"|"move_in"|"mist"|"clean";

export type Plant = {
  id: string;
  name: string;
  species: string;
  location: "indoor"|"outdoor";
  light: "full_sun"|"bright_indirect"|"shade";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CareRule = {
  id: string;
  plantId?: string;
  species?: string;
  action: ActionType;
  method: string;
  rrule: string;
  seasonMonths?: number[];
  windowDays?: number;
  priority?: 1|2|3;
};

export type TaskInstance = {
  id: string;
  plantId: string;
  plantName: string;
  date: string;
  action: ActionType;
  actionLabel: string;
  method: string;
  status: "todo"|"done"|"snoozed";
  createdAt: string;
  completedAt?: string;
};

class PCDB extends Dexie {
  plants!: Table<Plant, string>;
  rules!: Table<CareRule, string>;
  tasks!: Table<TaskInstance, string>;

  constructor() {
    super("plantes-care");
    this.version(1).stores({
      plants: "id, species",
      rules: "id, plantId, species, action",
      tasks: "id, plantId, date, status"
    });
  }
}

export const db = new PCDB();
