# City Weather Search

City Weather Search est une application React permettant aux utilisateurs de rechercher des villes et d'afficher les prévisions météo pour ces villes en utilisant une fonctionnalité d'autocomplete. L'application utilise l'API OpenWeatherMap pour fournir des informations météorologiques précises.

## Fonctionnalités

- Recherche de villes avec une liste déroulante d'autocomplete.
- Affichage des prévisions météo pour les 3 prochains jours.
- Utilisation de l'API OpenWeatherMap pour obtenir des données météorologiques en temps réel.
- Utilisation de `date-fns` pour le formatage des dates.
- Application stylisée avec Tailwind CSS.

## Prérequis

- **Docker** : Assurez-vous d'avoir [Docker](https://www.docker.com/get-started) et [Docker Compose](https://docs.docker.com/compose/install/) installés sur votre machine.

## Installation et Lancement avec Docker Compose

1. Clonez le dépôt GitHub sur votre machine locale :

```bash
   git clone https://github.com/votre-utilisateur/city-weather-search.git
```

2. Accédez au répertoire du projet :

```bash
cd city-weather-search
```

3. Créez un fichier .env à la racine du projet et ajoutez votre clé API OpenWeatherMap comme ceci :

```bash
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

4. Exécutez l'application avec Docker Compose :

```bash
docker-compose up --build
```

Cette commande va créer l'image Docker et lancer le conteneur. L'application sera accessible via http://localhost:3000.
