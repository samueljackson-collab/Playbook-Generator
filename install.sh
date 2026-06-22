#!/usr/bin/env bash
# install.sh — Ansible Homelab Playbook Generator
# Sets up the Node.js environment and prints usage instructions.
# Usage: bash install.sh

set -euo pipefail

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
RESET="\033[0m"

info()    { echo -e "${GREEN}[INFO]${RESET}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; }
header()  { echo -e "\n${BOLD}$*${RESET}"; }

# ---------------------------------------------------------------------------
# Node.js version check
# ---------------------------------------------------------------------------

check_node() {
  header "Checking Node.js..."

  if ! command -v node &>/dev/null; then
    error "Node.js is not installed or not on PATH."
    error "Install Node.js 20 or later from https://nodejs.org and re-run this script."
    exit 1
  fi

  NODE_VERSION=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)

  if [[ "$NODE_MAJOR" -lt 20 ]]; then
    error "Node.js $NODE_VERSION found, but version 20 or later is required."
    error "Download the latest LTS from https://nodejs.org and re-run."
    exit 1
  fi

  info "Node.js $NODE_VERSION — OK"
  info "npm $(npm --version) — OK"
}

# ---------------------------------------------------------------------------
# Environment file setup
# ---------------------------------------------------------------------------

setup_env() {
  header "Setting up environment file..."

  if [[ -f ".env.local" ]]; then
    info ".env.local already exists — skipping."
  elif [[ -f ".env" ]]; then
    info ".env already exists — skipping."
  else
    warn "No .env or .env.local file found."
    warn "Create a .env.local file with the following content before starting the app:"
    echo ""
    echo "    GEMINI_API_KEY=your_gemini_api_key_here"
    echo ""
    warn "You can get a Gemini API key at: https://aistudio.google.com/app/apikey"
  fi
}

# ---------------------------------------------------------------------------
# Install npm dependencies
# ---------------------------------------------------------------------------

install_deps() {
  header "Installing npm dependencies..."

  if [[ ! -f "package.json" ]]; then
    error "package.json not found. Make sure you are running this script from the"
    error "Playbook-Generator project root directory."
    exit 1
  fi

  npm ci
  info "Dependencies installed."
}

# ---------------------------------------------------------------------------
# No-tests notice
# ---------------------------------------------------------------------------

warn_no_tests() {
  header "Testing notice..."
  warn "This project does not currently have a test suite."
  warn "To add tests, see the 'Testing' section in docs/GUIDE.md for instructions"
  warn "on adding Vitest."
}

# ---------------------------------------------------------------------------
# Usage instructions
# ---------------------------------------------------------------------------

print_usage() {
  header "Setup complete. Next steps:"
  echo ""
  echo "  1. Add your Gemini API key to .env.local:"
  echo ""
  echo "       GEMINI_API_KEY=your_gemini_api_key_here"
  echo ""
  echo "  2. Start the development server:"
  echo ""
  echo "       npm run dev"
  echo ""
  echo "     The app will be available at http://localhost:3000"
  echo ""
  echo "  Other commands:"
  echo "    npm run build    — Build the React frontend to dist/"
  echo "    npm run start    — Run the built Express server (production)"
  echo "    npm run lint     — TypeScript type-check (tsc)"
  echo "    npm run preview  — Serve the dist/ build locally"
  echo ""
  echo "  For full documentation see: docs/GUIDE.md"
  echo "  For pre-deploy checks see:  docs/PRODUCTION_CHECKLIST.md"
  echo ""
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
  echo ""
  echo -e "${BOLD}====================================================${RESET}"
  echo -e "${BOLD}  Ansible Homelab Playbook Generator — Installer    ${RESET}"
  echo -e "${BOLD}====================================================${RESET}"

  check_node
  setup_env
  install_deps
  warn_no_tests
  print_usage
}

main "$@"
