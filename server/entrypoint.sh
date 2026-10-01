#!/bin/sh
set -e

# Run database migrations (if the DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
fi

# Start the NestJS app
exec npm run start:prod
