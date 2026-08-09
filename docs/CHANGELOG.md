# Changelog

Notable changes to this portfolio. For contribution workflow and conventions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 2026-08

### Fixed

- **Theme auto / toggle** — Local hour now uses `Intl` timezone (aligned with locale detection). Toggle reads DOM instead of stale React state; double-click Navbar sun/moon restores `auto` mode. Hydration flicker on theme icon fixed with mount guard.
- **Language toggle** — Segmented ES/EN control with sliding pill (`transform`) and design-token motion; respects `prefers-reduced-motion`.

### Added

- **Certificates section** — Swipe deck between Skills and Contact. PDFs in `public/certificates/`; metadata in `src/data/certificates.ts`. Each slide pairs meta + PDF preview; click/drag navigation, dots, `PdfLightbox`, verification link, i18n + nav `#certificates`.
- **Certificate categories** — `category` filter (`coursera`, `aws`, `google`, `meta`, `other`) plus optional `description` / `courseCount` for Coursera-style specializations.

### Files touched (Certificates)

| Area | Files |
| ---- | ----- |
| Section UI | `Certificates.tsx`, `Certificates.module.css`, `PdfLightbox.tsx`, `PdfLightbox.module.css`, `formatters.ts`, `index.ts` |
| Data / assets | `src/data/certificates.ts`, `public/certificates/` |
| Integration | `page.tsx`, `Navbar.tsx` |
| i18n | `types.ts`, `en.ts`, `es.ts` |
| Docs | `ARCHITECTURE.md`, `CONTRIBUTING.md`, `AGENTS.md` |

---

## 2026-07

### Added

- **ODC Simulator** — 3 PNG screenshots (`odc-simulator-1..3.png`) in `public/screenshots/`, entry in `projects.ts`.
- **RLC Lab** — 5 PNG screenshots (`rlc-lab-1..5.png`) in `public/screenshots/`, entry in `projects.ts`.
- **Zoro Security** — GitHub-only project card (no preview modal; `screenshots: []`).

### Changed

- **SelanFlow screenshots** — Replaced 6 WebP with 8 PNG (`selanflow-1..8.png`); WebP assets removed.
- **SkyVault screenshots** — Replaced 8 WebP with 16 PNG (`skyvault-1..16.png`); WebP assets removed.
- **Gallery & lightbox UX** — Carousel uses `object-fit: contain` with letterbox; `max-height: min(55vh, 28rem)`. Lightbox: internal controls, `clamp` padding, `object-fit: contain`. Modal body padding tightened around gallery.
- **Skills Tech Stack** — Chips aligned with the author's GitHub README Tech Stack section. Category key `database` renamed to `tools`; labels EN `Backend & Data` / `Tools`, ES `Backend y datos` / `Herramientas`.
- **CV download path** — Fixed 404: About CTA now points to `/cv/Julian_Martinez_Junior_SoftwareEngineer.pdf`.

### Files touched (gallery & lightbox)

| Area | Files |
| ---- | ----- |
| Carousel layout | `ProjectGallery.module.css`, `ImageWithSkeleton.tsx`, `ProjectGallery.tsx` |
| Lightbox | `ImageLightbox.module.css` |
| Modal spacing | `ProjectModal.module.css` |
| Skills | `Skills.tsx`, `types.ts`, `es.ts`, `en.ts` |
| CV | `About.tsx`, `public/cv/` |

---

## 2026-06

### Fixed — project modal interaction

| Issue | Solution | Files |
| ----- | -------- | ----- |
| Frozen modal (`inert` on `<main>` blocked modal inside main) | Portal to `document.body` | `ProjectModal.tsx` |
| Scattered scroll-lock logic | Centralised `useModalLock` hook | `useModalLock.ts` |
| Navbar still clickable under overlay | `modal-open` rule on wrapper and header | `Navbar.module.css` |
| Navbar remained in accessible tree | `aria-hidden` on `#site-navbar` when modal opens | `useModalLock.ts`, `Navbar.tsx` |

### Fixed — focus trap

| Issue | Solution | Files |
| ----- | -------- | ----- |
| Lightbox opened → modal trap returned focus to Preview button | `restoreFocus: false` in `useFocusTrap` | `useFocusTrap.ts`, `ProjectModal.tsx` |
| `offsetParent` filter excluded valid fixed-overlay nodes | Filter by `getClientRects()` + `aria-hidden` | `useFocusTrap.ts` |

### Fixed — ARIA and semantics

| Issue | Solution | Files |
| ----- | -------- | ----- |
| Modal `aria-label` duplicated visible `<h2>` | `aria-labelledby` + `id` on title | `ProjectModal.tsx` |
| Lightbox label mixed close action with content | `aria-labelledby` with `projects.lightbox_label` | `ImageLightbox.tsx` |
| Carousel dots used `tablist/tab` without `tabpanel` | `role="group"` + `aria-current` on buttons | `ProjectGallery.tsx` |
| Slide `<div onClick>` without button role | `<button type="button">` per slide | `ProjectGallery.tsx` |
| No screen-reader announcement for slide changes | `aria-live="polite"` on counter | `ProjectGallery.tsx`, `ImageLightbox.tsx` |
| Hardcoded English `aria-label` values | i18n keys in `common`, `nav`, `footer`, `projects` | `es.ts`, `en.ts`, components |

### Fixed — CSS and tokens

| Issue | Solution | Files |
| ----- | -------- | ----- |
| Undefined tokens (`--glass-bg-hover`, `--glow-accent`, etc.) | Added in dark and light themes | `globals.css` |
| Hardcoded rgba/hex in gallery and lightbox | `--overlay-*` tokens | `globals.css`, `ProjectGallery.module.css`, `ImageLightbox.module.css` |
| No consistent keyboard focus style | `:focus-visible` in globals | `globals.css` |
| Carousel dots below 44px touch target | `min-width/height: 44px` with visual dot in `::after` | `ProjectGallery.module.css` |
| Skeleton collapsed to 0px height | `min-height: 12rem` on wrapper | `ImageWithSkeleton.module.css` |

### Added — gallery and lightbox UX

- Horizontal `scroll-snap` carousel with arrows, dots, and keyboard navigation (`ProjectGallery.tsx`).
- Portalled lightbox (z-index 300) with GSAP (`ImageLightbox.tsx`).
- Escape closes lightbox first, then modal (`ProjectModal.tsx`, `ImageLightbox.tsx`).
- GSAP exit animation before modal unmount (`ProjectModal.tsx`).

### Added — project screenshots

| Project | Assets | Notes |
| ------- | ------ | ----- |
| SkyVault | 8 WebP (`skyvault-1..8.webp`) | Later replaced by PNG in 2026-07 |
| SelanFlow | 6 WebP (`selanflow-1..6.webp`) | Later replaced by PNG in 2026-07 |
| SkyGate | — | GitHub link only (`screenshots: []`) |
