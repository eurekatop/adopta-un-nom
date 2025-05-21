# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: Execució amb Node i deps
FROM node:20-alpine

WORKDIR /app

# Copiem node_modules i dist des del builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Si tens .env o altra config, copia-la aquí també si cal
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]
