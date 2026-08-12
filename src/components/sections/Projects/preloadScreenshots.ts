const preloaded = new Set<string>();
const decodeCache = new Map<string, Promise<void>>();

function shouldPreloadNeighbors(): boolean {
    if (typeof window === 'undefined') return true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function warmImage(url: string): void {
    if (preloaded.has(url)) return;
    preloaded.add(url);
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
}

/** Warm the browser cache for the active slide and optionally its neighbors. */
export function preloadScreenshots(urls: string[], center: number): void {
    const indices = shouldPreloadNeighbors()
        ? [center - 1, center, center + 1]
        : [center];

    for (const i of indices) {
        if (i < 0 || i >= urls.length) continue;
        const url = urls[i];
        if (url) warmImage(url);
    }
}

/** Decode a screenshot before swapping it into the lightbox. Reuses in-flight decode promises. */
export function decodeScreenshot(url: string): Promise<void> {
    const cached = decodeCache.get(url);
    if (cached) return cached;

    warmImage(url);

    const promise = (async (): Promise<void> => {
        const img = new Image();
        img.src = url;
        try {
            await img.decode();
        } catch {
            /* decode() may reject for unsupported formats — still attempt display */
        }
    })();

    decodeCache.set(url, promise);
    return promise;
}
