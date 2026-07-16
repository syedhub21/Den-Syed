#!/bin/bash
# Switch between SQLite (local) and PostgreSQL (Vercel)
#
# Usage:
#   ./switch-db.sh local    → SQLite for local dev
#   ./switch-db.sh vercel   → PostgreSQL for Vercel

set -e

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

if [ "$1" = "local" ]; then
  echo -e "${YELLOW}Switching to SQLite (local dev)...${RESET}"
  cp prisma/schema.local.prisma prisma/schema.prisma
  echo 'DATABASE_URL="file:./dev.db"' > .env
  echo -e "${YELLOW}  Set ADMIN_PASSWORD and SESSION_SECRET in .env.local${RESET}"
  bun run db:push
  echo -e "${GREEN}✓ Switched to SQLite. Run 'bun run dev' to start.${RESET}"

elif [ "$1" = "vercel" ]; then
  echo -e "${YELLOW}Switching to PostgreSQL (Vercel)...${RESET}"
  cat > prisma/schema.prisma << 'SCHEMA'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
SCHEMA
  # Append models from the local schema (they're identical)
  tail -n +16 prisma/schema.local.prisma >> prisma/schema.prisma
  echo -e "${GREEN}✓ Switched to PostgreSQL."
  echo -e "${YELLOW}  Set DATABASE_URL in .env and Vercel env vars to your Postgres URL.${RESET}"
  echo -e "${YELLOW}  Get a free one at https://neon.tech${RESET}"
  echo -e "${YELLOW}  Set ADMIN_PASSWORD and SESSION_SECRET in Vercel env vars.${RESET}"

else
  echo "Usage: ./switch-db.sh local  |  ./switch-db.sh vercel"
  echo ""
  echo "  local  → SQLite (for local development)"
  echo "  vercel → PostgreSQL (for Vercel deployment)"
fi
