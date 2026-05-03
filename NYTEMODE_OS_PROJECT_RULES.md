# NYTEMODE OS Project Development Rules & Guidelines

> Companion doc to [`CLAUDE.md`](./CLAUDE.md). CLAUDE.md is the short, always-loaded brief; this file is the long-form rulebook. Read both.

## 🌌 Project Overview

**NYTEMODE OS** is a personalized, browser-based desktop environment, live at https://os.nytemode.com.

- **Repository (origin):** https://github.com/NYTEMODEONLY/nytemode-os
- **Upstream:** Fork of [DustinBrett/daedalOS](https://github.com/DustinBrett/daedalOS) — `git remote add upstream https://github.com/DustinBrett/daedalOS.git`
- **Tech stack:** Next.js 15, React 19, TypeScript 5.8, styled-components 6, BrowserFS over IndexedDB
- **Deployment:** Vercel (`violetmyst/nytemode-os` project, static export, custom domain `os.nytemode.com`)
- **Maintainer:** NYTEMODEONLY

### Fork status (as of 2026-05-03)

- Last common ancestor with upstream: `f77cdc8b` "Pkg upgrades" (2025-03-18).
- Ahead of upstream: ~39 NYTEMODE customization commits.
- Behind upstream: ~131 commits — upstream is highly active. Plan a real sync, not a fast-forward.
- Last production deployment: ~mid-September 2025. Project paused for ~7 months and is now being revisited.

---

## 🎯 Core Development Principles

### 1. **Maintain 100% Functionality**

- All existing features must remain operational
- No breaking changes without explicit approval
- Test thoroughly before deploying changes
- Prioritize stability over new features

### 2. **Performance First**

- Use Web Workers for intensive operations
- Implement OffscreenCanvas for animations
- Lazy load components and assets
- Optimize bundle size and loading times

### 3. **Browser Compatibility**

- Ensure cross-browser support (Chrome, Firefox, Safari, Edge)
- Test on mobile devices (iOS Safari, Android Chrome)
- Graceful degradation for older browsers
- Progressive enhancement approach

---

## 📁 Project Structure Rules

### Core Directories

```
components/
├── apps/          # Individual applications (Browser, Terminal, etc.)
├── pages/         # Next.js pages and global components
└── system/        # Core OS components (Taskbar, StartMenu, etc.)

contexts/          # React context providers
├── fileSystem/    # File system management
├── process/       # Window/app process management
├── session/       # User session and settings
├── menu/          # Context menu system
└── viewport/      # Screen/viewport management

utils/             # Utility functions and constants
scripts/           # Build automation scripts
public/            # Static assets and file system
```

### File Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Utilities**: camelCase (`myUtility.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Types**: PascalCase with Type suffix (`MyComponentType`)

---

## 🛠️ Development Workflow

### Before Making Changes

1. **Workspace Integrity Check**: Always scan existing files
2. **Understand Dependencies**: Check how changes affect other components
3. **Review Context**: Understand the specific functionality being modified
4. **Test Locally**: Ensure changes work in development environment

### Code Standards

- **TypeScript**: All new code must be TypeScript
- **ESLint**: Follow existing ESLint configuration
- **Prettier**: Use project Prettier settings
- **Styled Components**: Use styled-components for styling
- **No Console Logs**: Remove console.logs in production

### Testing Requirements

- **E2E Tests**: Use Playwright for end-to-end testing
- **Unit Tests**: Jest for component testing
- **Manual Testing**: Test on multiple browsers and devices
- **Performance Testing**: Monitor bundle size and loading times

---

## 🏗️ Build System Rules

### Scripts Understanding

- `npm install --legacy-peer-deps` — required; React 19 + several React-18-pinned libs collide otherwise
- `npm run build:prebuild` — generates essential files (icons, search index, RSS, robots, shortcut cache, fs.9p.json)
- `npm run build` — runs prebuild then the static `next build`
- `npm run dev` — Next.js dev server (http://localhost:3000)
- `npm run serve` — serves the built `out/` directory
- `npm run e2e` — Playwright e2e suite
- `npm test` — Jest unit tests
- `vercel deploy` — preview deployment
- `vercel --prod` — production deployment

> Package manager: **npm** (`package-lock.json` is authoritative). `yarn.lock` and `.yarnrc.yml` linger from upstream but are not used by Vercel or our local workflow.

### Pre-build Scripts (run in order by `build:prebuild`)

1. **robots.js** — generates `public/robots.txt`
2. **rssBuilder.js** — creates `public/rss.xml`
3. **searchIndex.js** — builds the in-app search index
4. **preloadIcons.js** — processes and caches icons under `public/.index/icons/`
5. **cacheShortcuts.js** — caches desktop shortcuts (`public/.index/shortcutCache.json`, `public/.index/desktopIcons.json`)
6. **fs2json.js** — converts the `public/` filesystem to `public/.index/fs.9p.json`

Re-run `npm run build:prebuild` whenever you add/rename/move anything under `public/`.

### Build Configuration

- **Output:** Static export (`output: "export"` in `next.config.js`)
- **Deployment:** Vercel with `framework: "nextjs"`, `outputDirectory: ".next"`, `installCommand: "npm install --legacy-peer-deps"`, `buildCommand: "npm run build"` (see `vercel.json`)
- **Type checking:** `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — a green build does **not** prove type/lint cleanliness. Verify separately when correctness matters.

---

## 📱 Application Development Rules

### Adding New Applications

1. Create folder in `components/apps/[AppName]/`
2. Include required files:
   - `index.tsx` (main component)
   - `config.ts` (app configuration)
   - `useApp.ts` (app-specific hooks if needed)
3. Register in process system
4. Add appropriate file associations
5. Include icon in `/System/Icons/`

### Existing Applications

**Core Apps**: Browser, Terminal, File Explorer, Monaco Editor, DevTools
**Utilities**: Photos, PDF Viewer, Paint, Video Player
**Emulators**: js-dos, EmulatorJS, Virtual x86, BoxedWine
**Games**: Space Cadet Pinball, DX-Ball, ClassiCube, Quake III
**Communication**: IRC, Messenger
**Development**: Vim, TinyMCE, Stable Diffusion

---

## 🎨 UI/UX Guidelines

### Design Consistency

- Follow Windows-like interface patterns
- Maintain dark theme as primary
- Use consistent spacing and typography
- Ensure accessibility compliance

### Mobile Optimization

- Responsive design for all components
- Touch-friendly interface elements
- Proper viewport configuration
- iOS-specific considerations (Safari quirks)

### Performance Standards

- Initial load under 3 seconds
- Smooth 60fps animations
- Efficient memory usage
- Lazy loading for heavy components

---

## 🔧 File System Rules

### Storage Architecture

- **Primary**: IndexedDB via BrowserFS
- **Structure**: Mimics traditional OS structure
- **Paths**: Unix-style paths (`/Users/Public/`)
- **Persistence**: All changes saved automatically

### File Types & Extensions

- **Images**: `.png, .jpg, .gif, .webp, .heic, .tiff, .jxl, .qoi`
- **Documents**: `.txt, .md, .pdf, .rtf, .whtml`
- **Archives**: `.zip, .7z, .rar, .tar, .gz`
- **Executables**: `.exe, .jsdos`
- **ROMs**: Console-specific extensions
- **Media**: `.mp3, .mp4, .webm, .mkv`

---

## 🚀 Deployment Guidelines

### Vercel context

- Authed account on this machine: `nytemode`
- Team: `violetmyst`
- Project: `nytemode-os` (Vercel internal slug; deployment URLs read as `nytemode-*-violetmyst.vercel.app`)
- Custom domain: `os.nytemode.com`
- Auto-deploy: GitHub integration on `main` (when active). After dormancy, manually verify a preview deploy before letting `main` auto-promote.

### Preview Deployment

```bash
npm run build
vercel deploy
```

### Production Deployment

```bash
npm run build
vercel --prod
```

### Environment Variables

- No sensitive data in client-side code
- All configs in `utils/constants.ts`
- Use Next.js environment variables for build-time configs (none currently in use; this is a fully static export)

---

## 🐛 Error Handling & Debugging

### Error Boundaries

- Wrap components in error boundaries
- Graceful failure handling
- User-friendly error messages
- Log errors for debugging

### Development Tools

- **DevTools App**: Built-in debugging capabilities
- **React DevTools**: For component debugging
- **Browser DevTools**: Performance profiling
- **Playwright**: E2E testing and debugging

---

## 📋 Task Tracking

### Always Maintain Task List

- Create `CURRENT_TASKS.md` for active development
- Track progress on each modification
- Document any blockers or issues
- Update completion status

### Task Categories

- **Bug Fixes**: Critical, High, Medium, Low
- **New Features**: High Priority, Medium, Low
- **Performance**: Optimization tasks
- **Maintenance**: Code cleanup, updates

---

## 🔒 Security Considerations

### Client-Side Security

- Sanitize all user inputs
- Validate file uploads
- Secure iframe configurations
- CSP headers for XSS protection

### File System Security

- Prevent directory traversal
- Validate file types
- Limit file sizes
- Sandbox execution environments

---

## 📖 Documentation Standards

### Code Documentation

- JSDoc comments for complex functions
- TypeScript interfaces for all types
- README updates for significant changes
- Inline comments for business logic

### Change Documentation

- Update IDEAS.md for future features
- Document breaking changes
- Maintain version history
- Update deployment notes

---

## 🎮 Gaming & Entertainment Features

### Game Integration

- ROM file support for multiple consoles
- Save state management
- Controller support where applicable
- Performance optimization for games

### Media Capabilities

- Video/audio playback
- Image viewing and editing
- PDF rendering
- Flash content via Ruffle

---

## 🌐 Network & External Services

### API Integrations

- Weather service (wttr.in)
- Astronomy Picture of the Day
- Git repositories (isomorphic-git)
- WebAssembly packages (WAPM)

### CORS Handling

- Proxy services for external content
- Iframe sandboxing
- Security headers
- Content validation

---

## 🔁 Upstream Sync Strategy

We are a fork. Upstream daedalOS keeps shipping. To keep NYTEMODE OS healthy:

### Add the upstream remote (one-time)

```bash
git remote add upstream https://github.com/DustinBrett/daedalOS.git
git fetch upstream main
```

### Inspect divergence

```bash
git log --oneline main..upstream/main      # what they have that we don't
git log --oneline upstream/main..main      # what we have that they don't
git merge-base main upstream/main          # last shared commit
```

### Branding files to defend during a sync

These hold NYTEMODE-specific values and should generally win conflicts:

- `utils/constants.ts` — `PACKAGE_DATA` (`alias`, `author`, `description`); `DEFAULT_WALLPAPER = "MATRIX"`
- `pages/_document.tsx` — apple-touch / theme-color / manifest links and `apple-mobile-web-app-title`
- `public/site.webmanifest` — `name`, `short_name`, theme colors
- `public/favicon*`, `public/apple-touch-icon*`, `public/android-chrome-*` — NYTEMODE icon set
- `public/Users/Public/Desktop/{CINDR,OUTWERD.,Snackulator,NYTEMODE}.url` — NYTEMODE-only shortcuts
- `public/System/Icons/{cindr,outwerd,snackulator}_icon*.png` and `pc.webp` — NYTEMODE icons
- Any wallpaper / taskbar color tweak files (Matrix purple `#7c519d`, taskbar off-black/grey)

Accept upstream changes everywhere else by default.

### Recommended cadence

- Quarterly merge / rebase from `upstream/main` if we're keeping the project active.
- Cherry-pick critical security or bug fixes from upstream as needed even between syncs.
- After a sync: full `npm install --legacy-peer-deps`, `npm run build`, smoke-test in dev, deploy to a Vercel preview before promoting.

---

## 🔄 Continuous Integration

### Automated Checks

- ESLint validation
- TypeScript compilation
- Prettier formatting
- Unit test execution
- E2E test runs

### Pre-commit Hooks

- Husky for git hooks
- Lint-staged for staged files
- Automatic formatting
- Import organization

---

## 📚 Learning Resources

### Key Technologies

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **styled-components**: https://styled-components.com/docs
- **BrowserFS**: https://github.com/jvilk/BrowserFS

### Related Projects

- **Original daedalOS**: https://github.com/DustinBrett/daedalOS
- **WebAssembly**: https://webassembly.org/
- **Progressive Web Apps**: https://web.dev/progressive-web-apps/

---

## ⚡ Emergency Procedures

### If Site Goes Down

1. Check Vercel deployment status
2. Verify build logs for errors
3. Rollback to previous deployment if needed
4. Contact via GitHub issues

### Critical Bug Response

1. Immediate hotfix for breaking issues
2. Create emergency branch for fixes
3. Test fix in preview deployment
4. Deploy to production with priority

---

## 📈 Performance Monitoring

### Key Metrics

- Bundle size (target: < 10MB initial)
- First Contentful Paint (target: < 2s)
- Time to Interactive (target: < 3s)
- Core Web Vitals compliance

### Optimization Strategies

- Code splitting by route/component
- Image optimization and WebP conversion
- Web Worker utilization
- Service Worker caching

---

**Last Updated**: 2026-05-03
**Project Status**: Returning from dormancy — re-onboarding (see `CURRENT_TASKS.md`)
**Maintainer**: NYTEMODEONLY
