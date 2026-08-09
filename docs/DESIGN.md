# Design system — Portfolio JME

Visual system for Julián Martínez Espitia's portfolio. Tokens defined in [`src/app/globals.css`](../src/app/globals.css).

For agent coding rules (tokens, anti-patterns), see [AGENTS.md](../AGENTS.md).

## Aesthetic direction

- **Tone**: refined minimalism with liquid glass and subtle neumorphism. References: premium dark interfaces, bold display typography, GSAP-controlled motion.
- **Differentiation**: animated blobs on cards, hero parallax (desktop), typographic reveal in About via ScrollTrigger.
- **Anti-pattern**: avoid generic AI aesthetics (Inter/Roboto, clichéd purple gradients, predictable layouts). See [AGENTS.md](../AGENTS.md).

## Typography

| Role | Family | Variable |
| ---- | ------ | -------- |
| Display | Cabinet Grotesk | `--font-display` |
| Body | Satoshi | `--font-body` |
| Mono | JetBrains Mono | `--font-mono` |

Fluid scale with `clamp()` (`--text-xs` … `--text-hero`).

## Colour and themes

Two themes via `data-theme="dark|light"` on `<html>`:

- **Dark**: background `#0a0a0b`, text `#f4f2ec`, dark semi-transparent glass.
- **Light**: background `#f7f5f1`, text `#18160f`, translucent white glass.

### Automatic theme

- `auto` mode (default): light between **07:00 and 19:00** local time; dark otherwise.
- Local hour is derived via `Intl.DateTimeFormat().resolvedOptions().timeZone` (same pattern as locale detection).
- Sun/moon button in Navbar forces `manual` mode and respects the user's choice; double-click restores `auto`.
- No geolocation: browser-reported timezone defines day/night.

Key variables:

- Surfaces: `--color-bg`, `--color-surface`, `--color-surface-offset`
- Text: `--color-text`, `--color-text-secondary`, `--color-text-muted`
- Glass: `--glass-bg`, `--glass-border`, `--glass-blur`
- Shadows: `--neu-shadow`, `--shadow-sm`

**Rule**: never hardcode hex values in components; always use CSS variables.

## Liquid glass

Pattern on cards (Hero, Projects):

1. `.liquidContainer` wrapper with animated blobs (`@keyframes`).
2. `.cardContent` layer on top with `position: relative; z-index: 1`.
3. Glass background: `backdrop-filter: blur(24px) saturate(180%)`.

Dense glass (`--glass-bg-strong`) on scrolled navbar and modals.

## Spacing and radius

- 4px system: `--space-1` (4px) … `--space-32` (128px).
- Radii: `--radius-sm` … `--radius-full`.
- Content widths: `--content-narrow` (640px), `--content-wide` (1280px).

## Motion (GSAP)

- Section entry: `useGSAP` + `ScrollTrigger` (`once: true`).
- Hero: entry timeline + mousemove parallax (desktop only, disabled with `prefers-reduced-motion`).
- About: word scrub that illuminates on scroll.
- Modal: overlay fade + panel slide-up.

Utility: [`src/lib/motion/prefersReducedMotion.ts`](../src/lib/motion/prefersReducedMotion.ts).

## Loading states

| Component | Use |
| --------- | --- |
| `Skeleton` | Shimmer placeholder |
| `Spinner` | Point-in-time actions |
| `ImageWithSkeleton` | Project modal screenshots |
| `AppReadyGate` | Initial splash (~300ms) |
| `app/loading.tsx` | Route transitions |

## Language banner (`LanguagePrompt`)

- Position: fixed bottom, centred, max width ~32rem.
- Style: liquid glass (`--glass-bg-strong`, `--glass-blur`, `--shadow-md`).
- Primary CTA: `--color-primary`; secondary: glass border.
- Does not block page interaction; `role="region"` + `aria-labelledby`.
- Appears ~350ms after `AppReadyGate` to avoid competing with the splash.

## Visual accessibility

- Readable text contrast in both themes.
- `:focus-visible` on interactive controls.
- `prefers-reduced-motion`: GSAP animations disabled or instant.
- Modals: focus trap, `inert` on `<main>`, Escape to close.
