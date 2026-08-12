'use client';

import { useRef } from 'react';
import type { JSX } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';

import {
    CodeBracketIcon,
    CommandLineIcon,
    ServerStackIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

import styles from './Skills.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const SKILL_CATEGORIES = [
    {
        key: 'languages' as const,
        icon: CodeBracketIcon,
        chips: ['Java', 'TypeScript', 'JavaScript', 'Kotlin', 'Swift'],
    },
    {
        key: 'frontend' as const,
        icon: CommandLineIcon,
        chips: ['React', 'Next.js', 'Vite', 'HTML', 'CSS', 'Tailwind', 'GSAP'],
    },
    {
        key: 'backend' as const,
        icon: ServerStackIcon,
        chips: ['Spring Boot', 'PostgreSQL', 'Supabase', 'Prisma', 'WebSocket', 'JWT', 'REST APIs'],
    },
    {
        key: 'tools' as const,
        icon: WrenchScrewdriverIcon,
        chips: ['Git', 'GitHub', 'Vercel', 'Figma', 'Maven', 'Gradle'],
    },
] as const;

export default function Skills(): JSX.Element {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (prefersReducedMotion()) {
            gsap.set('.js-skills-header, .js-skill-card', { opacity: 1, y: 0 });
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                once: true,
            },
        });

        tl.from('.js-skills-header', {
            y: 30,
            opacity: 0,
            duration: getMotionDuration(0.8),
            ease: 'power3.out',
            stagger: 0.15,
        }).from(
            '.js-skill-card',
            {
                y: 50,
                opacity: 0,
                duration: getMotionDuration(0.8),
                ease: 'power3.out',
                stagger: 0.1,
            },
            '-=0.4',
        );
    }, { scope: sectionRef });

    return (
        <section id="skills" ref={sectionRef} className={styles.skills}>
            <div className={styles.header}>
                <span className={`js-skills-header ${styles.label}`}>
                    {t.skills.label}
                </span>
                <h2 className={`js-skills-header ${styles.heading}`}>
                    {t.skills.heading_line1}
                    <br />
                    {t.skills.heading_line2}
                </h2>
            </div>

            <div className={styles.grid}>
                {SKILL_CATEGORIES.map(({ key, icon: Icon, chips }) => (
                    <div key={key} className={`js-skill-card ${styles.category}`}>
                        <div className={styles.categoryHeader}>
                            <div className={styles.iconWrapper}>
                                <Icon aria-hidden="true" />
                            </div>
                            <h3 className={styles.categoryName}>
                                {t.skills.categories[key]}
                            </h3>
                        </div>

                        <div className={styles.divider} aria-hidden="true" />

                        <ul className={styles.chips} role="list">
                            {chips.map((chip) => (
                                <li key={chip} className={styles.chip}>
                                    {chip}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
