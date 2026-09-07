import type { Language } from '@/lib/i18n/types';

/**
 * Certificate showcase data.
 *
 * 1. Place the PDF in `public/certificates/` (e.g. `course-name.pdf`).
 * 2. Add an entry below with matching `pdf` path, `verificationUrl`, `category`, and `track`.
 *
 * For Coursera specializations, fill `description` (ES/EN) and `courseCount`
 * (how many courses you completed to earn the credential).
 *
 * Display order is computed by `sortCertificates` (not array order):
 * track `it` → `language` → `other`, then newest `issuedAt` first.
 * The UI does not expose track — visitors only swipe the ordered deck.
 *
 * The Certificates section renders an empty state while this array is empty.
 *
 * @example
 * {
 *   id: 'google-ux-design',
 *   title: 'Google UX Design Professional Certificate',
 *   issuer: 'Google',
 *   category: 'coursera',
 *   track: 'it',
 *   pdf: '/certificates/google-ux-design.pdf',
 *   verificationUrl: 'https://www.coursera.org/account/accomplishments/…',
 *   issuedAt: '2025-06',
 *   description: {
 *     es: 'Especialización en fundamentos de UX, investigación y prototipado.',
 *     en: 'Specialization covering UX foundations, research, and prototyping.',
 *   },
 *   courseCount: 7,
 * }
 */
export type CertificateCategory =
    | 'coursera'
    | 'aws'
    | 'google'
    | 'meta'
    | 'other';

/**
 * Topic bucket for internal deck order (not shown in the UI).
 * - `it` — programming, cloud, UX/UI, security, developer tooling
 * - `language` — language learning
 * - `other` — everything else
 */
export type CertificateTrack = 'it' | 'language' | 'other';

/** Canonical category order for filters and grouping. */
export const CERTIFICATE_CATEGORIES: readonly CertificateCategory[] = [
    'coursera',
    'aws',
    'google',
    'meta',
    'other',
] as const;

/** Canonical track order for deck sorting. */
export const CERTIFICATE_TRACKS: readonly CertificateTrack[] = [
    'it',
    'language',
    'other',
] as const;

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    /** Platform / provider bucket for filtering (Coursera, AWS, …). */
    category: CertificateCategory;
    /**
     * Topic bucket for internal sort only — not rendered as a filter or label.
     * Prefer `it` for programming / cloud / UX / security credentials.
     */
    track: CertificateTrack;
    /** Public path, e.g. `/certificates/aws-cloud-practitioner.pdf` */
    pdf: string;
    /** Credential / badge verification URL */
    verificationUrl: string;
    /** Optional issue date, e.g. `2025-06` — used as secondary sort key */
    issuedAt?: string;
    /**
     * Optional bilingual blurb — useful for Coursera specializations
     * (what the program covers).
     */
    description?: Record<Language, string>;
    /**
     * Optional number of courses completed to earn this credential
     * (typical for Coursera specializations / professional certificates).
     */
    courseCount?: number;
}

const TRACK_RANK: Record<CertificateTrack, number> = {
    it: 0,
    language: 1,
    other: 2,
};

/**
 * Stable deck order: track (IT → language → other), then newest `issuedAt`,
 * then `id`. Entries without `issuedAt` sort after dated ones in the same track.
 */
export function sortCertificates(list: Certificate[]): Certificate[] {
    return [...list].sort((a, b) => {
        const trackDiff = TRACK_RANK[a.track] - TRACK_RANK[b.track];
        if (trackDiff !== 0) return trackDiff;

        const dateA = a.issuedAt ?? '';
        const dateB = b.issuedAt ?? '';
        if (dateA !== dateB) {
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB.localeCompare(dateA);
        }

        return a.id.localeCompare(b.id);
    });
}

const certificatesRaw: Certificate[] = [
    {
        id: 'learn-english-beginning-grammar',
        title: 'Learn English: Beginning Grammar',
        issuer: 'University of California, Irvine',
        category: 'coursera',
        track: 'language',
        pdf: '/certificates/learn-english-beginning-grammar.pdf',
        verificationUrl: 'https://coursera.org/verify/specialization/VW7VGZE1310G',
        issuedAt: '2026-07',
        description: {
            es: 'Especialización de Coursera (UC Irvine) sobre gramática inglesa básica: formas de palabras, tiempos verbales y formación de preguntas.',
            en: 'Coursera specialization (UC Irvine) on beginning English grammar: word forms, verb tenses, and question formation.',
        },
        courseCount: 3,
    },
    {
        id: 'energy-production-distribution-safety',
        title: 'Energy Production, Distribution & Safety',
        issuer: 'University at Buffalo',
        category: 'coursera',
        track: 'other',
        pdf: '/certificates/energy-production-distribution-safety.pdf',
        verificationUrl: 'https://coursera.org/verify/specialization/B3MB63MK1JVW',
        issuedAt: '2026-02',
        description: {
            es: 'Especialización de Coursera (University at Buffalo) sobre la industria energética: sistemas eléctricos, gas natural, seguridad en utilities y el impacto de las renovables en la Smart Grid.',
            en: 'Coursera specialization (University at Buffalo) on the energy industry: electric power systems, natural gas, utility safety, and the impact of renewables on the Smart Grid.',
        },
        courseCount: 4,
    },
    {
        id: 'intro-to-supabase',
        title: 'Intro to Supabase',
        issuer: 'Scrimba',
        category: 'coursera',
        track: 'it',
        pdf: '/certificates/intro-to-supabase.pdf',
        verificationUrl: 'https://coursera.org/share/e7eb86a09eea0956f717fb7d741df040',
        issuedAt: '2026-08',
        description: {
            es: 'Curso de Coursera (Scrimba) sobre Supabase: creación de proyectos y tablas, consultas SQL, integración en la UI y suscripciones en tiempo real para mantener los datos sincronizados.',
            en: 'Coursera course (Scrimba) on Supabase: project and table setup, SQL queries, UI integration, and real-time subscriptions to keep app data in sync.',
        },
    },
    {
        id: 'fundamentals-of-ui-ux-design',
        title: 'Fundamentals of UI/UX Design',
        issuer: 'Microsoft',
        category: 'coursera',
        track: 'it',
        pdf: '/certificates/fundamentals-of-ui-ux-design.pdf',
        verificationUrl: 'https://coursera.org/verify/YF1GYHBZAI8T',
        issuedAt: '2026-07',
        description: {
            es: 'Curso de Coursera (Microsoft) sobre fundamentos de UI/UX: diseño centrado en las personas, roles en un equipo de UX, design thinking y el inicio de un portafolio de casos.',
            en: 'Coursera course (Microsoft) on UI/UX fundamentals: human-centered design, UX team roles, design thinking, and starting a case-study portfolio.',
        },
    },
    {
        id: 'designing-for-user-experience',
        title: 'Designing for User Experience',
        issuer: 'Microsoft',
        category: 'coursera',
        track: 'it',
        pdf: '/certificates/designing-for-user-experience.pdf',
        verificationUrl: 'https://coursera.org/verify/QU11RZ60ZJ0L',
        issuedAt: '2026-07',
        description: {
            es: 'Curso de Coursera (Microsoft) sobre diseño de experiencia de usuario: investigación y necesidades, ideación con design thinking, storyboards, flujos de usuario, journey maps y arquitectura de información.',
            en: 'Coursera course (Microsoft) on user experience design: research and user needs, design-thinking ideation, storyboards, user flows, journey maps, and information architecture.',
        },
    },
];

/** Certificates in display order (IT → language → other, newest first). */
export const certificates: Certificate[] = sortCertificates(certificatesRaw);

/** Categories that currently have at least one certificate. */
export function getUsedCertificateCategories(
    list: Certificate[] = certificates,
): CertificateCategory[] {
    const present = new Set(list.map((c) => c.category));
    return CERTIFICATE_CATEGORIES.filter((cat) => present.has(cat));
}

export function filterCertificatesByCategory(
    category: CertificateCategory | 'all',
    list: Certificate[] = certificates,
): Certificate[] {
    const filtered = category === 'all' ? list : list.filter((c) => c.category === category);
    return sortCertificates(filtered);
}
