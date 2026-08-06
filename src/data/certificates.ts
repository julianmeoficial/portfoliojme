/**
 * Certificate showcase data.
 *
 * 1. Place the PDF in `public/certificates/` (e.g. `course-name.pdf`).
 * 2. Add an entry below with matching `pdf` path and `verificationUrl`.
 *
 * The Certificates section renders an empty state while this array is empty.
 */
export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    /** Public path, e.g. `/certificates/aws-cloud-practitioner.pdf` */
    pdf: string;
    /** Credential / badge verification URL */
    verificationUrl: string;
    /** Optional issue date, e.g. `2025-06` */
    issuedAt?: string;
}

export const certificates: Certificate[] = [];
