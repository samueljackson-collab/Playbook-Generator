# Playbook Generator

AI-assisted web app that helps you design homelab-focused Ansible automation by selecting infrastructure capabilities, then generating structured playbook output with Gemini.

## Features

- Guided selection UI for base configuration, services, apps, testing, docs, and advanced options.
- Prompt builder that enforces Ansible best practices (idempotency, handlers, variables, check-mode support).
- AI-generated output designed to include `site.yml` and role-oriented structure.
- Built-in output sanitization to remove markdown code fences for quick copy/paste.
- Light/dark theme toggle with persisted preference.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- `@google/genai` SDK
- Tailwind utility classes via CDN in `index.html`

## Project Structure

```text
.
├── App.tsx
├── components/
│   ├── CodeDisplay.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── constants.ts
├── services/
│   └── geminiService.ts
├── types.ts
├── vite.config.ts
└── index.tsx
```

## Prerequisites

- Node.js 18+
- npm 9+
- Gemini API key

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the repo root:

   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Gemini API key consumed by Vite and exposed as `process.env.API_KEY` at build/runtime. |

## Available Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – create production build
- `npm run preview` – preview production build locally

## Usage

1. Select one or more capabilities in the sidebar.
2. Click **Generate Playbook**.
3. Review generated output in the main panel.
4. Copy content into your Ansible repository and adapt variables/inventory.

## Notes

- The app throws early if no API key is present.
- Generated content is AI output and should be reviewed before production use.
- The Vite dev server is configured to bind to `0.0.0.0` for LAN accessibility.

## Troubleshooting

- **`API_KEY environment variable not set`**  
  Ensure `.env.local` exists with `GEMINI_API_KEY=...`, then restart the dev server.

- **No generation response / API error**  
  Verify key validity, model access, and network connectivity.

- **`localhost:3000` unavailable**  
  Check for port conflicts and restart `npm run dev`.

## License

No license file is currently included. Add a `LICENSE` file if you plan to distribute this project.
