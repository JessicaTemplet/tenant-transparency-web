# ── Stage 1: build React app ─────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_API_BASE_URL is intentionally left unset here.
# The built JS uses the fallback (http://localhost:3000) which is correct
# because the browser — not the container — makes API calls, and Docker
# exposes the API on localhost:3000 of the host machine.
RUN npm run build

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
