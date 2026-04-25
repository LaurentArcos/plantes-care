// Types dérivés de data/jardin_db.json
// Note : les sous-objets (caracteristiques, arrosage, caracteristiques_decoratives)
// ont des clés variables selon la plante (outdoor vs indoor, agrumes vs cactus, etc.).
// On les type donc en Record<string, string> pour rester honnête.

export type PlanteType = 'outdoor' | 'indoor';

export type SaisonKey = 'printemps' | 'ete' | 'automne' | 'hiver';

export const SAISONS: readonly SaisonKey[] = [
  'printemps',
  'ete',
  'automne',
  'hiver',
] as const;

export type MoisKey =
  | '01' | '02' | '03' | '04' | '05' | '06'
  | '07' | '08' | '09' | '10' | '11' | '12';

export const MOIS_KEYS: readonly MoisKey[] = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12',
] as const;

export type CategorieKey =
  | 'TAILLE'
  | 'TAILLE LÉGÈRE'
  | 'ARROSAGE'
  | 'FERTILISATION'
  | 'TRAITEMENT'
  | 'FLORAISON'
  | 'RÉCOLTE'
  | 'PROTECTION'
  | 'OBSERVATION'
  | 'NETTOYAGE'
  | 'REPOS'
  | 'DIVISION'
  | 'PALISSAGE'
  | 'PRÉPARATION'
  | 'PAILLAGE'
  | 'SURVEILLANCE'
  | 'ENTRETIEN';

export interface Categorie {
  label: string;
  /** Couleur HEX (ex. "#A85234") — à utiliser en inline style. */
  color: string;
}

export interface Plante {
  id: string;
  nom: string;
  nom_scientifique: string;
  famille: string;
  page_manuel: number;
  type: PlanteType;
  /** Nombre d'individus dans le jardin (info uniquement, pas de tracking). */
  instances: number;
  /** Noms de fichiers, à résoudre vers /photos/<nom>. */
  photos: string[];
  caracteristiques: Record<string, string>;
  arrosage: Record<string, string>;
  caracteristiques_decoratives: Record<string, string>;
  taille_nettoyage: string;
  calendrier_saisonnier: Record<SaisonKey, string[]>;
  a_surveiller: string[];
  specificite_ou_conseils: string[];
}

export interface Action {
  categorie: CategorieKey;
  /** Nom affichable (peut différer un peu du nom complet de la plante). */
  plante: string;
  /** Référence vers Plante.id. */
  plante_id: string;
  action: string;
}

export interface MoisCalendrier {
  /** Nom du mois en français : "Janvier", "Février", … */
  mois: string;
  contexte: string;
  actions: Action[];
}

export interface SaisonCalendrier {
  numero: string;
  contexte: string;
  actions: Action[];
}

export interface JardinMetadata {
  version: string;
  generated_at: string;
  jardin: {
    nom: string;
    lieu: string;
    climat: string;
    specificites: string[];
  };
  plantes_count: {
    total: number;
    outdoor: number;
    indoor: number;
  };
}

export interface JardinDB {
  metadata: JardinMetadata;
  categories: Record<CategorieKey, Categorie>;
  category_order: CategorieKey[];
  plants: Plante[];
  calendrier_jardin_mois: Record<MoisKey, MoisCalendrier>;
  calendrier_interieur_saison: Record<SaisonKey, SaisonCalendrier>;
}
