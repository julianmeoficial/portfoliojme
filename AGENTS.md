# Portfolio JME — Agent Rules

Project documentation: [README.md](README.md) · [docs/](docs/README.md)

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Stack and structure

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, CSS Modules |
| Motion | GSAP 3 + ScrollTrigger + `@gsap/react` |
| i18n | React Context (`src/lib/i18n/`) |
| Data | `src/data/projects.ts` (static) |

```
src/
├── app/                  # layout, page, globals.css, loading.tsx
├── components/common/    # Navbar, Footer, Skeleton, Spinner, ImageWithSkeleton
├── components/sections/  # Hero, About, Projects, Skills, Contact
├── data/                 # projects.ts
└── lib/i18n/             # LanguageContext, es.ts, en.ts, types.ts
```

---

## Design thinking (before coding UI)

Before implementing visual changes, commit to the portfolio's aesthetic direction:

- **Tone**: refined minimalism with liquid glass and subtle neumorphism. Bold display typography (Cabinet Grotesk + Satoshi). Controlled motion, not decorative.
- **Hierarchy through light, not fill**: hairline borders + semi-transparent glass replace heavy shadows.
- **Intentional colour**: warm neutral palette in dark/light modes. Per-project accents (`--project-color`), not generic purple gradients.
- **Differentiation**: animated blobs, hero parallax, typographic reveal in About. Restraint executed with precision.

If the brief is ambiguous, propose **one variation** within the existing system; do not reinvent the visual language per request.

### frontend_aesthetics

> NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), clichéd colour schemes (particularly purple gradients on white or dark backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character. Use distinctive fonts (Cabinet Grotesk, Satoshi), cohesive CSS variable tokens, and GSAP animations for high-impact moments.

---

## CSS tokens (required)

All visual values come from variables in [`src/app/globals.css`](src/app/globals.css). **Never hardcode** hex values, spacing px, or easing in components.

| Category | Prefix | Example |
| -------- | ------ | ------- |
| Color | `--color-*` | `--color-text`, `--color-surface` |
| Glass | `--glass-*` | `--glass-bg`, `--glass-blur` |
| Typography | `--font-*`, `--text-*` | `--font-display`, `--text-xl` |
| Spacing | `--space-*` | `--space-6` |
| Radius | `--radius-*` | `--radius-2xl` |
| Motion | `--transition-*`, `--ease-*` | `--transition-base` |

Themes: `data-theme="dark|light"` on `<html>`. Auto mode (default): light 07:00–19:00 local time, dark otherwise. User toggle sets `portfolio-theme-mode` to `manual` and persists `portfolio-theme`. Utilities: `src/lib/theme/themeUtils.ts`, `useTheme.ts`.

---

## GSAP and motion

- Use `useGSAP` with `{ scope: ref }` for automatic cleanup.
- Register plugins: `ScrollTrigger`, `useGSAP` inside `typeof window !== 'undefined'`.
- Prefer animating `transform` and `opacity` — never `width`, `height`, `top`, or `left`.
- Respect `prefers-reduced-motion`: use `prefersReducedMotion()` and `getMotionDuration()` from `src/lib/motion/`.
- Parallax mousemove on desktop only, and only when reduced motion is off.
- Do not mix CSS transitions with GSAP on the same property.

---

## i18n (required)

The site supports Spanish and English for **user-facing UI**. Agent-facing docs and code comments in this repo stay in English.

- **Never** hardcode user-facing text in components.
- Add keys in `types.ts`, then update `es.ts` and `en.ts` as a pair.
- Use `const { t, language } = useLanguage()` in client components.
- Aria-labels, error messages, and loading states also go through i18n (`common.*`).
- Default on first visit: **English** (no `portfolio-lang` in storage).
- Persistence: `portfolio-lang`, `portfolio-lang-prompt-dismissed`.
- Spanish suggestion banner: `LanguagePrompt` + `localeUtils.detectSpanishRegion()`.
- Expose `setLanguage()` and `toggleLanguage()` from `useLanguage()`.
- Do not auto-switch to Spanish on init without user action or banner accept.

See [docs/I18N.md](docs/I18N.md).

---

## CSS Modules

- One `.module.css` per component, colocated with the component file.
- **camelCase** semantic class names: `.cardTitle`, `.modalHeader`.
- State via conditional classes or `data-*` attributes.
- Compose global utilities (`.glass`) in JSX alongside the module class.
- Do not use `:global()` except for utilities documented in `globals.css`.

---

## Accessibility

- Visible focus on all controls (`:focus-visible`).
- Modals: `role="dialog"`, `aria-modal`, focus trap (`useFocusTrap`), `inert` on `<main>`, Escape to close, return focus to trigger.
- Mobile menu: block body scroll, Escape to close, `aria-expanded`.
- Landmarks: `<nav>`, `<main>`, `<footer>`, `<section>` with ids for anchors.
- Images: descriptive `alt`; skeletons with `aria-busy` / `role="status"`.
- Never signal state with colour alone.

---

## Loading states

| Component | When to use |
| --------- | ----------- |
| `Skeleton` | Structured content (gallery, routes) |
| `Spinner` | Point-in-time button actions |
| `ImageWithSkeleton` | Project modal screenshots |
| `AppReadyGate` | Initial splash (~300ms, disabled with reduced motion) |

Thresholds: nothing visible under 200ms; skeleton for slow content; actionable error message if loading fails.

---

## Project data

Edit only [`src/data/projects.ts`](src/data/projects.ts):

- Bilingual descriptions (`Record<Language, string>`)
- Correct GitHub links (case-sensitive)
- Screenshots in `public/screenshots/` (`.webp` or `.png`)
- Matching icon in `PROJECT_ICONS` in `Projects.tsx`

Current projects: **SkyVault**, **SelanFlow**, **SkyGate**, **ODC Simulator**, **RLC Lab**, **Zoro Security**.

---

## Anti-patterns (do NOT)

- Hardcode colours or spacing instead of CSS tokens
- Visible text without going through i18n
- Animate layout properties with GSAP
- Ignore `prefers-reduced-motion`
- Generic AI-slop aesthetics (Inter, purple gradients, glass card grids)
- Modals without focus trap or Escape handling
- Read `localStorage` or `window` during render (only in `useEffect` or inline script in layout)
- Over-engineering: one-line helpers, premature abstractions

---

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```

## Extended documentation

| Doc | Content |
| --- | ------- |
| [docs/DESIGN.md](docs/DESIGN.md) | Visual system |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture |
| [docs/I18N.md](docs/I18N.md) | Internationalisation |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Conventions |

## Cursor Cloud specific instructions

- Single static Next.js 16 app (no backend, database, or environment variables). Nothing extra needs to run to develop or test end to end.
- Dependencies are refreshed automatically on VM startup (`npm install`). Standard commands are in the Commands section above (`npm run dev`, `npm run build`, `npm run lint`).
- `npm run dev` serves on port 3000 (Turbopack). It is the primary way to exercise the app; there are no automated tests in this repo, so verify UI changes manually against the running dev server.

