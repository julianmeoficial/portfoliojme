export type Theme = 'light' | 'dark';
export type ThemeMode = 'auto' | 'manual';

export const THEME_STORAGE_KEY = 'portfolio-theme';
export const THEME_MODE_KEY = 'portfolio-theme-mode';

/** Local hour (0–23) via Intl timezone — matches locale detection pattern. */
export function getLocalHour(now: Date = new Date()): number {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const value = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: tz,
        }).format(now);
        const parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed)) return now.getHours();
        return parsed === 24 ? 0 : parsed;
    } catch {
        return now.getHours();
    }
}

export function resolveThemeFromHour(hour: number): Theme {
    return hour >= 7 && hour < 19 ? 'light' : 'dark';
}

export function getEffectiveTheme(mode: ThemeMode, storedTheme: Theme | null): Theme {
    if (mode === 'manual' && storedTheme) return storedTheme;
    return resolveThemeFromHour(getLocalHour());
}

export function readThemeMode(): ThemeMode {
    if (typeof localStorage === 'undefined') return 'auto';
    const mode = localStorage.getItem(THEME_MODE_KEY);
    return mode === 'manual' ? 'manual' : 'auto';
}

export function readStoredTheme(): Theme | null {
    if (typeof localStorage === 'undefined') return null;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return null;
}

export function readThemeFromDocument(): Theme {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return getEffectiveTheme(readThemeMode(), readStoredTheme());
}

export function applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
}

/** Clear manual override and re-apply auto theme from local hour. */
export function resetThemeToAuto(): Theme {
    try {
        localStorage.removeItem(THEME_STORAGE_KEY);
        localStorage.setItem(THEME_MODE_KEY, 'auto');
    } catch {
        /* private mode / quota */
    }
    const next = getEffectiveTheme('auto', null);
    applyTheme(next);
    return next;
}
