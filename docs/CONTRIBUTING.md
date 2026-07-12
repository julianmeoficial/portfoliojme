# Contributing

Guide for working on Julián Martínez Espitia's portfolio.

## Requirements

- Node.js 18+
- npm (or pnpm/yarn)

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Development server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Production server (after build) |
| `npm run lint` | ESLint |

## Code conventions

### TypeScript + React

- Section components: `'use client'` when using hooks, GSAP, or events.
- Explicit types on props and public exports.
- One component per folder with optional `index.ts` barrel.

### CSS Modules

- One `.module.css` per component, colocated.
- **camelCase** semantic classes (`.cardTitle`, not `.blue-text`).
- Visual styles via CSS tokens (`var(--color-*)`, `var(--space-*)`).
- Do not hardcode hex colours in modules.

### GSAP

- Use `useGSAP` with `{ scope: ref }` for automatic cleanup.
- Respect `prefersReducedMotion()` from `src/lib/motion/`.
- Animate only `transform` and `opacity` where possible.

### i18n

- Never hardcode user-facing text.
- Update `types.ts`, `es.ts`, and `en.ts` in the same PR.
- `aria-label` attributes also go through i18n.

### Modals and layers

- Modals portalled to `document.body` (outside `<main>`).
- `useModalLock` applies `inert` + `aria-hidden` on `<main>` and `#site-navbar`.
- `html.modal-open` blocks interaction with the navbar.
- Lightbox rendered as a sibling of the modal, not as a child of `role="dialog"`.

## Adding a project

1. Add screenshots in `public/screenshots/` named `{id}-{n}.webp` or `{id}-{n}.png`.
2. Entry in `src/data/projects.ts` with ES/EN descriptions and screenshot paths.
3. Icon in `PROJECT_ICONS` in `Projects.tsx`.
4. Verify GitHub link and preview modal (gallery `contain` + lightbox).
5. If the author's GitHub README Tech Stack changes, update `SKILL_CATEGORIES` in `Skills.tsx` and i18n labels if needed.

## Fix changelog (2026-06)

### Project modal — interaction

| Area | Issue | Solution | Files |
| ---- | ----- | -------- | ----- |
| Frozen modal | `inert` on `<main>` blocked the modal rendered inside | Portal to `document.body` | `ProjectModal.tsx` |
| Scroll lock | Scattered logic | Centralised `useModalLock` hook | `useModalLock.ts` |
| Active navbar | `.header` had `pointer-events: auto` over the blocked wrapper | `modal-open` rule on wrapper **and** header | `Navbar.module.css` |
| Navbar ARIA | Navbar remained in accessible tree | `aria-hidden` on `#site-navbar` when modal opens | `useModalLock.ts`, `Navbar.tsx` |

### Focus trap

| Area | Issue | Solution | Files |
| ---- | ----- | -------- | ----- |
| Lightbox | Opening lightbox, modal trap returned focus to Preview button | `restoreFocus: false` option in `useFocusTrap` | `useFocusTrap.ts`, `ProjectModal.tsx` |
| Omitted elements | `offsetParent` filter excluded valid nodes in fixed overlays | Filter by `getClientRects()` + `aria-hidden` | `useFocusTrap.ts` |

### ARIA and semantics

| Area | Issue | Solution | Files |
| ---- | ----- | -------- | ----- |
| Modal dialog | `aria-label` duplicated visible `<h2>` | `aria-labelledby` + `id` on title | `ProjectModal.tsx` |
| Lightbox | Label mixed close action with content | `aria-labelledby` with `projects.lightbox_label` | `ImageLightbox.tsx` |
| Carousel dots | `tablist/tab` pattern without `tabpanel` | `role="group"` + `aria-current` on buttons | `ProjectGallery.tsx` |
| Slides | `<div onClick>` without button role | `<button type="button">` per slide | `ProjectGallery.tsx` |
| Slide state | No announcement for screen readers | `aria-live="polite"` on counter | `ProjectGallery.tsx`, `ImageLightbox.tsx` |
| English labels | Hardcoded `aria-label` in several components | i18n keys in `common`, `nav`, `footer`, `projects` | `es.ts`, `en.ts`, components |

### CSS and tokens

| Area | Issue | Solution | Files |
| ---- | ----- | -------- | ----- |
| Missing tokens | `--glass-bg-hover`, `--glass-border-hover`, `--glow-accent`, `--shadow-md` used but undefined | Added in dark and light | `globals.css` |
| Overlays | Hardcoded rgba/hex in gallery and lightbox | `--overlay-*` tokens | `globals.css`, `ProjectGallery.module.css`, `ImageLightbox.module.css` |
| Keyboard focus | No consistent global style | `:focus-visible` in `globals.css` | `globals.css` |
| Touch targets | Carousel dots at 8×8px | `min-width/height: 44px` with visual dot in `::after` | `ProjectGallery.module.css` |
| Placeholders | Skeleton collapsed to 0px height | `min-height: 12rem` on wrapper | `ImageWithSkeleton.module.css` |

### Gallery and lightbox (UX)

| Area | Change | Files |
| ---- | ------ | ----- |
| Carousel | Horizontal `scroll-snap` with arrows, dots, and keyboard | `ProjectGallery.tsx` |
| Lightbox | Portalled expanded view (z-index 300) with GSAP | `ImageLightbox.tsx` |
| Escape | Closes lightbox first, then modal | `ProjectModal.tsx`, `ImageLightbox.tsx` |
| Modal exit | GSAP animation before unmount | `ProjectModal.tsx` |

### Real screenshots (2026-06)

| Area | Change | Files |
| ---- | ------ | ----- |
| SkyVault | 8 WebP screenshots renamed `skyvault-1..8.webp` | `public/screenshots/`, `projects.ts` |
| SelanFlow | 6 WebP screenshots renamed `selanflow-1..6.webp` | `public/screenshots/`, `projects.ts` |
| SkyGate | No preview; GitHub link only (`screenshots: []`) | `projects.ts`, `Projects.tsx` |

### New screenshots (2026-07)

| Area | Change | Files |
| ---- | ------ | ----- |
| ODC Simulator | 3 PNG screenshots `odc-simulator-1..3.png` | `public/screenshots/`, `projects.ts` |
| RLC Lab | 5 PNG screenshots `rlc-lab-1..5.png` | `public/screenshots/`, `projects.ts` |
| Zoro Security | No preview; GitHub link only (`screenshots: []`) | `projects.ts`, `Projects.tsx` |
| SelanFlow | Replacement: 6 WebP → 8 PNG `selanflow-1..8.png` (WebP removed) | `public/screenshots/`, `projects.ts` |
| SkyVault | Replacement: 8 WebP → 16 PNG `skyvault-1..16.png` (WebP removed) | `public/screenshots/`, `projects.ts` |

### Gallery and lightbox — full image (2026-07)

| Area | Change | Files |
| ---- | ------ | ----- |
| Carousel | `object-fit: contain` + letterbox; `max-height: min(55vh, 28rem)` | `ProjectGallery.module.css` |
| Wrapper | `wrapperClassName` on `ImageWithSkeleton` to centre screenshots | `ImageWithSkeleton.tsx`, `ProjectGallery.tsx` |
| Lightbox | Internal controls (close/nav/counter); `clamp` padding; `object-fit: contain` | `ImageLightbox.module.css` |
| Modal body | More compact padding around gallery | `ProjectModal.module.css` |

### Skills — Tech Stack from README (2026-07)

Source: Tech Stack section of the author's GitHub README. Chips not localised; categories via i18n.

| Key | Chips |
| --- | ----- |
| `languages` | Java, TypeScript, JavaScript, Kotlin, Swift |
| `frontend` | React, Next.js, Vite, HTML, CSS, Tailwind, GSAP |
| `backend` | Spring Boot, PostgreSQL, Supabase, Prisma, WebSocket, JWT, REST APIs |
| `tools` | Git, GitHub, Vercel, Figma, Maven, Gradle |

- i18n key `categories.database` renamed to `categories.tools`
- Labels: EN `Backend & Data` / `Tools`; ES `Backend y datos` / `Herramientas`
- Files: `Skills.tsx`, `types.ts`, `es.ts`, `en.ts`

### User preferences — theme and language

| Key | Values | Description |
| --- | ------ | ----------- |
| `portfolio-theme-mode` | `auto` \| `manual` | `auto` by default: light 07:00–19:00 local time |
| `portfolio-theme` | `light` \| `dark` | Theme stored when user uses sun/moon button |
| `portfolio-lang` | `es` \| `en` | Selected language; first visit without key → English |
| `portfolio-lang-prompt-dismissed` | `true` | Spanish suggestion banner already dismissed |

- Automatic theme: [`src/lib/theme/themeUtils.ts`](../src/lib/theme/themeUtils.ts) + [`useTheme.ts`](../src/lib/theme/useTheme.ts)
- Language banner: [`LanguagePrompt.tsx`](../src/components/common/LanguagePrompt/LanguagePrompt.tsx) + [`localeUtils.ts`](../src/lib/i18n/localeUtils.ts)
- Theme button in Navbar **remains visible**; using it switches to `manual` mode

## Versioning and deploy (Vercel)

### What goes in Git vs what does not

| Include in Git | Exclude (`.gitignore`) |
| -------------- | ---------------------- |
| `src/`, `public/screenshots/`, `docs/` | `node_modules/` |
| `package.json`, `package-lock.json` | `.next/` |
| Config (`next.config.ts`, `tsconfig.json`) | `.idea/`, `.env*`, `.vercel/` |

Vercel clones the repo, runs `npm install` + `npm run build`, and serves the result. Only what is committed to `main` reaches production.

### First deploy

1. `npm run lint` and `npm run build` locally.
2. `git push origin main` with the full portfolio.
3. [vercel.com](https://vercel.com) → Import → `julianmeoficial/portfoliojme`.
4. Next.js framework (default). No env vars for now.
5. Verify modal, screenshots, and i18n on the `.vercel.app` URL.

### Typical cycle

`npm run dev` (Mac) → edit → `lint` + `build` → commit → push → automatic deploy on Vercel.

## Pre-PR checklist

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` succeeds
- [ ] Text in ES and EN (including aria-labels)
- [ ] Modal: close with X, Escape, and backdrop
- [ ] Modal: internal body scroll works
- [ ] Code link opens GitHub in a new tab
- [ ] Carousel: arrows, dots, and swipe
- [ ] Lightbox: click on image opens expanded view; Escape closes lightbox before modal
- [ ] Navbar does not receive clicks with modal open
- [ ] Tab cycles within modal/lightbox without escaping to background
- [ ] `prefers-reduced-motion` verified
- [ ] Screenshots optimised (webp or png)
- [ ] Auto theme: light by day / dark by night without `localStorage`; theme button fixes manual mode
- [ ] ES banner: only in Spanish-speaking region without stored preference; dismiss does not reappear
- [ ] Default language English on first visit

## AI agents

If you use Cursor or Claude Code, read [AGENTS.md](../AGENTS.md) before modifying the project.
