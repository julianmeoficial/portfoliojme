const preloaded = new Set<string>();

function shouldPreloadNeighbors(): boolean {
    if (typeof window === 'undefined') return true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Warm the browser cache for the active slide and optionally its neighbors. */
export function preloadScreenshots(urls: string[], center: number): void {
    const indices = shouldPreloadNeighbors()
        ? [center - 1, center, center + 1]
        : [center];

    const filtered = indices.filter((i) => i >= 0 && i < urls.length);

    for (const i of filtered) {
        const url = urls[i];
        if (!url || preloaded.has(url)) continue;
        preloaded.add(url);
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
    }
}

/** Decode a screenshot before swapping it into the lightbox. */
export async function decodeScreenshot(url: string): Promise<void> {
    const img = new Image();
    img.src = url;
    try {
        await img.decode();
    } catch {
        /* decode() may reject for SVG or unsupported formats — still attempt display */
    }
}
