'use client';

import { useCallback, useEffect, useId, useRef, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import styles from './ImageLightbox.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(useGSAP);
}

interface ImageLightboxProps {
    projectTitle: string;
    screenshots: string[];
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

export default function ImageLightbox({
    projectTitle,
    screenshots,
    activeIndex,
    onClose,
    onNavigate,
}: ImageLightboxProps): JSX.Element | null {
    const { t } = useLanguage();
    const overlayRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const titleId = useId();

    useFocusTrap(overlayRef, true);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            onClose();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onNavigate(activeIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onNavigate(activeIndex + 1);
        }
    }, [activeIndex, onClose, onNavigate]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useGSAP(() => {
        if (!overlayRef.current || !imageRef.current) return;

        if (prefersReducedMotion()) {
            gsap.set([overlayRef.current, imageRef.current], { opacity: 1, scale: 1 });
            return;
        }

        gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: getMotionDuration(0.25), ease: 'power2.out' },
        );
        gsap.fromTo(
            imageRef.current,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: getMotionDuration(0.35), ease: 'power3.out', delay: 0.05 },
        );
    }, { scope: overlayRef, dependencies: [activeIndex] });

    const slideLabel = t.projects.gallery_slide_label
        .replace('{current}', String(activeIndex + 1))
        .replace('{total}', String(screenshots.length));

    const dialogTitle = t.projects.lightbox_label.replace('{title}', projectTitle);

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
                {screenshots.length > 1 && (
                    <>
                        <button
                            type="button"
                            className={`${styles.navBtn} ${styles.navPrev}`}
                            onClick={() => onNavigate(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            aria-label={t.projects.gallery_prev}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            type="button"
                            className={`${styles.navBtn} ${styles.navNext}`}
                            onClick={() => onNavigate(activeIndex + 1)}
                            disabled={activeIndex === screenshots.length - 1}
                            aria-label={t.projects.gallery_next}
                        >
                            <ChevronRight />
                        </button>
                    </>
                )}

                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label={t.projects.lightbox_close}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imageRef}
                    src={screenshots[activeIndex]}
                    alt={`${projectTitle} screenshot ${activeIndex + 1}`}
                    className={styles.image}
                />

                <span className={styles.counter} aria-live="polite">
                    {slideLabel}
                </span>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
}
