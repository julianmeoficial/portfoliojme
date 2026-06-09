'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './LanguageSwitch.module.css';

export default function LanguageSwitch() {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <div className={styles.wrapper} aria-label={t.common.language_toggle}>
            <div className={styles.button}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={language === 'en'}
                    onChange={toggleLanguage}
                    aria-label={language === 'es' ? t.common.switch_to_en : t.common.switch_to_es}
                    id="lang-toggle"
                />
                <div className={styles.knobs} />
                <div className={styles.layer} />
            </div>
        </div>
    );
}
