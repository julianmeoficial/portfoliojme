'use client';

import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type JSX,
} from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { useModalLock } from '@/lib/hooks/useModalLock';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import { decodeScreenshot, preloadScreenshots } from './preloadScreenshots';
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

function screenshotAlt(template: string, title: string, index: number): string {
    return template.replace('{title}', title).replace('{n}', String(index + 1));
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
    const stageRef = useRef<HTMLDivElement>(null);
    const bufferRefs = useRef<[HTMLImageElement | null, HTMLImageElement | null]>([null, null]);
    const activeBufferRef = useRef(0);
    const displayedIndexRef = useRef(activeIndex);
    const swapTokenRef = useRef(0);
    const titleId = useId();
    const [frontBuffer, setFrontBuffer] = useState(0);
    const [displayedIndex, setDisplayedIndex] = useState(activeIndex);

    useModalLock(true);
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

    /* Overlay fade-in once on mount — never re-run on slide change. */
    useGSAP(() => {
        if (!overlayRef.current || !stageRef.current) return;

        const frontImg = bufferRefs.current[0];
        if (frontImg) {
            gsap.set(frontImg, { opacity: 1 });
        }

        if (prefersReducedMotion()) {
            gsap.set([overlayRef.current, stageRef.current], { opacity: 1, scale: 1 });
            return;
        }

        gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: getMotionDuration(0.25), ease: 'power2.out' },
        );
        gsap.fromTo(
            stageRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: getMotionDuration(0.35), ease: 'power3.out', delay: 0.05 },
        );
    }, { scope: overlayRef });

    /* Preload neighbors whenever the requested index changes. */
    useEffect(() => {
        preloadScreenshots(screenshots, activeIndex);
    }, [activeIndex, screenshots]);

    /* Decode + crossfade when navigating between slides. */
    useEffect(() => {
        if (displayedIndexRef.current === activeIndex) return;

        const token = ++swapTokenRef.current;
        const url = screenshots[activeIndex];
        if (!url) return;

        const swap = async (): Promise<void> => {
            await decodeScreenshot(url);
            if (swapTokenRef.current !== token) return;

            const backBuffer = activeBufferRef.current === 0 ? 1 : 0;
            const backImg = bufferRefs.current[backBuffer];
            const frontImg = bufferRefs.current[activeBufferRef.current];
            if (!backImg) return;

            backImg.src = url;
            backImg.alt = screenshotAlt(t.projects.screenshot_alt, projectTitle, activeIndex);

            const reduced = prefersReducedMotion();
            if (reduced) {
                activeBufferRef.current = backBuffer;
                setFrontBuffer(backBuffer);
                displayedIndexRef.current = activeIndex;
                setDisplayedIndex(activeIndex);
                gsap.set(backImg, { opacity: 1 });
                if (frontImg) gsap.set(frontImg, { opacity: 0 });
                return;
            }

            gsap.killTweensOf([frontImg, backImg]);
            gsap.set(backImg, { opacity: 0 });
            gsap.to(backImg, {
                opacity: 1,
                duration: getMotionDuration(0.22),
                ease: 'power2.out',
            });
            gsap.to(frontImg, {
                opacity: 0,
                duration: getMotionDuration(0.22),
                ease: 'power2.out',
                onComplete: () => {
                    if (swapTokenRef.current !== token) return;
                    activeBufferRef.current = backBuffer;
                    setFrontBuffer(backBuffer);
                    displayedIndexRef.current = activeIndex;
                    setDisplayedIndex(activeIndex);
                },
            });
        };

        void swap();
    }, [activeIndex, projectTitle, screenshots, t.projects.screenshot_alt]);

    const slideLabel = t.projects.gallery_slide_label
        .replace('{current}', String(displayedIndex + 1))
        .replace('{total}', String(screenshots.length));

    const dialogTitle = t.projects.lightbox_label.replace('{title}', projectTitle);
    const initialAlt = screenshotAlt(t.projects.screenshot_alt, projectTitle, activeIndex);

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

                <div ref={stageRef} className={styles.imageStage}>
                    {[0, 1].map((bufferIndex) => (
                        <div
                            key={bufferIndex}
                            className={`${styles.imageLayer} ${bufferIndex === frontBuffer ? styles.imageLayerActive : ''}`}
                            aria-hidden={bufferIndex !== frontBuffer}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={(el) => {
                                    bufferRefs.current[bufferIndex] = el;
                                }}
                                src={bufferIndex === 0 ? screenshots[activeIndex] : undefined}
                                alt={bufferIndex === frontBuffer ? initialAlt : ''}
                                className={styles.image}
                                decoding="async"
                                fetchPriority={bufferIndex === 0 ? 'high' : 'low'}
                            />
                        </div>
                    ))}
                </div>

                <span className={styles.counter} aria-live="polite">
                    {slideLabel}
                </span>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
}
