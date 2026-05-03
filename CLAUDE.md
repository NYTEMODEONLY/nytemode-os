# CLAUDE.md — NYTEMODE OS

Workspace-level guidance for any future Claude session working in this repo. Keep this file tight; pointers to deeper docs live at the bottom.

---

## What this project is

**NYTEMODE OS** is a personalized, browser-based desktop environment — a NYTEMODE-branded fork of [DustinBrett/daedalOS](https://github.com/DustinBrett/daedalOS).

- **Live:** https://os.nytemode.com
- **Origin (our fork):** https://github.com/NYTEMODEONLY/nytemode-os
- **Upstream (do NOT push to):** https://github.com/DustinBrett/daedalOS
- **Vercel project:** `violetmyst/nytemode-os` (this machine is authed as `nytemode`)
- **Maintainer GitHub user:** `nytemodeonly` (commits also land under email `lobo.rivera@gmail.com`)

### Fork relationship at a glance

- Last common ancestor with upstream: **`f77cdc8b` "Pkg upgrades"** (2025-03-18).
- Ahead of upstream: ~39 NYTEMODE-specific commits (branding, custom icons, mobile favicon work, taskbar color tweaks, default Matrix wallpaper recoloring).
- Behind upstream: ~131 commits as of 2026-05-03. Upstream is highly active; expect non-trivial conflicts when syncing.
- Last production deploy: ~238 days ago (mid-Sept 2025). The project has been dormant and is now being revisited.

---

## Tech stack & runtime

- **Framework:** Next.js 15 (`output: "export"`, static export)
- **UI:** React 19 + styled-components 6, framer-motion
- **Language:** TypeScript 5.8 (build-time TS errors are tolerated — `ignoreBuildErrors: true`)
- **Filesystem:** BrowserFS over IndexedDB (Unix-style paths under `/Users/Public`)
- **Package manager:** **npm** (`package-lock.json` is authoritative; `yarn.lock` and `.yarnrc.yml` linger from upstream but are not used)
- **Node:** `.nvmrc` pins **22.0.0**; `package.json` engines accept `^18.18.0 || ^19.8.0 || >= 20.0.0`
- **Deploy:** Vercel, framework `nextjs`, `installCommand: npm install --legacy-peer-deps`
- **Tests:** Jest (unit) + Playwright (e2e)

---

## Commands you'll actually use

```bash
# install (legacy-peer-deps is non-negotiable — peer-dep graph is not clean)
npm install --legacy-peer-deps

# dev server
npm run dev                 # http://localhost:3000

# regenerate generated assets after touching public/, icons, or shortcuts
npm run build:prebuild      # robots, RSS, search index, icon cache, shortcut cache, fs.9p.json

# full production build (runs prebuild + next build)
npm run build

# preview locally
npm run serve               # serves ./out

# Vercel deploy (already authed)
vercel deploy               # preview URL
vercel --prod               # production at os.nytemode.com

# tests
npm test                    # jest
npm run e2e                 # playwright
```

The `build:prebuild` step is **mandatory** any time you add/rename/move files under `public/` (especially desktop shortcuts and icons). It rebuilds:

- `public/.index/shortcutCache.json`
- `public/.index/desktopIcons.json`
- `public/.index/fs.9p.json`
- preloaded icons in `public/.index/icons/`

If a desktop change "doesn't show up," 90% of the time the answer is: re-run `npm run build:prebuild`.

---

## Branding — what's NYTEMODE-specific vs. upstream

When syncing from upstream, **preserve** these NYTEMODE-only customizations:

- `utils/constants.ts` → `PACKAGE_DATA` (alias `"NYTEMODE OS"`, author `NYTEMODEONLY`) and `DEFAULT_WALLPAPER = "MATRIX"`.
- `pages/_document.tsx` → all the `apple-mobile-web-app-*`, manifest, and favicon `<link>` tags configured for `NYTEMODE OS`.
- `public/site.webmanifest` → `name: "NYTEMODE OS"`, `theme_color: "#000000"`.
- `public/favicon*`, `public/apple-touch-icon*`, `public/android-chrome-*` — the NYTEMODE-formatted favicon set (the original daedalOS favicon was WebP-as-ICO; we converted to a real ICO).
- `public/Users/Public/Desktop/*.url` — NYTEMODE-curated shortcuts: `CINDR.url`, `OUTWERD..url`, `Snackulator.url`, `NYTEMODE.url`, plus the upstream `My PC.url` and `Public.url`.
- `public/System/Icons/` — NYTEMODE custom icons: `cindr_icon*.png`, `outwerd_icon*.png`, `snackulator_icon*.{png,svg}`, NYTEMODE favicon (`pc.webp`).
- Matrix wallpaper config recolored to brand purple `#7c519d` (see commit `b72deaf9` and neighbors).
- Taskbar uses off-black/grey instead of upstream's blue (commit `22acf4fb`).

If you're rebasing onto upstream, expect conflicts in `utils/constants.ts`, `pages/_document.tsx`, `public/site.webmanifest`, and `package.json`/lockfile. Resolve toward NYTEMODE values for branding, accept upstream for everything else.

---

## Conventions

- **Desktop shortcuts:** PascalCase, no spaces in filename (`MyApp.url`, never `My App.url`). Filenames with spaces have caused subtle render bugs — see `DESKTOP_ICON_TEMPLATE.md`.
- **Icons:** PNG preferred, multi-resolution under `public/System/Icons/{16x16,32x32,48x48,96x96}/<name>.png` plus a top-level `<name>.png` (96x96+). Optional SVG source alongside.
- **Components:** PascalCase. Co-located under `components/{apps,system,pages}/<Name>/index.tsx` with companion `config.ts`/`useApp.ts` where applicable.
- **Utilities:** camelCase, under `utils/`.
- **Styles:** styled-components, dark theme primary, Windows-style UI metaphors.
- **Commits:** imperative-mood subject lines, sometimes with a leading emoji (e.g. `📚`, see commit `65e62b5b`). Match the style around you. AI-assisted commits should include the standard `Co-Authored-By` footer.

---

## Gotchas to keep in mind

- **Static export only.** `next.config.js` sets `output: "export"`. No SSR / no Next.js API routes / no middleware will work in production. Anything dynamic must run client-side or via a separate service.
- **Build allows TS errors.** `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`. A green Vercel build does not mean the code is type-clean. Run `npm run eslint` and `tsc --noEmit` (via VS Code or manually) when verifying real correctness.
- **`legacy-peer-deps` is required.** Without it, `npm install` will fail on the React 19 / various-libs-pinned-to-React-18 conflict.
- **Heavy bundle (~10MB initial).** Don't introduce additional megabyte-class dependencies casually.
- **BrowserFS persists in IndexedDB.** Test changes to `public/Users/Public/...` in an incognito window or after clearing site storage; otherwise the user's saved state shadows the new defaults.
- **Mobile/iOS favicon is fragile.** The original WebP-as-ICO bug taught us iOS Safari is picky. If you touch favicons, validate on real iOS, not just Chrome DevTools.
- **Vercel CLI defaults look wrong.** `vercel ls` shows deployment URLs like `nytemode-*-violetmyst.vercel.app` because the underlying Vercel project name is `nytemode`, not `nytemode-os`. The custom domain `os.nytemode.com` is what users see — don't get spooked by the project naming mismatch.
- **Vercel rejects CVE'd Next.js versions post-build.** Vercel runs a security gate AFTER `next build` succeeds. If the pinned `next` version has a published advisory, the deploy is marked Error with `Vulnerable version of Next.js detected, please update immediately` even though the build log shows `Build Completed`. Local `npm run build` will not catch this — only `vercel ls` will. Bump to the latest backport stable on the major you're on (currently `^15.5.15` for the Next 15 line). The skill `vercel-nextjs-vulnerable-version-block` documents the full recipe.
- **Never claim Vercel-readiness from a local build alone.** Always check the actual deploy status with `vercel ls` after pushing.
- **`out/` and `.next/` are committed/ignored inconsistently across history.** When in doubt, never `git add` build output.

---

## Pointers to deeper docs

- **`NYTEMODE_OS_PROJECT_RULES.md`** — full development rules, project structure, deployment guidelines, performance targets.
- **`CURRENT_TASKS.md`** — what's actively being worked on / next up. Update this as work progresses.
- **`DESKTOP_ICON_TEMPLATE.md`** — step-by-step recipe for adding a new desktop icon/shortcut.
- **`IDEAS.md`** — long backlog inherited from upstream daedalOS. Useful for inspiration; not a NYTEMODE-specific roadmap.
- **`README.md`** — feature list (largely the upstream daedalOS README plus NYTEMODE preamble). Good for explaining what the OS _does_; not the right place to learn how _we_ work on it.

---

## Working style for this repo

- The project went dormant for ~7 months before this revisit. Start by re-grounding: `git status`, `git log --oneline -20`, and skim `CURRENT_TASKS.md` before assuming anything about state.
- Before any non-trivial change, sanity-check whether the same code exists upstream — we're a fork, and there's a real chance upstream has already solved (or broken) what you're about to touch.
- The user prefers quality over speed (see global `~/.claude/CLAUDE.md`). For non-trivial work, briefly state the approach before implementing so they can course-correct early.
- Don't claim a UI/feature works without actually loading it in a browser. Type-check passing ≠ feature works.

---

_Last verified: 2026-05-03. If this file feels out of sync with reality, update it._
