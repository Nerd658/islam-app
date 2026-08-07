# Documentation : Calculateur de Zakat

## Description globale
La fonctionnalité "Calculateur de Zakat" permet aux utilisateurs de déterminer le montant de leur Zakat Al-Maal (l'aumône légale). En prenant en compte la devise sélectionnée, leurs différentes formes de richesse (liquidités, or, argent, actions, marchandises professionnelles) et leurs dettes, la page interroge une API externe pour obtenir les cours de l'or et de l'argent en temps réel, calculer le Nissab (seuil d'imposition) et évaluer si l'utilisateur est redevable de la Zakat.

## Architecture
Cette fonctionnalité est principalement implémentée dans un seul fichier de page, avec l'utilisation de composants d'interface réutilisables.

- **Page principale** : [`FRONTEND/islam app/src/pages/Zakat.jsx`](file:///home/bikienga/Desktop/islam-app/FRONTEND/islam%20app/src/pages/Zakat.jsx) (Contient toute la logique de récupération des prix, de soumission du formulaire et de l'affichage des résultats).
- **Composants externes utilisés** :
  - `PageHeader` (`../components/PageHeader`) : Composant générique pour afficher l'en-tête de la page avec un titre et un sous-titre.
  - Icônes de `lucide-react` (`Calculator`, `Coins`, `RefreshCw`, `AlertCircle`, `TrendingUp`) pour enrichir l'interface utilisateur.

## Gestion de l'état (State)
L'état de la page est géré localement à l'aide des Hooks React (`useState` et `useEffect`). Aucun gestionnaire d'état global (comme Redux ou Context) n'est directement nécessaire pour cette fonctionnalité spécifique.

- **États de chargement et d'erreur** :
  - `loadingPrices` (boolean) : Gère l'affichage du loader pendant la récupération des cours de l'or et de l'argent.
  - `loadingCalc` (boolean) : Gère l'affichage du loader sur le bouton de soumission pendant le calcul.
  - `error` (string) : Stocke et affiche les messages d'erreur liés au réseau ou à la validation de l'API.

- **Données de l'application** :
  - `prices` (object) : Stocke les cours actuels et les valeurs du Nissab renvoyés par l'API.
  - `result` (object) : Stocke la réponse du calcul de la Zakat (ex. si le Nissab est atteint, le montant dû, et le détail net).
  
- **Formulaire de saisie** :
  - `form` (object) : Gère de manière centralisée les champs du formulaire de calcul (devise, cash, or, argent, actions, marchandises, dettes).

Un effet de bord (`useEffect`) se déclenche à chaque fois que la devise change (`form.currency`), afin de mettre à jour les cours affichés en temps réel.

## APIs & Données
La fonctionnalité s'appuie sur **UmmahAPI** pour obtenir les données financières requises. Une clé d'API est récupérée via les variables d'environnement (`import.meta.env.VITE_UMMAH_API_KEY`).

1. **Récupération des cours (GET)** :
   - **Endpoint** : `https://ummahapi.com/api/zakat/prices?currency={currency}&apikey={API_KEY}`
   - **Utilisation** : Récupère le prix au gramme de l'or et de l'argent, ainsi que la valeur monétaire du Nissab (basé sur 85g d'or et 595g d'argent).

2. **Calcul de la Zakat (POST)** :
   - **Endpoint** : `https://ummahapi.com/api/zakat/calculate?apikey={API_KEY}`
   - **Corps de la requête (JSON)** : Envoie les valeurs du formulaire (cash, gold_grams, silver_grams, stocks, business_goods, liabilities) accompagnées de la devise.
   - **Utilisation** : L'API traite ces informations pour retourner si le montant total est imposable (`above_nisab`) et le montant exact à payer (`zakat_due_formatted`).

## Pistes d'amélioration
Pour les futurs contributeurs, voici quelques idées pour améliorer ou étendre cette fonctionnalité :

1. **Extraction de la logique API** : Séparer les appels à l'API (`fetchPrices`, `handleCalculate`) dans un hook personnalisé (ex: `useZakat.js`) ou un service dédié pour alléger le fichier composant et faciliter les tests unitaires.
2. **Validation côté client** : Ajouter une validation plus stricte avant l'envoi au serveur afin de s'assurer que les valeurs ne soient pas négatives.
3. **Localisation / Internationalisation (i18n)** : Ajouter une prise en charge multi-langues pour que la page soit accessible en anglais, arabe ou d'autres langues.
4. **Sauvegarde locale** : Mettre en cache (via `localStorage`) les données du formulaire pour que l'utilisateur ne perde pas ses saisies s'il quitte la page par inadvertance.
5. **Mode hors-ligne** : Intégrer un système de repli (fallback) stockant en cache le dernier cours connu de l'or et de l'argent afin de permettre un calcul approximatif même sans connexion internet.
