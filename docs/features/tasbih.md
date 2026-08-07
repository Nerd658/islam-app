# Documentation de la fonctionnalité : Tasbih Numérique

## Description globale
La fonctionnalité "Tasbih Numérique" permet aux utilisateurs de l'application de compter leurs invocations (Dhikr) facilement. Elle propose une interface moderne imitant un compteur numérique avec retour sonore et haptique (vibrations). L'utilisateur peut choisir parmi une liste d'invocations prédéfinies et ses progrès sont automatiquement sauvegardés, lui permettant de reprendre là où il s'est arrêté.

## Architecture
Les fichiers principaux impliqués dans cette fonctionnalité sont :

- **Page principale** : `src/pages/Tasbih.jsx`
  - Contient toute la logique de l'interface utilisateur, la gestion des compteurs, le rendu conditionnel (ex: étape des 33 invocations) et la génération du son via l'API Web Audio.
- **Hook personnalisé** : `src/hooks/useLocalStorage.js`
  - Un hook React permettant de synchroniser un état local avec le `localStorage` du navigateur. Il gère la persistance des données et inclut une option de durée de vie (TTL) si nécessaire.
- **Composants partagés** : 
  - `src/components/PageHeader.jsx` : Utilisé pour afficher l'en-tête de la page avec un titre et une icône.
  - Icônes de `lucide-react` (RotateCcw, Activity, Volume2, VolumeX, Gem, Trash2).

## Gestion de l'état (State)
La gestion de l'état est centralisée grâce au hook `useLocalStorage`, ce qui garantit que les données ne sont pas perdues lors d'un rafraîchissement de la page :

- `tasbih_count` (Entier) : Le compteur actuel de l'invocation en cours.
- `tasbih_total` (Entier) : Le nombre total d'invocations effectuées au cours de la session.
- `tasbih_phrase` (Chaîne) : L'invocation actuellement sélectionnée (par défaut : "Subhanallah").
- `tasbih_sound` (Booléen) : L'état d'activation du retour sonore.

Les actions de l'utilisateur (incrémentation, changement d'invocation, réinitialisation) mettent à jour ces états, qui sont immédiatement persistés dans le navigateur.

## APIs & Données
Cette fonctionnalité ne consomme **aucune API externe** :

- **Données locales** : Les invocations sont codées en dur dans le composant sous forme de tableau d'objets (texte en phonétique et version arabe).
- **Web Audio API** : Le son du "clic" est généré dynamiquement à l'aide de l'objet `AudioContext` natif du navigateur, ce qui évite de charger un fichier audio externe.
- **API Vibration** : L'API native `navigator.vibrate` est utilisée pour le retour haptique (petite vibration à chaque clic, double vibration tous les 33 clics).

## Pistes d'amélioration
Pour les futurs contributeurs, voici quelques idées d'évolutions possibles pour cette fonctionnalité :

1. **Personnalisation des invocations** : Permettre à l'utilisateur d'ajouter ses propres invocations (Dhikr) personnalisées.
2. **Objectifs personnalisés** : Au lieu de bloquer le jalon à 33, permettre à l'utilisateur de définir son propre palier d'alerte (ex: 10, 100, 1000).
3. **Historique et statistiques** : Sauvegarder les sessions terminées et afficher un graphique ou un calendrier de régularité du Dhikr.
4. **Accessibilité** : Ajouter des raccourcis clavier (ex: appuyer sur "Espace" pour compter) pour faciliter l'utilisation sur ordinateur.
