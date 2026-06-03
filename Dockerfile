FROM node:20-alpine AS build

WORKDIR /app

COPY backend/package.json ./backend/package.json
WORKDIR /app/backend
RUN npm install --only=production

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/backend /app/backend
COPY frontend/public /app/frontend/public

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "src/server.js"]
