# Ansible Homelab Playbook Generator — Guide

## Overview

The Ansible Homelab Playbook Generator is an AI-powered web application that helps you build
valid Ansible playbooks for homelab and self-hosted infrastructure. You select configuration
categories (networking, services, security, storage, and more), provide context about your
environment, and the Gemini AI model generates a complete, well-structured YAML playbook. The
output is rendered with syntax highlighting, can be downloaded as a `.yml` file, and can be
committed directly to a Git repository via the built-in simple-git integration.

**Stack:** React 19 + Express 5 backend (`server.ts`), TypeScript, Vite, Gemini AI
(`@google/genai`), `js-yaml` for YAML validation, `react-simple-code-editor` + `prismjs` for
syntax highlighting, `simple-git` for optional Git commits.

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 20 or later | `node --version` to check |
| npm | 9 or later (bundled with Node 20) | `npm --version` to check |
| Gemini API key | — | See [Gemini Key Setup](#gemini-key-setup) below |
| Git | Any recent version | Optional — only needed for the commit-to-repo feature |
| SSH key or HTTPS token | — | Optional — only needed if using Git commit to a private repo |

---

## Install

### 1. Clone or download the repository

```bash
git clone <repo-url>
cd Playbook-Generator
```

### 2. Install dependencies

```bash
npm install
```

This installs all runtime and dev dependencies listed in `package.json`, including Express,
React 19, Vite, js-yaml, simple-git, and the Gemini SDK.

### 3. Set up environment variables

Copy the example environment file and add your Gemini API key:

```bash
cp .env.local .env
```

Then edit `.env` (or `.env.local`) and set:

```dotenv
GEMINI_API_KEY=your_api_key_here
```

> The key is read by the Express server at runtime. It is never exposed to the browser.

### 4. Start the development server

```bash
npm run dev
```

This runs `tsx server.ts`, which boots the Express backend and Vite dev middleware together on
`http://localhost:3000`.

---

## Gemini Key Setup

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and sign in with a Google
   account.
2. Click **Create API key** and copy the key.
3. Paste it as the value of `GEMINI_API_KEY` in your `.env` or `.env.local` file.
4. Restart the dev server if it was already running.

The app uses the `@google/genai` package and calls the Gemini API from the Express backend, so
the key is kept server-side and never sent to the browser.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Express + Vite dev server on port 3000 |
| `npm run build` | Build the React frontend to `dist/` via Vite |
| `npm run start` | Run the compiled Express server (`node server.ts`) |
| `npm run lint` | TypeScript type-check via `tsc` |
| `npm run preview` | Serve the `dist/` build locally via Vite preview |

---

## Usage

### Selecting categories

The left panel lists Ansible playbook template categories derived from `constants.ts`. Categories
include networking, core services, security hardening, storage, monitoring, and more. Check the
categories you want included in the generated playbook.

### Providing context

In the context/preferences text area, describe your environment — for example:

- Target OS (Ubuntu 22.04, Debian 12, etc.)
- Hostnames or inventory groups
- Any constraints (no sudo password, specific package versions, etc.)

### Generating the playbook

Click **Generate Playbook**. The app sends your selected categories and context to the Gemini AI
backend. Generation typically takes a few seconds. The resulting YAML is validated with `js-yaml`
before being displayed.

### Viewing the output

The generated playbook is displayed in an embedded `react-simple-code-editor` with `prismjs`
syntax highlighting. You can edit the YAML inline before downloading or committing it.

### Downloading the YAML

Click **Download YAML** to save the playbook as a `.yml` file to your local machine.

### Optional: Git commit to a repository

If you want to commit the generated playbook directly to a Git repository:

1. Enter the repository URL (HTTPS or SSH), target branch, and a commit message in the Git panel.
2. Click **Commit to Repo**.
3. The Express backend clones the repo into a temporary directory using `simple-git`, writes the
   playbook file(s), and pushes the commit to the specified branch.

> For SSH-based repos, ensure your SSH key is available in the environment where the server runs.
> For HTTPS, use a personal access token in the repo URL (`https://token@github.com/...`).

---

## Testing

The project does not currently include a test suite. To add one:

1. Install Vitest and its dependencies:

```bash
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

2. Add a `test` script to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

3. Create a `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

4. Write tests in a `tests/` directory mirroring the source structure. Good starting points:
   - Unit-test the YAML validation logic (parse with `js-yaml`, assert no exceptions on valid output).
   - Mock the Gemini API service and test category selection logic.
   - Smoke-test the Express `/api/git/commit` endpoint with supertest.

---

## Troubleshooting

### Generated YAML is invalid or won't parse

`js-yaml` will surface parse errors in the UI if the AI output is malformed. If this happens:

- Click **Regenerate** to retry with the same prompt. Gemini output can vary between runs.
- Simplify your category selection — fewer categories reduces prompt complexity.
- Add explicit constraints in the context box (e.g., "output only valid YAML, no prose").
- If the problem recurs consistently with a specific category combination, report it and include
  the exact category set and context you provided so it can be reproduced.

### Syntax highlighting does not render

- Confirm `prismjs` and `react-simple-code-editor` are installed (`npm install`).
- Check the browser console for JavaScript errors.
- If running in `preview` mode, ensure `npm run build` completed without errors first.

### YAML download produces an empty file

- Confirm the playbook was successfully generated (no error state in the UI).
- Check the browser's download settings — some browsers block automatic downloads.

### Git commit fails

- Verify the repository URL is correct and accessible from your network.
- For SSH repos, confirm your SSH key is loaded: `ssh -T git@github.com`.
- For HTTPS repos, ensure your token has `repo` write permissions.
- Check the server logs (terminal running `npm run dev`) for the full error from `simple-git`.
- Confirm the target branch name does not contain characters that are invalid in Git branch names.
- The backend writes to a temp directory and then pushes; ensure the temp partition has free space.
