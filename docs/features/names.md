# Documentation de la Fonctionnalité : Prénoms Islamiques

Bienvenue dans la documentation de la fonctionnalité **Prénoms Islamiques** ! Ce document est conçu pour aider les nouveaux contributeurs à comprendre le fonctionnement, l'architecture et les données derrière cette belle fonctionnalité de l'application IslamApp. 🚀

## Description globale

La fonctionnalité "Prénoms Islamiques" permet aux utilisateurs de parcourir, rechercher et filtrer une liste de prénoms islamiques authentiques pour garçons et filles. Elle offre une interface intuitive avec :
- Une **barre de recherche textuelle** dynamique (recherche par prénom ou par signification).
- Des **filtres rapides** par genre (Tous, Garçons, Filles).
- Des **cartes élégantes** affichant les détails de chaque prénom (prénom en alphabet latin et en arabe, signification, genre et origine).

## Architecture

L'architecture de cette fonctionnalité est simple et repose principalement sur un seul composant page. Les fichiers principaux impliqués sont :

- **Page principale** : [`IslamicNames.jsx`](file:///home/bikienga/Desktop/islam-app/FRONTEND/islam%20app/src/pages/IslamicNames.jsx)
  C'est le composant React (page) qui orchestre l'affichage, la logique de recherche et le filtrage des prénoms.
- **Composant UI partagé** : [`PageHeader.jsx`](file:///home/bikienga/Desktop/islam-app/FRONTEND/islam%20app/src/components/PageHeader.jsx)
  Un composant réutilisable pour afficher l'en-tête de la page avec un titre, un sous-titre et une icône.
- **Icônes** : La page utilise la bibliothèque `lucide-react` (icônes `Type`, `Search`, `User`, `UserCheck`) pour un design moderne.

## Gestion de l'état (State)

La page [`IslamicNames.jsx`](file:///home/bikienga/Desktop/islam-app/FRONTEND/islam%20app/src/pages/IslamicNames.jsx) utilise des hooks React standard pour gérer l'interface de manière réactive :

- `names` (`useState`) : Stocke la liste complète des prénoms (initialisée avec les données du JSON).
- `searchTerm` (`useState`) : Contient la chaîne de texte tapée par l'utilisateur dans la barre de recherche.
- `filterGender` (`useState`) : Gère le filtre de genre actif (les valeurs possibles sont `'all'`, `'male'`, ou `'female'`).

> [!TIP]
> **Optimisation des performances avec useMemo**
> Le filtrage des prénoms est géré par le hook `useMemo` pour éviter les calculs inutiles à chaque rendu du composant. La liste filtrée n'est recalculée que si `names`, `searchTerm` ou `filterGender` changent.

```javascript
const filteredNames = useMemo(() => {
    return names.filter(n => {
        const matchesGender = filterGender === 'all' || n.gender === filterGender;
        const matchesSearch = n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              n.meaning.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesGender && matchesSearch;
    });
}, [names, searchTerm, filterGender]);
```

## APIs & Données

Actuellement, cette fonctionnalité ne fait aucun appel à une API réseau externe. Les données sont 100% statiques et chargées depuis un fichier JSON local.

- **Source de données** : [`islamic_names.json`](file:///home/bikienga/Desktop/islam-app/FRONTEND/islam%20app/src/data/islamic_names.json)
- **Structure des données** : Le fichier JSON est composé d'un large tableau d'objets. Chaque objet représente un prénom unique.

Voici un exemple de la structure d'un objet prénom :
```json
{
  "id": 1,
  "name": "Muhammad",
  "arabic": "مُحَمَّد",
  "gender": "male",
  "meaning": "Praised, commendable",
  "origin": "Arabic",
  "root": "ح م د",
  "note": "The name of the Final Prophet (ﷺ). Most common Islamic name worldwide."
}
```

> [!NOTE]
> Actuellement, les clés `root` et `note` existent dans le fichier JSON mais ne sont pas affichées sur l'interface utilisateur. C'est une excellente opportunité d'amélioration !

## Pistes d'amélioration

Vous souhaitez contribuer ? Voici quelques idées d'améliorations (issues/PRs) qui seraient très appréciées pour enrichir la fonctionnalité :

1. **Amélioration des performances (Pagination / Virtualisation)** : Le fichier JSON contient plus de 2000 prénoms. L'affichage de tous les éléments d'un coup peut ralentir le DOM. Intégrer un système de défilement infini ou de pagination (par exemple avec `react-window`) serait un vrai plus.
2. **Fonctionnalité "Favoris"** : Permettre aux utilisateurs de sauvegarder leurs prénoms favoris en utilisant le `localStorage` du navigateur (ou le Context global de l'app).
3. **Exploitation complète des données** : Ajouter un modal (fenêtre contextuelle) au clic sur une carte pour afficher plus de détails, comme les champs `note` et `root` qui sont actuellement ignorés dans le rendu.
4. **Filtres supplémentaires** : Ajouter un tri par ordre alphabétique (A-Z, Z-A) ou un filtre supplémentaire basé sur l'origine du prénom (`origin`).
5. **Traduction (i18n)** : Actuellement, les significations (`meaning`) et les notes (`note`) du fichier JSON sont en anglais alors que l'interface est en français. Implémenter une traduction directe des données ou utiliser une librairie d'internationalisation.

Merci pour votre intérêt à contribuer à IslamApp ! N'hésitez pas à ouvrir une Pull Request ou à discuter de ces fonctionnalités dans les issues du projet. 🌟
