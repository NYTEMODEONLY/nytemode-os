# NYTEMODE OS — Current Tasks

**Project:** NYTEMODE OS Desktop Environment
**Live:** https://os.nytemode.com
**Repository:** https://github.com/NYTEMODEONLY/nytemode-os
**Upstream:** https://github.com/DustinBrett/daedalOS
**Last updated:** 2026-05-03
**Status:** Returning from ~7-month dormancy. Re-onboarding in progress.

> Read [`CLAUDE.md`](./CLAUDE.md) and [`NYTEMODE_OS_PROJECT_RULES.md`](./NYTEMODE_OS_PROJECT_RULES.md) before picking up work here.

---

## 🔭 Where the project sits today

- **Dormancy window:** Last production deployment ~2025-09 (≈238 days ago). Last commit on `origin/main` is `cc4bf44e "Fix NYTEMODE favicon format"`.
- **Fork divergence vs. `DustinBrett/daedalOS`:** 39 commits ahead, 131 commits behind. Last common ancestor is `f77cdc8b "Pkg upgrades"` (2025-03-18). Upstream has had heavy activity during our dormancy — a sync will be a real piece of work, not a fast-forward.
- **Local working tree is dirty.** Carry-forward state from the prior session (May 2025-ish):
  - Snackulator icon iterations: untracked `*_v2`, `*_v3`, `*_v4` PNGs at every resolution. The committed `snackulator_icon.png` (and 48x48 variant) was deleted on disk; the SVG source was modified.
  - `public/Users/Public/Desktop/Snacks App.url` deleted; `Snackulator.url` already lives in `public/Users/Public/Desktop/`.
  - Prettier nits in `utils/constants.ts` (multi-line description; trailing comma in `SYSTEM_FILES`).
  - Untracked: `tmp_conversion/`, several stray `.DS_Store`, `DESKTOP_ICON_TEMPLATE.md` (already added — see below; this is a real working doc).
- **Vercel:** Authed as `nytemode` on team `violetmyst`. Project name on Vercel is `nytemode-os`, latest production URL is `https://os.nytemode.com`. CLI is good to go; no re-auth needed.

---

## 🎯 Re-onboarding queue (pick up here)

Ordered roughly by what unblocks the most. Re-prioritize with the maintainer before sinking serious time into anything past the first section.

### Step 0 — Stabilize the working tree

- [ ] Decide the fate of the **Snackulator icon iterations** (`_v2/_v3/_v4`). Pick one as the canonical icon, delete the rest, and either re-commit `snackulator_icon.png` or update the shortcut to point at the chosen variant. Don't leave four parallel versions sitting untracked.
- [ ] Re-run `npm run build:prebuild` after the icon decision so `public/.index/{shortcutCache,desktopIcons}.json` reflect the live state.
- [ ] Decide whether the prettier-only diff in `utils/constants.ts` should be committed standalone or rolled into the icon PR.
- [ ] Add `.DS_Store` patterns to `.gitignore` if not already covered, and delete the tracked-disk-junk untracked files.
- [ ] `git status` should be clean (or contain only intentional WIP) before any other work begins.

### Step 1 — Re-validate the build & deploy path

- [ ] `nvm use` against `.nvmrc` (Node 22.0.0) — local machine is currently on 24.3.0. Confirm that's still the targeted runtime, or update the `.nvmrc`/`engines` to a current LTS.
- [ ] `npm install --legacy-peer-deps` from a clean `node_modules`. Note any new resolution warnings.
- [ ] `npm run build` end-to-end. Expect prebuild scripts (`robots`, `rssBuilder`, `searchIndex`, `preloadIcons`, `cacheShortcuts`, `fs2json`) to all succeed.
- [ ] `npm run dev` and smoke-test the desktop in Chrome + iOS Safari (real device, not just DevTools).
- [ ] `vercel deploy` (preview) — confirm Vercel still builds cleanly against current `package-lock.json`. If it fails, fix locally before pushing to `main`.

### Step 2 — Decide the upstream-sync strategy

- [ ] Read through 131 upstream commits since `f77cdc8b` and decide whether to: (a) hard-pause and rebase NYTEMODE customizations on top of the latest upstream, (b) cherry-pick a small set of upstream fixes, or (c) keep diverging deliberately. Document the choice here.
- [ ] If syncing: protect NYTEMODE branding (see CLAUDE.md "Branding" section) and verify the Matrix wallpaper purple recolor + custom desktop icons survive the rebase.

### Step 3 — Health check & known regressions

- [ ] Cross-browser smoke test (Chrome, Firefox, Safari, Edge desktop; iOS Safari, Android Chrome mobile). Report any regressions that crept in during dormancy.
- [ ] PWA install flow on iOS — last verified 2025-01. Verify still works post-iOS updates.
- [ ] Lighthouse pass on `os.nytemode.com` to capture a current performance baseline before any changes.
- [ ] Audit dependency vulns: `npm audit` summary — note critical/high counts, decide which to upgrade.

---

## 🪜 Standing backlog (medium-term)

These were already in flight or planned before dormancy. Re-evaluate after Steps 0–3 are clean.

- **Bundle size.** Initial bundle ~10MB. Targets: `<8MB` initial, FCP `<2s`, Lighthouse `>90`.
- **Service worker / offline.** Inherited daedalOS uses none; adding one is in `IDEAS.md` but unimplemented in our fork.
- **Accessibility audit.** Keyboard nav, screen reader compatibility, ARIA labels — never seriously audited.
- **Test coverage.** Jest + Playwright are wired up but coverage is shallow. Critical user flows (file open, app launch, drag-drop) deserve deterministic e2e tests.
- **TypeScript hygiene.** `next.config.js` has `ignoreBuildErrors: true`. There are real type errors hiding behind that flag. Fix incrementally and eventually flip the switch off.
- **Screen savers, system tray, custom desktop layouts** — see `IDEAS.md` for the long upstream-inherited backlog. Many of these are nice-to-have, not roadmap.

---

## 🧊 Frozen until upstream sync decision

Anything that touches files heavily edited upstream (e.g. `components/system/Taskbar`, `components/system/Window`, the Terminal, the file system layer) should wait until we've decided whether to rebase. Otherwise we're piling NYTEMODE-only changes onto an old base and making the eventual sync worse.

---

## 🗂️ Where to put new work

- A user-facing change to a desktop icon → follow `DESKTOP_ICON_TEMPLATE.md`, update this file's "Recently completed" section when done.
- A new app component → `components/apps/<AppName>/{index.tsx, config.ts}`, register in the process system, add icon set, regenerate caches.
- A branding change → `pages/_document.tsx`, `public/site.webmanifest`, `utils/constants.ts` `PACKAGE_DATA`. Mirror in any `.url` shortcuts and icon files.
- A behavior tweak from upstream daedalOS → cherry-pick from `upstream/main` rather than re-implementing.

---

## ✅ Recently completed (prior session — pre-dormancy)

Kept here for context. Do not re-do these.

- **Snackulator desktop icon (Apr–May 2025).** Renamed from `Snacks App.url` (space in filename was causing render bugs) to `Snackulator.url`. Custom pink ice-cream-cone icon designed (SVG source + multi-res PNG export via ImageMagick). Multiple icon revisions in flight (`_v2`/`_v3`/`_v4`) — see Step 0 above to finalize.
- **NYTEMODE website desktop shortcut (`NYTEMODE.url`).**
- **Mobile favicon overhaul (Jan 2025).** Replaced the upstream WebP-masquerading-as-ICO with a real ICO, added apple-touch-icon set, iOS-specific `<meta>` tags, `site.webmanifest` for PWA support. Deployed and verified on iOS Safari + Firefox.
- **Comprehensive project docs.** `NYTEMODE_OS_PROJECT_RULES.md`, `CURRENT_TASKS.md`, `DESKTOP_ICON_TEMPLATE.md` initialized.
- **Branding swaps.** CINDR token shortcut + flame icon, OUTWERD shortcut, Snackulator shortcut, Matrix wallpaper recolor to brand purple `#7c519d`, taskbar off-black/grey color scheme.
- **`Refresh.url` removed** from desktop and added to `SYSTEM_FILES` ignore set.

---

## 📌 Notes for whoever picks this up next

- This file is the canonical "what's in flight" document. Update it the moment status changes — don't let it go stale again.
- The previous version of this file pretended to be dated "January 2025" while containing May 2025 content. Don't do that. Use real dates and overwrite stale claims.
- If you're starting a new line of work that doesn't fit any section above, add a section. The structure exists to serve the work, not the other way around.
