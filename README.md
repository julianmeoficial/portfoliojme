# Portfolio — Julián Martínez Espitia

Personal portfolio for **Julián Martínez Espitia**, frontend and full-stack developer. Single-page landing with GSAP animations, liquid glass design, dark/light themes, and Spanish/English internationalisation.

**Live:** [julianmeoficial.vercel.app](https://julianmeoficial.vercel.app)

## Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, CSS Modules |
| Motion | GSAP 3 + ScrollTrigger + `@gsap/react` |
| Icons | Heroicons |
| i18n | React Context (ES / EN) |
| Deploy | Vercel |

## Featured projects

| Project | Description | Repository |
| ------- | ----------- | ---------- |
| **SkyVault** | Interactive commercial aircraft catalogue with WebSocket and moderation panel | [skyvault](https://github.com/julianmeoficial/skyvault) |
| **SelanFlow** | Tasks + Pomodoro + FIFO/RR scheduler with Gantt and live metrics | [SelanFlow](https://github.com/julianmeoficial/SelanFlow) |
| **SkyGate** | Automated airport gate management with DFA and real-time monitoring | [SkyGate](https://github.com/julianmeoficial/SkyGate) |
| **ODC Simulator** | Java 21 CPU simulator with cache HIT/MISS and UMA vs segmented memory comparison | [odc-simulator](https://github.com/julianmeoficial/odc-simulator) |
| **RLC Lab** | Interactive series RLC circuit simulator in AC with ODE, RK4, and industrial cases | [rlc-lab](https://github.com/julianmeoficial/rlc-lab) |
| **Zoro Security** | MCP server case study for security and observability (BrevKu) | [BK-OPS-Security-Case-Study](https://github.com/julianmeoficial/BK-OPS-Security-Case-Study) |

## Quick start

```bash
git clone https://github.com/julianmeoficial/portfoliojme.git
cd portfoliojme
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for scripts, conventions, and the pre-PR checklist.

## Features

- GSAP and ScrollTrigger animated sections
- Project preview modal with gallery and loading skeleton (SkyGate and Zoro Security: GitHub only)
- Automatic theme by local time (light 07:00–19:00) with manual override via sun/moon button
- Default language English; Spanish suggestion banner in Spanish-speaking regions
- ES/EN language selector in navbar
- Responsive design with liquid glass and neumorphism
- Accessibility: focus trap in modals, `prefers-reduced-motion`, ARIA landmarks

## Documentation

Full index: [docs/README.md](docs/README.md)

| Document | Content |
| -------- | ------- |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Setup, conventions, deploy, pre-PR checklist |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture |
| [docs/DESIGN.md](docs/DESIGN.md) | Visual system and tokens |
| [docs/I18N.md](docs/I18N.md) | Internationalisation guide |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Notable changes and fixes |
| [AGENTS.md](AGENTS.md) | AI agent rules |

## Deploy

Production runs on [Vercel](https://vercel.com) from the `main` branch. Before pushing:

```bash
npm run lint
npm run build
git push origin main
```

Details (Git vs `.gitignore`, first deploy, local production test): [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md#deploy-vercel).

## Author

**Julián Martínez Espitia** — Software Engineering, University of Cartagena

- GitHub: [@julianmeoficial](https://github.com/julianmeoficial)
- LinkedIn: [julianmeoficial](https://linkedin.com/in/julianmeoficial)
- Email: julianmeoficial@outlook.com

## Licence

Personal project — all rights reserved.
