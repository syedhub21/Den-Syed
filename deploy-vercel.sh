#!/bin/bash
# ===========================================
# Vercel Deployment Helper Script
# ===========================================
# Run this script to deploy your portfolio to Vercel.
# It checks everything is ready, then deploys.
#
# Usage:
#   chmod +x deploy-vercel.sh
#   ./deploy-vercel.sh
# ===========================================

set -e

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}🚀 Portfolio → Vercel Deployment${RESET}"
echo -e "${BOLD}================================${RESET}"
echo ""

# --- Step 1: Check prerequisites ---
echo -e "${BOLD}Step 1: Checking prerequisites...${RESET}"

if ! command -v git &> /dev/null; then
  echo -e "${RED}❌ Git not found. Install: https://git-scm.com${RESET}"
  exit 1
fi
echo -e "${GREEN}  ✓ Git found${RESET}"

if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}  ⚠ Vercel CLI not found. Installing...${RESET}"
  npm install -g vercel
fi
echo -e "${GREEN}  ✓ Vercel CLI found${RESET}"

# --- Step 2: Check .env ---
echo ""
echo -e "${BOLD}Step 2: Checking environment...${RESET}"

if [ -f ".env" ]; then
  echo -e "${GREEN}  ✓ .env file exists${RESET}"
else
  echo -e "${YELLOW}  ⚠ No .env file. Copying from .env.example...${RESET}"
  cp .env.example .env
  echo -e "${RED}  ❌ Edit .env with your DATABASE_URL before deploying!${RESET}"
  echo -e "     Get a free Postgres URL from https://neon.tech"
  exit 1
fi

if grep -q "postgresql://" .env || grep -q "postgresql://" .env.local 2>/dev/null; then
  echo -e "${GREEN}  ✓ PostgreSQL DATABASE_URL found${RESET}"
else
  echo -e "${RED}  ❌ DATABASE_URL in .env is not a PostgreSQL URL${RESET}"
  echo -e "     Vercel needs PostgreSQL, not SQLite."
  echo -e "     Get a free URL from https://neon.tech"
  exit 1
fi

# --- Step 3: Generate Prisma Client ---
echo ""
echo -e "${BOLD}Step 3: Generating Prisma client...${RESET}"
bun run db:generate 2>/dev/null || npx prisma generate
echo -e "${GREEN}  ✓ Prisma client generated${RESET}"

# --- Step 4: Push schema to database ---
echo ""
echo -e "${BOLD}Step 4: Pushing schema to database...${RESET}"
echo -e "${YELLOW}  This creates all tables in your Postgres database.${RESET}"
bun run db:push 2>/dev/null || npx prisma db push
echo -e "${GREEN}  ✓ Database schema pushed${RESET}"

# --- Step 5: Git status ---
echo ""
echo -e "${BOLD}Step 5: Git status...${RESET}"

if git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${GREEN}  ✓ Git repository initialized${RESET}"
else
  echo -e "${YELLOW}  Initializing git repository...${RESET}"
  git init
  git add .
  git commit -m "Initial portfolio commit"
fi

# --- Step 6: Deploy ---
echo ""
echo -e "${BOLD}Step 6: Deploying to Vercel...${RESET}"
echo -e "${YELLOW}  This will open a browser to log into Vercel (first time only).${RESET}"
echo ""

vercel --prod

echo ""
echo -e "${BOLD}================================${RESET}"
echo -e "${GREEN}${BOLD}✅ Deployment complete!${RESET}"
echo ""
echo -e "${BOLD}Next steps:${RESET}"
echo -e "  1. Go to your Vercel dashboard"
echo -e "  2. Add environment variables (if not set):"
echo -e "     - DATABASE_URL (PostgreSQL)"
echo -e "     - ADMIN_PASSWORD (your chosen password)"
echo -e "     - SESSION_SECRET (any random string)"
echo -e "  3. Redeploy if you added env vars"
echo -e "  4. Visit your site — it auto-seeds on first load!"
echo ""
