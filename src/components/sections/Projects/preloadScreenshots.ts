const preloaded = new Set<string>();

/** Warm the browser cache for the active slide and its neighbors. */
export function preloadScreenshots(urls: string[], center: number): void {
    const indices = [center - 1, center, center + 1].filter(
        (i) => i >= 0 && i < urls.length,
    );

    for (const i of indices) {
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
