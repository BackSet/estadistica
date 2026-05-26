# --- Build ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL pública para SEO / Open Graph (definir en Railway como variable de build)
ARG VITE_SITE_URL=
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN npm run build

# --- Serve ---
FROM nginx:1.27-alpine

# Plantilla procesada por el entrypoint oficial de nginx (envsubst)
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

# Railway inyecta PORT en runtime; 8080 es valor por defecto en local
ENV PORT=8080
EXPOSE 8080
