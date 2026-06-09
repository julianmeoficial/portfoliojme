'use client';

import { useRef } from 'react';
import type { JSX } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';

import {
    EnvelopeIcon,
    MapPinIcon,
    BriefcaseIcon,
    LanguageIcon,
} from '@heroicons/react/24/outline';

import styles from './Contact.module.css';

const SOCIAL_LINKS = [
    { href: 'https://github.com/julianmeoficial', label: 'GitHub' },
    { href: 'https://linkedin.com/in/julianmeoficial', label: 'LinkedIn' },
] as const;

export default function Contact(): JSX.Element {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);

    const info = [
        { icon: EnvelopeIcon, label: t.contact.info_email_label, value: 'julianmeoficial@outlook.com' },
        { icon: MapPinIcon, label: t.contact.info_location_label, value: t.contact.info_location_value },
        { icon: BriefcaseIcon, label: t.contact.info_availability_label, value: t.contact.info_availability_value },
        { icon: LanguageIcon, label: t.contact.info_languages_label, value: t.contact.info_languages_value },
    ];

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger, useGSAP);

        if (prefersReducedMotion()) {
            gsap.set('.js-contact-fade, .js-contact-card', { opacity: 1, y: 0, x: 0 });
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                once: true,
            },
        });

        tl.from('.js-contact-fade', {
            y: 40,
            opacity: 0,
            duration: getMotionDuration(0.8),
            ease: 'power3.out',
            stagger: 0.15,
        }).from(
            '.js-contact-card',
            {
                x: 50,
                opacity: 0,
                duration: getMotionDuration(1),
                ease: 'power3.out',
                clearProps: 'transform',
            },
            '-=0.6',
        );
    }, { scope: sectionRef });

    return (
        <section id="contact" ref={sectionRef} className={styles.contact}>
            <div className={styles.inner}>
                <div className={styles.left}>
                    <span className={`js-contact-fade ${styles.label}`}>
                        {t.contact.label}
                    </span>

                    <h2 className={`js-contact-fade ${styles.heading}`}>
                        {t.contact.heading_line1}
                        <br />
                        {t.contact.heading_line2}
                    </h2>

                    <p className={`js-contact-fade ${styles.subtitle}`}>
                        {t.contact.subtitle}
                    </p>

                    <div className={`js-contact-fade ${styles.ctaGroup}`}>
                        <a
                            href="mailto:julianmeoficial@outlook.com"
                            className={styles.emailBtn}
                        >
                            {t.contact.btn_email}
                        </a>

                        <div className={styles.socials}>
                            {SOCIAL_LINKS.map(({ href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label={label}
                                >
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`js-contact-card ${styles.right}`}>
                    <div className={styles.cardGlow} aria-hidden="true" />

                    <h3 className={styles.infoTitle}>{t.contact.info_title}</h3>

                    <ul className={styles.infoList} role="list">
                        {info.map(({ icon: Icon, label, value }) => (
                            <li key={label} className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <Icon aria-hidden="true" />
                                </div>
                                <div className={styles.infoText}>
                                    <span className={styles.infoLabel}>{label}</span>
                                    <span className={styles.infoValue}>{value}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
