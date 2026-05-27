# Playbook Generator — Production Launch Checklist

## 1. Setup Verification

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 1 | Server starts | `npm run dev`, open http://localhost:3000 | App loads, no console errors | |
| 2 | API key set | Check `.env` has `API_KEY=...` | Key present | |
| 3 | No TypeScript errors | `npm run build` | Exits 0, `dist/` created | |

## 2. Core Feature Flows

| # | Feature | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 4 | Service selection | Check Docker, Nginx, and one DB service | Checkboxes select and persist | |
| 5 | Ansible version select | Change Ansible target version | Dropdown updates prompt context | |
| 6 | Generate playbook | Click "Generate Playbook" | YAML playbook appears in editor | |
| 7 | Playbook structure | Inspect generated output | Contains `site.yml` and role files separated by `--- # filename.yml` | |
| 8 | Custom variables | Add YAML in custom variables box, regenerate | Variables appear in `group_vars/all/custom.yml` in output | |
| 9 | Documentation options | Enable README + Role Docs, generate | Output includes `README.md` and `roles/*/README.md` | |

## 3. AI Integration

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 10 | Playbook generation | Generate any playbook | No API errors, valid YAML returned | |
| 11 | Lint playbook | Click "Lint Playbook" | Lint results appear, no crash | |
| 12 | Doc suggestion | Open documentation suggestion feature | Returns suggestion + reason | |
| 13 | Valid model | Check Network tab during API calls | No "model not found" errors | |

## 4. Git Integration

| # | Test | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 14 | Valid repo URL accepted | Enter `https://github.com/your-user/your-repo`, click push | Proceeds to clone (or auth error if no access — not a URL rejection) | |
| 15 | Invalid URL rejected | Enter `http://evil.com/repo`, click push | Returns "Invalid repository URL" error | |
| 16 | Private IP rejected | Enter `https://192.168.1.1/repo` | Returns "Invalid repository URL" error | |
| 17 | Shell chars in branch sanitized | Enter `main; rm -rf /` as branch name | Sanitized to `main rm -rf ` or similar, no injection | |
| 18 | Rate limit enforced | Submit 6+ Git requests within 1 minute | 6th request returns 429 Too Many Requests | |

## 5. Error Handling

| # | Scenario | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 19 | Empty API key | Remove `API_KEY` from `.env`, restart, try generate | Clear error shown, no crash | |
| 20 | No services selected | Click Generate with nothing selected | Either generates a minimal playbook or shows validation message | |

## 6. Performance

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 21 | Initial page load | Hard-refresh http://localhost:3000 | UI loads in under 3s | |
| 22 | Large generation | Select 10+ services with full docs | Generation completes, no server timeout | |

## 7. Security

| # | Check | Steps | Expected | Pass/Fail |
|---|---|---|---|---|
| 23 | No stack traces in API errors | Trigger a Git operation failure | Error message is generic, no file paths or stack traces in response | |
| 24 | API key not in bundle | `npm run build`, grep `dist/` for the key | Key not in built output | |
