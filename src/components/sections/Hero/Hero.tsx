'use client';

import { useRef } from 'react';
import type { JSX } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import styles from './Hero.module.css';

export default function Hero(): JSX.Element {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.js-card');
        const titleLines = gsap.utils.toArray('.js-title-line');

        if (prefersReducedMotion()) {
            gsap.set([cards, titleLines], { opacity: 1, y: 0, scale: 1, rotateX: 0 });
            return;
        }

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.fromTo(
            cards,
            { y: 60, opacity: 0, scale: 0.95, rotateX: 5 },
            { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: getMotionDuration(1.2), stagger: 0.15 },
        ).fromTo(
            titleLines,
            { y: 30, opacity: 0, rotateX: -15 },
            { y: 0, opacity: 1, rotateX: 0, duration: getMotionDuration(1), stagger: 0.1 },
            '-=0.8',
        );

        const handleMouseMove = (e: MouseEvent): void => {
            if (prefersReducedMotion()) return;
            if (window.innerWidth < 1024) return;

            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const rotateX = ((clientY - centerY) / centerY) * -4;
            const rotateY = ((clientX - centerX) / centerX) * 4;

            gsap.to('.js-parallax-layer', {
                rotateX,
                rotateY,
                transformPerspective: 1200,
                ease: 'power2.out',
                duration: 0.6,
                overwrite: 'auto',
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, { scope: containerRef });

    const scrollToProjects = (e: React.MouseEvent): void => {
        e.preventDefault();
        document.querySelector('#projects')?.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
    };

    return (
        <section id="home" ref={containerRef} className={styles.hero}>
            <div className={styles.noise} aria-hidden="true" />
            <div className={styles.glow} aria-hidden="true" />

            <div className={styles.grid}>
                <div className={`js-card js-parallax-layer ${styles.card} ${styles.cardMain}`}>
                    <div className={styles.liquidContainer}>
                        <div className={styles.liquidBlob} />
                        <div className={styles.liquidBlob} />
                    </div>
                    <div className={styles.cardContent}>
                        <span className={`js-title-line ${styles.badge}`}>{t.hero.badge}</span>

                        <h1 className={styles.title}>
                            <span className={`js-title-line ${styles.titleLine}`}>{t.hero.title_line1}</span>
                            <span className={`js-title-line ${styles.titleLine}`}>{t.hero.title_line2}</span>
                            <span className={`js-title-line ${styles.titleLine}`}>{t.hero.title_line3}</span>
                        </h1>

                        <p className={`js-title-line ${styles.bio}`}>{t.hero.bio}</p>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={`js-card js-parallax-layer ${styles.card} ${styles.cardStack}`}>
                        <div className={styles.liquidContainer}>
                            <div className={styles.liquidBlob} />
                            <div className={styles.liquidBlob} />
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.education}>{t.hero.education}</p>

                            <ul className={styles.techList} role="list">
                                {(['React', 'TypeScript', 'Next.js', 'Spring Boot', 'PostgreSQL', 'GSAP'] as const).map(
                                    (tech) => (
                                        <li key={tech} className={styles.techChip}>
                                            {tech}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </div>

                    <a
                        href="#projects"
                        className={`js-card js-parallax-layer ${styles.card} ${styles.cardCta}`}
                        onClick={scrollToProjects}
                    >
                        <div className={styles.liquidContainer}>
                            <div className={styles.liquidBlob} />
                            <div className={styles.liquidBlob} />
                        </div>
                        <div className={`${styles.cardContent} ${styles.ctaContent}`}>
                            <span className={styles.ctaText}>{t.hero.cta_projects}</span>
                            <div className={styles.ctaIcon} aria-hidden="true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
