# Documentation de la fonctionnalité : Lecture du Coran

## Description globale
La fonctionnalité "Lecture du Coran" permet aux utilisateurs de consulter, lire et écouter les versets du Noble Coran. Elle offre une expérience riche et interactive avec des options avancées telles que la recherche globale (sourates et versets), la gestion de la lecture hors-ligne (téléchargement du texte et de l'audio), le suivi du dernier verset lu (marque-page), l'activation des règles de Tajweed avec un code couleur, ainsi que le choix du récitateur et de la vitesse de lecture.

## Architecture
La fonctionnalité est construite autour de plusieurs composants clés et hooks :

- **`src/pages/Quran.jsx`** : La page principale qui sert de conteneur de base pour l'interface de lecture.
- **`src/components/QuranReader.jsx`** : Le composant central et le plus volumineux. Il gère l'ensemble de l'interface utilisateur : la liste des sourates, l'affichage des versets (avec ou sans Tajweed et traduction), les contrôles du lecteur audio synchronisé mot à mot, et la logique de recherche.
- **`src/hooks/useQuranOffline.js`** : Un hook React sur mesure qui orchestre la logique de téléchargement, vérifie le statut des données locales, et supprime les ressources hors-ligne (textes et fichiers audio).
- **`src/utils/quranOfflineStorage.js`** : Un utilitaire d'interaction directe avec l'API **IndexedDB** du navigateur pour stocker les métadonnées des sourates (`surah_meta`) et les fichiers audio sous forme de `Blob` (`audio_blobs`).

## Gestion de l'état (State)

### State local React (`useState` / `useRef`)
Le composant `QuranReader` utilise de nombreux états pour gérer l'interaction utilisateur :
- **Données** : `chapters` (liste des sourates), `selectedChapter`, `verses` (versets de la sourate active).
- **Recherche** : `searchQuery`, `searchMode` (sourates ou versets), `searchResults`, `isSearchingVerses`.
- **Préférences** : `tajweedMode` (booléen), `showTranslation` (booléen), `selectedReciter` (ID du récitateur), `playbackSpeed` (vitesse de lecture).
- **Lecteur Audio** : `audioFiles` (URLs des audios), `playingVerse`, `audioProgress` (progression, index du mot en cours de lecture pour la surbrillance).
- **Références (`useRef`)** : Utilisées pour l'élément audio HTML (`audioRef`), la gestion de l'auto-scroll (`verseRefs`, `versesListContainerRef`), et pour conserver en mémoire les URL d'objets Blob (`blobUrlsRef` dans le hook offline).

### Mémoire persistante (`localStorage`)
- **`quran_chapters_cache`** : Mise en cache de la liste des sourates pour un chargement instantané sans attendre la réponse réseau.
- **`quran_last_read`** : Sauvegarde le dernier verset lu (ID de sourate, nom, numéro du verset) pour permettre de reprendre la lecture (système de marque-page).

### Stockage Hors-ligne (IndexedDB)
Grâce au hook `useQuranOffline`, l'état de la mise en cache (téléchargement en cours, progression, statut complété) est maintenu. Les données elles-mêmes sont stockées de façon asynchrone dans IndexedDB via l'utilitaire `quranOfflineStorage.js`.

## APIs & Données
L'application consomme l'API publique V4 de [Quran.com](https://quran.com) (configurée via la variable d'environnement `VITE_QURAN_API_URL`) :

- **`/api/v4/chapters?language=fr`** : Récupère la liste globale des 114 sourates.
- **`/api/v4/quran/verses/uthmani_tajweed`** : Récupère les versets en écriture "Uthmani" avec les balises HTML de coloration pour le Tajweed.
- **`/api/v4/quran/translations/31`** : Récupère la traduction française des versets.
- **`/api/v4/quran/recitations/{reciter_id}`** : Récupère les métadonnées audio (et les URLs) selon le récitateur sélectionné.
- **`/api/v4/search`** : Endpoint pour la recherche textuelle dans l'ensemble du Coran.

*Note : Les URLs audio relatives retournées par l'API sont préfixées dynamiquement avec `https://verses.quran.com/`.*

## Pistes d'amélioration pour les futurs contributeurs

1. **Refactoring de `QuranReader.jsx`** : Le fichier dépasse les 800 lignes. Il serait très pertinent de le scinder en plusieurs petits composants réutilisables, par exemple :
   - `<SurahList />` (pour la grille des sourates)
   - `<VerseItem />` (pour l'affichage d'un verset individuel)
   - `<AudioPlayerControls />` (pour les paramètres de vitesse et de récitateur)
   - `<TajweedLegendModal />` (pour l'affichage des règles)
2. **Virtualisation de la liste des versets** : Lors du chargement de très longues sourates (ex: Al-Baqarah, 286 versets), le rendu de centaines d'éléments du DOM peut ralentir l'interface. L'utilisation d'une librairie comme `react-window` ou `react-virtuoso` permettrait d'améliorer drastiquement les performances.
3. **Gestion Globale de l'Audio** : L'état de l'audio est actuellement localisé dans `QuranReader.jsx`. Extraire cette logique vers un contexte (`React Context`, Redux ou Zustand) permettrait de continuer à écouter la récitation même en naviguant sur d'autres pages de l'application.
4. **Amélioration de la gestion des erreurs réseau** : Remplacer les simples `console.error` par des notifications visuelles (toast / alertes) pour informer l'utilisateur si la connexion internet est instable lors de la recherche ou du téléchargement.
5. **Gestion de l'espace de stockage** : Ajouter une interface dans les paramètres globaux de l'application permettant à l'utilisateur de voir l'espace disque consommé par les sourates téléchargées (IndexedDB) et de purger le cache en une seule action.
