# Design System — Portfolio JME

Sistema visual del portfolio de Julián Martínez Espitia. Tokens definidos en [`src/app/globals.css`](../src/app/globals.css).

## Dirección estética

- **Tono**: minimalismo refinado con liquid glass y neumorfismo sutil. Referencias: interfaces premium oscuras, tipografía display audaz, motion controlado con GSAP.
- **Diferenciación**: blobs animados en tarjetas, parallax en hero (desktop), revelado tipográfico en About vía ScrollTrigger.
- **Anti-patrón**: evitar estética genérica de IA (Inter/Roboto, gradientes púrpura cliché, layouts predecibles). Ver [AGENTS.md](../AGENTS.md).

## Tipografía

| Rol | Familia | Variable |
| --- | ------- | -------- |
| Display | Cabinet Grotesk | `--font-display` |
| Body | Satoshi | `--font-body` |
| Mono | JetBrains Mono | `--font-mono` |

Escala fluida con `clamp()` (`--text-xs` … `--text-hero`).

## Color y temas

Dos temas vía `data-theme="dark|light"` en `<html>`:

- **Dark**: fondo `#0a0a0b`, texto `#f4f2ec`, glass semitransparente oscuro.
- **Light**: fondo `#f7f5f1`, texto `#18160f`, glass blanco translúcido.

### Tema automático

- Modo `auto` (default): light entre **07:00 y 19:00** hora local; dark el resto.
- El botón sol/luna en Navbar fuerza modo `manual` y respeta la elección del usuario.
- Sin geolocalización: la hora local del navegador define día/noche.

Variables clave:

- Superficies: `--color-bg`, `--color-surface`, `--color-surface-offset`
- Texto: `--color-text`, `--color-text-secondary`, `--color-text-muted`
- Glass: `--glass-bg`, `--glass-border`, `--glass-blur`
- Sombras: `--neu-shadow`, `--shadow-sm`

**Regla**: nunca hardcodear hex en componentes; usar siempre variables CSS.

## Liquid glass

Patrón en tarjetas (Hero, Projects):

1. Contenedor `.liquidContainer` con blobs animados (`@keyframes`).
2. Capa `.cardContent` encima con `position: relative; z-index: 1`.
3. Fondo glass: `backdrop-filter: blur(24px) saturate(180%)`.

Glass denso (`--glass-bg-strong`) en navbar scrolled y modales.

## Espaciado y radio

- Sistema 4px: `--space-1` (4px) … `--space-32` (128px).
- Radios: `--radius-sm` … `--radius-full`.
- Anchos de contenido: `--content-narrow` (640px), `--content-wide` (1280px).

## Motion (GSAP)

- Entrada de secciones: `useGSAP` + `ScrollTrigger` (`once: true`).
- Hero: timeline de entrada + parallax mousemove (solo desktop, desactivado con `prefers-reduced-motion`).
- About: scrub de palabras que se iluminan al scroll.
- Modal: fade overlay + slide-up del panel.

Utilidad: [`src/lib/motion/prefersReducedMotion.ts`](../src/lib/motion/prefersReducedMotion.ts).

## Estados de carga

| Componente | Uso |
| ---------- | --- |
| `Skeleton` | Placeholder con shimmer |
| `Spinner` | Acciones puntuales |
| `ImageWithSkeleton` | Screenshots del modal de proyectos |
| `AppReadyGate` | Splash inicial (~300ms) |
| `app/loading.tsx` | Transiciones de ruta |

## Banner de idioma (`LanguagePrompt`)

- Posición: fijo inferior, centrado, ancho máximo ~32rem.
- Estilo: liquid glass (`--glass-bg-strong`, `--glass-blur`, `--shadow-md`).
- CTA primario: `--color-primary`; secundario: borde glass.
- No bloquea interacción con la página; `role="region"` + `aria-labelledby`.
- Aparece ~350ms tras `AppReadyGate` para no competir con el splash.

## Accesibilidad visual

- Contraste texto legible en ambos temas.
- `:focus-visible` en controles interactivos.
- `prefers-reduced-motion`: animaciones GSAP desactivadas o instantáneas.
- Modales: focus trap, `inert` en `<main>`, Escape para cerrar.
