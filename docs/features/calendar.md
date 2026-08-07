# Documentation de la Fonctionnalité : Observation Lunaire et Événements (Moon & Events)

Bienvenue dans la documentation des fonctionnalités liées au calendrier hégirien et à la lune ! Ce document est destiné aux contributeurs souhaitant comprendre ou faire évoluer cette partie du projet.

## Description globale

La fonctionnalité "Moon & Events" permet aux utilisateurs de suivre l'évolution des phases lunaires, de consulter la date hégirienne actuelle, et de s'informer sur les événements islamiques importants de l'année. Elle intègre également un outil de conversion bidirectionnelle pratique entre le calendrier grégorien et le calendrier hégirien.

## Architecture

L'architecture s'articule autour de deux pages principales et d'un fichier de données statique :

- **Pages (Composants principaux) :**
  - `src/pages/Moon.jsx` : Affiche l'état de la lune d'aujourd'hui (phase, pourcentage d'illumination, visibilité du croissant), la date hégirienne calculée correspondante, ainsi qu'une liste des prévisions pour les prochaines nouvelles lunes.
  - `src/pages/Events.jsx` : Présente un rappel de la date du jour, un convertisseur de dates, et une chronologie des événements islamiques (fêtes, événements historiques, sunnah) avec une mise en évidence visuelle du prochain événement à venir.
- **Composants transverses :**
  - `src/components/PageHeader.jsx` : Utilisé dans `Moon.jsx` pour structurer l'en-tête de la page.
- **Données locales :**
  - `src/data/islamic_events.json` : Base de données statique contenant la liste annuelle des événements avec leur mois/jour hégirien, nom, description et catégorie.

## Gestion de l'état (State)

Ces pages utilisent les Hooks natifs de React (`useState`, `useEffect`) pour gérer leurs états locaux.

**Dans `Moon.jsx` :**
- `moonData` : Stocke les informations actuelles sur la lune et la date hégirienne de l'API.
- `phasesData` : Garde en mémoire le tableau des prochaines nouvelles lunes.
- `loading` : Booléen gérant l'affichage d'un indicateur de chargement (`<RefreshCw />`) pendant que les requêtes API sont en cours.

**Dans `Events.jsx` :**
- `events` : Liste des événements chargée depuis le fichier JSON, puis triée par ordre chronologique.
- `nextEventId` : Mémorise l'ID de l'événement le plus proche dans le temps afin de le mettre en surbrillance.
- `todayHijri` : Date hégirienne du jour pour situer l'utilisateur.
- **État du Convertisseur** : 
  - `convMode` ('g2h' ou 'h2g') : Mode de conversion actuel.
  - `gDate` / `hDate` : Stockent les valeurs des inputs saisis par l'utilisateur.
  - `convResult` : Chaine de caractères affichant le résultat retourné par l'API après la soumission.

## APIs & Données

L'application récupère ses données dynamiques en temps réel via **Ummah API**. La clé d'API doit être définie dans l'environnement via `VITE_UMMAH_API_KEY`.

**Endpoints consommés :**
- `GET /api/moon` : Obtient les informations lunaires actuelles et la date hégirienne.
- `GET /api/moon/phases?count=3` : Récupère les prévisions pour les prochaines nouvelles lunes.
- `GET /api/moon/hijri?year={y}&month={m}&day={d}` : Convertit une date grégorienne en hégirienne.
- `GET /api/moon/gregorian?year={y}&month={m}&day={d}` : Convertit une date hégirienne en grégorienne.

*Note : `Promise.all` est utilisé dans `Moon.jsx` pour optimiser et paralléliser les requêtes réseau initiales.*

## Pistes d'amélioration

Voici quelques suggestions pour les futurs contributeurs souhaitant améliorer ces modules :

1. **Mise en cache (Caching) :** Implémenter une stratégie de mise en cache (via `localStorage`, `sessionStorage`, ou une librairie comme `React Query`). Les phases lunaires et les dates ne changent qu'une fois par jour ; éviter de solliciter l'API externe à chaque montage du composant serait une excellente optimisation.
2. **Gestion robuste des erreurs :** Actuellement, en cas de défaillance de l'API, les erreurs sont principalement logguées en console (`console.error`). Il serait bénéfique d'ajouter un retour visuel (UI) expliquant clairement l'erreur à l'utilisateur, et de prévoir des données "fallback" plus complètes.
3. **Validation avancée du formulaire :** Dans le convertisseur de `Events.jsx`, ajouter une vérification avant de lancer la requête API pour s'assurer que les dates saisies sont valides (par exemple, bloquer la saisie d'un 32ème jour).
4. **Internationalisation (i18n) :** La liste des mois dans `Events.jsx` (`MONTHS`) et les catégories ("Fête", "Historique", etc.) sont codées en dur en français. Les extraire vers un système de traduction faciliterait l'ajout d'autres langues à l'avenir.
