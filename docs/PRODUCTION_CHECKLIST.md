# Production Checklist — Ansible Homelab Playbook Generator

Work through every item before deploying or shipping a new version. Check each box only when the
criterion has been manually or automatically verified.

---

## Environment & Configuration

- [ ] `GEMINI_API_KEY` is set in the server environment and is a valid, non-expired key
- [ ] `.env` / `.env.local` is excluded from version control (confirm it is in `.gitignore`)
- [ ] `npm run build` completes with zero TypeScript errors (`tsc` passes)
- [ ] `npm run lint` (`tsc`) exits 0 with no type errors
- [ ] Production server is started with `npm run start` (not `npm run dev`)

---

## YAML Generation & Validation

- [ ] Generate a playbook covering at least three different categories; confirm the output renders
      in the editor without a parse error banner
- [ ] Verify that `js-yaml.load()` / `js-yaml.parse()` succeeds on the generated output — no
      `YAMLException` thrown
- [ ] Generate a multi-file playbook (two or more `--- # filename.yml` sections) and confirm each
      section is correctly split and written by the backend
- [ ] Attempt generation with an intentionally minimal context string; confirm the app handles a
      low-quality AI response gracefully (error state, not a crash)

---

## Syntax Highlighting

- [ ] Generated playbook renders with colour-coded syntax (keywords, strings, punctuation) in the
      embedded editor
- [ ] Inline edits to the YAML in the editor do not break or reset the highlight state
- [ ] Syntax highlighting works in both Chromium-based browsers and Firefox

---

## YAML Download

- [ ] Click **Download YAML** on a freshly generated playbook; confirm the browser downloads a
      file with a `.yml` extension
- [ ] Open the downloaded file in a text editor and confirm it is valid YAML (no encoding
      artefacts, BOM characters, or truncation)
- [ ] Download works for a large playbook (e.g. 500+ lines) without truncation

---

## Git Commit Flow

- [ ] Set up a test Git repository (can be a private GitHub repo with a test branch)
- [ ] Enter the repo URL, a test branch name, and a commit message; click **Commit to Repo**
- [ ] Confirm the commit appears in the remote repository with the correct file(s) and message
- [ ] Test with an SSH URL and confirm the push succeeds when the correct SSH key is loaded
- [ ] Test with an HTTPS URL using a personal access token
- [ ] Confirm the temp directory is cleaned up after a successful or failed commit (no leftover
      directories accumulating in `/tmp`)
- [ ] Submit a commit with an invalid repo URL; confirm the UI displays the error from the backend
      rather than crashing

---

## Security

- [ ] `GEMINI_API_KEY` is never logged or returned in any API response body
- [ ] The `/api/git/commit` endpoint validates that all required fields are present before
      attempting any filesystem or git operations
- [ ] CORS is configured to restrict allowed origins for the production domain (not wildcard `*`)
- [ ] Playbook content size is validated server-side (Express JSON limit is currently `50mb`;
      review and tighten if appropriate for your deployment)

---

## Build & Performance

- [ ] `npm run build` output in `dist/` is under a reasonable size budget (check with
      `du -sh dist/`)
- [ ] The Vite bundle does not include any dev-only or source-map files in production
- [ ] App loads in under 3 seconds on a standard broadband connection (check with browser DevTools
      Network tab)
- [ ] No console errors appear in the browser on a fresh page load

---

## Rollback Plan

- [ ] Previous working build artifact is retained before deploying
- [ ] Server restart procedure is documented and tested
- [ ] A rollback to the previous version can be completed in under 5 minutes
