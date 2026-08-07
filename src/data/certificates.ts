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

export const certificates: Certificate[] = [];

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
