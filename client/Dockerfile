FROM node:20-alpine AS builder
WORKDIR /app

# Install deps and build React app
COPY package.json package-lock.json* .
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Production Nginx image
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: replace default nginx config with one that handles SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
