# Projet plantes-care

Site Next.js statique pour consulter le manuel d'entretien d'un jardin
méditerranéen (La Farlède). Pas de DB, pas d'auth, pas de tracking de tâches.
Source de vérité unique : src/data/jardin_db.json.

## Stack

- Next.js 16 (App Router, --src-dir, Turbopack)
- TypeScript strict, Tailwind v4
- Déploiement : static export (`output: 'export'`) → dossier `out/`

## Conventions

- Imports via alias @/* (mappé vers src/*)
- Couche data : src/lib/jardin.ts (helpers synchrones, pas de fetch)
- Types : src/types/jardin.ts
- Photos : public/photos/, noms en kebab-case ASCII
- Couleurs de catégories : utiliser inline style depuis le JSON
  (categories[key].color), pas d'extension Tailwind
- Composants "use client" : vivent au même niveau que leur page.tsx
  (ex: src/app/plantes/PlantesGrid.tsx), pas dans src/components/
- src/components/ réservé aux server components réutilisables
  entre plusieurs routes
- Clés arrosage dans le JSON : capitalisées ("Printemps", "Été", etc.)
- Clés calendrier_saisonnier dans le JSON : minuscules ("printemps", "ete", etc.)
- Pages dynamiques (params) : async + await params (Next.js 16, params est une Promise)
- Liens retour et liens "Voir tout" : py-2 -my-2 pour atteindre 44px de touch target
- Texte secondaire/metadata : text-stone-500 minimum (text-stone-400 ne passe pas WCAG AA)

## À ne pas faire

- Pas de base de données, pas d'API routes, pas de mutation
- Pas de tracking "tâche faite"
- Pas de gestion par instance (3 lauriers = 1 fiche, pas 3)

## Routes prévues

- /                       Home avec mois courant (✅ fait)
- /plantes                Grille avec recherche client-side (✅ fait)
- /plantes/[id]           Fiche détail (✅ fait)
- /calendrier             Index 12 mois (✅ fait)
- /calendrier/[mois]      Détail mois (✅ fait)
- /interieur              4 saisons (✅ fait)

## Composants partagés

- `src/components/ActionsGroupees.tsx` — server component, reçoit
  `Action[]`, groupe par catégorie via `groupActionsByCategorie`, affiche
  avec bordure colorée (inline style) et lien vers la fiche plante.
  Utilisé par `/calendrier/[mois]` et `/interieur`.

- `src/app/plantes/PlantesGrid.tsx` — **"use client"**, reçoit la liste
  complète de plantes en prop, gère la recherche (useState) et filtre
  par nom / nom_scientifique / famille. Sépare outdoor/indoor et cache
  les sections vides.

## Scripts

- `scripts/rename-photos.mjs` — normalise les photos en kebab-case ASCII
  et patche les entrées `photos` du JSON. Idempotent. Lancer après ajout
  de nouvelles photos : `node scripts/rename-photos.mjs`

## Maintenance de ce fichier

Après chaque feature implémentée et validée, mettre à jour ce CLAUDE.md si pertinent :

- Cocher la route dans "Routes prévues" (✅) si la page a été créée
- Ajouter une ligne dans "Composants partagés" si un composant
  réutilisable a été extrait (ex: ActionsGroupees, PlantesGrid)
- Ajouter une convention si une décision d'archi a été prise
  (ex: "les filtres client-side passent par un sous-composant
  'use client' au même niveau que page.tsx")
- Ne pas réécrire tout le fichier, faire des modifications ciblées

Ne pas mettre à jour ce fichier pour des détails d'implémentation,
des fixes mineurs, ou du polish visuel.
