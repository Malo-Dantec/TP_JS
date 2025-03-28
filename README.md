# League of Champions

Application web pour gérer les builds d'objets des champions League of Legends.

## Fonctionnalités

- **Listing des champions** avec filtres par rôle, favoris et recherche
- **Fiche détail** présentant les stats de base et le calcul dynamique des stats totales
- **Système de build** :
  - Ajout et suppression d'objets (max 6)
  - Prévisualisation en temps réel des statistiques
  - Sauvegarde et chargement des builds
- **Système de notation** (Stockage dans le JSON)
- **Favoris** (Local storage)
- **Gestion des builds** personnalisables (création, renommage, suppression, chargement)

## Lancement de l'application

### Prérequis

- Node.js v16+
- npm

### Installation

1. Cloner le dépôt :
   ```
   git clone https://github.com/Malo-Dantec/TP-JS.git
   cd TP-JS
   ```
2. Installer json-server :
   ```
   npm install -g json-server
   ```
### Démarrage

1. Démarrer le server d'API :
   ```
   json-server --watch data/characters.json --port 3000
   ```
2. Démarrer le serveur web :
   ```
   php -S localhost:8000
   ```
3. Ouvrir le navigateur et accéder à l'application :
   ```
   http://localhost:8000
   ```

**Malo DANTEC, Julien BAILLY**
