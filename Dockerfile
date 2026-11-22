# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

# Copy root and backend package definitions
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install backend production dependencies
RUN npm install --prefix backend --omit=dev

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create uploads and private_uploads directories
RUN mkdir -p /app/backend/uploads /app/backend/private_uploads/verification

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "backend/server.js"]
