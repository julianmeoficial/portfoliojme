'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import type { Language, Translations } from './types';
import { LANG_STORAGE_KEY } from './localeUtils';
import { es } from './es';
import { en } from './en';

const translations: Record<Language, Translations> = { es, en };

interface LanguageContextValue {
    language: Language;
    t: Translations;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
    if (stored === 'es' || stored === 'en') return stored;
    return 'en';
}

function applyLanguage(lang: Language): void {
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    const setLanguage = useCallback((lang: Language) => {
        applyLanguage(lang);
        setLanguageState(lang);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => {
            const next: Language = prev === 'es' ? 'en' : 'es';
            applyLanguage(next);
            return next;
        });
    }, []);

    return (
        <LanguageContext.Provider
            value={{ language, t: translations[language], setLanguage, toggleLanguage }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error('useLanguage must be used inside <LanguageProvider>');
    }
    return ctx;
}
