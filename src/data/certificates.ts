import type { Language } from '@/lib/i18n/types';

/**
 * Certificate showcase data.
 *
 * 1. Place the PDF in `public/certificates/` (e.g. `course-name.pdf`).
 * 2. Add an entry below with matching `pdf` path, `verificationUrl`, and `category`.
 *
 * For Coursera specializations, fill `description` (ES/EN) and `courseCount`
 * (how many courses you completed to earn the credential).
 *
 * The Certificates section renders an empty state while this array is empty.
 *
 * @example
 * {
 *   id: 'google-ux-design',
 *   title: 'Google UX Design Professional Certificate',
 *   issuer: 'Google',
 *   category: 'coursera',
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

/** Canonical category order for filters and grouping. */
export const CERTIFICATE_CATEGORIES: readonly CertificateCategory[] = [
    'coursera',
    'aws',
    'google',
    'meta',
    'other',
] as const;

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    /** Platform / provider bucket for filtering (Coursera, AWS, …). */
    category: CertificateCategory;
    /** Public path, e.g. `/certificates/aws-cloud-practitioner.pdf` */
    pdf: string;
    /** Credential / badge verification URL */
    verificationUrl: string;
    /** Optional issue date, e.g. `2025-06` */
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

export const certificates: Certificate[] = [
    {
        id: 'learn-english-beginning-grammar',
        title: 'Learn English: Beginning Grammar',
        issuer: 'University of California, Irvine',
        category: 'coursera',
        pdf: '/certificates/learn-english-beginning-grammar.pdf',
        verificationUrl: 'https://coursera.org/verify/specialization/VW7VGZE1310G',
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
        issuer: 'Supabase',
        category: 'coursera',
        pdf: '/certificates/intro-to-supabase.pdf',
        verificationUrl: 'https://coursera.org/share/e7eb86a09eea0956f717fb7d741df040',
        issuedAt: '2026-08',
        description: {
            es: 'Curso de Coursera sobre Supabase: creación de proyectos y tablas, consultas SQL, integración en la UI y suscripciones en tiempo real para mantener los datos sincronizados.',
            en: 'Coursera course on Supabase: project and table setup, SQL queries, UI integration, and real-time subscriptions to keep app data in sync.',
        },
    },
];

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
    if (category === 'all') return list;
    return list.filter((c) => c.category === category);
}
