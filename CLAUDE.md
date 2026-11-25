# Jhalak TV app: Spec-Driven Delivery Workflow

This repo is the React Native TV wrapper (Fire TV/Android now; Samsung port on the `Samsung` branch, `menu-display` branch for Jhalak.app). A WebView loads a site's `/cast` page.

The workflow, gates, and orchestrator rules are defined in **`inepali/caredisplay/CLAUDE.md`**. Follow them here too. The subagents in `.claude/agents/` are the same four: `spec-writer`, `developer`, `code-reviewer`, `tester`.

## Differences for this repo
- **Specs** live in `inepali/caredisplay/specs/` (one shared JH-### sequence). Clone caredisplay alongside this repo to read and update them.
- **Checks:** `npm ci`, then `npm run lint`, `npx tsc --noEmit`, and `npm test` (jest).
- **No preview deployment.** After the reviewer approves and the developer commits and pushes, the tester runs the checks and turns each acceptance criterion into **manual-device steps** for Sanjay: build with `npm run build:apk`, install on a Fire TV/Android TV, and verify. Sanjay reports pass/fail, then the developer opens the PR.
- Never publish store builds or sign release APKs with production keys. That's Sanjay's call.
- Don't change the WebView `/cast` URL unless a spec says to.
