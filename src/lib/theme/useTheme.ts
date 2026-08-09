'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    applyTheme,
    getEffectiveTheme,
    readThemeFromDocument,
    readThemeMode,
    resetThemeToAuto,
    THEME_MODE_KEY,
    THEME_STORAGE_KEY,
    type Theme,
    type ThemeMode,
} from './themeUtils';

interface UseThemeResult {
    theme: Theme;
    mode: ThemeMode;
    toggleTheme: () => void;
    resetToAuto: () => void;
}

export function useTheme(): UseThemeResult {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'dark';
        return readThemeFromDocument();
    });
    const [mode, setMode] = useState<ThemeMode>(() => readThemeMode());

    useEffect(() => {
        if (mode !== 'auto') return;

        const tick = (): void => {
            const next = getEffectiveTheme('auto', null);
            setTheme(next);
            applyTheme(next);
        };

        tick();
        const id = window.setInterval(tick, 60_000);
        return () => window.clearInterval(id);
    }, [mode]);

    const toggleTheme = useCallback((): void => {
        const current = readThemeFromDocument();
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
            localStorage.setItem(THEME_MODE_KEY, 'manual');
        } catch {
            /* private mode / quota */
        }
        applyTheme(next);
        setMode('manual');
        setTheme(next);
    }, []);

    const resetToAuto = useCallback((): void => {
        const next = resetThemeToAuto();
        setMode('auto');
        setTheme(next);
    }, []);

    return { theme, mode, toggleTheme, resetToAuto };
}
