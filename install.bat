@echo off
REM install.bat — Ansible Homelab Playbook Generator
REM Sets up the Node.js environment on Windows and prints usage instructions.
REM Usage: install.bat

setlocal enabledelayedexpansion

echo.
echo ====================================================
echo   Ansible Homelab Playbook Generator - Installer
echo ====================================================
echo.

REM ---------------------------------------------------------------------------
REM Node.js version check
REM ---------------------------------------------------------------------------

echo [INFO]  Checking Node.js...

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not on PATH.
    echo [ERROR] Install Node.js 20 or later from https://nodejs.org and re-run.
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=1 delims=." %%m in ('node --version') do (
    set NODE_MAJOR=%%m
    set NODE_MAJOR=!NODE_MAJOR:v=!
)

if !NODE_MAJOR! LSS 20 (
    echo [ERROR] Node.js !NODE_MAJOR! found but version 20 or later is required.
    echo [ERROR] Download the latest LTS from https://nodejs.org and re-run.
    pause
    exit /b 1
)

for /f %%v in ('node --version') do echo [INFO]  Node.js %%v - OK
for /f %%v in ('npm --version') do echo [INFO]  npm %%v - OK

REM ---------------------------------------------------------------------------
REM Check for package.json
REM ---------------------------------------------------------------------------

if not exist "package.json" (
    echo [ERROR] package.json not found.
    echo [ERROR] Run this script from the Playbook-Generator project root directory.
    pause
    exit /b 1
)

REM ---------------------------------------------------------------------------
REM Environment file setup
REM ---------------------------------------------------------------------------

echo.
echo [INFO]  Checking environment file...

if exist ".env.local" (
    echo [INFO]  .env.local already exists - skipping.
) else if exist ".env" (
    echo [INFO]  .env already exists - skipping.
) else (
    echo [WARN]  No .env or .env.local file found.
    echo [WARN]  Create a .env.local file in this directory with:
    echo.
    echo             GEMINI_API_KEY=your_gemini_api_key_here
    echo.
    echo [WARN]  Get a key at: https://aistudio.google.com/app/apikey
)

REM ---------------------------------------------------------------------------
REM Install npm dependencies
REM ---------------------------------------------------------------------------

echo.
echo [INFO]  Installing npm dependencies...

call npm ci
if errorlevel 1 (
    echo [ERROR] npm ci failed. Check the output above for details.
    pause
    exit /b 1
)
echo [INFO]  Dependencies installed.

REM ---------------------------------------------------------------------------
REM No-tests notice
REM ---------------------------------------------------------------------------

echo.
echo [WARN]  This project does not currently have a test suite.
echo [WARN]  See the Testing section in docs\GUIDE.md for instructions on adding Vitest.

REM ---------------------------------------------------------------------------
REM Usage instructions
REM ---------------------------------------------------------------------------

echo.
echo ====================================================
echo   Setup complete. Next steps:
echo ====================================================
echo.
echo   1. Add your Gemini API key to .env.local:
echo.
echo          GEMINI_API_KEY=your_gemini_api_key_here
echo.
echo   2. Start the development server:
echo.
echo          npm run dev
echo.
echo      The app will be available at http://localhost:3000
echo.
echo   Other commands:
echo     npm run build    -- Build the React frontend to dist\
echo     npm run start    -- Run the built Express server (production)
echo     npm run lint     -- TypeScript type-check (tsc)
echo     npm run preview  -- Serve the dist\ build locally
echo.
echo   Full docs: docs\GUIDE.md
echo   Pre-deploy checks: docs\PRODUCTION_CHECKLIST.md
echo.

pause
endlocal
