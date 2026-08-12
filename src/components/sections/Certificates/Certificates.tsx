'use client';

import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
    type JSX,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowTopRightOnSquareIcon,
    ArrowsPointingOutIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import {
    certificates,
    filterCertificatesByCategory,
    getUsedCertificateCategories,
} from '@/data/certificates';
import type { CertificateCategory } from '@/data/certificates';
import PdfLightbox from './PdfLightbox';
import { fillCounter, fillCourseCount, fillTitle } from './formatters';
import styles from './Certificates.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type CategoryFilter = CertificateCategory | 'all';

function useCoarsePointer(): boolean {
    return useSyncExternalStore(
        (onStoreChange) => {
            const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
            mq.addEventListener('change', onStoreChange);
            return () => mq.removeEventListener('change', onStoreChange);
        },
        () => window.matchMedia('(hover: none) and (pointer: coarse)').matches,
        () => false,
    );
}

/** Pointer travel before a click becomes a drag. */
const DRAG_LOCK_PX = 6;
/** Horizontal velocity (px/ms) that counts as a flick to the next/prev slide. */
const VELOCITY_FLICK = 0.45;

function getClosestIndex(
    track: HTMLDivElement,
    slides: (HTMLElement | null)[],
): number {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;

    slides.forEach((el, i) => {
        if (!el) return;
        const slideCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(slideCenter - trackCenter);
        if (dist < closestDist) {
            closestDist = dist;
            closest = i;
        }
    });

    return closest;
}

function getCenteredScrollLeft(track: HTMLDivElement, slide: HTMLElement): number {
    return slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
}

export default function Certificates(): JSX.Element {
    const { t, language } = useLanguage();
    const isCoarsePointer = useCoarsePointer();
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLElement | null)[]>([]);
    const activeIndexRef = useRef(0);
    const animatingRef = useRef(false);
    const peekRaf = useRef<number | null>(null);
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        startScroll: number;
        lastX: number;
        lastTime: number;
        velocity: number;
        dragging: boolean;
        startSlideIndex: number | null;
    } | null>(null);

    const trackId = useId();
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const usedCategories = useMemo(
        () => getUsedCertificateCategories(certificates),
        [],
    );

    const visibleCertificates = useMemo(
        () => filterCertificatesByCategory(categoryFilter, certificates),
        [categoryFilter],
    );

    const total = visibleCertificates.length;

    const categoryLabel = useCallback(
        (category: CertificateCategory): string => t.certificates.categories[category],
        [t],
    );

    const setIndexSafe = useCallback((index: number): void => {
        activeIndexRef.current = index;
        setActiveIndex((prev) => (prev === index ? prev : index));
    }, []);

    /** Distance-based opacity for peeking slides. No scale — Safari flickers when scaling iframe ancestors. */
    const updatePeek = useCallback((): void => {
        const track = trackRef.current;
        if (!track || !total) return;

        const reduced = prefersReducedMotion();
        const centerX = track.getBoundingClientRect().left + track.clientWidth / 2;

        slideRefs.current.forEach((el) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const slideCenter = rect.left + rect.width / 2;
            const distance = Math.abs(slideCenter - centerX) / Math.max(rect.width, 1);
            const tDist = Math.min(distance, 1);
            const opacity = reduced ? 1 : Math.max(0.55, 1 - tDist * 0.38);

            gsap.killTweensOf(el);
            gsap.set(el, { opacity, scale: 1, force3D: false });
        });
    }, [total]);

    const schedulePeek = useCallback((): void => {
        if (peekRaf.current !== null) return;
        peekRaf.current = window.requestAnimationFrame(() => {
            peekRaf.current = null;
            updatePeek();
        });
    }, [updatePeek]);

    const setSnapEnabled = useCallback((enabled: boolean): void => {
        const track = trackRef.current;
        if (!track) return;
        track.dataset.snap = enabled ? 'true' : 'false';
    }, []);

    const scrollToIndex = useCallback(
        (index: number, instant = false): void => {
            const track = trackRef.current;
            if (!track || !total) return;

            const clamped = Math.max(0, Math.min(index, total - 1));
            const slide = slideRefs.current[clamped];
            if (!slide) return;

            const targetLeft = getCenteredScrollLeft(track, slide);
            if (Math.abs(track.scrollLeft - targetLeft) < 1 && clamped === activeIndexRef.current) {
                setIndexSafe(clamped);
                updatePeek();
                return;
            }

            setIndexSafe(clamped);
            const reduced = prefersReducedMotion() || instant;

            gsap.killTweensOf(track);
            animatingRef.current = true;
            setSnapEnabled(false);

            if (reduced) {
                track.scrollLeft = targetLeft;
                animatingRef.current = false;
                setSnapEnabled(true);
                updatePeek();
                return;
            }

            const distance = Math.abs(track.scrollLeft - targetLeft);
            const duration = getMotionDuration(
                Math.min(0.65, Math.max(0.38, 0.32 + distance / 2200)),
            );

            gsap.to(track, {
                scrollLeft: targetLeft,
                duration,
                ease: 'power2.inOut',
                overwrite: true,
                onUpdate: schedulePeek,
                onComplete: () => {
                    // Settle exactly, then restore snap next frame to avoid snap fights.
                    track.scrollLeft = targetLeft;
                    updatePeek();
                    window.requestAnimationFrame(() => {
                        animatingRef.current = false;
                        setSnapEnabled(true);
                    });
                },
            });
        },
        [schedulePeek, setIndexSafe, setSnapEnabled, total, updatePeek],
    );

    useGSAP(
        () => {
            if (prefersReducedMotion()) {
                gsap.set('.js-certificates-header, .js-certificates-body', { opacity: 1, y: 0 });
                return;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    once: true,
                },
            });

            tl.from('.js-certificates-header', {
                y: 30,
                opacity: 0,
                duration: getMotionDuration(0.8),
                ease: 'power3.out',
                stagger: 0.12,
            }).from(
                '.js-certificates-body',
                {
                    y: 40,
                    opacity: 0,
                    duration: getMotionDuration(0.85),
                    ease: 'power3.out',
                },
                '-=0.45',
            );
        },
        { scope: sectionRef },
    );

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const onScroll = (): void => {
            if (animatingRef.current || dragRef.current?.dragging) {
                schedulePeek();
                return;
            }
            const closest = getClosestIndex(track, slideRefs.current);
            setIndexSafe(closest);
            schedulePeek();
        };

        track.addEventListener('scroll', onScroll, { passive: true });
        setSnapEnabled(true);
        updatePeek();

        return () => {
            track.removeEventListener('scroll', onScroll);
            if (peekRaf.current !== null) {
                window.cancelAnimationFrame(peekRaf.current);
            }
        };
    }, [schedulePeek, setIndexSafe, setSnapEnabled, updatePeek, total]);

    useEffect(() => {
        const onResize = (): void => {
            scrollToIndex(activeIndexRef.current, true);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [scrollToIndex]);

    const go = useCallback(
        (delta: number): void => {
            if (!total || animatingRef.current) return;
            scrollToIndex(activeIndexRef.current + delta);
        },
        [scrollToIndex, total],
    );

    const selectCategory = (next: CategoryFilter): void => {
        if (next === categoryFilter) return;
        setCategoryFilter(next);
        setIndexSafe(0);
        setLightboxOpen(false);
        slideRefs.current = [];
        animatingRef.current = false;

        requestAnimationFrame(() => {
            const track = trackRef.current;
            if (!track) return;
            gsap.killTweensOf(track);
            track.scrollLeft = 0;
            setSnapEnabled(true);
            updatePeek();
        });
    };

    const onDeckKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            go(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            go(1);
        }
    };

    const onDragPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
        if (lightboxOpen || total < 2) return;
        const track = trackRef.current;
        if (!track) return;

        const target = event.target as HTMLElement;
        if (target.closest('a, button')) return;

        const slide = target.closest('[data-slide-index]');
        const rawIndex = slide ? Number(slide.getAttribute('data-slide-index')) : NaN;

        gsap.killTweensOf(track);
        animatingRef.current = false;

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScroll: track.scrollLeft,
            lastX: event.clientX,
            lastTime: performance.now(),
            velocity: 0,
            dragging: false,
            startSlideIndex: Number.isNaN(rawIndex) ? null : rawIndex,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onDragPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
        const drag = dragRef.current;
        const track = trackRef.current;
        if (!drag || !track || drag.pointerId !== event.pointerId) return;

        const now = performance.now();
        const deltaX = event.clientX - drag.startX;
        const dt = Math.max(now - drag.lastTime, 1);
        const frameDelta = event.clientX - drag.lastX;
        drag.velocity = frameDelta / dt;
        drag.lastX = event.clientX;
        drag.lastTime = now;

        if (!drag.dragging && Math.abs(deltaX) > DRAG_LOCK_PX) {
            drag.dragging = true;
            setSnapEnabled(false);
            track.dataset.dragging = 'true';
        }

        if (!drag.dragging) return;

        track.scrollLeft = drag.startScroll - deltaX;
        schedulePeek();
        event.preventDefault();
    };

    const endDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
        const drag = dragRef.current;
        const track = trackRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        try {
            event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
            /* already released */
        }

        const wasDragging = drag.dragging;
        const velocity = drag.velocity;
        const startSlideIndex = drag.startSlideIndex;
        dragRef.current = null;

        if (track) {
            track.dataset.dragging = 'false';
        }

        if (!wasDragging) {
            setSnapEnabled(true);

            // Peek card → that cert; active card left/right half → prev/next.
            if (
                startSlideIndex !== null &&
                startSlideIndex >= 0 &&
                startSlideIndex < total
            ) {
                if (startSlideIndex !== activeIndexRef.current) {
                    scrollToIndex(startSlideIndex);
                } else if (total > 1) {
                    const slide = slideRefs.current[startSlideIndex];
                    if (slide) {
                        const rect = slide.getBoundingClientRect();
                        const mid = rect.left + rect.width / 2;
                        if (drag.startX < mid) {
                            if (activeIndexRef.current > 0) {
                                scrollToIndex(activeIndexRef.current - 1);
                            }
                        } else if (activeIndexRef.current < total - 1) {
                            scrollToIndex(activeIndexRef.current + 1);
                        }
                    }
                }
            }
            return;
        }

        if (!track) {
            setSnapEnabled(true);
            return;
        }

        let target = getClosestIndex(track, slideRefs.current);
        if (Math.abs(velocity) > VELOCITY_FLICK) {
            target += velocity > 0 ? -1 : 1;
        }

        scrollToIndex(target);
    };

    const counterLabel = total
        ? fillCounter(t.certificates.counter, activeIndex + 1, total)
        : '';
    const showFilters = certificates.length > 0 && usedCategories.length > 0;
    const showDots = total > 1 && total <= 8;

    return (
        <section id="certificates" ref={sectionRef} className={styles.certificates}>
            <div className={styles.header}>
                <span className={`js-certificates-header ${styles.label}`}>
                    {t.certificates.label}
                </span>
                <h2 className={`js-certificates-header ${styles.heading}`}>
                    {t.certificates.heading}
                </h2>
            </div>

            <div className={`js-certificates-body ${styles.body}`}>
                {showFilters ? (
                    <div
                        className={styles.filters}
                        role="group"
                        aria-label={t.certificates.filter_aria}
                    >
                        <button
                            type="button"
                            className={styles.filterChip}
                            data-active={categoryFilter === 'all' ? 'true' : 'false'}
                            aria-pressed={categoryFilter === 'all'}
                            onClick={() => selectCategory('all')}
                        >
                            {t.certificates.filter_all}
                        </button>
                        {usedCategories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={styles.filterChip}
                                data-active={categoryFilter === cat ? 'true' : 'false'}
                                aria-pressed={categoryFilter === cat}
                                onClick={() => selectCategory(cat)}
                            >
                                {categoryLabel(cat)}
                            </button>
                        ))}
                    </div>
                ) : null}

                {total === 0 ? (
                    <div className={`glass ${styles.empty}`} role="status">
                        <DocumentTextIcon className={styles.emptyIcon} aria-hidden="true" />
                        <p className={styles.emptyTitle}>{t.certificates.empty}</p>
                        <p className={styles.emptyHint}>{t.certificates.empty_hint}</p>
                    </div>
                ) : (
                    <>
                        <div
                            className={styles.deck}
                            tabIndex={0}
                            onKeyDown={onDeckKeyDown}
                            role="region"
                            aria-roledescription="carousel"
                            aria-label={t.certificates.label}
                        >
                            <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
                                {counterLabel}
                            </p>

                            <div
                                ref={trackRef}
                                id={trackId}
                                className={styles.track}
                                data-snap="true"
                                data-dragging="false"
                                onPointerDown={onDragPointerDown}
                                onPointerMove={onDragPointerMove}
                                onPointerUp={endDrag}
                                onPointerCancel={endDrag}
                            >
                                {visibleCertificates.map((cert, index) => {
                                    const isActive = index === activeIndex;
                                    const description = cert.description?.[language];
                                    const courseLabel =
                                        typeof cert.courseCount === 'number'
                                            ? fillCourseCount(
                                                  t.certificates.courses_one,
                                                  t.certificates.courses_many,
                                                  cert.courseCount,
                                              )
                                            : null;

                                    return (
                                        <article
                                            key={cert.id}
                                            ref={(el) => {
                                                slideRefs.current[index] = el;
                                            }}
                                            className={styles.slide}
                                            data-slide-index={index}
                                            data-active={isActive ? 'true' : 'false'}
                                            aria-hidden={!isActive}
                                            aria-label={
                                                isActive
                                                    ? undefined
                                                    : fillTitle(
                                                          t.certificates.select_certificate,
                                                          cert.title,
                                                      )
                                            }
                                        >
                                            <div className={styles.slideCard}>
                                                <div className={styles.liquidContainer} aria-hidden="true">
                                                    <span className={styles.liquidBlob} />
                                                    <span className={styles.liquidBlob} />
                                                </div>

                                                <div className={styles.slideContent}>
                                                    <header className={styles.slideMeta}>
                                                        <div className={styles.metaRow}>
                                                            <span className={styles.categoryBadge}>
                                                                {categoryLabel(cert.category)}
                                                            </span>
                                                            <p className={styles.issuer}>
                                                                <span className={styles.issuerLabel}>
                                                                    {t.certificates.issuer_label}
                                                                </span>
                                                                {cert.issuer}
                                                                {cert.issuedAt ? (
                                                                    <span className={styles.issuedAt}>
                                                                        · {cert.issuedAt}
                                                                    </span>
                                                                ) : null}
                                                            </p>
                                                        </div>
                                                        <h3 className={styles.cardTitle}>{cert.title}</h3>
                                                        {description ? (
                                                            <p className={styles.description}>{description}</p>
                                                        ) : null}
                                                        {courseLabel ? (
                                                            <p className={styles.courseCount}>{courseLabel}</p>
                                                        ) : null}
                                                    </header>

                                                    <div className={styles.previewShell}>
                                                        {isCoarsePointer ? (
                                                            <div className={styles.previewFallback} aria-hidden="true">
                                                                <DocumentTextIcon
                                                                    width={40}
                                                                    height={40}
                                                                    aria-hidden="true"
                                                                />
                                                                <span>{t.certificates.open_pdf}</span>
                                                            </div>
                                                        ) : (
                                                            <iframe
                                                                className={styles.preview}
                                                                src={`${cert.pdf}#view=FitH`}
                                                                title={fillTitle(
                                                                    t.certificates.preview_label,
                                                                    cert.title,
                                                                )}
                                                                loading={isActive ? 'eager' : 'lazy'}
                                                                tabIndex={isActive ? 0 : -1}
                                                            />
                                                        )}

                                                        <div
                                                            className={styles.dragLayer}
                                                            aria-hidden="true"
                                                        />

                                                        {isActive && total > 1 ? (
                                                            <>
                                                                <div
                                                                    className={`${styles.hitZone} ${styles.hitPrev}`}
                                                                    aria-hidden="true"
                                                                    data-disabled={activeIndex <= 0 ? 'true' : 'false'}
                                                                />
                                                                <div
                                                                    className={`${styles.hitZone} ${styles.hitNext}`}
                                                                    aria-hidden="true"
                                                                    data-disabled={activeIndex >= total - 1 ? 'true' : 'false'}
                                                                />
                                                            </>
                                                        ) : null}

                                                        <div className={styles.previewActions}>
                                                            <button
                                                                type="button"
                                                                className={styles.actionBtn}
                                                                onClick={() => {
                                                                    setIndexSafe(index);
                                                                    setLightboxOpen(true);
                                                                }}
                                                                tabIndex={isActive ? 0 : -1}
                                                                aria-label={t.certificates.expand}
                                                            >
                                                                <ArrowsPointingOutIcon
                                                                    aria-hidden="true"
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                {t.certificates.expand}
                                                            </button>
                                                            <a
                                                                className={styles.actionBtn}
                                                                href={cert.pdf}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                tabIndex={isActive ? 0 : -1}
                                                            >
                                                                <DocumentTextIcon
                                                                    aria-hidden="true"
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                {t.certificates.open_pdf}
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <footer className={styles.cardFooter}>
                                                        <a
                                                            className={styles.verifyLink}
                                                            href={cert.verificationUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            tabIndex={isActive ? 0 : -1}
                                                            aria-label={`${t.certificates.verify}: ${cert.title}`}
                                                        >
                                                            {t.certificates.verify}
                                                            <ArrowTopRightOnSquareIcon
                                                                aria-hidden="true"
                                                                width={16}
                                                                height={16}
                                                            />
                                                        </a>
                                                    </footer>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.controls}>
                            <div className={styles.pager}>
                                <p className={styles.counter} aria-hidden="true">
                                    {counterLabel}
                                </p>
                                {showDots ? (
                                    <div className={styles.dots} role="tablist" aria-label={t.certificates.label}>
                                        {visibleCertificates.map((cert, index) => (
                                            <button
                                                key={cert.id}
                                                type="button"
                                                role="tab"
                                                className={styles.dot}
                                                data-active={index === activeIndex ? 'true' : 'false'}
                                                aria-selected={index === activeIndex}
                                                aria-label={fillCounter(
                                                    t.certificates.counter,
                                                    index + 1,
                                                    total,
                                                )}
                                                onClick={() => scrollToIndex(index)}
                                            />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {lightboxOpen ? (
                            <PdfLightbox
                                certificates={visibleCertificates}
                                activeIndex={activeIndex}
                                onClose={() => setLightboxOpen(false)}
                                onNavigate={(index) => {
                                    scrollToIndex(index, true);
                                }}
                            />
                        ) : null}
                    </>
                )}
            </div>
        </section>
    );
}
