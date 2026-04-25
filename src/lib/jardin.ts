// Couche d'accès au JSON. Tout est synchrone, importé une fois au build/run.
// Utilise import @/data/jardin_db.json — Next.js (App Router) sait l'inliner.

import rawData from '@/data/jardin_db.json';
import type {
  Action,
  Categorie,
  CategorieKey,
  JardinDB,
  MoisCalendrier,
  MoisKey,
  Plante,
  PlanteType,
  SaisonCalendrier,
  SaisonKey,
} from '@/types/jardin';
import { MOIS_KEYS, SAISONS } from '@/types/jardin';

// On caste via unknown — JSON imports en TS strict ne matchent pas exactement nos types
// à cause de Record<string, string> vs des string literals inférées.
const db = rawData as unknown as JardinDB;

// =====================
// Metadata
// =====================
export const metadata = db.metadata;

// =====================
// Plantes
// =====================
export function getAllPlantes(): Plante[] {
  return db.plants;
}

export function getPlantesByType(type: PlanteType): Plante[] {
  return db.plants.filter((p) => p.type === type);
}

export function getPlanteById(id: string): Plante | undefined {
  return db.plants.find((p) => p.id === id);
}

export function getAllPlanteIds(): string[] {
  return db.plants.map((p) => p.id);
}

// =====================
// Calendrier mensuel (jardin extérieur)
// =====================
export function getMois(key: MoisKey): MoisCalendrier | undefined {
  return db.calendrier_jardin_mois[key];
}

/** Renvoie les 12 mois dans l'ordre, avec leur clé. */
export function getAllMois(): Array<MoisCalendrier & { key: MoisKey }> {
  return MOIS_KEYS.map((key) => ({ key, ...db.calendrier_jardin_mois[key] }));
}

export function getCurrentMoisKey(): MoisKey {
  const m = new Date().getMonth() + 1;
  return String(m).padStart(2, '0') as MoisKey;
}

// =====================
// Calendrier saisonnier (intérieur)
// =====================
export const SAISON_LABELS: Record<SaisonKey, string> = {
  printemps: 'Printemps',
  ete: 'Été',
  automne: 'Automne',
  hiver: 'Hiver',
};

export function getSaison(key: SaisonKey): SaisonCalendrier | undefined {
  return db.calendrier_interieur_saison[key];
}

export function getAllSaisons(): Array<SaisonCalendrier & { key: SaisonKey }> {
  return SAISONS.map((key) => ({ key, ...db.calendrier_interieur_saison[key] }));
}

export function getCurrentSaisonKey(): SaisonKey {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'printemps';
  if (m >= 6 && m <= 8) return 'ete';
  if (m >= 9 && m <= 11) return 'automne';
  return 'hiver';
}

// =====================
// Catégories
// =====================
export function getCategorie(key: CategorieKey): Categorie | undefined {
  return db.categories[key];
}

/** Catégories triées selon category_order, avec leur clé. */
export function getOrderedCategories(): Array<Categorie & { key: CategorieKey }> {
  return db.category_order
    .filter((k) => db.categories[k])
    .map((k) => ({ key: k, ...db.categories[k] }));
}

/**
 * Regroupe un tableau d'actions par catégorie, dans l'ordre défini par category_order.
 * Pratique pour les pages de calendrier (mois ou saison).
 */
export function groupActionsByCategorie(actions: Action[]): Array<{
  key: CategorieKey;
  categorie: Categorie;
  actions: Action[];
}> {
  const grouped = new Map<CategorieKey, Action[]>();
  for (const a of actions) {
    const list = grouped.get(a.categorie);
    if (list) list.push(a);
    else grouped.set(a.categorie, [a]);
  }
  return db.category_order
    .filter((k) => grouped.has(k))
    .map((k) => ({
      key: k,
      categorie: db.categories[k],
      actions: grouped.get(k)!,
    }));
}
