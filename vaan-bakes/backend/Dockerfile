# Build context is the project root (see docker-compose.yml), so this
# Dockerfile can pick up both backend/ and the static frontend/ it serves.
FROM node:20-alpine

WORKDIR /app

# Install deps first so this layer caches across code-only changes
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# App code
COPY backend/server.js ./
COPY backend/db.js ./
COPY backend/schema.sql ./
COPY backend/seed.js ./
COPY backend/src ./src

# Static frontend the server serves directly (see server.js FRONTEND_DIR)
COPY frontend /frontend

ENV PORT=4000
EXPOSE 4000

CMD ["node", "server.js"]
