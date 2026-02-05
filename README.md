  # Ansible Homelab Playbook Generator

  **Interactive, AI-assisted playbook design studio for homelab operators and infrastructure engineers.**

  Generate structured, role-oriented Ansible playbook output from guided selections across base hardening, services, app deployment, testing, and documentation.
</div>

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [What You Get](#what-you-get)
- [Feature Breakdown](#feature-breakdown)
- [Architecture Overview](#architecture-overview)
- [Prompt & Generation Flow](#prompt--generation-flow)
- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
- [Runtime Behavior](#runtime-behavior)
- [Playbook Option Categories](#playbook-option-categories)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)
- [Security & Operational Notes](#security--operational-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why This Exists

Building reliable homelab automation often starts with a blank file and a long checklist:

- Base OS hardening
- User and SSH management
- Service deployment (reverse proxies, containers, observability)
- App rollout and lifecycle management
- Validation, linting, and dry-run safety
- Documentation for repeatable operation

This project provides a **guided UI workflow** that turns those decisions into an opinionated prompt, then asks Gemini to produce coherent, modular Ansible output with practical best-practice constraints (idempotency, variables, handlers, check-mode awareness, etc.).

---

## What You Get

| Capability | Outcome |
|------------|---------|
| Guided selection UI | Choose only the automation building blocks you want |
| Structured prompt generation | Selection state is converted into categorized requirements |
| AI-generated output | Consolidated text containing `site.yml`, role files, and optional docs |
| Copy-friendly presentation | Output is normalized to remove markdown code fences |
| UX quality-of-life | Theme persistence, loading/error states, success toast |

---

## Feature Breakdown

### 1) Guided Playbook Composition
The sidebar renders all option groups from a centralized constant (`PLAYBOOK_OPTIONS`) and tracks your selected capabilities with strong typing (`Selections`).

### 2) Prompt Engineering in Code
A deterministic `buildPrompt()` routine embeds non-negotiable requirements into every generation request, including:

- Valid YAML output
- Role-based project structure
- Idempotent implementation patterns
- Handler usage and check mode support
- Variable-driven configuration
- Vault placeholder conventions
- Optional documentation expansion when requested

### 3) Model Invocation & Response Cleanup
The Gemini service calls `ai.models.generateContent()` and then strips markdown fences from the response so users can immediately paste output into project files.

### 4) Dark/Light Theme Persistence
The UI remembers user theme preference in `localStorage` and applies it at root element level for consistent visual behavior.

---

## Architecture Overview

```text
┌────────────────────────────────────────────────────────────────┐
│                         React Frontend                         │
│                                                                │
│   ┌─────────────────────┐         ┌─────────────────────────┐  │
│   │ Sidebar             │         │ CodeDisplay             │  │
│   │ - category options  │         │ - generated text        │  │
│   │ - selection state   │         │ - loading/error states  │  │
│   └─────────┬───────────┘         └─────────────┬───────────┘  │
│             │                                     ▲             │
│             ▼                                     │             │
│   ┌─────────────────────┐         ┌─────────────────────────┐  │
│   │ App                 │         │ Header                  │  │
│   │ - orchestration     │         │ - title + theme toggle  │  │
│   │ - notification flow │         └─────────────────────────┘  │
│   └─────────┬───────────┘                                       │
│             │ calls                                               │
│             ▼                                                     │
│   ┌─────────────────────────────────────────────────────────────┐ │
│   │ services/geminiService.ts                                  │ │
│   │ - buildPrompt(selections)                                  │ │
│   │ - generateContent(model: gemini-3-flash-preview)          │ │
│   │ - sanitize response text                                   │ │
│   └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Prompt & Generation Flow

```text
User selects options
      ↓
Sidebar submits typed selection map
      ↓
App.handleGenerate(selections)
      ↓
generatePlaybook(selections)
      ↓
buildPrompt() merges global requirements + selected items
      ↓
Gemini API request
      ↓
Response normalization (strip code fences)
      ↓
CodeDisplay renders result
```

### Prompt Inputs
Selections are grouped by category:
- Base configuration
- Service playbooks
- App deployments
- Automation features
- Testing
- Documentation
- Advanced configuration

Only selected options are injected into the final prompt payload.

---

## System Requirements

| Requirement | Minimum | Notes |
|------------|---------|-------|
| Node.js | 18+ | Recommended current LTS |
| npm | 9+ | Included with Node.js |
| Browser | Modern Chromium/Firefox/Safari | Required for local UI access |
| Gemini API Key | Active key | Required for generation requests |

---

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create a `.env.local` file in repository root:

```env
GEMINI_API_KEY=your_real_key_here
```

### 3) Start local development server

```bash
npm run dev
```

Default dev host/port is configured in `vite.config.ts` as `0.0.0.0:3000`.

### 4) Use the app

1. Open `http://localhost:3000`
2. Select desired playbook components
3. Click **Generate Playbook**
4. Copy generated output into your Ansible project structure

### 5) Build for production

```bash
npm run build
npm run preview
```

---

## Configuration Reference

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes | API key loaded by Vite and mapped to runtime env values |

### Vite Runtime Defines
`vite.config.ts` maps the loaded key to:
- `process.env.API_KEY`
- `process.env.GEMINI_API_KEY`

The Gemini service checks `process.env.API_KEY` and throws early if missing.

### Model Selection
The current model identifier in `services/geminiService.ts` is:

```ts
model: 'gemini-1.5-flash-latest'
```

If you change this, ensure your API key and account have access to the new model.

---

## Runtime Behavior

### Loading & Error Handling
- Generation disables repeated submission while in progress
- API failures are surfaced in UI with human-readable error text
- Unknown failures fall back to a generic error message

### Success Feedback
After successful generation, the app displays a temporary success toast (`Playbook generated successfully!`) for a few seconds.

### Theme Behavior
- Startup checks persisted theme in `localStorage`
- Falls back to `prefers-color-scheme` if no saved preference exists
- Applies `light`/`dark` class at document root

---

## Playbook Option Categories

The options catalog lives in `constants.ts` and includes rich tooltip guidance for each item.

| Category | Purpose |
|----------|---------|
| Base Configuration | OS baseline hardening, package/user/SSH/firewall fundamentals |
| Service Playbooks | Infrastructure services (containers, reverse proxies, DNS, storage, etc.) |
| App Deployments | Application deployment blocks and operational concerns |
| Automation Features | Reusability and operational enhancements |
| Testing | Validation, linting, and preflight confidence checks |
| Documentation | Generated reference and usage docs |
| Advanced Configuration | Optional `vars_files` customization path |

---

## Project Structure

```text
.
├── App.tsx                       # Application shell and orchestration
├── index.tsx                     # React entry point
├── index.html                    # HTML shell + Tailwind CDN + import map
├── constants.ts                  # Option catalog (labels + tooltips)
├── types.ts                      # Shared TypeScript interfaces
├── vite.config.ts                # Vite server + env definition wiring
├── package.json                  # Scripts and dependencies
├── metadata.json                 # Project metadata description
├── components/
│   ├── Header.tsx                # Header + theme toggle
│   ├── Sidebar.tsx               # Option sections + form submit
│   └── CodeDisplay.tsx           # Output, loading, and error rendering
└── services/
    └── geminiService.ts          # Prompt construction + model call
```

---

## Technology Stack

| Technology | Version (declared) | Role |
|-----------|---------------------|------|
| React | 19.2.x | UI rendering |
| TypeScript | 5.8.x | Type safety and developer ergonomics |
| Vite | 6.x | Dev server and production bundling |
| @vitejs/plugin-react | 5.x | React integration for Vite |
| @google/genai | 1.34.x | Gemini SDK client |
| Tailwind CSS (CDN) | Latest CDN runtime | Utility classes in browser |

---

## Troubleshooting

### Common Issues

| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| `API_KEY environment variable not set` | Missing `.env.local` or wrong var name | Add `GEMINI_API_KEY` and restart dev server |
| Generate button disabled | No options selected | Select at least one option in any category |
| Empty response from API | Model returned no text | Retry; verify key permissions and request quota |
| Network/API failures | Invalid key or transient service issue | Check browser network tab and SDK error output |
| App unavailable on `localhost:3000` | Port conflict / server not running | Stop conflicting process or restart `npm run dev` |

### Debug Tips

1. Start with minimal option selections and validate output shape.
2. Check browser devtools console for thrown errors.
3. Verify env injection by restarting Vite after changing `.env.local`.
4. Confirm `npm run build` succeeds before sharing/deploying changes.

---

## Security & Operational Notes

- This project currently runs a client-side application that invokes Gemini through configured API credentials.
- Do **not** commit `.env.local` or keys into source control.
- The development server is exposed on `0.0.0.0` by current config, which may be convenient for LAN testing but broader than localhost-only binding.
- Tailwind is loaded from CDN in `index.html`; environments requiring fully offline operation should migrate to local Tailwind/PostCSS bundling.

---

## Roadmap

- Add export-to-files/zip capability for generated playbook bundles
- Add copy-by-section UX (site.yml / roles / docs)
- Add prompt profile presets (k3s, docker-only, monitoring-first, etc.)
- Add test coverage around prompt assembly and UI selection behavior
- Add local-first/offline styling pipeline (remove CDN dependency)
- Add model/provider abstraction for easier AI backend switching

---

## Contributing

1. Fork and create a feature branch.
2. Keep changes scoped and small where possible.
3. Validate with at least `npm run build` before opening a PR.
4. Update README/docs whenever behavior, configuration, or architecture changes.

---

## License

No `LICENSE` file is currently present in this repository. Add one to define redistribution and usage terms.

---

*Built for operators who want to move from manual setup to reproducible homelab automation, faster.*
