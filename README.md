# Ansible Homelab Playbook Generator

Interactive, AI-assisted playbook design studio for homelab operators and infrastructure engineers.

This project helps you design Ansible automation faster by turning guided UI selections into a structured prompt and generating a role-oriented playbook output with Gemini.

---

## Table of Contents

- [Overview](#overview)
- [Why This Exists](#why-this-exists)
- [What You Get](#what-you-get)
- [Feature Breakdown](#feature-breakdown)
- [Architecture Overview](#architecture-overview)
- [Prompt & Generation Flow](#prompt--generation-flow)
- [Who This Is For](#who-this-is-for)
- [Core Capabilities](#core-capabilities)
- [How It Works](#how-it-works)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Detailed Usage Guide](#detailed-usage-guide)
  - [1) Select Components](#1-select-components)
  - [2) Generate Playbook Output](#2-generate-playbook-output)
  - [3) Review and Apply Safely](#3-review-and-apply-safely)
- [Prompt Construction & Generation Logic](#prompt-construction--generation-logic)
- [Playbook Option Categories](#playbook-option-categories)
  - [Base Configuration](#base-configuration)
  - [Service Playbooks](#service-playbooks)
  - [Application Deployments](#application-deployments)
  - [Automation Features](#automation-features)
  - [Testing](#testing)
  - [Documentation](#documentation)
  - [Advanced Configuration](#advanced-configuration)
- [Environment Variables & API Configuration](#environment-variables--api-configuration)
- [Configuration Reference](#configuration-reference)
- [Runtime Behavior](#runtime-behavior)
- [Available Scripts](#available-scripts)
- [Architecture & Data Flow](#architecture--data-flow)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Operational Notes and Security Guidance](#operational-notes-and-security-guidance)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Execution Cookbook](#execution-cookbook)
- [Recommended Validation Pipeline](#recommended-validation-pipeline)
- [Reference Deployment Profiles](#reference-deployment-profiles)
- [FAQ](#faq)
- [End-to-End Workflow States](#end-to-end-workflow-states)
- [Prompt Quality Control Checklist](#prompt-quality-control-checklist)
- [Operational Runbooks](#operational-runbooks)
- [Known Limitations](#known-limitations)
- [Roadmap Ideas](#roadmap-ideas)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Ansible Homelab Playbook Generator is a React + TypeScript web app that helps you assemble production-minded Ansible boilerplate for homelab environments.

Instead of starting from a blank editor, you choose what your automation should include (hardening, infrastructure services, app deployments, testing, docs, and more). The app composes a deterministic prompt and requests generated output from Gemini. The response is then cleaned for direct copy/paste into your repository.

The generated output is intended to accelerate scaffolding and planning, not replace review. You should always validate and adapt generated playbooks to your environment before applying changes.

---

## Why This Exists

Homelab automation typically starts with a blank `site.yml` and an expanding checklist: baseline hardening, service orchestration, app deployment, validation, and documentation. This project exists to reduce that startup cost while preserving operational discipline.

It combines guided selection UX with a deterministic prompt strategy so generated output is aligned with practical Ansible standards (idempotency, handlers, variable-driven configuration, check-mode awareness, and vault placeholders).

---

## What You Get

| Capability | Outcome |
|---|---|
| Guided selection UI | Choose specific automation building blocks by category |
| Prompt assembly from selections | Convert choice state into explicit requirements |
| AI-generated blueprint output | Produce role-oriented playbook draft content |
| Fence-free display normalization | Copy output directly into repository files faster |
| Operator-friendly UX states | Loading, errors, and success notifications with theme persistence |

---

## Feature Breakdown

### 1) Guided Playbook Composition

The sidebar is generated from a centralized option catalog and maintains a strict typed selection model. This keeps category expansion maintainable and avoids hardcoded UI drift.

### 2) Prompt Engineering in Code

Prompt construction is deterministic and includes mandatory implementation quality constraints for every request. User-selected items are appended as explicit requirement lines so output reflects selected scope.

### 3) Model Invocation + Output Cleanup

Generation uses the Google GenAI SDK and normalizes response text by removing markdown code fences for easier file splitting.

### 4) UX Reliability Patterns

The app prevents duplicate in-flight submits, surfaces user-facing errors clearly, and confirms success with a transient toast. Theme preferences persist across sessions.

---

## Architecture Overview

```text
┌────────────────────────────────────────────────────────────────┐
│                        React Frontend                         │
│                                                                │
│  ┌────────────────────┐          ┌──────────────────────────┐  │
│  │ Sidebar            │          │ CodeDisplay              │  │
│  │ - category options │  ----->  │ - generated output text  │  │
│  │ - checkbox state   │          │ - loading/error states   │  │
│  └─────────┬──────────┘          └────────────┬─────────────┘  │
│            │                                   ▲                │
│            ▼                                   │                │
│  ┌────────────────────┐          ┌──────────────────────────┐  │
│  │ App                │          │ Header                   │  │
│  │ - orchestration    │          │ - title + theme toggle   │  │
│  │ - notifications    │          └──────────────────────────┘  │
│  └─────────┬──────────┘                                         │
│            │ invokes                                             │
│            ▼                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ services/geminiService.ts                                 │  │
│  │ - buildPrompt(selections)                                 │  │
│  │ - generateContent(model='gemini-3-flash-preview')         │  │
│  │ - sanitize response text                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Prompt & Generation Flow

```text
User picks options
    ↓
Sidebar updates Selections object
    ↓
App.handleGenerate(selections)
    ↓
generatePlaybook(selections)
    ↓
buildPrompt() merges mandatory rules + selected options
    ↓
Gemini generateContent() call
    ↓
Sanitize response (strip markdown fences)
    ↓
Render output in CodeDisplay
```

### Prompt rule highlights

- Valid YAML requirement
- Role-based project structure guidance
- Idempotency and handler behavior expectations
- Variable and vault-placeholder usage
- Optional expanded documentation instructions when selected

---

## Who This Is For

This project is useful for:

- Homelab operators automating repeatable server provisioning.
- Infrastructure engineers building role-based Ansible structures quickly.
- Teams that want a fast “starter kit” for consistent playbook patterns.
- Learners who want to compare selected requirements to generated YAML structure.

---

## Core Capabilities

- **Guided UI for option selection**
  - Categories are rendered from a centralized options catalog.
  - Tooltips provide practical context for each capability.

- **Structured prompt generation**
  - Selected options are transformed into an explicit requirement set.
  - Non-negotiable constraints (idempotency, handler use, variable-driven config, etc.) are always included.

- **Gemini-powered playbook generation**
  - Uses the Google GenAI SDK to request generated output.
  - Model is currently configured as `gemini-3-flash-preview`.

- **Output cleanup for practical use**
  - Markdown code fences are stripped so generated text is easier to copy into project files.

- **Usability enhancements**
  - Light/dark theme toggle with localStorage persistence.
  - Loading state, error state, and success notification for generation flow.

---

## How It Works

At a high level:

1. You select one or more options in the sidebar.
2. The app builds a prompt that includes strict Ansible implementation rules plus your selected categories.
3. The Gemini service is called with your configured API key.
4. The model response is sanitized and displayed in the output panel.
5. You copy the output and split it into actual files (e.g., `site.yml`, role task files, docs) in your Ansible repo.

---

## System Requirements

- **Node.js**: 18.x or newer (20.x recommended)
- **npm**: 9.x or newer
- **Browser**: Latest Chrome, Firefox, Edge, or Safari
- **Gemini API Key**: Required for generation

---

## Installation

1. **Clone the repository**

```bash
git clone <your-fork-or-repo-url> playbook-generator
cd playbook-generator
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

4. **Start development server**

```bash
npm run dev
```

5. **Open the app**

Visit the displayed local URL (default: `http://localhost:3000`).

### Production Build

```bash
npm run build
npm run preview
```

---

## Getting Started

Quick workflow:

1. Launch the app.
2. Choose at least one option from any category.
3. Click **Generate Playbook**.
4. Wait for output to appear in the main panel.
5. Copy output into files in your Ansible project.
6. Run `ansible-lint`, syntax checks, and dry-runs before using in production.

---

## Detailed Usage Guide

### 1) Select Components

The sidebar exposes categories such as Base Configuration, Service Playbooks, and Testing. Each option is a boolean toggle, allowing you to define scope precisely.

Tips:

- Start with foundational selections (users, SSH, firewall, package baseline).
- Add only the services/apps you actively plan to deploy.
- Include testing and documentation options when sharing with others.

### 2) Generate Playbook Output

After selecting options:

- The Generate button becomes enabled.
- Clicking it triggers a single async request.
- During generation, button state is disabled and a loading spinner appears.
- On success, a toast confirms output generation.

### 3) Review and Apply Safely

Treat generated YAML as a draft:

- Verify inventory assumptions.
- Confirm package/module names for your target OS.
- Replace placeholders for secrets using Ansible Vault.
- Run dry-run and lint checks before any real apply.

---

## Prompt Construction & Generation Logic

Prompt generation is deterministic and intentionally opinionated.

### Always-enforced requirements include:

- Valid YAML output
- Role-based structure for modularity
- Idempotent task design
- Handler usage where service restarts are needed
- Variable-driven configuration
- Vault placeholders for secrets
- Optional richer documentation when docs options are selected

### Category-aware augmentation

For each selected item, the prompt includes explicit instructions (from the options catalog), ensuring the generated playbook reflects your exact checklist rather than a generic template.

### Response normalization

After generation, the app removes markdown fence wrappers (` ```yaml ` / ` ``` `) so the output can be copied directly into files with less cleanup.

---

## Playbook Option Categories

Below is a practical interpretation of each category and how it shapes output.

### Base Configuration

Use this for foundational host hardening and readiness:

- Package updates and baseline package install
- User provisioning and SSH key setup
- SSH hardening and firewall defaults
- Timezone/locale settings
- UFW policy management

**When to include**: almost always; this creates a stable baseline for all higher-level services.

### Service Playbooks

Adds infrastructure services often needed in homelabs:

- Docker + Compose runtime
- Kubernetes distribution bootstrap (e.g., k3s)
- Reverse proxy and certificate management
- NFS/Samba file sharing
- DNS management patterns

**When to include**: when you are building shared platform services used by multiple apps.

### Application Deployments

Application-oriented deployment blocks:

- Media servers (Plex/Jellyfin)
- Home Assistant
- Immich
- Vaultwarden
- Gitea

**When to include**: when you want generated role stubs and tasks for specific apps rather than infrastructure only.

### Automation Features

Cross-cutting operational patterns:

- Dynamic inventory modes (Proxmox/script/cloud)
- Vault integration
- Tags and partial execution
- Check mode compatibility
- Idempotency emphasis
- GitOps-oriented structure hints

**When to include**: when maintainability and repeatability are as important as initial deployment.

### Testing

Validation-focused options:

- Molecule scaffolding hints
- ansible-lint support
- YAML syntax checks
- Reproducible local test environment concepts
- Pre-commit hook guidance

**When to include**: in any workflow where changes are shared, reviewed, or reused.

### Documentation

Documentation generation guidance:

- Root README playbook reference
- Role-specific docs
- Variable references
- Usage examples
- Best-practices documentation patterns

**When to include**: always beneficial for long-term maintainability and onboarding.

### Advanced Configuration

Currently includes:

- Custom variables file support (`vars_files`-style workflow guidance)

**When to include**: when externalized environment-specific values are required.

---

## Environment Variables & API Configuration

### Required variable

```bash
GEMINI_API_KEY=your_api_key_here
```

### How the app uses it

- Vite loads environment variables via `loadEnv`.
- `GEMINI_API_KEY` is mapped into `process.env.API_KEY` and `process.env.GEMINI_API_KEY` at build/runtime define stage.
- Gemini client initialization requires `process.env.API_KEY`; the app throws early if missing.

If generation fails immediately with an API key error, verify the `.env.local` file path and restart the dev server.

---

## Configuration Reference

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Loaded by Vite and mapped for runtime Gemini client usage |

### Vite runtime defines

The Vite config maps `GEMINI_API_KEY` to both:

- `process.env.API_KEY`
- `process.env.GEMINI_API_KEY`

The Gemini service reads `process.env.API_KEY` and throws early when missing.

### Model selection

Current configured model identifier:

```ts
model: 'gemini-3-flash-preview'
```

---

## Runtime Behavior

### Loading and error handling

- Generation requests show loading UI and prevent duplicate submissions.
- API and runtime errors are surfaced in the UI with readable messaging.
- Unexpected failures fall back to a generic error text for resilience.

### Success feedback

On successful generation, the app shows a temporary success toast to confirm completion.

### Theme behavior

- Reads persisted preference from `localStorage`.
- Falls back to `prefers-color-scheme` when no stored preference exists.
- Applies `light`/`dark` class at root element.

---

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — generate production build artifacts
- `npm run preview` — preview production build locally

---

## Architecture & Data Flow

```text
User Selections (Sidebar)
      │
      ▼
State in App (Selections object)
      │
      ▼
generatePlaybook(selections)
      │
      ▼
buildPrompt(selections) in geminiService
      │
      ▼
GoogleGenAI.generateContent(model='gemini-3-flash-preview')
      │
      ▼
Response text cleanup (remove markdown fences)
      │
      ▼
CodeDisplay renders output / error / loading state
```

### UI components

- `Header`: app title and theme toggle
- `Sidebar`: option groups and generation trigger
- `CodeDisplay`: generated output + state rendering
- `App`: orchestration, notifications, and theme persistence

---

## Project Structure

```text
.
├── App.tsx                       # Main orchestration and generation flow
├── index.tsx                     # React entry point
├── index.html                    # HTML shell and styles bootstrap
├── constants.ts                  # Option catalog with labels/tooltips
├── types.ts                      # Shared TypeScript types
├── vite.config.ts                # Vite server and env variable mapping
├── package.json                  # Scripts and dependency declarations
├── metadata.json                 # Project metadata
├── components/
│   ├── Header.tsx                # Header + dark/light toggle
│   ├── Sidebar.tsx               # Category sections + checkboxes + submit
│   └── CodeDisplay.tsx           # Render generated text/errors/loading
└── services/
    └── geminiService.ts          # Prompt construction + Gemini invocation
```

---

## Technology Stack

| Technology | Version (declared) | Purpose |
|---|---|---|
| React | 19.x | UI rendering |
| TypeScript | 5.8.x | Type safety |
| Vite | 6.x | Dev/build tooling |
| @vitejs/plugin-react | 5.x | React + Vite integration |
| @google/genai | 1.34.x | Gemini API client |

---

## Operational Notes and Security Guidance

- Keep `.env.local` out of source control.
- Do not hardcode API keys in frontend code.
- Validate generated tasks against your actual host inventory and OS family.
- Run with least-privilege principles where possible (limit blanket `become: true` usage unless required).
- Because dev server binds to `0.0.0.0`, be aware of local network visibility during development.

---

## Troubleshooting

### 1) `API_KEY environment variable not set`

**Cause:** `GEMINI_API_KEY` missing or dev server not restarted.

**Fix:**

```bash
# verify file exists and variable is present
cat .env.local

# restart dev server
npm run dev
```

### 2) Generate button stays disabled

**Cause:** no options are selected.

**Fix:** select at least one checkbox in any category.

### 3) Empty or weak output

**Cause:** model variability or narrow selection set.

**Fix:**

- Retry generation.
- Add more explicit selections (testing/docs/handlers/check mode).
- Manually refine generated structure after first pass.

### 4) API request failures

**Cause:** invalid key, quota issues, transient network error.

**Fix:**

- Validate key and provider access.
- Check browser devtools network/console logs.
- Retry after waiting if rate-limited.

### 5) Production build issues

**Fix:**

```bash
npm install
npm run build
```

If build still fails, inspect TypeScript and dependency errors in terminal output.

---

## Best Practices

- Start with baseline hardening + a small set of services.
- Keep generated output under version control and review via PR.
- Split generated monolithic output into role-based files immediately.
- Add linting and syntax checks to CI before applying infrastructure changes.
- Use dry-run (`--check`) and limited host targeting before full rollout.

---


## Execution Cookbook

This section provides concrete command patterns for moving from generated output to safe execution.

### A) First-time bootstrap (single host)

```bash
# 1) validate inventory formatting
ansible-inventory -i inventory/hosts.yml --list

# 2) syntax-check playbook
ansible-playbook -i inventory/hosts.yml site.yml --syntax-check

# 3) dry-run (check mode)
ansible-playbook -i inventory/hosts.yml site.yml --check --diff

# 4) apply with explicit limit
ansible-playbook -i inventory/hosts.yml site.yml --limit homelab-core
```

### B) Role-only iterative development

```bash
# run only selected tags while developing
ansible-playbook -i inventory/hosts.yml site.yml --tags docker,reverse_proxy --check --diff

# then apply for real
ansible-playbook -i inventory/hosts.yml site.yml --tags docker,reverse_proxy
```

### C) Safer rollout strategy for multiple nodes

1. Target one canary node with `--limit`.
2. Run in `--check --diff` first.
3. Apply only after reviewing changed tasks.
4. Expand to a host group.
5. Run final full-group apply.

### D) Vault usage pattern

```bash
# create encrypted vars file
ansible-vault create group_vars/all/vault.yml

# edit encrypted vars file later
ansible-vault edit group_vars/all/vault.yml

# execute with vault prompt
ansible-playbook -i inventory/hosts.yml site.yml --ask-vault-pass
```

---

## Recommended Validation Pipeline

To keep generated playbooks production-safe, use a layered validation approach.

| Stage | Goal | Example Command | Expected Outcome |
|---|---|---|---|
| YAML validity | Catch formatting problems early | `yamllint .` | No syntax/style errors |
| Ansible linting | Enforce best practices | `ansible-lint` | No critical rule violations |
| Syntax check | Validate parseability | `ansible-playbook -i inventory/hosts.yml site.yml --syntax-check` | Valid playbook parse |
| Dry-run | Preview changes | `ansible-playbook -i inventory/hosts.yml site.yml --check --diff` | Controlled, reviewable diff |
| Scoped apply | Reduce blast radius | `ansible-playbook -i inventory/hosts.yml site.yml --limit <canary>` | Safe incremental rollout |
| Full apply | Final convergence | `ansible-playbook -i inventory/hosts.yml site.yml` | All targeted hosts converge |

### Optional CI Gate Example

```bash
#!/usr/bin/env bash
set -euo pipefail

yamllint .
ansible-lint
ansible-playbook -i inventory/hosts.yml site.yml --syntax-check
ansible-playbook -i inventory/hosts.yml site.yml --check --diff --limit ci-test-host
```

---

## Reference Deployment Profiles

Use these profiles as starting points when selecting options in the UI.

### 1) Minimal Secure Baseline

**Recommended selections:**

- Base Configuration: package updates, users/SSH keys, SSH hardening, firewall
- Automation Features: idempotent operations, handlers, check mode support
- Testing: YAML syntax validation, ansible-lint
- Documentation: playbook reference

**Best for:** first homelab server, jump host, or controlled migration away from manual provisioning.

### 2) Container Platform Foundation

**Recommended selections:**

- Base Configuration (full baseline)
- Service Playbooks: Docker/Compose, reverse proxy, certificate management
- Automation Features: tag-based execution, vault integration
- Testing + Documentation selections

**Best for:** hosting multiple self-hosted apps with centralized ingress and SSL automation.

### 3) K3s + GitOps-Oriented Profile

**Recommended selections:**

- Base Configuration (full baseline)
- Service Playbooks: Kubernetes (k3s), DNS, certificate management
- Automation Features: dynamic inventory, GitOps integration, check mode
- Testing: Molecule + lint + syntax checks

**Best for:** users preparing cluster-first homelab workflows and repeatable Git-driven changes.

### 4) Media + Storage Stack

**Recommended selections:**

- Service Playbooks: NFS/Samba + reverse proxy + certificates
- App Deployments: Plex/Jellyfin + Immich
- Automation Features: handlers, vault placeholders, tag-based execution
- Documentation: variable reference + usage examples

**Best for:** household media pipelines with shared storage and external access via TLS.

---

## FAQ

### Is this tool generating runnable production code automatically?

It generates structured starter output and implementation direction, but you are responsible for environment-specific validation, testing, and adaptation.

### Does this app execute Ansible against my servers?

No. The app is a frontend generator. Execution happens in your own Ansible environment after you copy/split the generated output into files.

### Why does generated output sometimes differ between runs?

LLM outputs can vary across requests. If consistency is important, keep a baseline generated version in source control and evolve it through reviews.

### What should I do if a generated task is not idempotent?

Refactor the task to use an idempotent module/pattern, add guards (`creates`, `when`, `changed_when` as appropriate), and verify with repeated `--check` runs.

### How should secrets be handled?

Store secrets in vault-encrypted files and reference them as variables (for example, `vault_*` values), never as plaintext in committed files.

---


## End-to-End Workflow States

This state view supplements the existing architecture and usage sections with a lifecycle perspective.

```text
[Idle]
  │ user selects options
  ▼
[Selection Ready]
  │ submit clicked
  ▼
[Generating]
  │ success                         │ failure
  ├──────────────────────────────►  [Error Shown]
  ▼                                  │ user retries
[Output Rendered]                    └──────────────┐
  │ copy/split into repo                            │
  ▼                                                 │
[Validation Phase: lint/check/diff] ◄──────────────┘
  │
  ▼
[Scoped Apply] -> [Full Apply] -> [Steady State]
```

### Practical interpretation

- **Idle / Selection Ready**: define scope early and avoid “select everything” unless required.
- **Generating**: treat result as a draft contract, not final deployment authority.
- **Output Rendered**: split generated content into explicit file paths (`site.yml`, role tasks, vars, handlers, docs).
- **Validation Phase**: run quality gates before any write-changing execution.
- **Scoped Apply**: limit to one host or a canary group first, then widen rollout.

---

## Prompt Quality Control Checklist

Use this checklist when reviewing generated output quality before execution.

| Check | Why it matters | What to verify quickly |
|---|---|---|
| Idempotency | Repeatable outcomes | Re-running does not report unnecessary changes |
| Variableization | Portability | Hardcoded IPs/paths moved to vars/defaults |
| Handler correctness | Controlled restarts | Service restarts happen only on config change |
| Secret hygiene | Security | No plaintext secrets in committed files |
| Role boundaries | Maintainability | Tasks grouped by role responsibility |
| Inventory assumptions | Correct targeting | Host groups and vars match your real environment |
| Port/firewall alignment | Availability | Exposed services map to expected firewall rules |
| Check-mode behavior | Safer previews | `--check --diff` surfaces meaningful proposed changes |

### Red flags to fix immediately

- Repeated shell tasks where first-party Ansible modules exist.
- Hardcoded credentials, tokens, or API keys.
- Service tasks with unconditional restart behavior.
- Missing `become` boundaries leading to privilege ambiguity.

---

## Operational Runbooks

These runbooks complement troubleshooting by providing repeatable operator play sequences.

### Runbook 1: New host onboarding

1. Add host to inventory and define minimal host/group variables.
2. Run syntax + check mode against only the new host.
3. Apply with `--limit <new-host>`.
4. Validate service health and open ports.
5. Merge host into broader groups for future routine runs.

### Runbook 2: Safe service update window

1. Generate updated output for selected service options only.
2. Review diffs in version control.
3. Execute tag-limited dry run (`--tags <service> --check --diff`).
4. Apply tags to canary host/group.
5. Expand to full target group after validation.

### Runbook 3: Fast rollback strategy (Git-based)

1. Revert to last known-good commit in your automation repository.
2. Re-run playbook with target-limited apply.
3. Confirm service recovery and state convergence.
4. Open a follow-up fix branch rather than hot-editing production directly.

### Runbook 4: Secret rotation

1. Update vault-encrypted secret values.
2. Validate dependent templates/tasks in `--check --diff` mode.
3. Apply only affected tags/roles first.
4. Verify dependent services restart through handlers and recover cleanly.

---

## Known Limitations

- The app is frontend-only and does not execute Ansible itself.
- Output quality depends on model behavior and prompt interpretation.
- No built-in export-to-files mechanism yet (manual copy/split workflow).
- No built-in schema validation of generated YAML in the app UI.

---

## Roadmap Ideas

- Section-aware export (e.g., generate downloadable role tree)
- Template presets (Docker-first, k3s-first, observability-first)
- Prompt history and comparison
- Built-in YAML parse checks before display
- Unit tests for prompt builder logic

---

## Contributing

1. Fork and create a feature branch.
2. Keep changes focused and explain rationale in commit messages.
3. Run a production build before opening a PR.
4. Update documentation when behavior or architecture changes.

---

## License

No license file is currently present in this repository. Add a `LICENSE` file to define permitted use, distribution, and contribution terms.
