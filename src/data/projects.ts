import type { Language } from '@/lib/i18n/types';

export interface Project {
    id: string;
    title: string;
    description: Record<Language, string>;
    stack: string[];
    githubUrl: string;
    demoUrl?: string;
    screenshots: string[];
    color: string;
}

export const projects: Project[] = [
    {
        id: 'skyvault',
        title: 'SkyVault',
        description: {
            es: 'Catálogo interactivo de aeronaves comerciales con comparador técnico, panel de usuario, moderación de incidencias y notificaciones en tiempo real vía WebSocket.',
            en: 'Interactive commercial aircraft catalog with technical comparison, user dashboard, incident moderation, and real-time notifications via WebSocket.',
        },
        stack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'GSAP', 'WebSocket'],
        githubUrl: 'https://github.com/julianmeoficial/skyvault',
        screenshots: [
            '/screenshots/skyvault-1.png',
            '/screenshots/skyvault-2.png',
            '/screenshots/skyvault-3.png',
            '/screenshots/skyvault-4.png',
            '/screenshots/skyvault-5.png',
            '/screenshots/skyvault-6.png',
            '/screenshots/skyvault-7.png',
            '/screenshots/skyvault-8.png',
            '/screenshots/skyvault-9.png',
            '/screenshots/skyvault-10.png',
            '/screenshots/skyvault-11.png',
            '/screenshots/skyvault-12.png',
            '/screenshots/skyvault-13.png',
            '/screenshots/skyvault-14.png',
            '/screenshots/skyvault-15.png',
            '/screenshots/skyvault-16.png',
        ],
        color: '#3b82f6',
    },
    {
        id: 'selanflow',
        title: 'SelanFlow',
        description: {
            es: 'App full-stack que une gestión de tareas, Pomodoro y simulador de scheduling de SO (FIFO vs Round Robin) con visualización de colas, Gantt y métricas en tiempo real.',
            en: 'Full-stack app combining task management, Pomodoro, and OS scheduling simulation (FIFO vs Round Robin) with queue, Gantt, and real-time metrics visualization.',
        },
        stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Prisma', 'GSAP'],
        githubUrl: 'https://github.com/julianmeoficial/SelanFlow',
        screenshots: [
            '/screenshots/selanflow-1.png',
            '/screenshots/selanflow-2.png',
            '/screenshots/selanflow-3.png',
            '/screenshots/selanflow-4.png',
            '/screenshots/selanflow-5.png',
            '/screenshots/selanflow-6.png',
            '/screenshots/selanflow-7.png',
            '/screenshots/selanflow-8.png',
        ],
        color: '#6366f1',
    },
    {
        id: 'skygate',
        title: 'SkyGate',
        description: {
            es: 'Sistema de gestión automatizada de gates aeroportuarios basado en un autómata finito determinista (DFA). Asignación dinámica de gates, colas de espera y monitoreo en tiempo real.',
            en: 'Automated airport gate management system based on a Deterministic Finite Automaton (DFA). Dynamic gate allocation, waiting queues, and real-time monitoring.',
        },
        stack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'Tailwind CSS'],
        githubUrl: 'https://github.com/julianmeoficial/SkyGate',
        screenshots: [],
        color: '#8b5cf6',
    },
    {
        id: 'odc-simulator',
        title: 'ODC Simulator',
        description: {
            es: 'Simulador de CPU en Java 21 (CLI) que modela el ciclo fetch–decode–execute, caché HIT/MISS y compara memoria unificada (UMA) vs segmentada con penalización PCIe. Determinista y reproducible.',
            en: 'Java 21 CLI CPU simulator modeling the fetch–decode–execute cycle, cache HIT/MISS events, and unified (UMA) vs segmented memory with PCIe penalty. Deterministic and reproducible.',
        },
        stack: ['Java 21', 'Maven', 'JUnit 5'],
        githubUrl: 'https://github.com/julianmeoficial/odc-simulator',
        screenshots: [
            '/screenshots/odc-simulator-1.png',
            '/screenshots/odc-simulator-2.png',
            '/screenshots/odc-simulator-3.png',
        ],
        color: '#f59e0b',
    },
    {
        id: 'rlc-lab',
        title: 'RLC Lab',
        description: {
            es: 'App web Next.js que modela un circuito RLC serie en AC, resuelve la EDO con Runge–Kutta 4, visualiza impedancia, fasores y régimen de amortiguamiento, y conecta el modelo con cinco casos industriales.',
            en: 'Next.js web app modeling a series RLC circuit in AC, solving the ODE with Runge–Kutta 4, visualizing impedance, phasors, and damping regime, and linking the model to five real-world industrial cases.',
        },
        stack: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Recharts', 'KaTeX'],
        githubUrl: 'https://github.com/julianmeoficial/rlc-lab',
        screenshots: [
            '/screenshots/rlc-lab-1.png',
            '/screenshots/rlc-lab-2.png',
            '/screenshots/rlc-lab-3.png',
            '/screenshots/rlc-lab-4.png',
            '/screenshots/rlc-lab-5.png',
        ],
        color: '#10b981',
    },
    {
        id: 'bk-ops-security',
        title: 'Zoro Security',
        description: {
            es: 'Case study documental de un MCP server para BrevKu que orquesta escaneos de seguridad y observabilidad vía GitHub Actions y Cloudflare Workers, con 17 tools, sincronización Notion y agentes IA — sin UI propia.',
            en: 'Documentary case study of an MCP server for BrevKu that orchestrates security scans and observability via GitHub Actions and Cloudflare Workers, with 17 tools, Notion sync, and AI agents — no dedicated UI.',
        },
        stack: ['TypeScript', 'MCP', 'Cloudflare Workers', 'GitHub Actions', 'Notion', 'Zod'],
        githubUrl: 'https://github.com/julianmeoficial/BK-OPS-Security-Case-Study',
        screenshots: [],
        color: '#ef4444',
    },
];
