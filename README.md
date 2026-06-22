# Playbook Generator

An AI-powered Ansible homelab playbook generator with Git push integration. Select your services and configuration options, generate production-ready YAML playbooks with Google Gemini, lint them in-browser, and push directly to a GitHub/GitLab/Bitbucket repository.

## Features

- **AI Playbook Generation** — Generate full Ansible role structures from a point-and-click UI
- **In-Browser Linting** — AI-powered ansible-lint simulation before you commit
- **Documentation Generation** — Auto-generate README, role docs, and variable references
- **Git Push Integration** — Commit and push generated playbooks directly to your repo
- **Ansible Vault support** — Generates vault-ready placeholders for secrets
- **Custom Variables** — YAML variable block merges into `group_vars/all/custom.yml`

## Architecture

```
Frontend (React + Vite)  ↔  Express server (port 3000)
                                    │
                          ├─ /api/git/commit  ← Git push via simple-git
                          └─ Vite dev middleware (serves frontend)
```

In development, the Express server proxies the Vite dev server. In production, Express serves the built `dist/` folder.

## Prerequisites

- **Node.js 20+** and npm 10+
- **Git** installed and configured (for the Git push feature)
- A **Google Gemini API key** — [get one at Google AI Studio](https://aistudio.google.com/app/apikey)
- For the Git push feature: a GitHub/GitLab/Bitbucket repo the user has write access to (authenticated via HTTPS credentials or SSH agent)

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/samueljackson-collab/playbook-generator.git
cd playbook-generator

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

Edit `.env`:

```env
API_KEY=your_gemini_api_key_here
```

```bash
# 4. Start the server (serves both API and frontend)
npm run dev
```

Open **http://localhost:3000** in your browser.

> The single `npm run dev` command starts the Express server which includes Vite middleware — you do **not** need to run a separate Vite process.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `API_KEY` | Yes | Google Gemini API key |
| `NODE_ENV` | No | Set to `production` to serve the built `dist/` folder |

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Express + Vite dev server on port 3000 |
| `npm run build` | Build frontend to `dist/` |
| `npm start` | Start in production mode (requires `npm run build` first) |

## Usage

### Generate a Playbook

1. Select your **base configuration** (OS, Ansible version, etc.)
2. Check the **service playbooks** you want (Docker, Nginx, PostgreSQL, etc.)
3. Choose **documentation** options (README, role docs, variable reference)
4. Choose **testing** options (ansible-lint, yamllint, pre-commit)
5. Add any **custom variables** in the YAML input
6. Click **Generate Playbook** — Gemini generates the full file structure
7. Review the output in the editor
8. Optionally click **Lint Playbook** to check for issues

### Git Push

1. Click the **Git** tab
2. Enter your repository URL (must be `https://github.com/...`, `https://gitlab.com/...`, or `https://bitbucket.org/...`)
3. Enter the branch name and commit message
4. Click **Commit & Push**

> The server clones your repo to a temp directory, writes the playbook files, commits, and pushes. The temp directory is always cleaned up after the operation.

**Rate limit:** 5 Git operations per minute per IP to prevent abuse.

## Security Notes

- The Git endpoint only accepts `https://` URLs from `github.com`, `gitlab.com`, and `bitbucket.org`
- Branch names and commit messages are sanitized (shell metacharacters stripped)
- Path traversal in generated filenames is blocked
- Raw error stack traces are never returned to the client
- For Git authentication, configure credentials via `~/.gitconfig` or an SSH agent; the server uses the system Git config

## Known Limitations

- The Git push uses the system-level Git credential store. In personal use this means you need `git credential store` or a personal access token configured globally.
- The linting feature simulates `ansible-lint` via AI — it is not a true static analysis tool.
- Very large playbook generations (many services + full docs) may approach Gemini context limits.

## Deployment

For personal use, run behind nginx or a reverse proxy with HTTPS. Set `NODE_ENV=production` and run `npm run build && npm start`.
