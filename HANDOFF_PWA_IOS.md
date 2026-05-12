# Handoff: iOS PWA Standalone Mode — Bottom-Band Bug

**Date:** 2026-05-11
**Working tree:** `main` (clean after this handoff commit)
**Production:** https://os.nytemode.com (Vercel project `violetmyst/nytemode-os`)

This document is for the next agent picking up the bug. **The session that produced
this doc made the situation work-in-progress, not better.** Read everything before
touching code.

---

## The user-visible problem

When NYTEMODE OS is **added to the iPhone home screen and launched standalone**,
there is a **persistent black band between the bottom of the taskbar and the bottom
of the physical screen.** The home-indicator pill renders inside that band. The
user wants the taskbar to be **flush with the bottom of the screen** (Windows-OS
visual metaphor — taskbar anchored to the bottom, no gap).

Screenshot evidence (user-supplied, two attempts on iPhone, both still show the band):

- Attempt 1: After `viewport-fit=cover` + safe-area-inset CSS + `position: absolute` taskbar.
  Taskbar visibly fatter, big black band below.
- Attempt 2: After switching taskbar to `position: fixed`. Identical or slightly
  worse outcome.

This bug **does not** appear on:

- Desktop browsers (any) — fine
- iPhone in Safari (not standalone) — N/A, OS doesn't really work in Safari mode
- Android — not tested by user this session but reportedly fine historically

---

## What is currently committed and live

All of this is on `main` and deployed to `os.nytemode.com`:

### 1. Upstream sync — DONE, working

- Merged `upstream/main` through `1409a15e` (Add Chess game). Merge commit `5a5627d2`.
- Three new deps installed cleanly: `chess.js`, `@chrisoakman/chessboard2`, `stockfish`.
- NYTEMODE branding preserved through git auto-merge (no manual conflict resolution
  needed): `package.json` kept NYTEMODE name/author and `next@^15.5.15` (newer than
  upstream's `^15.5.5` — do NOT downgrade, Vercel CVE-gates older versions);
  `next.config.js` kept our `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`
  AND took upstream's new stockfish webpack rule.
- Chess launches from Start Menu → Games → Chess. Verified by user.

### 2. NYTEMODE desktop icon — DONE, working

- Bug: NYTEMODE.url shortcut pointed at `/System/Icons/nytemode_favicon.png` but
  only had the top-level 3000×3000 source. daedalOS resolves icons by size dir
  (16x16, 32x32, 48x48, 96x96, 144x144) so the desktop tile fell back to generic.
- Fix: generated all 5 size variants via `sips` from the 3000×3000 source.
  Committed in `237b8426`. Verified by user.

### 3. Duplicate `<meta name="viewport">` — DONE, fixed

- **Important context for next agent:** the production HTML used to have TWO
  viewport meta tags. One from `components/pages/Metadata.tsx` (page-level,
  injected by `next/head`, has the `data-next-head=""` attribute), one from
  `pages/_document.tsx` (static document-level). The page-level one was the one
  iOS Safari actually applied, and it LACKED `viewport-fit=cover`. With that
  missing, the home-screen install didn't get safe-area insets at all.
- Fix: added `viewport-fit=cover` to the Metadata.tsx viewport, **deleted the
  duplicate from `_document.tsx`**. Now exactly ONE viewport meta in prod HTML.
  Verified via `curl https://os.nytemode.com/ | grep viewport` — only one match.
- Current viewport content:
  `width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, interactive-widget=resizes-content, viewport-fit=cover`

### 4. `site.webmanifest` `start_url` + `scope` — DONE

- Added `"start_url": "/"` and `"scope": "/"` (were missing). Without `scope`,
  iOS sometimes treats the home-screen entry as a Safari shortcut rather than
  a standalone PWA.

### 5. Safe-area CSS (THIS IS WHERE IT'S STUCK) — partial / not working

Three component files touched:

- `components/system/Desktop/StyledDesktop.ts`:
  - Added `padding-top: env(safe-area-inset-top, 0px)` so desktop-icon
    FileManager children get pushed below the iOS status bar.
  - Adjusted the wallpaper `<canvas>` child with negative `top` and increased
    `height` so it covers the full element (including the new padding area).
  - **User confirmed this part works.** Icons now sit below the status bar.

- `components/system/Taskbar/StyledTaskbar.ts`:
  - `height: calc(${TASKBAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`
  - `padding-bottom: env(safe-area-inset-bottom, 0px)`
  - Originally `position: absolute`. Tried switching to `position: fixed` in a
    follow-up commit (`3bdd7aa5`) — no visible difference on iPhone.
  - **The black band below the taskbar persists in BOTH absolute and fixed mode.**
  - `TASKBAR_HEIGHT = 30` (from `utils/constants.ts`).

- `pages/_document.tsx`: just the duplicate-viewport removal and one
  `eslint-disable react/no-invalid-html-attribute` block around the
  `apple-touch-icon-precomposed` link (pre-existing lint issue surfaced by
  husky/lint-staged on the touched file). Same block-disable pattern was
  needed in `Metadata.tsx`. Single-line `// eslint-disable-next-line` doesn't
  work because Prettier (which runs before ESLint in lint-staged) re-wraps
  multi-attribute JSX to multi-line, shifting the line the disable comment
  was supposed to target. **If you touch these files, you need the block
  `/* eslint-disable */ … /* eslint-enable */` form.**

### 6. Diagnostic that was IN PROGRESS — REVERTED in this handoff commit

Pushed a one-line diagnostic that set `theme-color` (meta + manifest) to
`#ff00ff` (hot pink) to test whether iOS was painting the home-indicator zone
with `theme-color` itself (i.e. iOS chrome, not our content). **User did not
report the band color before saying "still not working, document progress."**
This handoff commit restores `theme-color` to `#000000`. **The diagnostic was
not validated. You may want to re-run it.** The relevant commits are
`8509d4ed` (apply hot-pink) and the handoff commit (revert).

---

## What the next agent needs to figure out

**The core mystery:** on iPhone in standalone PWA mode, with all of:

- `<meta name="viewport" content="…, viewport-fit=cover">` (verified single-source in prod HTML)
- `<meta name="apple-mobile-web-app-capable" content="yes">` (in both `_document.tsx` and
  `Metadata.tsx`-conditional-on-mobile-UA)
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `site.webmanifest` with `"display": "standalone"`, `"start_url": "/"`, `"scope": "/"`
- The taskbar set to `position: fixed; bottom: 0; height: calc(30px + env(safe-area-inset-bottom, 0px))`

…the taskbar still does not reach the physical bottom of the screen. A ~30–50pt
black band sits between the taskbar's bottom edge and the screen bottom (the
home-indicator pill renders in that band).

The wallpaper `<canvas>` _appears_ to reach the screen bottom (matrix characters
visible all the way down, in screenshots BEFORE the taskbar was switched to fixed).
The taskbar specifically does not.

### Hypotheses explored, ranked by current likelihood

1. **iOS paints the home-indicator zone with `theme-color`** (most likely per
   reflection but **NOT YET VALIDATED**). The hot-pink diagnostic would have
   answered this. **Re-run that diagnostic first.** If pink → fix is to make
   content actually reach that zone (negative-bottom positioning, or restructure
   so taskbar lives outside the position-fixed body).

2. **`body { height: 100%; position: fixed }` + `html { height: -webkit-fill-available }`
   constrains the viewport for fixed children in iOS standalone PWA.**
   See `styles/GlobalStyle.ts` (lines ~21–37 at time of writing). Worth trying:
   `body { min-height: 100dvh; height: 100dvh; }` and removing
   `-webkit-fill-available` from html. NOTE: this WILL affect all OS layout, not
   just the taskbar — exercise care.

3. **The `&::after` pseudo with `backdrop-filter: blur(…)` and `z-index: -TASKBAR_Z_INDEX`
   may be the only thing painting the visible "taskbar background"**, and that
   pseudo is sized at `height: 100%` of the _content_ box (excluding `padding-bottom`),
   meaning the safe-area extension area has no backdrop-filter and may render
   as solid black via the element's `background-color` … but the element's
   `background-color` is `hsla(270, 30%, 10%, 90%)` (10% transparent), not solid
   black. If iOS is over-painting that with theme-color, hypothesis 1 wins.

4. **The user is on a recent iPhone (iOS 18+ / iPhone 16) and Safari has
   regressed behavior around `viewport-fit=cover` in standalone PWAs.** Not yet
   investigated.

5. **PWA cache.** User has done remove-and-re-add multiple times; this is less
   likely, but if the next agent's first push doesn't show the change, suspect
   this and try a totally different `start_url` (cache-busting query string)
   for one diagnostic round.

### What to try next (suggested order, ONE AT A TIME, verify each before

the next)

1. **Re-push the hot-pink diagnostic** (`#ff00ff` for both meta + manifest).
   Ask user explicitly: _what color is the band — pink, black, or other?_
   This single answer narrows the fix path by ~70%.

2. If band is **pink**: fix is to make our content paint the home-indicator zone.
   Try `bottom: calc(env(safe-area-inset-bottom, 0px) * -1)` instead of `bottom: 0`,
   keeping `padding-bottom: env(safe-area-inset-bottom, 0px)` so content stays
   above the home indicator. Test on iPhone.

3. If band is **black**: theme-color isn't the painter. Investigate
   `styles/GlobalStyle.ts` body/html height. Replace `body { height: 100% }`
   with `body { height: 100dvh }`. Replace `html { height: -webkit-fill-available }`
   with `html { height: 100dvh }`. Build, push, test.

4. If still broken after both: bisect by temporarily setting the taskbar to a
   bright color and a thicker border, push, watch where the taskbar _actually_
   ends up on the iPhone. The visual offset from the screen bottom tells you
   exactly how many pixels of "untouchable zone" iOS is reserving.

### What you should NOT do

- **Do not bypass husky pre-commit hooks** with `--no-verify`. The pre-existing
  lint errors are tolerable; new ones in touched files need real
  block-style `eslint-disable`/`enable` (Prettier rewraps multi-attribute JSX
  multi-line, which moves the line that `eslint-disable-next-line` would
  target).
- **Do not downgrade `next` from `^15.5.15` to `^15.5.5`** to "align with
  upstream." Vercel CVE-gates older Next.js after build success — local build
  passes, Vercel deploy returns `Error` with "Vulnerable version of Next.js
  detected." See skill `vercel-nextjs-vulnerable-version-block` and CLAUDE.md.
- **Do not amend the merge commits** (`5a5627d2`, or the merge from the prior
  upstream sync). Already in remote history.
- **Do not claim "fixed" from a local build alone.** This whole session's
  pain came from "OK on Mac Chrome, broken on iPhone PWA standalone."
  Verify ON the actual device every iteration. `vercel ls` must show `Ready`,
  AND the user must visually confirm on iPhone, AFTER deleting the existing
  home-screen icon and re-adding it (iOS aggressively caches the install
  manifest/meta-tag state).
- **Do not introduce `safe-area-inset` CSS to any other component** without
  thinking about its containment. The desktop and taskbar were the right
  surgical targets. Adding it to FileManager, Window, etc. could regress
  windowed apps.

---

## File-by-file diff summary (from `git log` since last clean state)

```
237b8426  Fix NYTEMODE desktop icon by generating multi-resolution favicon set
1683bd40  Fix iOS PWA safe-area handling and consolidate viewport meta
3bdd7aa5  Switch taskbar to position:fixed for iOS PWA bottom anchoring
8509d4ed  DIAGNOSTIC: theme-color #ff00ff to test home-indicator zone painting
<handoff>  Revert diagnostic theme-color to #000000; add HANDOFF_PWA_IOS.md
```

Verify with:

```
cd "/Users/lobo/Desktop/Progress/BI2025/NYTEMODE OS"
git log --oneline -10
git log -p 237b8426..HEAD -- components/ pages/ public/site.webmanifest styles/
```

---

## How to re-deploy and re-test

1. Edit files locally
2. `NODE_OPTIONS=--openssl-legacy-provider yarn build` to validate
3. `git add <files>` then `git commit` (husky will run lint-staged; expect
   prettier to re-format your touched files automatically)
4. `git push origin main`
5. `vercel ls` to watch — typical build is ~45s–2min
6. When the new deploy shows `● Ready`, verify on prod:
   `curl https://os.nytemode.com/ | grep <relevant-CSS-or-meta>`
7. Tell user to **delete existing home-screen icon, hard-reload Safari, re-add
   to home screen, launch from home screen** — iOS caches the manifest/meta
   state at install time. A simple page refresh inside the PWA will NOT pick
   up changes.
8. Get user screenshot before declaring victory.

---

## Open question the next agent should answer FIRST

**What color was the band when `theme-color` was `#ff00ff`?**

If the user can recall, this saves a round-trip. If not, re-deploy hot-pink
and ask. Everything downstream depends on this single yes/no.
