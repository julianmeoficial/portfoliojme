'use client';

import { useCallback, useEffect, useId, useRef, useState, type JSX, type KeyboardEvent } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ImageWithSkeleton from '@/components/common/ImageWithSkeleton';
import { preloadScreenshots } from './preloadScreenshots';
import styles from './ProjectGallery.module.css';

interface ProjectGalleryProps {
    projectTitle: string;
    screenshots: string[];
    onExpand: (index: number) => void;
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

export default function ProjectGallery({
    projectTitle,
    screenshots,
    onExpand,
}: ProjectGalleryProps): JSX.Element {
    const { t } = useLanguage();
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0);
    const scrollRafRef = useRef<number | null>(null);
    const trackId = useId();

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        preloadScreenshots(screenshots, activeIndex);
    }, [activeIndex, screenshots]);

    const scrollToIndex = useCallback((index: number) => {
        const track = trackRef.current;
        if (!track) return;
        const clamped = Math.max(0, Math.min(index, screenshots.length - 1));
        const slide = track.children[clamped] as HTMLElement | undefined;
        if (slide) {
            track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
        }
        setActiveIndex(clamped);
    }, [screenshots.length]);

    const handleScroll = useCallback(() => {
        if (scrollRafRef.current !== null) return;
        scrollRafRef.current = requestAnimationFrame(() => {
            scrollRafRef.current = null;
            const track = trackRef.current;
            if (!track || track.children.length === 0) return;
            const center = track.scrollLeft + track.clientWidth / 2;
            let closest = 0;
            let minDist = Infinity;
            for (let i = 0; i < track.children.length; i++) {
                const slide = track.children[i] as HTMLElement;
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                const dist = Math.abs(slideCenter - center);
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            }
            if (closest !== activeIndexRef.current) {
                setActiveIndex(closest);
            }
        });
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        track.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            track.removeEventListener('scroll', handleScroll);
            if (scrollRafRef.current !== null) {
                cancelAnimationFrame(scrollRafRef.current);
            }
        };
    }, [handleScroll]);

    const screenshotAlt = (index: number): string =>
        t.projects.screenshot_alt
            .replace('{title}', projectTitle)
            .replace('{n}', String(index + 1));

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollToIndex(activeIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollToIndex(activeIndex + 1);
        }
    };

    const slideLabel = t.projects.gallery_slide_label
        .replace('{current}', String(activeIndex + 1))
        .replace('{total}', String(screenshots.length));

    return (
        <div
            className={styles.gallery}
            role="region"
            aria-roledescription="carousel"
            aria-label={projectTitle}
            onKeyDown={handleKeyDown}
        >
            <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
                {slideLabel}
            </p>

            <div className={styles.viewport}>
                {screenshots.length > 1 && (
                    <>
                        <button
                            type="button"
                            className={`${styles.navBtn} ${styles.navPrev}`}
                            onClick={() => scrollToIndex(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            aria-label={t.projects.gallery_prev}
                            aria-controls={trackId}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            type="button"
                            className={`${styles.navBtn} ${styles.navNext}`}
                            onClick={() => scrollToIndex(activeIndex + 1)}
                            disabled={activeIndex === screenshots.length - 1}
                            aria-label={t.projects.gallery_next}
                            aria-controls={trackId}
                        >
                            <ChevronRight />
                        </button>
                    </>
                )}

                <div ref={trackRef} id={trackId} className={styles.track} tabIndex={0}>
                    {screenshots.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            className={styles.slide}
                            aria-label={`${t.projects.lightbox_expand}: ${projectTitle} ${i + 1}`}
                            {...(i !== activeIndex ? { 'aria-hidden': 'true' as const } : {})}
                            tabIndex={i === activeIndex ? 0 : -1}
                            onClick={() => onExpand(i)}
                        >
                            <ImageWithSkeleton
                                src={src}
                                alt={screenshotAlt(i)}
                                className={styles.slideImage}
                                wrapperClassName={styles.slideImageWrapper}
                                loading={i <= 1 ? 'eager' : 'lazy'}
                                fetchPriority={i === 0 ? 'high' : i === 1 ? 'low' : undefined}
                                errorLabel={t.common.image_error}
                                loadingLabel={t.common.loading}
                            />
                            <span className={styles.counter} aria-hidden="true">
                                {i + 1} / {screenshots.length}
                            </span>
                            <span className={styles.expandHint} aria-hidden="true">
                                {t.projects.lightbox_expand}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {screenshots.length > 1 && (
                <div
                    className={styles.dots}
                    role="group"
                    aria-label={t.projects.gallery_choose_slide}
                >
                    {screenshots.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                            aria-label={`${projectTitle} ${i + 1}`}
                            {...(i === activeIndex ? { 'aria-current': 'true' as const } : {})}
                            onClick={() => scrollToIndex(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
