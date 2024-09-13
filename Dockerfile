# Étape 1: Construction de l'image
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./

# Créer le build de l'application
RUN yarn build

# Étape 2: Serveur web de production avec NGINX
FROM nginx:stable-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer le serveur NGINX
CMD ["nginx", "-g", "daemon off;"]
