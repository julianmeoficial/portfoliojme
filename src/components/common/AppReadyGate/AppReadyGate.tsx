'use client';

import { useEffect, useState, type ReactNode, type JSX } from 'react';
import { prefersReducedMotion } from '@/lib/motion/prefersReducedMotion';
import styles from './AppReadyGate.module.css';

interface AppReadyGateProps {
    children: ReactNode;
}

export default function AppReadyGate({ children }: AppReadyGateProps): JSX.Element {
    const [ready, setReady] = useState(
        () => typeof window !== 'undefined' && prefersReducedMotion(),
    );

    useEffect(() => {
        if (ready) return;
        const id = window.requestAnimationFrame(() => setReady(true));
        return () => window.cancelAnimationFrame(id);
    }, [ready]);

    return (
        <>
            {!ready && (
                <div className={styles.gate} aria-hidden="true">
                    <span className={styles.logo}>JME</span>
                </div>
            )}
            {children}
        </>
    );
}
