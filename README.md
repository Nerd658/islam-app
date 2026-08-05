# IslamApp

**IslamApp** est une application web moderne, rapide et sécurisée conçue pour accompagner au quotidien la communauté musulmane. Construite sur une architecture stricte de séparation **Frontend (React) / Backend (Express)** et pensée comme une **PWA** (Progressive Web App), elle offre une expérience native sur mobile et une interface de type tableau de bord sur ordinateur.

## Version
Version : **4.1.0** (selon le fichier package.json du Frontend).

## Fonctionnalités Principales

- **Horaires de Prière (Accueil)** : Calcul dynamique des heures de prière en fonction de votre ville ou de votre position GPS automatique.
- **Lecteur du Coran** : Lecture des 114 sourates avec textes en arabe authentique, règles de tajweed, écoute audio synchronisée, gestion de marque-pages, et support hors-ligne.
- **Hadiths** : Accès à la compilation des 40 hadiths d'An-Nawawi.
- **Adhkar** : Invocations quotidiennes du matin et du soir.
- **Tasbih** : Compteur numérique pour faciliter le dhikr.
- **99 Noms d'Allah** : Liste complète avec translittération, sens, bienfaits et invocations (Duas) recommandés.
- **Boussole Qibla** : Indication de la direction de la Mecque.
- **Calendrier des Événements Islamiques** : Suivi des grandes dates islamiques (Ramadan, Aïd, Hajj, Achoura).
- **Imam Virtuel (Chat IA)** : Un assistant basé sur l'IA répondant à vos questions théologiques.
- **Apprentissage de l'Arabe** : Modules complets comprenant l'alphabet, le vocabulaire (avec audio local), les règles de tajweed, la grammaire et un quiz interactif.

## Stack Technique

- **Frontend** : React 19, Vite 6, TailwindCSS 3, react-router-dom 7, Zustand (gestion d'état), Framer Motion (animations), Lucide React (icônes vectorielles), Howler.js (audio), Axios, vite-plugin-pwa.
- **Backend** : Node.js, Express, Axios, Zod (validation des données).
- **Tests** : Vitest (Frontend), Jest / Python requests (Backend).

## Architecture

L'application repose sur une séparation claire :
- **Séparation Frontend/Backend** : Le Frontend gère l'interface utilisateur, la mise en cache et le stockage local, tandis que le Backend s'occupe de la logique métier critique, de la sécurité et du proxy vers certaines API tierces.
- **Motif Proxy d'API** : Le Backend fait office de proxy (notamment pour l'API OpenRouter et pour un service TTS) afin de masquer les clés API et contourner les restrictions CORS des navigateurs.
- **Lecteur Coran Offline-First** : L'application utilise IndexedDB pour le stockage binaire des fichiers audio MP3 afin de permettre le téléchargement par sourate pour une utilisation hors-ligne.

## API Intégrées

- **Quran.com API v4** : Pour la récupération des versets, des récitations audio et la recherche globale.
- **AlAdhan API** : Pour le calcul des heures de prière et la récupération des 99 noms d'Allah.
- **Nominatim (OpenStreetMap)** : Pour le géocodage et la détermination de la position de l'utilisateur.
- **OpenRouter** : Pour le moteur de conversation du chatbot "Imam Virtuel".

## Support Hors-Ligne (PWA)

L'application intègre un système hors-ligne à deux niveaux :
1. **Service Worker** : Généré via `vite-plugin-pwa` et Workbox, il met en cache les requêtes API (comme l'API Quran.com en stratégie `CacheFirst` et AlAdhan en `NetworkFirst`) ainsi que les assets vitaux pour un démarrage sans réseau.
2. **IndexedDB** : Utilisé pour le stockage binaire natif des fichiers MP3, permettant le téléchargement des sourates complètes (texte et audio) pour un accès hors-ligne fluide.

Une fois installée, l'application fonctionne comme une application native sur iOS (Safari) et Android (Chrome).

## Sécurité du Backend

Le backend Node.js intègre plusieurs couches de protection :
- **CORS strict** : Autorise uniquement les requêtes provenant du frontend.
- **Helmet** : Sécurisation des en-têtes HTTP (Cross-Origin Resource Policy).
- **HPP (HTTP Parameter Pollution)** : Prévient les attaques par pollution de paramètres.
- **Rate-Limiting (Anti-DDoS)** : Blocage des requêtes abusives en limitant les accès à 100 requêtes toutes les 10 minutes par adresse IP.
- **XSS Clean** : Nettoyage automatique du contenu des requêtes pour bloquer les scripts intersites.

## Installation et Démarrage

### 1. Prérequis
- Node.js (version 18 ou supérieure)

### 2. Variables d'Environnement
Dans le répertoire `FRONTEND/islam app`, créez un fichier `.env` basé sur le `.env.example` :
```env
VITE_ALADHAN_API_URL=https://api.aladhan.com
VITE_QURAN_API_URL=https://api.quran.com
VITE_NOMINATIM_API_URL=https://nominatim.openstreetmap.org
VITE_BACKEND_URL=http://localhost:3001
```
- **VITE_ALADHAN_API_URL** : API pour les prières et les noms d'Allah.
- **VITE_QURAN_API_URL** : API pour le lecteur du Coran.
- **VITE_NOMINATIM_API_URL** : API pour la géolocalisation.
- **VITE_BACKEND_URL** : URL de votre backend local ou en production.

Dans le répertoire `BACKEND`, créez un fichier `.env` :
```env
PORT=4000
OPENROUTER_API_KEY=votre_cle_openrouter
PROMPT_SYSTEM="Tu es un savant musulman..."
FRONTEND_URL=http://localhost:5173
```
- **PORT** : Le port d'écoute du serveur backend (par défaut 4000).
- **OPENROUTER_API_KEY** : La clé pour utiliser les modèles IA du chat.
- **PROMPT_SYSTEM** : Le prompt injecté par défaut à l'IA pour définir son comportement.
- **FRONTEND_URL** : L'URL du frontend autorisée par les CORS.

### 3. Lancer le Backend
```bash
cd BACKEND
npm install
npm run start
```
*Le serveur se lance sur le port 4000.*

### 4. Lancer le Frontend
```bash
cd "FRONTEND/islam app"
npm install
npm run dev
```
*L'interface sera accessible sur le port défini par Vite (ex: http://localhost:5173).*

## Tests Automatisés

Le projet contient des scripts complets situés dans le dossier `/scripts/` :
- **Test d'Intégrité Frontend** (`node scripts/test_frontend.js`) : Installe les dépendances, lance la suite de tests unitaires (Vitest) et vérifie la compilation complète de l'application et de la PWA.
- **Test de Sécurité Backend** (`python3 scripts/test_backend.py`) : Script exécutant des requêtes automatisées pour valider les règles de sécurité, comme le Rate Limiting (429 Too Many Requests), la protection HPP et la validation basique des entrées.

## Contribution

- L'architecture privilégie la modularité. Tous les composants UI doivent se trouver dans le dossier `src/components`, et les vues dans `src/pages`.
- Aucun emoji texte ne doit être utilisé dans le code source : utilisez uniquement les icônes de la librairie Lucide React.
- Exécutez les scripts de test avant toute soumission de code.
