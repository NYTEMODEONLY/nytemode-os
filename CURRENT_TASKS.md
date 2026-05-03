# NYTEMODE OS — Current Tasks

**Project:** NYTEMODE OS Desktop Environment
**Live:** https://os.nytemode.com
**Repository:** https://github.com/NYTEMODEONLY/nytemode-os
**Upstream:** https://github.com/DustinBrett/daedalOS
**Last updated:** 2026-05-03 (after upstream sync)
**Status:** Active. Synced with upstream, deployed clean, ready for custom feature work.

> Read [`CLAUDE.md`](./CLAUDE.md) and [`NYTEMODE_OS_PROJECT_RULES.md`](./NYTEMODE_OS_PROJECT_RULES.md) before picking up work here.

---

## 🟢 Where the project sits today

- **In sync with upstream daedalOS** through `61db23f0` (2026-04-28). Merge commit on our side: `a86d7f03`.
- **43 commits ahead** of upstream — all NYTEMODE customizations (branding, icons, Matrix wallpaper purple, taskbar off-black/grey, custom shortcuts, mobile favicon work, the Next.js 15.5.15 backport, this round of docs).
- **Vercel auto-deploy is live and verified.** Pushes to `origin/main` automatically build and deploy to https://os.nytemode.com. Most recent prod deploy (`nytemode-jny84f3oo`) — Status `● Ready`, 2m duration.
- **Working tree:** clean.
- **Backup tag:** `pre-sync-2026-05-03` (local) pinned to `9fbc17ce` — pre-merge rollback point if any latent regression appears once the OS is exercised in a browser.

---

## 🎯 Next up — pick up here

Roughly ordered. Re-prioritize with the maintainer.

### Validate the OS in a browser end-to-end

Local builds pass and Vercel reports Ready, but neither confirms the OS actually _works_ in a real browser session. Before sinking time into new features, smoke-test:

- [ ] Open https://os.nytemode.com in **a fresh browser profile / incognito** (default browser state shadows IndexedDB-persisted state).
- [ ] Boot loads cleanly — desktop renders, NYTEMODE-N start button shows, taskbar is off-black, Matrix wallpaper is purple `#7c519d`.
- [ ] Custom desktop shortcuts open the right URLs: CINDR → cindrtoken.com, OUTWERD. → outwerd.com, Snackulator → snackulator.app, NYTEMODE → nytemode.com, plus upstream's My PC and Public.
- [ ] Try the Snackulator desktop icon — confirm the v4 pink ice-cream-cone art renders at every resolution (16/32/48/96).
- [ ] Open a few core upstream apps that we didn't customize (Browser, File Explorer, Terminal, Monaco editor, Webamp) to confirm the upstream merge didn't regress them.
- [ ] Mobile / iOS Safari: load on iPhone, verify favicon, apple-touch-icon, PWA install flow still work.
- [ ] If any of the above fails, cross-check upstream behavior — they may have introduced a bug in their last 131 commits that we need to fix or revert from.

### Custom feature work

This is the part the maintainer wants to do next ("we'll be working on it ourselves and doing a lot of custom features"). Backlog will be filled in here as features are scoped. Possible directions inherited from prior planning:

- [ ] **Curated wallpaper expansion.** We pruned upstream's Art Institute / MET / APOD / Stable Diffusion wallpapers during the sync. If any are wanted back, re-add to `components/system/Desktop/Wallpapers/constants.ts` (and matching `WALLPAPER_PATHS` / `WALLPAPER_WORKERS` if they need workers).
- [ ] **Burn-My-Windows close shaders** are now installed (came in with the upstream merge). Wire them up in `utils/closeEffectShaders.ts` if we want the dramatic window-close effects.
- [ ] **Service worker / PWA offline.** Backlog item from the original IDEAS.md and the pre-dormancy task list — never implemented in our fork.
- [ ] **Accessibility audit.** Keyboard nav, screen reader, ARIA — never seriously audited.
- [ ] **More NYTEMODE-branded apps.** The desktop has CINDR, OUTWERD., Snackulator, NYTEMODE. Easy to add more via `DESKTOP_ICON_TEMPLATE.md`.
- [ ] **(maintainer to fill in)** — additional custom features go here as they're scoped.

### Standing technical-debt backlog

These were already in flight or planned. Re-evaluate after a few feature passes.

- **Bundle size.** Initial bundle ~259 kB after the upstream sync (was ~252 kB pre-merge). Targets in PROJECT_RULES are looser (under 10 MB) — we're well under. Re-audit if any heavy deps land.
- **TypeScript hygiene.** `next.config.js` has `ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`. Real type errors hide behind those flags. Fix incrementally and eventually flip both off.
- **Test coverage.** Jest + Playwright wired up but coverage is shallow. Critical user flows (file open, app launch, drag-drop) deserve deterministic e2e tests. Upstream just added e2e tests — check if any of theirs cover what we need.
- **`--no-verify` follow-up.** The merge commit `a86d7f03` skipped lint-staged because reformatting 259 mostly-upstream files would add noise. If a future audit reveals real issues, run `yarn prettier` + `yarn eslint --fix` as a separate cleanup commit.

---

## 🗂️ Where to put new work

- A user-facing change to a desktop icon → follow `DESKTOP_ICON_TEMPLATE.md`, update this file's "Recently completed" section when done.
- A new app component → `components/apps/<AppName>/{index.tsx, config.ts}`, register in the process system, add icon set, regenerate caches with `yarn build:prebuild`.
- A branding change → `pages/_document.tsx`, `public/site.webmanifest`, `utils/constants.ts` `PACKAGE_DATA`. Mirror in any `.url` shortcuts and icon files.
- A behavior tweak from upstream daedalOS → cherry-pick from `upstream/main` rather than re-implementing.

---

## ✅ Recently completed (2026-05-03 re-onboarding session)

Everything below was done in one session on 2026-05-03. Don't re-do.

- **`a86d7f03` — Upstream sync.** Merged 131 upstream commits since `f77cdc8b` (2025-03-18). Conflicts resolved on `.gitignore`, `package.json`, `yarn.lock`, `Wallpapers/{constants,types}.ts`, `Taskbar/{TaskbarPanel.ts,Search/Details.tsx,Search/ResultEntry.tsx,TaskbarEntry/Peek/StyledPeekWindow.ts}`, `Metadata.tsx` — preserving NYTEMODE branding (Matrix purple, off-black taskbar, custom desktop, NYTEMODE alias). Workflow switched from npm to yarn for installs because upstream's `Burn-My-Windows` git dep can't be cloned by npm.
- **`9fbc17ce` — Next.js 15.2.3 → 15.5.15 bump.** First auto-deploy after re-onboarding failed Vercel's CVE security gate (added at some point during dormancy). Bumped to `^15.5.15` (active 15.x backport line); `next-env.d.ts` added to `.eslintignore` because Next 15.5 regenerates it with a triple-slash reference airbnb-eslint flags.
- **`ad16d52d` — Repo hygiene + Snackulator finalize.** Promoted v4 pink ice-cream-cone art to canonical `snackulator_icon.png` at every resolution; renamed `Snacks App.url` → `Snackulator.url`. Expanded `.gitignore` to catch `.DS_Store`, `tmp_conversion/`, and to whitelist all `Desktop/*.url` (previously `Snackulator.url` was being silently ignored).
- **`01303ea7` — Doc refresh for re-onboarding.** Created `CLAUDE.md`, refreshed `CURRENT_TASKS.md` / `NYTEMODE_OS_PROJECT_RULES.md` / `README.md`, added `DESKTOP_ICON_TEMPLATE.md` to the repo (had been untracked).

### Verified end-to-end

- `yarn build` succeeds locally (3 static pages, ~259 kB first load).
- Vercel preview deploy `nytemode-ai6qshuq8` → `Ready` (2m).
- Production auto-deploy `nytemode-jny84f3oo` → `Ready` (2m).
- `https://os.nytemode.com` returns HTTP 200.

---

## 📌 Notes for whoever picks this up next

- This file is the canonical "what's in flight" document. Update it the moment status changes.
- Always real-date entries (`2026-MM-DD`), never relative or stale ones.
- The `Next up` section is meant to be a working punchlist, not a wishlist. If something here is no longer being actively worked toward, demote it to backlog or delete it.
- Custom feature work supersedes everything in this file — let the maintainer drive the priorities.
