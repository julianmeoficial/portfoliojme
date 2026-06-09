'use client';

import { useCallback, useEffect, useId, useState, type JSX } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { en } from '@/lib/i18n/en';
import {
    detectSpanishRegion,
    dismissLanguagePrompt,
    hasStoredLanguage,
    isLanguagePromptDismissed,
} from '@/lib/i18n/localeUtils';
import styles from './LanguagePrompt.module.css';

function shouldShowPrompt(): boolean {
    if (hasStoredLanguage()) return false;
    if (isLanguagePromptDismissed()) return false;
    return detectSpanishRegion();
}

export default function LanguagePrompt(): JSX.Element | null {
    const { setLanguage } = useLanguage();
    const titleId = useId();
    const bodyId = useId();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (shouldShowPrompt()) {
                setVisible(true);
            }
        }, 350);

        return () => window.clearTimeout(timer);
    }, []);

    const close = useCallback((): void => {
        dismissLanguagePrompt();
        setVisible(false);
    }, []);

    const handleAccept = useCallback((): void => {
        setLanguage('es');
        close();
    }, [setLanguage, close]);

    const handleDismiss = useCallback((): void => {
        setLanguage('en');
        close();
    }, [setLanguage, close]);

    useEffect(() => {
        if (!visible) return;

        const onKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                handleDismiss();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [visible, handleDismiss]);

    if (!visible) return null;

    const { common: t } = en;

    return (
        <div
            className={styles.banner}
            role="region"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
        >
            <p id={titleId} className={styles.title}>{t.language_prompt_title}</p>
            <p id={bodyId} className={styles.body}>{t.language_prompt_body}</p>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.acceptBtn}
                    onClick={handleAccept}
                >
                    {t.language_prompt_accept}
                </button>
                <button
                    type="button"
                    className={styles.dismissBtn}
                    onClick={handleDismiss}
                >
                    {t.language_prompt_dismiss}
                </button>
            </div>
        </div>
    );
}
