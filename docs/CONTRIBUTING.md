# Contributing

Guide for working on Julián Martínez Espitia's portfolio. For AI agent rules, see [AGENTS.md](../AGENTS.md).

## Documentation map

| Document | Purpose |
| -------- | ------- |
| [README.md](../README.md) | Project overview, quick start, featured projects |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Repository layout, rendering flow, themes, deploy target |
| [DESIGN.md](DESIGN.md) | Visual tokens, typography, liquid glass, motion |
| [I18N.md](I18N.md) | Translations, language banner, persistence keys |
| [CHANGELOG.md](CHANGELOG.md) | Historical fixes and feature additions |
| [AGENTS.md](../AGENTS.md) | Rules for Cursor / Claude Code agents |

## Requirements

- **Node.js** 18.18+ (20+ recommended)
- **npm** — this repo uses `package-lock.json`; install with `npm install`

## Setup

```bash
git clone https://github.com/julianmeoficial/portfoliojme.git
cd portfoliojme
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Development server (Turbopack, port 3000) |
| `npm run build` | Production build |
| `npm run start` | Production server (run after build) |
| `npm run lint` | ESLint |

There are no automated tests; verify UI changes manually against the dev server.

## Code conventions

Follow existing patterns in the codebase. Detailed rules live in the docs below — avoid duplicating them here.

| Topic | Where to read |
| ----- | ------------- |
| TypeScript, React, folder layout | [ARCHITECTURE.md](ARCHITECTURE.md) |
| CSS Modules and design tokens | [DESIGN.md](DESIGN.md), [AGENTS.md](../AGENTS.md) |
| GSAP and reduced motion | [DESIGN.md](DESIGN.md) (Motion), [AGENTS.md](../AGENTS.md) |
| Internationalisation | [I18N.md](I18N.md) |
| Accessibility, modals, focus trap | [AGENTS.md](../AGENTS.md) (Accessibility) |

**Quick reminders:**

- Section components use `'use client'` when they need hooks, GSAP, or events.
- One `.module.css` per component, colocated; **camelCase** class names.
- Never hardcode user-facing text — update `types.ts`, `es.ts`, and `en.ts` together.
- Modals portal to `document.body`; `useModalLock` applies `inert` + `aria-hidden` on `<main>` and `#site-navbar`.

## Adding a project

1. Add screenshots in `public/screenshots/` named `{id}-{n}.webp` or `{id}-{n}.png`.
2. Add an entry in [`src/data/projects.ts`](../src/data/projects.ts) with ES/EN descriptions and screenshot paths.
3. Register the icon in `PROJECT_ICONS` in [`Projects.tsx`](../src/components/sections/Projects/Projects.tsx).
4. Verify the GitHub link (case-sensitive) and preview modal (gallery `contain` + lightbox).
5. If the author's GitHub README Tech Stack changes, update `SKILL_CATEGORIES` in [`Skills.tsx`](../src/components/sections/Skills/Skills.tsx) and i18n labels.

Projects without screenshots (GitHub only): set `screenshots: []` — see SkyGate and Zoro Security in `projects.ts`.

## Adding a certificate

1. Add the PDF in `public/certificates/` (e.g. `{id}.pdf`).
2. Add an entry in [`src/data/certificates.ts`](../src/data/certificates.ts) with `title`, `issuer`, `category` (`coursera` | `aws` | `google` | `meta` | `other`), `pdf` path (`/certificates/...`), and `verificationUrl`.
3. Optionally set `issuedAt` (e.g. `2025-06`).
4. For Coursera specializations / multi-course credentials: set bilingual `description` and `courseCount`.
5. Verify category filters, swipe/click navigation, PDF preview, Expand lightbox, open-PDF fallback, and verification link in the Certificates section.

While `certificates` is `[]`, the section shows an empty state (nav link remains available).

## CV download

- PDF path: `public/cv/Julian_Martinez_Junior_SoftwareEngineer.pdf`
- About CTA links to `/cv/Julian_Martinez_Junior_SoftwareEngineer.pdf` with a `download` filename attribute.
- To replace the CV, overwrite the PDF or update `href` / `download` in [`About.tsx`](../src/components/sections/About/About.tsx).

## User preferences (`localStorage`)

| Key | Values | Description |
| --- | ------ | ----------- |
| `portfolio-theme-mode` | `auto` \| `manual` | Default `auto`: light 07:00–19:00 local time |
| `portfolio-theme` | `light` \| `dark` | Stored when user toggles sun/moon in Navbar |
| `portfolio-lang` | `es` \| `en` | Selected language; absent on first visit → English |
| `portfolio-lang-prompt-dismissed` | `true` | Spanish suggestion banner dismissed |

Implementation: [`themeUtils.ts`](../src/lib/theme/themeUtils.ts), [`useTheme.ts`](../src/lib/theme/useTheme.ts), [`LanguagePrompt.tsx`](../src/components/common/LanguagePrompt/LanguagePrompt.tsx), [`localeUtils.ts`](../src/lib/i18n/localeUtils.ts).

## Deploy (Vercel)

**Production:** [julianmeoficial.vercel.app](https://julianmeoficial.vercel.app)

### What belongs in Git

| Include | Exclude (`.gitignore`) |
| ------- | ---------------------- |
| `src/`, `public/`, `docs/` | `node_modules/`, `.next/` |
| `package.json`, `package-lock.json` | `.env*`, `.vercel/`, `.idea/` |

Vercel runs `npm install` + `npm run build` on each push to `main`. Only committed files reach production.

### Typical workflow

```bash
npm run dev       # local development
npm run lint      # before pushing
npm run build     # simulates Vercel build
git add … && git commit -m "…" && git push origin main
```

### First deploy checklist

1. `npm run lint` and `npm run build` pass locally.
2. Push the full portfolio to `main`.
3. [vercel.com](https://vercel.com) → Import → `julianmeoficial/portfoliojme` (Next.js preset, no env vars required).
4. Verify modal, screenshots, and i18n on the `.vercel.app` URL.

## Pre-PR checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] User-facing text updated in ES and EN (including `aria-label`s)
- [ ] Modal: close with X, Escape, and backdrop; body scroll works
- [ ] Code link opens GitHub in a new tab
- [ ] Carousel: arrows, dots, swipe; lightbox opens on slide click
- [ ] Escape closes lightbox before modal
- [ ] Navbar does not receive clicks while modal is open
- [ ] Tab cycles within modal/lightbox only
- [ ] `prefers-reduced-motion` respected
- [ ] Screenshots optimised (WebP or PNG)
- [ ] Auto theme: light by day / dark by night; manual toggle persists
- [ ] Spanish banner: region-only, dismiss does not reappear
- [ ] Default language English on first visit
- [ ] CV download from About returns the PDF

## Changelog

Past fixes and additions are recorded in [CHANGELOG.md](CHANGELOG.md).
