'use client';

import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type JSX,
    type KeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
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
import styles from './Certificates.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type CategoryFilter = CertificateCategory | 'all';

const SWIPE_THRESHOLD = 48;
const DRAG_LOCK_PX = 8;

function fillCounter(template: string, current: number, total: number): string {
    return template
        .replace('{current}', String(current))
        .replace('{total}', String(total));
}

function fillPreviewLabel(template: string, title: string): string {
    return template.replace('{title}', title);
}

function fillCourseCount(one: string, many: string, count: number): string {
    if (count === 1) return one;
    return many.replace('{count}', String(count));
}

export default function Certificates(): JSX.Element {
    const { t, language } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLElement | null)[]>([]);
    const scrollingProgrammatically = useRef(false);
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        startScroll: number;
        dragging: boolean;
        moved: boolean;
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

    const updatePeek = useCallback((): void => {
        const track = trackRef.current;
        if (!track || !total) return;

        const reduced = prefersReducedMotion();
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;

        slideRefs.current.forEach((el, i) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const slideCenter = rect.left + rect.width / 2;
            const distance = Math.abs(slideCenter - centerX) / Math.max(rect.width, 1);
            const tDist = Math.min(distance, 1.35);
            const scale = reduced ? (i === activeIndex ? 1 : 0.96) : 1 - tDist * 0.06;
            const opacity = reduced ? (i === activeIndex ? 1 : 0.55) : Math.max(0.42, 1 - tDist * 0.45);

            gsap.to(el, {
                scale,
                opacity,
                duration: reduced ? 0 : 0.28,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });
    }, [activeIndex, total]);

    const scrollToIndex = useCallback(
        (index: number, instant = false): void => {
            const track = trackRef.current;
            if (!track || !total) return;

            const clamped = ((index % total) + total) % total;
            const slide = slideRefs.current[clamped];
            if (!slide) return;

            setActiveIndex(clamped);
            scrollingProgrammatically.current = true;

            const reduced = prefersReducedMotion() || instant;
            const targetLeft = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;

            if (reduced) {
                track.scrollLeft = targetLeft;
                scrollingProgrammatically.current = false;
                updatePeek();
                return;
            }

            gsap.to(track, {
                scrollLeft: targetLeft,
                duration: getMotionDuration(0.55),
                ease: 'power3.out',
                overwrite: 'auto',
                onUpdate: updatePeek,
                onComplete: () => {
                    scrollingProgrammatically.current = false;
                    updatePeek();
                },
            });
        },
        [total, updatePeek],
    );

    const syncIndexFromScroll = useCallback((): void => {
        const track = trackRef.current;
        if (!track || !total || scrollingProgrammatically.current) return;

        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;

        slideRefs.current.forEach((el, i) => {
            if (!el) return;
            const slideCenter = el.offsetLeft + el.offsetWidth / 2;
            const dist = Math.abs(slideCenter - trackCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
            }
        });

        setActiveIndex((prev) => (prev === closest ? prev : closest));
        updatePeek();
    }, [total, updatePeek]);

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
            syncIndexFromScroll();
        };

        track.addEventListener('scroll', onScroll, { passive: true });
        updatePeek();

        return () => track.removeEventListener('scroll', onScroll);
    }, [syncIndexFromScroll, updatePeek, visibleCertificates]);

    useEffect(() => {
        const onResize = (): void => {
            scrollToIndex(activeIndex, true);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [activeIndex, scrollToIndex]);

    const go = useCallback(
        (delta: number): void => {
            if (!total) return;
            scrollToIndex(activeIndex + delta);
        },
        [activeIndex, scrollToIndex, total],
    );

    const selectCategory = (next: CategoryFilter): void => {
        if (next === categoryFilter) return;
        setCategoryFilter(next);
        setActiveIndex(0);
        setLightboxOpen(false);
        slideRefs.current = [];

        requestAnimationFrame(() => {
            const track = trackRef.current;
            if (track) {
                if (prefersReducedMotion()) {
                    track.scrollLeft = 0;
                    updatePeek();
                    return;
                }
                gsap.fromTo(
                    track,
                    { opacity: 0.35 },
                    {
                        opacity: 1,
                        duration: getMotionDuration(0.35),
                        ease: 'power2.out',
                        onStart: () => {
                            track.scrollLeft = 0;
                        },
                        onComplete: updatePeek,
                    },
                );
            }
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

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScroll: track.scrollLeft,
            dragging: false,
            moved: false,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onDragPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
        const drag = dragRef.current;
        const track = trackRef.current;
        if (!drag || !track || drag.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - drag.startX;
        if (!drag.dragging && Math.abs(deltaX) > DRAG_LOCK_PX) {
            drag.dragging = true;
            scrollingProgrammatically.current = true;
            gsap.killTweensOf(track);
        }

        if (!drag.dragging) return;

        drag.moved = true;
        track.scrollLeft = drag.startScroll - deltaX;
        updatePeek();
        event.preventDefault();
    };

    const endDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        try {
            event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
            /* already released */
        }

        const deltaX = event.clientX - drag.startX;
        dragRef.current = null;
        scrollingProgrammatically.current = false;

        if (!drag.dragging) return;

        if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
            scrollToIndex(activeIndex + (deltaX > 0 ? -1 : 1));
        } else {
            scrollToIndex(activeIndex);
        }
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
                                onPointerDown={onDragPointerDown}
                                onPointerMove={onDragPointerMove}
                                onPointerUp={endDrag}
                                onPointerCancel={endDrag}
                            >
                                {visibleCertificates.map((cert, index) => {
                                    const isActive = index === activeIndex;
                                    const isNear = Math.abs(index - activeIndex) <= 1;
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
                                            data-active={isActive ? 'true' : 'false'}
                                            aria-hidden={!isActive}
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
                                                        {isNear ? (
                                                            <iframe
                                                                className={styles.preview}
                                                                src={`${cert.pdf}#view=FitH`}
                                                                title={fillPreviewLabel(
                                                                    t.certificates.preview_label,
                                                                    cert.title,
                                                                )}
                                                                loading={isActive ? 'eager' : 'lazy'}
                                                                tabIndex={isActive ? 0 : -1}
                                                            />
                                                        ) : (
                                                            <div
                                                                className={styles.previewPlaceholder}
                                                                aria-hidden="true"
                                                            />
                                                        )}

                                                        <div
                                                            className={styles.dragLayer}
                                                            aria-hidden="true"
                                                            data-active={isActive ? 'true' : 'false'}
                                                        />

                                                        <div className={styles.previewActions}>
                                                            <button
                                                                type="button"
                                                                className={styles.actionBtn}
                                                                onClick={() => {
                                                                    setActiveIndex(index);
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
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => go(-1)}
                                aria-label={t.certificates.prev}
                                aria-controls={trackId}
                                disabled={total < 2}
                            >
                                <ArrowLeftIcon aria-hidden="true" width={18} height={18} />
                            </button>

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

                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => go(1)}
                                aria-label={t.certificates.next}
                                aria-controls={trackId}
                                disabled={total < 2}
                            >
                                <ArrowRightIcon aria-hidden="true" width={18} height={18} />
                            </button>
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
