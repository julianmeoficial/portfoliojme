'use client';

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import type { JSX } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import { useTheme } from '@/lib/theme/useTheme';
import LanguageSwitch from '../LanguageSwitch';
import styles from './Navbar.module.css';
const NAV_HREFS = ['#home', '#about', '#projects', '#skills', '#certificates', '#contact'] as const;
type NavHref = (typeof NAV_HREFS)[number];

function SunIcon(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    );
}

function MoonIcon(): JSX.Element {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

interface MenuIconProps { isOpen: boolean; }

function MenuIcon({ isOpen }: MenuIconProps): JSX.Element {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isOpen ? (
                <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </>
            ) : (
                <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </>
            )}
        </svg>
    );
}

function ArrowRight(): JSX.Element {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    );
}

export default function Navbar(): JSX.Element {
    const { t } = useLanguage();
    const { theme, toggleTheme, resetToAuto } = useTheme();

    const headerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const menuBtnRef = useRef<HTMLButtonElement>(null);

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState<NavHref>('#home');
    const themeMounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
    useFocusTrap(mobileMenuRef, menuOpen);

    const navLinks: { label: string; href: NavHref }[] = [
        { label: t.nav.home, href: '#home' },
        { label: t.nav.about, href: '#about' },
        { label: t.nav.projects, href: '#projects' },
        { label: t.nav.skills, href: '#skills' },
        { label: t.nav.certificates, href: '#certificates' },
        { label: t.nav.contact, href: '#contact' },
    ];

    useEffect(() => {
        const sectionNodes = NAV_HREFS.map((href) => ({
            href,
            el: document.querySelector(href),
        })).filter((entry): entry is { href: NavHref; el: Element } => entry.el !== null);

        const onScroll = (): void => {
            setScrolled(window.scrollY > 30);

            let current: NavHref = '#home';
            for (const { href, el } of sectionNodes) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 120) current = href;
            }
            setActive(current);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;

        document.body.style.overflow = 'hidden';

        const handleEscape = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                menuBtnRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [menuOpen]);

    useGSAP(() => {
        if (prefersReducedMotion()) {
            gsap.set([navRef.current, ...linksRef.current.filter(Boolean)], {
                opacity: 1,
                y: 0,
                scale: 1,
            });
            return;
        }

        gsap.from(navRef.current, {
            y: -40,
            scale: 0.95,
            opacity: 0,
            duration: getMotionDuration(1.2),
            ease: 'power4.out',
            delay: 0.1,
        });

        const validLinks = linksRef.current.filter(Boolean);
        if (validLinks.length > 0) {
            gsap.from(validLinks, {
                y: -10,
                opacity: 0,
                duration: getMotionDuration(0.6),
                ease: 'power2.out',
                stagger: 0.05,
                delay: 0.4,
            });
        }
    }, { scope: headerRef });

    const scrollTo = useCallback((href: string): void => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        setMenuOpen(false);
    }, []);

    return (
        <div ref={headerRef} className={`${styles.headerWrapper} ${scrolled ? styles.scrolled : ''}`}>
            <header id="site-navbar" ref={navRef} className={styles.header}>
                <nav className={styles.nav} role="navigation" aria-label={t.nav.main_navigation}>
                    <div className={styles.logoContainer}>
                        <a
                            href="#home"
                            className={styles.logo}
                            onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
                            aria-label={t.nav.go_top}
                        >
                            JME
                        </a>
                    </div>

                    <div className={styles.linksContainer}>
                        <ul className={styles.links} role="list">
                            {navLinks.map(({ label, href }, i) => (
                                <li key={href}>
                                    <a
                                        ref={(el) => { linksRef.current[i] = el; }}
                                        href={href}
                                        className={`${styles.link} ${active === href ? styles.active : ''}`}
                                        onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                                        aria-current={active === href ? 'page' : undefined}
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.actions}>
                        <LanguageSwitch />

                        <button
                            onClick={toggleTheme}
                            onDoubleClick={resetToAuto}
                            className={styles.iconBtn}
                            type="button"
                            title={t.nav.theme_auto_hint}
                            aria-label={themeMounted
                                ? (theme === 'dark' ? t.nav.theme_light : t.nav.theme_dark)
                                : t.nav.theme_dark}
                            suppressHydrationWarning
                        >
                            {themeMounted
                                ? (theme === 'dark' ? <SunIcon /> : <MoonIcon />)
                                : <span className={styles.themeIconPlaceholder} aria-hidden="true" />}
                        </button>

                        <a
                            href="#contact"
                            className={styles.ctaBtn}
                            onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
                        >
                            {t.nav.cta_talk}
                        </a>

                        <button
                            ref={menuBtnRef}
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className={`${styles.iconBtn} ${styles.menuBtn}`}
                            type="button"
                            aria-label={menuOpen ? t.nav.menu_close : t.nav.menu_open}
                            {...(menuOpen
                                ? { 'aria-expanded': 'true' as const }
                                : { 'aria-expanded': 'false' as const })}
                            aria-controls="mobile-nav-menu"
                        >
                            <MenuIcon isOpen={menuOpen} />
                        </button>
                    </div>
                </nav>

                {menuOpen && (
                    <div
                        ref={mobileMenuRef}
                        id="mobile-nav-menu"
                        className={styles.mobileMenu}
                        role="dialog"
                        aria-label={t.nav.mobile_nav}
                    >
                        {navLinks.map(({ label, href }) => (
                            <a
                                key={href}
                                href={href}
                                className={`${styles.mobileLink} ${active === href ? styles.active : ''}`}
                                onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                                aria-current={active === href ? 'page' : undefined}
                            >
                                <span>{label}</span>
                                <ArrowRight />
                            </a>
                        ))}
                    </div>
                )}
            </header>
        </div>
    );
}
