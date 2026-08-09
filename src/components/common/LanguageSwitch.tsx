'use client';

import type { JSX } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Language } from '@/lib/i18n/types';
import styles from './LanguageSwitch.module.css';

const OPTIONS: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
];

export default function LanguageSwitch(): JSX.Element {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div
            className={styles.wrapper}
            role="group"
            aria-label={t.common.language_toggle}
            data-lang={language}
        >
            <div className={styles.track}>
                <span className={styles.pill} aria-hidden="true" />
                {OPTIONS.map(({ code, label }) => (
                    <button
                        key={code}
                        type="button"
                        className={styles.option}
                        data-active={language === code ? 'true' : 'false'}
                        aria-pressed={language === code}
                        aria-label={code === 'es' ? t.common.switch_to_es : t.common.switch_to_en}
                        onClick={() => {
                            if (language !== code) setLanguage(code);
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
