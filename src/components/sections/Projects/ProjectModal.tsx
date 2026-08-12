'use client';

import { useCallback, useEffect, useId, useRef, useState, type JSX, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { useModalLock } from '@/lib/hooks/useModalLock';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import type { Project } from '@/data/projects';
import ProjectGallery from './ProjectGallery';
import ImageLightbox from './ImageLightbox';
import { preloadScreenshots } from './preloadScreenshots';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    returnFocusRef: RefObject<HTMLButtonElement | null>;
}

export default function ProjectModal({
    project,
    onClose,
    returnFocusRef,
}: ProjectModalProps): JSX.Element | null {
    const { t, language } = useLanguage();
    const titleId = useId();
    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const isLightboxOpen = lightboxIndex !== null;

    useModalLock(true);
    useFocusTrap(overlayRef, !isLightboxOpen, { restoreFocus: false });

    const finishClose = useCallback(() => {
        onClose();
        returnFocusRef.current?.focus();
    }, [onClose, returnFocusRef]);

    const requestClose = useCallback(() => {
        if (isClosing || isLightboxOpen) return;

        if (prefersReducedMotion() || !overlayRef.current || !modalRef.current) {
            finishClose();
            return;
        }

        setIsClosing(true);
        const tl = gsap.timeline({ onComplete: finishClose });
        tl.to(modalRef.current, {
            y: 40,
            scale: 0.95,
            opacity: 0,
            duration: getMotionDuration(0.3),
            ease: 'power3.in',
        }).to(
            overlayRef.current,
            { opacity: 0, duration: getMotionDuration(0.25), ease: 'power2.in' },
            '-=0.15',
        );
    }, [isClosing, isLightboxOpen, finishClose]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLightboxOpen) {
                requestClose();
            }
        },
        [isLightboxOpen, requestClose],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;
        if (isLightboxOpen) {
            modal.setAttribute('inert', '');
        } else {
            modal.removeAttribute('inert');
        }
    }, [isLightboxOpen]);

    useGSAP(() => {
        if (!overlayRef.current || !modalRef.current) return;

        if (prefersReducedMotion()) {
            gsap.set([overlayRef.current, modalRef.current], { opacity: 1, y: 0, scale: 1 });
            return;
        }

        gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: getMotionDuration(0.3), ease: 'power2.out' },
        );
        gsap.fromTo(
            modalRef.current,
            { y: 60, scale: 0.95, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: getMotionDuration(0.5), ease: 'power4.out', delay: 0.1 },
        );
    }, { scope: overlayRef });

    useEffect(() => {
        if (project.screenshots.length > 0) {
            preloadScreenshots(project.screenshots, 0);
        }
    }, [project.id, project.screenshots]);

    const handleExpand = useCallback((index: number): void => {
        preloadScreenshots(project.screenshots, index);
        setLightboxIndex(index);
    }, [project.screenshots]);

    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLightboxOpen) requestClose();
    }, [isLightboxOpen, requestClose]);

    const handleLightboxNavigate = (index: number): void => {
        const clamped = Math.max(0, Math.min(index, project.screenshots.length - 1));
        setLightboxIndex(clamped);
    };

    const content = (
        <>
            <div
                ref={overlayRef}
                className={styles.overlay}
                onClick={handleOverlayClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                {...(isLightboxOpen ? { 'aria-hidden': 'true' as const } : {})}
            >
                <div ref={modalRef} className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2 id={titleId} className={styles.modalTitle}>{project.title}</h2>
                        <button
                            onClick={requestClose}
                            className={styles.closeBtn}
                            aria-label={t.common.close}
                            type="button"
                            disabled={isClosing}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className={styles.modalBody}>
                        <ProjectGallery
                            key={project.id}
                            projectTitle={project.title}
                            screenshots={project.screenshots}
                            onExpand={handleExpand}
                        />

                        <div className={styles.infoSection}>
                            <p className={styles.description}>
                                {project.description[language]}
                            </p>
                            <ul className={styles.stackList} role="list">
                                {project.stack.map((tech) => (
                                    <li key={tech} className={styles.stackChip}>{tech}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.footerBtn} ${styles.btnPrimary}`}
                        >
                            {t.projects.btn_github}
                        </a>
                        {project.demoUrl && (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.footerBtn} ${styles.btnSecondary}`}
                            >
                                {t.projects.btn_demo}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {isLightboxOpen && (
                <ImageLightbox
                    projectTitle={project.title}
                    screenshots={project.screenshots}
                    activeIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNavigate={handleLightboxNavigate}
                />
            )}
        </>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
}
