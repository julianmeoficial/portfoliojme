# Portfolio — Julián Martínez Espitia

Portfolio personal de **Julián Martínez Espitia**, desarrollador frontend y full-stack. Landing single-page con animaciones GSAP, diseño liquid glass, temas dark/light e internacionalización ES/EN.

**Live:** [julianmeoficial.vercel.app](https://julianmeoficial.vercel.app)

## Stack

| Capa | Tecnología |
| ---- | ---------- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, CSS Modules |
| Motion | GSAP 3 + ScrollTrigger + `@gsap/react` |
| Iconos | Heroicons |
| i18n | React Context (ES / EN) |
| Deploy | Vercel |

## Proyectos destacados

| Proyecto | Descripción | Repositorio |
| -------- | ----------- | ----------- |
| **SkyVault** | Catálogo y comparador de aeronaves comerciales con WebSocket y panel de moderación | [skyvault](https://github.com/julianmeoficial/skyvault) |
| **SelanFlow** | Tareas + Pomodoro + simulador FIFO/RR con Gantt y métricas en tiempo real | [SelanFlow](https://github.com/julianmeoficial/SelanFlow) |
| **SkyGate** | Gestión automatizada de gates aeroportuarios con DFA y monitoreo en tiempo real | [SkyGate](https://github.com/julianmeoficial/SkyGate) |
| **ODC Simulator** | Simulador de CPU en Java 21 con caché HIT/MISS y comparativa UMA vs segmentada | [odc-simulator](https://github.com/julianmeoficial/odc-simulator) |
| **RLC Lab** | Simulador interactivo de circuito RLC en AC con EDO, RK4 y casos industriales | [rlc-lab](https://github.com/julianmeoficial/rlc-lab) |
| **Zoro Security** | Case study de MCP server para seguridad y observabilidad (BrevKu) | [BK-OPS-Security-Case-Study](https://github.com/julianmeoficial/BK-OPS-Security-Case-Study) |

## Quick Start

```bash
git clone https://github.com/julianmeoficial/portfoliojme.git
cd portfoliojme
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Descripción |
| ------- | ----------- |
| `npm run dev` | Desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |

## Estructura

```
src/
├── app/              # Layout, página principal, globals.css
├── components/
│   ├── common/       # Navbar, Footer, Skeleton, Spinner
│   └── sections/     # Hero, About, Projects, Skills, Contact
├── data/projects.ts  # Datos de proyectos
└── lib/i18n/         # Traducciones y contexto de idioma
```

## Documentación

| Documento | Contenido |
| --------- | --------- |
| [docs/README.md](docs/README.md) | Índice de documentación |
| [docs/DESIGN.md](docs/DESIGN.md) | Sistema visual y tokens |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura técnica |
| [docs/I18N.md](docs/I18N.md) | Guía de internacionalización |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Convenciones y contribución |
| [AGENTS.md](AGENTS.md) | Reglas para agentes IA |

## Características

- Secciones animadas con GSAP y ScrollTrigger
- Modal de preview de proyectos con galería y skeleton de carga (SkyGate y Zoro Security solo GitHub)
- Tema automático por hora local (light 07:00–19:00) con override manual vía botón sol/luna
- Idioma por defecto inglés; banner de sugerencia ES en regiones hispanohablantes
- Selector de idioma ES/EN en navbar
- Diseño responsive con liquid glass y neumorfismo
- Accesibilidad: focus trap en modales, `prefers-reduced-motion`, landmarks ARIA

## Deploy

**Producción:** [julianmeoficial.vercel.app](https://julianmeoficial.vercel.app) (Vercel, conectado al repo `portfoliojme`).

### Flujo local → producción

```bash
npm run dev      # desarrollo en Mac (no afecta producción)
npm run lint     # verificar antes de subir
npm run build    # simula el build de Vercel
git add … && git commit -m "…" && git push origin main
```

### Build manual local

```bash
npm run build
npm run start    # prueba el build en http://localhost:3000
```

## Autor

**Julián Martínez Espitia** — Ingeniería de Software, Universidad de Cartagena

- GitHub: [@julianmeoficial](https://github.com/julianmeoficial)
- LinkedIn: [julianmeoficial](https://linkedin.com/in/julianmeoficial)
- Email: julianmeoficial@outlook.com

## Licencia

Proyecto personal — todos los derechos reservados...
