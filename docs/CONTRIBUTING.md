# Contribución

Guía para trabajar en el portfolio de Julián Martínez Espitia.

## Requisitos

- Node.js 18+
- npm (o pnpm/yarn)

## Scripts

| Comando | Descripción |
| ------- | ----------- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción (tras build) |
| `npm run lint` | ESLint |

## Convenciones de código

### TypeScript + React

- Componentes de sección: `'use client'` cuando usan hooks, GSAP o eventos.
- Tipos explícitos en props y exports públicos.
- Un componente por carpeta con `index.ts` barrel opcional.

### CSS Modules

- Un `.module.css` por componente, colocalizado.
- Clases en **camelCase** semánticas (`.cardTitle`, no `.blue-text`).
- Estilos visuales vía tokens CSS (`var(--color-*)`, `var(--space-*)`).
- No hardcodear colores hex en módulos.

### GSAP

- Usar `useGSAP` con `{ scope: ref }` para cleanup automático.
- Respetar `prefersReducedMotion()` de `src/lib/motion/`.
- Animar solo `transform` y `opacity` cuando sea posible.

### i18n

- Nunca texto user-facing hardcoded.
- Actualizar `types.ts`, `es.ts` y `en.ts` en el mismo PR.
- Los `aria-label` también pasan por i18n.

### Modales y capas

- Modales portaleados a `document.body` (fuera de `<main>`).
- `useModalLock` aplica `inert` + `aria-hidden` en `<main>` y `#site-navbar`.
- `html.modal-open` bloquea interacción con la navbar.
- Lightbox renderizado como hermano del modal, no como hijo del `role="dialog"`.

## Añadir un proyecto

1. Añadir screenshots en `public/screenshots/` (formato `.webp` o `.png`).
2. Entrada en `src/data/projects.ts` con descripciones ES/EN.
3. Icono en `PROJECT_ICONS` de `Projects.tsx`.
4. Verificar enlace GitHub y modal de preview.

## Changelog de correcciones (2026-06)

### Modal de proyectos — interacción

| Área | Problema | Solución | Archivos |
| ---- | -------- | -------- | -------- |
| Modal congelado | `inert` en `<main>` bloqueaba el modal renderizado dentro | Portal a `document.body` | `ProjectModal.tsx` |
| Scroll lock | Lógica dispersa | Hook `useModalLock` centralizado | `useModalLock.ts` |
| Navbar activa | `.header` tenía `pointer-events: auto` sobre el wrapper bloqueado | Regla `modal-open` en wrapper **y** header | `Navbar.module.css` |
| Navbar ARIA | Navbar seguía en árbol accesible | `aria-hidden` en `#site-navbar` al abrir modal | `useModalLock.ts`, `Navbar.tsx` |

### Focus trap

| Área | Problema | Solución | Archivos |
| ---- | -------- | -------- | -------- |
| Lightbox | Al abrir lightbox, el trap del modal devolvía foco al botón Preview | Opción `restoreFocus: false` en `useFocusTrap` | `useFocusTrap.ts`, `ProjectModal.tsx` |
| Elementos omitidos | Filtro `offsetParent` excluía nodos válidos en overlays fixed | Filtro por `getClientRects()` + `aria-hidden` | `useFocusTrap.ts` |

### ARIA y semántica

| Área | Problema | Solución | Archivos |
| ---- | -------- | -------- | -------- |
| Dialog modal | `aria-label` duplicaba el `<h2>` visible | `aria-labelledby` + `id` en título | `ProjectModal.tsx` |
| Lightbox | Label mezclaba acción de cierre con contenido | `aria-labelledby` con `projects.lightbox_label` | `ImageLightbox.tsx` |
| Carrusel dots | Patrón `tablist/tab` sin `tabpanel` | `role="group"` + `aria-current` en botones | `ProjectGallery.tsx` |
| Slides | `<div onClick>` sin rol de botón | `<button type="button">` por slide | `ProjectGallery.tsx` |
| Estado slide | Sin anuncio para lectores de pantalla | `aria-live="polite"` en contador | `ProjectGallery.tsx`, `ImageLightbox.tsx` |
| Labels en inglés | `aria-label` hardcoded en varios componentes | Claves i18n en `common`, `nav`, `footer`, `projects` | `es.ts`, `en.ts`, componentes |

### CSS y tokens

| Área | Problema | Solución | Archivos |
| ---- | -------- | -------- | -------- |
| Tokens faltantes | `--glass-bg-hover`, `--glass-border-hover`, `--glow-accent`, `--shadow-md` usados pero no definidos | Añadidos en dark y light | `globals.css` |
| Overlays | rgba/hex hardcoded en gallery y lightbox | Tokens `--overlay-*` | `globals.css`, `ProjectGallery.module.css`, `ImageLightbox.module.css` |
| Focus teclado | Sin estilo global consistente | `:focus-visible` en `globals.css` | `globals.css` |
| Touch targets | Dots del carrusel de 8×8px | `min-width/height: 44px` con punto visual en `::after` | `ProjectGallery.module.css` |
| Placeholders | Skeleton colapsaba a 0px de alto | `min-height: 12rem` en wrapper | `ImageWithSkeleton.module.css` |

### Galería y lightbox (UX)

| Área | Cambio | Archivos |
| ---- | ------ | -------- |
| Carrusel | `scroll-snap` horizontal con flechas, dots y teclado | `ProjectGallery.tsx` |
| Lightbox | Vista ampliada portaleada (z-index 300) con GSAP | `ImageLightbox.tsx` |
| Escape | Cierra lightbox primero, luego modal | `ProjectModal.tsx`, `ImageLightbox.tsx` |
| Salida modal | Animación GSAP antes de desmontar | `ProjectModal.tsx` |

### Screenshots reales (2026-06)

| Área | Cambio | Archivos |
| ---- | ------ | -------- |
| SkyVault | 8 capturas WebP renombradas `skyvault-1..8.webp` | `public/screenshots/`, `projects.ts` |
| SelanFlow | 6 capturas WebP renombradas `selanflow-1..6.webp` | `public/screenshots/`, `projects.ts` |
| SkyGate | Sin preview; solo enlace GitHub (`screenshots: []`) | `projects.ts`, `Projects.tsx` |

### Screenshots nuevos (2026-07)

| Área | Cambio | Archivos |
| ---- | ------ | -------- |
| ODC Simulator | 3 capturas PNG `odc-simulator-1..3.png` | `public/screenshots/`, `projects.ts` |
| RLC Lab | 5 capturas PNG `rlc-lab-1..5.png` | `public/screenshots/`, `projects.ts` |
| Zoro Security | Sin preview; solo enlace GitHub (`screenshots: []`) | `projects.ts`, `Projects.tsx` |

### Preferencias de usuario — tema e idioma

| Key | Valores | Descripción |
| --- | ------- | ----------- |
| `portfolio-theme-mode` | `auto` \| `manual` | `auto` por defecto: light 07:00–19:00 hora local |
| `portfolio-theme` | `light` \| `dark` | Tema guardado cuando el usuario usa el botón sol/luna |
| `portfolio-lang` | `es` \| `en` | Idioma elegido; primera visita sin key → inglés |
| `portfolio-lang-prompt-dismissed` | `true` | Banner de sugerencia ES ya descartado |

- Tema automático: [`src/lib/theme/themeUtils.ts`](../src/lib/theme/themeUtils.ts) + [`useTheme.ts`](../src/lib/theme/useTheme.ts)
- Banner de idioma: [`LanguagePrompt.tsx`](../src/components/common/LanguagePrompt/LanguagePrompt.tsx) + [`localeUtils.ts`](../src/lib/i18n/localeUtils.ts)
- El botón de tema en Navbar **sigue visible**; al usarlo pasa a modo `manual`

## Versionado y deploy (Vercel)

### Qué va a Git vs qué no

| Incluir en Git | Excluir (`.gitignore`) |
| -------------- | ---------------------- |
| `src/`, `public/screenshots/`, `docs/` | `node_modules/` |
| `package.json`, `package-lock.json` | `.next/` |
| Config (`next.config.ts`, `tsconfig.json`) | `.idea/`, `.env*`, `.vercel/` |

Vercel clona el repo, ejecuta `npm install` + `npm run build` y sirve el resultado. Solo lo commiteado en `main` llega a producción.

### Primer deploy

1. `npm run lint` y `npm run build` en local.
2. `git push origin main` con todo el portfolio.
3. [vercel.com](https://vercel.com) → Import → `julianmeoficial/portfoliojme`.
4. Framework Next.js (default). Sin env vars por ahora.
5. Verificar modal, screenshots y i18n en la URL `.vercel.app`.

### Ciclo habitual

`npm run dev` (Mac) → editar → `lint` + `build` → commit → push → deploy automático en Vercel.

## Checklist antes de PR

- [ ] `npm run lint` sin errores
- [ ] `npm run build` exitoso
- [ ] Textos en ES y EN (incluidos aria-labels)
- [ ] Modal: cerrar con X, Escape y backdrop
- [ ] Modal: scroll del body interno funciona
- [ ] Enlace Code abre GitHub en nueva pestaña
- [ ] Carrusel: flechas, dots y swipe
- [ ] Lightbox: clic en imagen abre vista ampliada; Escape cierra lightbox antes que modal
- [ ] Navbar no recibe clics con modal abierto
- [ ] Tab cicla dentro de modal/lightbox sin escapar al fondo
- [ ] `prefers-reduced-motion` verificado
- [ ] Screenshots optimizados (webp o png)
- [ ] Tema auto: light de día / dark de noche sin `localStorage`; botón tema fija modo manual
- [ ] Banner ES: solo en región hispanohablante sin preferencia guardada; dismiss no reaparece
- [ ] Idioma por defecto inglés en primera visita

## Agentes IA

Si usas Cursor o Claude Code, lee [AGENTS.md](../AGENTS.md) antes de modificar el proyecto.
