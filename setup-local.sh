#!/bin/bash
# ===========================================
# Local Development Setup Script
# ===========================================
# Run this once after cloning the repo to set up your local .env
# This file is safe to commit — it doesn't contain any secrets.
#
# Usage:
#   ./setup-local.sh
# ===========================================

set -e

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}🔧 Portfolio — Local Setup${RESET}"
echo -e "${BOLD}========================${RESET}"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
  echo -e "${YELLOW}  .env already exists. Overwrite? (y/N)${RESET}"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "  Keeping existing .env."
    exit 0
  fi
fi

# Generate a random session secret
SECRET=$(openssl rand -hex 32 2>/dev/null || echo "fallback-secret-$(date +%s)")

# Ask for admin password
echo ""
echo -e "${YELLOW}  Enter admin password (for editing portfolio):${RESET}"
read -r PASSWORD
if [ -z "$PASSWORD" ]; then
  PASSWORD="admin123"
  echo -e "  Using default: admin123"
fi

# Write .env
cat > .env << EOF
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="$PASSWORD"
SESSION_SECRET="$SECRET"
EOF

echo ""
echo -e "${GREEN}✓ .env created with your settings.${RESET}"
echo -e "${GREEN}✓ Session secret generated: $SECRET${RESET}"
echo ""
echo -e "${BOLD}Next steps:${RESET}"
echo -e "  1. Run: bun install"
echo -e "  2. Run: bun run db:push"
echo -e "  3. Run: bun run dev"
echo ""
echo -e "${YELLOW}⚠️  .env is gitignored — it will NEVER be uploaded to GitHub.${RESET}"
echo -e "${YELLOW}⚠️  The db/ folder is also gitignored — your data stays local.${RESET}"
echo ""
