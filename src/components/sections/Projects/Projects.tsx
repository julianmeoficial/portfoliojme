'use client';

import { useRef, useState } from 'react';
import type { JSX, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { prefersReducedMotion, getMotionDuration } from '@/lib/motion/prefersReducedMotion';
import { projects } from '@/data/projects';
import type { Project } from '@/data/projects';
import ProjectModal from './ProjectModal';
import styles from './Projects.module.css';

import {
    PaperAirplaneIcon,
    CpuChipIcon,
    BuildingOfficeIcon,
    CommandLineIcon,
    BeakerIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const PROJECT_ICONS: Record<string, React.ElementType> = {
    skyvault: PaperAirplaneIcon,
    selanflow: CpuChipIcon,
    skygate: BuildingOfficeIcon,
    'odc-simulator': CommandLineIcon,
    'rlc-lab': BeakerIcon,
    'bk-ops-security': ShieldCheckIcon,
};

export default function Projects(): JSX.Element {
    const { t, language } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    useGSAP(() => {
        if (prefersReducedMotion()) {
            gsap.set('.js-projects-header, .js-project-card', { opacity: 1, y: 0 });
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                once: true,
            },
        });

        tl.from('.js-projects-header', {
            y: 30,
            opacity: 0,
            duration: getMotionDuration(0.8),
            ease: 'power3.out',
            stagger: 0.15,
        }).from(
            '.js-project-card',
            {
                y: 50,
                opacity: 0,
                duration: getMotionDuration(0.8),
                ease: 'power3.out',
                stagger: 0.12,
            },
            '-=0.4',
        );
    }, { scope: sectionRef });

    const openModal = (project: Project, button: HTMLButtonElement): void => {
        triggerRef.current = button;
        setSelectedProject(project);
    };

    return (
        <>
            <section id="projects" ref={sectionRef} className={styles.projects}>
                <div className={styles.header}>
                    <span className={`js-projects-header ${styles.label}`}>
                        {t.projects.label}
                    </span>
                    <h2 className={`js-projects-header ${styles.heading}`}>
                        {t.projects.heading}
                    </h2>
                </div>

                <div className={styles.grid}>
                    {projects.map((project) => {
                        const Icon = PROJECT_ICONS[project.id] || PaperAirplaneIcon;

                        return (
                            <div
                                key={project.id}
                                className={`js-project-card ${styles.card}`}
                                style={{ '--project-color': project.color } as CSSProperties}
                            >
                                <div className={styles.liquidContainer} aria-hidden="true">
                                    <div className={styles.liquidBlob} />
                                    <div className={styles.liquidBlob} />
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.projectIcon}>
                                            <Icon aria-hidden="true" />
                                        </div>
                                    </div>

                                    <h3 className={styles.cardTitle}>{project.title}</h3>

                                    <p className={styles.cardDescription}>
                                        {project.description[language]}
                                    </p>

                                    <ul className={styles.stack} role="list">
                                        {project.stack.map((tech) => (
                                            <li key={tech} className={styles.tech}>{tech}</li>
                                        ))}
                                    </ul>

                                    <div
                                        className={`${styles.cardActions} ${project.screenshots.length === 0 ? styles.cardActionsSingle : ''}`}
                                    >
                                        {project.screenshots.length > 0 && (
                                            <button
                                                onClick={(e) => openModal(project, e.currentTarget)}
                                                className={styles.btnPreview}
                                                type="button"
                                            >
                                                {t.projects.btn_preview}
                                            </button>
                                        )}
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${styles.btnGithub} ${project.screenshots.length === 0 ? styles.btnGithubPrimary : ''}`}
                                        >
                                            {t.projects.btn_github}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    returnFocusRef={triggerRef}
                />
            )}
        </>
    );
}
