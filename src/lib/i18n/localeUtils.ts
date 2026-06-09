export const LANG_STORAGE_KEY = 'portfolio-lang';
export const LANG_PROMPT_DISMISSED_KEY = 'portfolio-lang-prompt-dismissed';

const SPANISH_REGIONS = new Set([
    'ES', 'MX', 'CO', 'AR', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO',
    'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ',
]);

const SPANISH_TIMEZONES = [
    'America/Mexico_City',
    'America/Bogota',
    'America/Lima',
    'America/Santiago',
    'America/Buenos_Aires',
    'America/Argentina',
    'America/Caracas',
    'America/La_Paz',
    'America/Guayaquil',
    'America/Asuncion',
    'America/Montevideo',
    'America/Panama',
    'America/Costa_Rica',
    'America/Guatemala',
    'America/El_Salvador',
    'America/Tegucigalpa',
    'America/Managua',
    'America/Havana',
    'America/Santo_Domingo',
    'America/Puerto_Rico',
    'Europe/Madrid',
    'Atlantic/Canary',
];

function languageList(): string[] {
    if (typeof navigator === 'undefined') return [];
    if (navigator.languages?.length) return [...navigator.languages];
    return navigator.language ? [navigator.language] : [];
}

export function detectSpanishRegion(): boolean {
    const langs = languageList();

    if (langs.some((lang) => lang.toLowerCase().startsWith('es'))) {
        return true;
    }

    for (const lang of langs) {
        try {
            const locale = new Intl.Locale(lang);
            if (locale.region && SPANISH_REGIONS.has(locale.region.toUpperCase())) {
                return true;
            }
        } catch {
            // ignore invalid locale strings
        }
    }

    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && SPANISH_TIMEZONES.includes(tz)) {
            return true;
        }
    } catch {
        // ignore
    }

    return false;
}

export function hasStoredLanguage(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return stored === 'es' || stored === 'en';
}

export function isLanguagePromptDismissed(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(LANG_PROMPT_DISMISSED_KEY) === 'true';
}

export function dismissLanguagePrompt(): void {
    localStorage.setItem(LANG_PROMPT_DISMISSED_KEY, 'true');
}
