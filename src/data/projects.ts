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
            '/screenshots/skyvault-1.webp',
            '/screenshots/skyvault-2.webp',
            '/screenshots/skyvault-3.webp',
            '/screenshots/skyvault-4.webp',
            '/screenshots/skyvault-5.webp',
            '/screenshots/skyvault-6.webp',
            '/screenshots/skyvault-7.webp',
            '/screenshots/skyvault-8.webp',
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
            '/screenshots/selanflow-1.webp',
            '/screenshots/selanflow-2.webp',
            '/screenshots/selanflow-3.webp',
            '/screenshots/selanflow-4.webp',
            '/screenshots/selanflow-5.webp',
            '/screenshots/selanflow-6.webp',
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
];
