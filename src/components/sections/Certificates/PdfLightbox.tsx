'use client';

import { useCallback, useEffect, useId, useRef, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { useModalLock } from '@/lib/hooks/useModalLock';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import type { Certificate } from '@/data/certificates';
import { fillCounter, fillTitle } from './formatters';
import styles from './PdfLightbox.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(useGSAP);
}

interface PdfLightboxProps {
    certificates: Certificate[];
    activeIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

function ChevronLeft(): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function ChevronRight(): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

export default function PdfLightbox({
    certificates,
    activeIndex,
    onClose,
    onNavigate,
}: PdfLightboxProps): JSX.Element | null {
    const { t } = useLanguage();
    const overlayRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const titleId = useId();
    const total = certificates.length;
    const active = certificates[activeIndex];

    useModalLock(true);
    useFocusTrap(overlayRef, true);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            onClose();
        } else if (e.key === 'ArrowLeft' && total > 1) {
            e.preventDefault();
            onNavigate((activeIndex - 1 + total) % total);
        } else if (e.key === 'ArrowRight' && total > 1) {
            e.preventDefault();
            onNavigate((activeIndex + 1) % total);
        }
    }, [activeIndex, onClose, onNavigate, total]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useGSAP(() => {
        if (!overlayRef.current || !frameRef.current) return;

        if (prefersReducedMotion()) {
            gsap.set([overlayRef.current, frameRef.current], { opacity: 1, scale: 1 });
            return;
        }

        gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: getMotionDuration(0.25), ease: 'power2.out' },
        );
        gsap.fromTo(
            frameRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: getMotionDuration(0.35), ease: 'power3.out', delay: 0.05 },
        );
    }, { scope: overlayRef, dependencies: [activeIndex] });

    if (!active) return null;

    const counterLabel = fillCounter(t.certificates.counter, activeIndex + 1, total);
    const dialogTitle = fillTitle(t.certificates.lightbox_label, active.title);

    const content = (
        <div
            ref={overlayRef}
            className={styles.overlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <h2 id={titleId} className={styles.srOnly}>
                {dialogTitle}
            </h2>

            <div className={styles.content}>
                {total > 1 ? (
                    <>
                        <button
                            type="button"
                            className={`${styles.navBtn} ${styles.navPrev}`}
                            onClick={() => onNavigate((activeIndex - 1 + total) % total)}
                            aria-label={t.certificates.prev}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            type="button"
                            className={`${styles.navBtn} ${styles.navNext}`}
                            onClick={() => onNavigate((activeIndex + 1) % total)}
                            aria-label={t.certificates.next}
                        >
                            <ChevronRight />
                        </button>
                    </>
                ) : null}

                <a
                    className={styles.openPdf}
                    href={active.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <DocumentTextIcon aria-hidden="true" width={16} height={16} />
                    {t.certificates.open_pdf}
                </a>

                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label={t.certificates.close_preview}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <iframe
                    ref={frameRef}
                    className={styles.frame}
                    src={`${active.pdf}#view=FitH`}
                    title={fillTitle(t.certificates.preview_label, active.title)}
                />

                {total > 1 ? (
                    <span className={styles.counter} aria-live="polite">
                        {counterLabel}
                    </span>
                ) : null}
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
}
