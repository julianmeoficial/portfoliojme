# Claude Code Instructions

This repository uses a single source of truth for AI agent rules.

**Read and follow [AGENTS.md](AGENTS.md) before writing or modifying any code.**

Key expectations:

- Next.js 16 App Router conventions (see the breaking-changes notice in AGENTS.md)
- CSS Modules + design tokens from `globals.css` (no hardcoded colors)
- GSAP via `useGSAP`, with `prefers-reduced-motion` support
- All user-facing UI text through i18n (`es.ts` + `en.ts`)
- Accessibility: focus traps, landmarks, descriptive labels

Do not duplicate rules here. Update AGENTS.md when agent conventions change.
