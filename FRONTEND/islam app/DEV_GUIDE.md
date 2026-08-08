# Guide de Développement (DEV_GUIDE.md)

Ce document décrit les conventions et règles architecturales de l'application.

## 1. Architecture
- `src/pages/` : Composants de pages entières (Home, Khatm, Quran, etc.).
- `src/components/` : Composants réutilisables (PageHeader, Navigation, ErrorBoundary).
- `src/hooks/` : Hooks personnalisés (`useLocalStorage`, `usePrayerTimes`).
- `src/data/` : Contenus statiques JSON (Quiz, Noms d'Allah, Hadiths, Fundamentals) pour une utilisation hors-ligne (PWA) ultra rapide.

## 2. Règles de Style & UX
- **Couleurs** : L'application utilise un Dark Theme strict.
  - Arrière-plan : `bg-[#0a0a0a]` ou `bg-[#111]` (mappé via Tailwind `bg-theme-bg` / `bg-theme-surface`).
  - Bordures : `#222` ou `#333` (`border-theme-border`).
  - Accent : Emerald (`#10b981`) ou la couleur primaire du thème.
- **Pas d'émojis dans le code natif JSX** : Privilégier les icônes vectorielles (Lucide React).
- **Responsive** : Penser "Mobile-First" (barre de navigation en bas sur mobile, latérale sur Desktop).

## 3. Gestion d'État et de Données
- Favoriser `localStorage` avec le hook `useLocalStorage` pour les petites préférences (favoris, plans).
- Les opérations lourdes (chargement audio complet, base de données Coran) utilisent `IndexedDB` via `src/utils/quranOfflineStorage.js`.
- **Prévention des crashs** : Toujours utiliser des blocs `try/catch` lors du `JSON.parse()` des données locales. Un `<ErrorBoundary>` global est présent dans `App.jsx` pour éviter les WSOD (White Screen of Death).

## 4. Déploiement & Branches
- Les développements se font sur `dev`.
- Les commits doivent utiliser les conventions (feat, fix, refactor, chore).
- Avant le passage en production sur `main`, une vérification des tests (`npm test`) et de la sécurité (audit NPM, vérification XSS) est recommandée.
