FROM node:20-alpine AS build
WORKDIR /app
RUN npm install -g bun
COPY bun.lock ./
COPY frontend/package.json ./
RUN bun install --frozen-lockfile
COPY frontend/ .
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
