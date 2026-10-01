FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm (optional) – we use npm here
COPY package.json package-lock.json* .
RUN npm ci --omit=dev

# Copy source files
COPY . .

# Prisma generation and build
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/src/main.js"]
