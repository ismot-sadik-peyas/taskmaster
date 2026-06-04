FROM node:20-alpine AS build

WORKDIR /app

# Copy full backend folder
COPY backend ./backend

WORKDIR /app/backend

# Install only production dependencies
RUN npm install --only=production


# ------------------------------
# Production Image
# ------------------------------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy backend from build stage
COPY --from=build /app/backend /app/backend

# Copy frontend
COPY frontend/public /app/frontend/public

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "src/server.js"]
