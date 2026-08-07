'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { JSX, KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowTopRightOnSquareIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import {
    certificates,
    filterCertificatesByCategory,
    getUsedCertificateCategories,
} from '@/data/certificates';
import type { Certificate, CertificateCategory } from '@/data/certificates';
import styles from './Certificates.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type CategoryFilter = CertificateCategory | 'all';

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

/** Relative stack depth from active index (wrapped). */
function stackDepth(index: number, active: number, total: number): number {
    let d = index - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
}

function stackTransform(depth: number, peek: boolean): { x: number; y: number; scale: number; rotate: number; opacity: number; z: number } {
    if (depth === 0) {
        return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, z: 30 };
    }

    const abs = Math.abs(depth);
    const sign = depth > 0 ? 1 : -1;
    const peekBoost = peek ? 1.35 : 1;
    const capped = Math.min(abs, 3);

    return {
        x: sign * capped * 14 * peekBoost,
        y: capped * 18 * peekBoost + (peek ? capped * 6 : 0),
        scale: 1 - capped * 0.045,
        rotate: sign * capped * (peek ? 3.2 : 1.8),
        opacity: Math.max(0.35, 1 - capped * 0.22),
        z: 30 - abs,
    };
}

export default function Certificates(): JSX.Element {
    const { t, language } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const deckRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLElement | null)[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [activeIndex, setActiveIndex] = useState(0);
    const [peeking, setPeeking] = useState(false);
    const animatingRef = useRef(false);

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

    const applyStack = useCallback(
        (immediate = false): void => {
            if (!total) return;

            const reduced = prefersReducedMotion();
            const duration = immediate || reduced ? 0 : getMotionDuration(0.55);

            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                const depth = stackDepth(i, activeIndex, total);
                const tf = stackTransform(depth, peeking && !reduced);
                const isActive = depth === 0;

                gsap.to(el, {
                    x: tf.x,
                    y: tf.y,
                    scale: tf.scale,
                    rotation: tf.rotate,
                    opacity: tf.opacity,
                    zIndex: tf.z,
                    duration,
                    ease: 'power3.out',
                    overwrite: 'auto',
                });

                el.setAttribute('aria-hidden', isActive ? 'false' : 'true');
                el.tabIndex = isActive ? 0 : -1;
                el.style.pointerEvents = isActive ? 'auto' : 'none';
            });
        },
        [activeIndex, peeking, total],
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
        applyStack(true);
    }, [applyStack, visibleCertificates]);

    useEffect(() => {
        if (!total) return;

        const reduced = prefersReducedMotion();
        if (reduced) {
            applyStack(true);
            return;
        }

        animatingRef.current = true;
        applyStack(false);
        const timer = window.setTimeout(() => {
            animatingRef.current = false;
        }, getMotionDuration(0.55) * 1000 + 40);

        return () => window.clearTimeout(timer);
    }, [activeIndex, applyStack, total]);

    useEffect(() => {
        if (!total) return;
        applyStack(prefersReducedMotion());
    }, [peeking, applyStack, total]);

    const go = useCallback(
        (delta: number): void => {
            if (!total || animatingRef.current) return;
            setActiveIndex((prev) => (prev + delta + total) % total);
        },
        [total],
    );

    const onDeckKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            go(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            go(1);
        }
    };

    const selectCategory = (next: CategoryFilter): void => {
        if (next === categoryFilter) return;
        setCategoryFilter(next);
        setActiveIndex(0);
        cardRefs.current = [];
        animatingRef.current = false;
    };

    const active: Certificate | undefined = total ? visibleCertificates[activeIndex] : undefined;
    const counterLabel = total
        ? fillCounter(t.certificates.counter, activeIndex + 1, total)
        : '';
    const showFilters = certificates.length > 0 && usedCategories.length > 0;

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

                {total === 0 || !active ? (
                    <div className={`glass ${styles.empty}`} role="status">
                        <DocumentTextIcon className={styles.emptyIcon} aria-hidden="true" />
                        <p className={styles.emptyTitle}>{t.certificates.empty}</p>
                        <p className={styles.emptyHint}>{t.certificates.empty_hint}</p>
                    </div>
                ) : (
                    <>
                        <div
                            ref={deckRef}
                            className={styles.deck}
                            tabIndex={0}
                            onMouseEnter={() => {
                                if (!prefersReducedMotion()) setPeeking(true);
                            }}
                            onMouseLeave={() => setPeeking(false)}
                            onKeyDown={onDeckKeyDown}
                            role="region"
                            aria-roledescription="carousel"
                            aria-label={t.certificates.label}
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
                                            cardRefs.current[index] = el;
                                        }}
                                        className={styles.card}
                                        data-active={isActive ? 'true' : 'false'}
                                        aria-hidden={!isActive}
                                    >
                                        <div className={styles.liquidContainer} aria-hidden="true">
                                            <span className={styles.liquidBlob} />
                                            <span className={styles.liquidBlob} />
                                        </div>

                                        <div className={styles.cardContent}>
                                            <header className={styles.cardHeader}>
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
                                                {isActive ? (
                                                    <iframe
                                                        className={styles.preview}
                                                        src={`${cert.pdf}#view=FitH`}
                                                        title={fillPreviewLabel(
                                                            t.certificates.preview_label,
                                                            cert.title,
                                                        )}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className={styles.previewPlaceholder} aria-hidden="true" />
                                                )}
                                                <a
                                                    className={styles.openPdf}
                                                    href={cert.pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    tabIndex={isActive ? 0 : -1}
                                                >
                                                    <DocumentTextIcon aria-hidden="true" width={16} height={16} />
                                                    {t.certificates.open_pdf}
                                                </a>
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
                                    </article>
                                );
                            })}
                        </div>

                        <div className={styles.controls}>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => go(-1)}
                                aria-label={t.certificates.prev}
                                disabled={total < 2}
                            >
                                <ArrowLeftIcon aria-hidden="true" width={18} height={18} />
                            </button>
                            <p className={styles.counter} aria-live="polite">
                                {counterLabel}
                            </p>
                            <button
                                type="button"
                                className={styles.navBtn}
                                onClick={() => go(1)}
                                aria-label={t.certificates.next}
                                disabled={total < 2}
                            >
                                <ArrowRightIcon aria-hidden="true" width={18} height={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
