# Build context is the repo root (docker-compose.yml and Render
# blueprint both build from the repository root), so this Dockerfile
# picks up both vaan-bakes/backend/ and vaan-bakes/frontend/.
FROM node:20-alpine

WORKDIR /app

# Install deps first so this layer caches across code-only changes
COPY vaan-bakes/backend/package.json vaan-bakes/backend/package-lock.json* ./
RUN npm install --omit=dev

# App code
COPY vaan-bakes/backend/server.js ./
COPY vaan-bakes/backend/db.js ./
COPY vaan-bakes/backend/schema.sql ./
COPY vaan-bakes/backend/seed.js ./
COPY vaan-bakes/backend/src ./src

# Static frontend the server serves directly (see server.js FRONTEND_DIR)
COPY vaan-bakes/frontend /frontend

ENV PORT=4000
EXPOSE 4000

CMD ["node", "server.js"]
