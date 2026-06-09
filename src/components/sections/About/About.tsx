'use client';

import { useRef } from 'react';
import type { JSX } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { prefersReducedMotion } from '@/lib/motion/prefersReducedMotion';
import styles from './About.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function About(): JSX.Element {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);

    const titleWords = t.about.title.split(' ');

    useGSAP(() => {
        if (prefersReducedMotion()) {
            gsap.set('.js-about-label, .js-word, .js-bottom-info', {
                opacity: 1,
                y: 0,
                color: 'var(--color-text)',
            });
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
                end: 'center 40%',
                scrub: 1,
            },
        });

        gsap.to('.js-about-label', {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                once: true,
            },
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
        });

        tl.to('.js-word', {
            color: 'var(--color-text)',
            stagger: 0.1,
            ease: 'none',
        });

        gsap.to('.js-bottom-info', {
            scrollTrigger: {
                trigger: '.js-bottom-info',
                start: 'top 85%',
                once: true,
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
        });

        gsap.to('.js-tech-1', {
            y: -100,
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.to('.js-tech-2', {
            y: -180,
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.to('.js-tech-3', {
            y: -80,
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    }, { scope: sectionRef });

    return (
        <section id="about" ref={sectionRef} className={styles.about}>
            <div className={styles.noise} aria-hidden="true" />

            <div className={styles.techCanvas} aria-hidden="true">
                <span className={`${styles.floatingTech} ${styles.tech1} js-tech-1`}>Frontend</span>
                <span className={`${styles.floatingTech} ${styles.tech2} js-tech-2`}>Full-Stack</span>
                <span className={`${styles.floatingTech} ${styles.tech3} js-tech-3`}>Motion UI</span>
            </div>

            <div className={styles.inner}>
                <span className={`js-about-label ${styles.label}`}>
                    {t.about.label}
                </span>

                <h2 className={styles.massiveText} aria-label={t.about.title}>
                    {titleWords.map((word, index) => (
                        <span key={index} className={`js-word ${styles.word}`} aria-hidden="true">
                            {word}
                        </span>
                    ))}
                </h2>

                <div className={`js-bottom-info ${styles.bottomInfo}`}>
                    <div className={styles.infoBlock}>
                        <h3 className={styles.infoTitle}>{t.about.section_background}</h3>
                        <p className={styles.infoText}>{t.about.paragraph1}</p>
                    </div>

                    <div className={styles.infoBlock}>
                        <h3 className={styles.infoTitle}>{t.about.section_focus}</h3>
                        <p className={styles.infoText}>{t.about.paragraph2}</p>

                        <div className={styles.actions}>
                            <a
                                href="https://github.com/julianmeoficial"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnPrimary}
                            >
                                {t.about.cta_github}
                            </a>
                            <a
                                href="/cv-julian-martinez.pdf"
                                download
                                className={styles.btnSecondary}
                            >
                                {t.about.cta_cv}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
