FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY bun.lock ./
COPY backend/package.json ./
RUN npm install -g bun && bun install --frozen-lockfile
COPY backend/ .

ENV CHROME_PATH=/usr/bin/chromium
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["bun", "src/index.ts"]
