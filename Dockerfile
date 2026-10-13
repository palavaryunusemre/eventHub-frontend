# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 1) Build stage — bağımlılıkları kurup Vite ile production build üretir.
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# 2) Runtime stage — yalnızca statik dosyalar + nginx.
#    nginx.conf, /api isteklerini aynı origin üzerinden backend'e proxy'ler.
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine
COPY --from=build /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=5 \
    CMD wget -qO- http://127.0.0.1:80/ >/dev/null 2>&1 || exit 1
