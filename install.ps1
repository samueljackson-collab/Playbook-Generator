#Requires -Version 5.1
<#
.SYNOPSIS
    Installs the Ansible Homelab Playbook Generator on Windows.

.DESCRIPTION
    Checks for Node.js 20+, sets up the environment file, installs npm dependencies
    with "npm ci", warns that no test suite is present, and prints usage instructions.

.EXAMPLE
    .\install.ps1
    .\install.ps1 -Verbose
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host $Message -ForegroundColor Cyan -BackgroundColor DarkBlue
}

function Write-Info  { param([string]$m) Write-Host "[INFO]  $m" -ForegroundColor Green  }
function Write-Warn  { param([string]$m) Write-Host "[WARN]  $m" -ForegroundColor Yellow }
function Write-Err   { param([string]$m) Write-Host "[ERROR] $m" -ForegroundColor Red    }

# ---------------------------------------------------------------------------
# Node.js version check
# ---------------------------------------------------------------------------

function Check-Node {
    Write-Header "Checking Node.js..."

    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Err "Node.js is not installed or not on PATH."
        Write-Err "Install Node.js 20 or later from https://nodejs.org and re-run."
        exit 1
    }

    $nodeVersion = (node --version).TrimStart('v')
    $nodeMajor   = [int]($nodeVersion.Split('.')[0])

    if ($nodeMajor -lt 20) {
        Write-Err "Node.js $nodeVersion found, but version 20 or later is required."
        Write-Err "Download the latest LTS from https://nodejs.org and re-run."
        exit 1
    }

    Write-Info "Node.js $nodeVersion - OK"
    Write-Info "npm $(npm --version) - OK"
}

# ---------------------------------------------------------------------------
# Environment file setup
# ---------------------------------------------------------------------------

function Setup-Env {
    Write-Header "Setting up environment file..."

    if (Test-Path '.env.local') {
        Write-Info '.env.local already exists - skipping.'
    } elseif (Test-Path '.env') {
        Write-Info '.env already exists - skipping.'
    } else {
        Write-Warn 'No .env or .env.local file found.'
        Write-Warn 'Create a .env.local file in this directory with the following content:'
        Write-Host ""
        Write-Host "    GEMINI_API_KEY=your_gemini_api_key_here" -ForegroundColor DarkCyan
        Write-Host ""
        Write-Warn 'Get a Gemini API key at: https://aistudio.google.com/app/apikey'
    }
}

# ---------------------------------------------------------------------------
# Install npm dependencies
# ---------------------------------------------------------------------------

function Install-Deps {
    Write-Header "Installing npm dependencies..."

    if (-not (Test-Path 'package.json')) {
        Write-Err 'package.json not found.'
        Write-Err 'Run this script from the Playbook-Generator project root directory.'
        exit 1
    }

    & npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Err "npm ci failed with exit code $LASTEXITCODE."
        exit $LASTEXITCODE
    }

    Write-Info 'Dependencies installed.'
}

# ---------------------------------------------------------------------------
# No-tests notice
# ---------------------------------------------------------------------------

function Warn-NoTests {
    Write-Header "Testing notice..."
    Write-Warn 'This project does not currently have a test suite.'
    Write-Warn 'See the Testing section in docs\GUIDE.md for instructions on adding Vitest.'
}

# ---------------------------------------------------------------------------
# Usage instructions
# ---------------------------------------------------------------------------

function Print-Usage {
    Write-Header "Setup complete. Next steps:"
    Write-Host ""
    Write-Host "  1. Add your Gemini API key to .env.local:"
    Write-Host ""
    Write-Host "       GEMINI_API_KEY=your_gemini_api_key_here" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  2. Start the development server:"
    Write-Host ""
    Write-Host "       npm run dev" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "     The app will be available at http://localhost:3000"
    Write-Host ""
    Write-Host "  Other commands:"
    Write-Host "    npm run build    - Build the React frontend to dist\"
    Write-Host "    npm run start    - Run the built Express server (production)"
    Write-Host "    npm run lint     - TypeScript type-check (tsc)"
    Write-Host "    npm run preview  - Serve the dist\ build locally"
    Write-Host ""
    Write-Host "  Full docs:         docs\GUIDE.md"
    Write-Host "  Pre-deploy checks: docs\PRODUCTION_CHECKLIST.md"
    Write-Host ""
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Ansible Homelab Playbook Generator - Installer   " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Check-Node
Setup-Env
Install-Deps
Warn-NoTests
Print-Usage
